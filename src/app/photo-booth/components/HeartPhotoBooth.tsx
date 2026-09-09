'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useTranslation } from '@/locale/I18nContext'
import {
  POLAROID_STYLES,
  PolaroidStyleConfig,
  renderPolaroidComposite,
} from '../types/polaroidStyles'
import { useHeartGestureDetector } from '../hooks/useHeartGestureDetector'
import PolaroidStyleSelector from './PolaroidStyleSelector'

interface HeartPhotoBoothProps {
  onPhotoCaptured?: (dataUrl: string) => void
}

export default function HeartPhotoBooth({ onPhotoCaptured }: HeartPhotoBoothProps) {
  const { t } = useTranslation()

  // Selected strategy state
  const [selectedStyle, setSelectedStyle] = useState<PolaroidStyleConfig>(POLAROID_STYLES[0])

  // DOM References
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const polaroidImgRef = useRef<HTMLImageElement | null>(null)

  // Multi-shot capture state
  const [capturedShots, setCapturedShots] = useState<HTMLCanvasElement[]>([])
  const [currentShotIndex, setCurrentShotIndex] = useState<number>(0)
  const [isCapturingSequence, setIsCapturingSequence] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [finalPolaroidUrl, setFinalPolaroidUrl] = useState<string | null>(null)

  // Preload polaroid background image template asset
  useEffect(() => {
    const img = new Image()
    img.src = selectedStyle.templateAsset
    img.onload = () => {
      polaroidImgRef.current = img
    }
  }, [selectedStyle])

  // Composite captured shots into polaroid layout strategy
  const generatePolaroidStrip = useCallback(
    (shots: HTMLCanvasElement[]) => {
      if (!polaroidImgRef.current) return
      const finalUrl = renderPolaroidComposite(selectedStyle, shots, polaroidImgRef.current)
      if (finalUrl) {
        setFinalPolaroidUrl(finalUrl)
        if (onPhotoCaptured) {
          onPhotoCaptured(finalUrl)
        }
      }
    },
    [selectedStyle, onPhotoCaptured],
  )

  // Capture current video frame into offscreen canvas
  const captureCurrentFrame = useCallback((): HTMLCanvasElement | null => {
    if (!videoRef.current) return null
    const video = videoRef.current
    const offscreen = document.createElement('canvas')
    offscreen.width = video.videoWidth || 1280
    offscreen.height = video.videoHeight || 960

    const ctx = offscreen.getContext('2d')
    if (!ctx) return null

    ctx.translate(offscreen.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, offscreen.width, offscreen.height)

    return offscreen
  }, [])

  // Start sequence of shots based on the selected Polaroid strategy required shots count
  const startPolaroidSequence = useCallback(() => {
    setIsCapturingSequence(true)
    setCapturedShots([])

    let shotCount = 0
    const accumShots: HTMLCanvasElement[] = []

    const takeOneShot = () => {
      let count = 3
      setCountdown(count)

      const timer = setInterval(() => {
        count -= 1
        if (count > 0) {
          setCountdown(count)
        } else {
          clearInterval(timer)
          setCountdown(null)

          const shot = captureCurrentFrame()
          if (shot) {
            accumShots.push(shot)
            setCapturedShots([...accumShots])
          }

          shotCount += 1
          setCurrentShotIndex(shotCount)

          if (shotCount < selectedStyle.shotsRequired) {
            setTimeout(takeOneShot, 800)
          } else {
            setIsCapturingSequence(false)
            generatePolaroidStrip(accumShots)
          }
        }
      }, 800)
    }

    takeOneShot()
  }, [captureCurrentFrame, generatePolaroidStrip, selectedStyle.shotsRequired])

  // Custom hook for MediaPipe gesture detection
  const {
    isLoading,
    loadingText,
    permissionError,
    heartDetected,
    consecutiveCount,
    resetGestureState,
  } = useHeartGestureDetector({
    videoRef,
    canvasRef,
    onGestureLock: startPolaroidSequence,
    isLocked: !!finalPolaroidUrl || isCapturingSequence || countdown !== null,
  })

  const handleRetake = () => {
    setFinalPolaroidUrl(null)
    setCapturedShots([])
    setCurrentShotIndex(0)
    setIsCapturingSequence(false)
    setCountdown(null)
    resetGestureState()
  }

  const handleDownload = () => {
    if (!finalPolaroidUrl) return
    const link = document.createElement('a')
    link.href = finalPolaroidUrl
    link.download = `${selectedStyle.id}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6">
      {/* Hidden Webcam Source Video */}
      <video ref={videoRef} playsInline muted className="hidden" />

      {/* Polaroid Style Selection Toolbar */}
      {!finalPolaroidUrl && !isCapturingSequence && (
        <div className="w-full bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-[#E0D8C8]">
          <PolaroidStyleSelector
            selectedStyle={selectedStyle}
            onSelectStyle={setSelectedStyle}
          />
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden bg-[#3B2A22]/90 border-4 border-[#E0D8C8] shadow-2xl flex items-center justify-center">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#3B2A22] z-50 flex flex-col items-center justify-center space-y-4 p-6 text-center text-white">
            <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <p className="font-lato text-sm tracking-wider uppercase text-[#FAF7F1]/90">
              {loadingText}
            </p>
          </div>
        )}

        {/* Error State */}
        {permissionError && (
          <div className="absolute inset-0 bg-[#3B2A22] z-40 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <p className="text-sm font-lato text-red-300">{permissionError}</p>
          </div>
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-2">
            <span className="text-7xl sm:text-8xl font-serif text-white font-bold animate-ping">
              {countdown}
            </span>
            <span className="text-xs sm:text-sm font-serif text-[#FAF7F1] tracking-widest uppercase">
              Taking Shot {currentShotIndex + 1} of {selectedStyle.shotsRequired}!
            </span>
          </div>
        )}

        {/* Live Camera Canvas Feed */}
        {!finalPolaroidUrl && (
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
        )}

        {/* Rendered Polaroid Composite Result */}
        {finalPolaroidUrl && (
          <div className="w-full h-full p-4 overflow-y-auto flex items-center justify-center bg-[#FAF7F1]/90 z-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={finalPolaroidUrl}
              alt="Polaroid Strip Result"
              className="max-h-full rounded-lg shadow-xl border border-[#E0D8C8]"
            />
          </div>
        )}

        {/* Gesture HUD */}
        {!finalPolaroidUrl && !isLoading && (
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white flex items-center gap-2">
              <span className="text-xs font-medium tracking-wide">
                {isCapturingSequence
                  ? `Capturing... (${capturedShots.length}/${selectedStyle.shotsRequired} Shots)`
                  : heartDetected
                    ? `Heart Detected! Starting ${selectedStyle.shotsRequired}-Shot Sequence...`
                    : consecutiveCount > 0
                      ? `Forming Heart... (${consecutiveCount}/30)`
                      : `Make a Mini-Heart 🫰 or Big Heart 🫶 to take ${selectedStyle.shotsRequired} shots!`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Controls */}
      {finalPolaroidUrl && (
        <div className="flex items-center gap-4 animate-in slide-in-from-bottom-3 duration-200">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C4714A] hover:bg-[#A85834] text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Polaroid
          </button>

          <button
            type="button"
            onClick={handleRetake}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#E0D8C8] text-[#5C4033] hover:bg-[#FAF7F1] font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {t('photoBooth.retake')}
          </button>
        </div>
      )}
    </div>
  )
}
