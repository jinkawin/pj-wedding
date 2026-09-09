'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useTranslation } from '@/locale/I18nContext'
import { FrameId } from './FrameSelector'

interface CameraViewProps {
  selectedFrame: FrameId
  onPhotoCaptured: (dataUrl: string) => void
}

export default function CameraView({ selectedFrame, onPhotoCaptured }: CameraViewProps) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [isCameraActive, setIsCameraActive] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isFlashing, setIsFlashing] = useState(false)

  // Start video stream
  const startCamera = useCallback(async () => {
    setErrorMsg(null)
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const currentStream = videoRef.current.srcObject as MediaStream
        currentStream.getTracks().forEach((track) => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setIsCameraActive(true)
    } catch {
      setErrorMsg(t('photoBooth.permissionDenied'))
      setIsCameraActive(false)
    }
  }, [facingMode, t])

  // Stop video stream
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }, [])

  // Switch front / back camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

  useEffect(() => {
    if (isCameraActive) {
      startCamera()
    }
  }, [facingMode, startCamera, isCameraActive])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  // Draw overlay frames onto Canvas
  const drawFrameOverlay = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: FrameId,
  ) => {
    if (frame === 'none') return

    ctx.save()
    const padding = Math.min(width, height) * 0.04

    if (frame === 'floralGold') {
      // Golden border frame
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = padding
      ctx.strokeRect(padding / 2, padding / 2, width - padding, height - padding)

      ctx.strokeStyle = '#FAF7F1'
      ctx.lineWidth = 2
      ctx.strokeRect(padding * 1.2, padding * 1.2, width - padding * 2.4, height - padding * 2.4)

      // Top corner decorations
      ctx.fillStyle = '#D4AF37'
      ctx.font = `bold ${Math.round(height * 0.04)}px serif`
      ctx.textAlign = 'center'
      ctx.fillText('❖  Parima & Jinkawin  ❖', width / 2, padding * 2)

      // Bottom Date
      ctx.font = `${Math.round(height * 0.03)}px serif`
      ctx.fillText('Wedding Day • Celebration of Love', width / 2, height - padding * 1.2)
    } else if (frame === 'romanticRose') {
      // Pink / Rose outer border
      ctx.strokeStyle = '#C4714A'
      ctx.lineWidth = padding * 1.2
      ctx.strokeRect(padding / 2, padding / 2, width - padding, height - padding)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = `italic bold ${Math.round(height * 0.045)}px serif`
      ctx.textAlign = 'center'
      ctx.fillText('Forever & Always', width / 2, padding * 2.2)

      ctx.font = `${Math.round(height * 0.03)}px sans-serif`
      ctx.fillText('Parima ♥ Jinkawin', width / 2, height - padding * 1.3)
    } else if (frame === 'classicMonogram') {
      // Dark Elegant Frame
      ctx.strokeStyle = '#3B2A22'
      ctx.lineWidth = padding * 1.5
      ctx.strokeRect(padding / 2, padding / 2, width - padding, height - padding)

      // Monogram Top
      ctx.fillStyle = '#EAE2D2'
      ctx.font = `bold ${Math.round(height * 0.05)}px serif`
      ctx.textAlign = 'center'
      ctx.fillText('P  &  J', width / 2, padding * 2.3)

      ctx.font = `${Math.round(height * 0.028)}px sans-serif`
      ctx.fillText('THANK YOU FOR CELEBRATING WITH US', width / 2, height - padding * 1.5)
    } else if (frame === 'modernWarm') {
      // Warm border
      ctx.strokeStyle = '#8C6D58'
      ctx.lineWidth = padding
      ctx.strokeRect(padding / 2, padding / 2, width - padding, height - padding)

      ctx.fillStyle = '#FAF7F1'
      ctx.font = `bold ${Math.round(height * 0.04)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('PARIMA × JINKAWIN', width / 2, padding * 2)

      ctx.font = `${Math.round(height * 0.028)}px sans-serif`
      ctx.fillText('BANGKOK • THAILAND', width / 2, height - padding * 1.2)
    }

    ctx.restore()
  }

  // Capture current canvas photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = video.videoWidth || 1280
    const height = video.videoHeight || 960

    canvas.width = width
    canvas.height = height

    // Flash trigger
    setIsFlashing(true)
    setTimeout(() => setIsFlashing(false), 200)

    // Flip horizontally if front camera
    if (facingMode === 'user') {
      ctx.translate(width, 0)
      ctx.scale(-1, 1)
    }

    // Draw video frame
    ctx.drawImage(video, 0, 0, width, height)

    // Reset transform before overlaying frames
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // Draw wedding frame
    drawFrameOverlay(ctx, width, height, selectedFrame)

    // Export image URL
    const dataUrl = canvas.toDataURL('image/png')
    onPhotoCaptured(dataUrl)
  }

  // Handle countdown before snap
  const startCountdownCapture = () => {
    if (countdown !== null) return
    let current = 3
    setCountdown(current)

    const timer = setInterval(() => {
      current -= 1
      if (current > 0) {
        setCountdown(current)
      } else {
        clearInterval(timer)
        setCountdown(null)
        capturePhoto()
      }
    }, 900)
  }

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Viewport Container */}
      <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden bg-[#3B2A22]/90 border-2 border-[#E0D8C8] shadow-lg flex items-center justify-center">
        {/* Flash Effect */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300 pointer-events-none" />
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex items-center justify-center">
            <span className="text-7xl sm:text-9xl font-serif text-white font-bold animate-ping">
              {countdown}
            </span>
          </div>
        )}

        {/* Live Video Feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover ${
            facingMode === 'user' ? '-scale-x-100' : ''
          } ${isCameraActive ? 'block' : 'hidden'}`}
        />

        {/* Frame Overlay Preview */}
        {isCameraActive && selectedFrame !== 'none' && (
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 sm:p-6 border-4 border-[#D4AF37]/80">
            {/* Top Text Frame */}
            <div className="text-center bg-black/40 backdrop-blur-sm py-1.5 px-4 rounded-full mx-auto border border-white/20">
              <span className="text-xs sm:text-sm font-serif text-white font-semibold tracking-widest">
                Parima &amp; Jinkawin
              </span>
            </div>
            {/* Bottom Text Frame */}
            <div className="text-center bg-black/40 backdrop-blur-sm py-1 px-4 rounded-full mx-auto border border-white/20">
              <span className="text-[10px] sm:text-xs font-sans text-white/90 tracking-wide uppercase">
                Wedding Day Photo Booth
              </span>
            </div>
          </div>
        )}

        {/* Inactive State / Placeholder */}
        {!isCameraActive && (
          <div className="flex flex-col items-center justify-center p-6 text-center text-[#FAF7F1] space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F1]/10 flex items-center justify-center mb-1">
              <svg className="w-8 h-8 text-[#FAF7F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-lato max-w-sm text-white/80">
              {errorMsg || t('photoBooth.description')}
            </p>
            <button
              type="button"
              onClick={startCamera}
              className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C4714A] hover:bg-[#A85834] text-white font-medium text-xs tracking-wider uppercase transition-colors shadow-md"
            >
              {t('photoBooth.startCamera')}
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons Toolbar */}
      {isCameraActive && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Flip Front/Back Camera */}
          <button
            type="button"
            onClick={toggleFacingMode}
            className="p-3 rounded-full bg-white border border-[#E0D8C8] text-[#5C4033] hover:bg-[#FAF7F1] shadow-sm transition-all"
            title={t('photoBooth.switchCamera')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          {/* Shutter Snap Button */}
          <button
            type="button"
            onClick={startCountdownCapture}
            disabled={countdown !== null}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#C4714A] hover:bg-[#A85834] text-white font-semibold text-sm tracking-wider uppercase transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            {t('photoBooth.takePhoto')}
          </button>

          {/* Turn Off Camera */}
          <button
            type="button"
            onClick={stopCamera}
            className="p-3 rounded-full bg-white border border-[#E0D8C8] text-red-600 hover:bg-red-50 shadow-sm transition-all"
            title={t('photoBooth.stopCamera')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
