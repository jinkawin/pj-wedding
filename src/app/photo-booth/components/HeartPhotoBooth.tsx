'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  HandLandmarker,
  FilesetResolver,
  NormalizedLandmark,
} from '@mediapipe/tasks-vision'
import { useTranslation } from '@/locale/I18nContext'

interface HeartPhotoBoothProps {
  onPhotoCaptured?: (dataUrl: string) => void
}

export default function HeartPhotoBooth({ onPhotoCaptured }: HeartPhotoBoothProps) {
  const { t } = useTranslation()

  // DOM References
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Instances & Loop State
  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const consecutiveFramesRef = useRef<number>(0)

  // React State
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Initializing AI Model...')
  const [isCameraStarted, setIsCameraStarted] = useState<boolean>(false)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [heartDetected, setHeartDetected] = useState<boolean>(false)
  const [consecutiveCount, setConsecutiveCount] = useState<number>(0)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  // 1. Calculate Euclidean distance between two 2D/3D landmarks
  const calculateDistance = (p1: NormalizedLandmark, p2: NormalizedLandmark): number => {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y

    return Math.sqrt(dx * dx + dy * dy)
  }

  // 2. Check "Heart Hands" gesture criteria between 2 detected hands
  const checkHeartHandGesture = useCallback(
    (hand1: NormalizedLandmark[], hand2: NormalizedLandmark[]): boolean => {
      // Landmark indices:
      // 4: Thumb Tip
      // 8: Index Finger Tip
      const thumb1 = hand1[4]
      const index1 = hand1[8]
      const thumb2 = hand2[4]
      const index2 = hand2[8]

      if (!thumb1 || !index1 || !thumb2 || !index2) return false

      // Condition 1 (Thumbs): Distance between Hand 1 Thumb Tip and Hand 2 Thumb Tip < 0.08
      const thumbDistance = calculateDistance(thumb1, thumb2)

      // Condition 2 (Index Fingers): Distance between Hand 1 Index Tip and Hand 2 Index Tip < 0.08
      const indexDistance = calculateDistance(index1, index2)

      // Condition 3 (Shape): Index tips must be physically HIGHER on canvas (lower Y value) than thumb tips
      const avgIndexY = (index1.y + index2.y) / 2
      const avgThumbY = (thumb1.y + thumb2.y) / 2
      const isShapeCorrect = avgIndexY < avgThumbY

      const isThumbTouch = thumbDistance < 0.08
      const isIndexTouch = indexDistance < 0.08

      return isThumbTouch && isIndexTouch && isShapeCorrect
    },
    [],
  )

  // 3. Capture canvas frame to base64 image
  const takeSnapshot = useCallback(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL('image/png')
    setCapturedImage(dataUrl)
    if (onPhotoCaptured) {
      onPhotoCaptured(dataUrl)
    }
  }, [onPhotoCaptured])

  // 4. Trigger countdown logic once 30 consecutive frames are locked
  const startCountdown = useCallback(() => {
    let current = 3
    setCountdown(current)

    const timer = setInterval(() => {
      current -= 1
      if (current > 0) {
        setCountdown(current)
      } else {
        clearInterval(timer)
        setCountdown(null)
        takeSnapshot()
      }
    }, 900)
  }, [takeSnapshot])

  // 5. Detection render loop
  const detectLoop = useCallback(() => {
    if (
      !landmarkerRef.current ||
      !videoRef.current ||
      !canvasRef.current ||
      videoRef.current.readyState < 2
    ) {
      animFrameIdRef.current = requestAnimationFrame(detectLoop)

      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      animFrameIdRef.current = requestAnimationFrame(detectLoop)

      return
    }

    // Match canvas display dimensions to webcam video feed
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 1280
      canvas.height = video.videoHeight || 960
    }

    const width = canvas.width
    const height = canvas.height

    // Draw mirrored video feed on canvas
    ctx.save()
    ctx.clearRect(0, 0, width, height)
    ctx.translate(width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, width, height)
    ctx.restore()

    // Detect hand landmarks
    const startTimeMs = performance.now()
    const results = landmarkerRef.current.detectForVideo(video, startTimeMs)

    let isHeartFormed = false

    if (results.landmarks && results.landmarks.length >= 2) {
      const hand1 = results.landmarks[0]
      const hand2 = results.landmarks[1]
      isHeartFormed = checkHeartHandGesture(hand1, hand2)
    }

    // Draw landmarks & heart indicator on canvas
    if (results.landmarks) {
      ctx.save()
      // Mirror context for landmarks drawing to align with mirrored camera feed
      ctx.translate(width, 0)
      ctx.scale(-1, 1)

      results.landmarks.forEach((landmarks) => {
        landmarks.forEach((lm) => {
          ctx.beginPath()
          ctx.arc(lm.x * width, lm.y * height, 4, 0, 2 * Math.PI)
          ctx.fillStyle = isHeartFormed ? '#FF4D6D' : '#D4AF37'
          ctx.fill()
        })
      })
      ctx.restore()
    }

    // Handle 30 consecutive frame detection state
    if (isHeartFormed && !capturedImage && countdown === null) {
      consecutiveFramesRef.current += 1
      setConsecutiveCount(consecutiveFramesRef.current)

      if (consecutiveFramesRef.current >= 30) {
        setHeartDetected(true)
        consecutiveFramesRef.current = 0
        startCountdown()
      }
    } else if (!isHeartFormed && countdown === null) {
      consecutiveFramesRef.current = 0
      setConsecutiveCount(0)
      setHeartDetected(false)
    }

    animFrameIdRef.current = requestAnimationFrame(detectLoop)
  }, [checkHeartHandGesture, capturedImage, countdown, startCountdown])

  // 6. Initialize MediaPipe HandLandmarker & Webcam
  useEffect(() => {
    let isMounted = true

    const initMediaPipe = async () => {
      try {
        setLoadingText('Loading MediaPipe Vision WASM...')
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
        )

        if (!isMounted) return

        setLoadingText('Loading Hand Detector Model...')
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
        })

        if (!isMounted) return

        landmarkerRef.current = landmarker
        setIsLoading(false)

        // Request Webcam Stream
        const constraints = { video: { width: { ideal: 1280 }, height: { ideal: 960 } } }
        const stream = await navigator.mediaDevices.getUserMedia(constraints)

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop())

          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setIsCameraStarted(true)
        }
      } catch {
        if (isMounted) {
          setIsLoading(false)
          setPermissionError(
            'Failed to load camera or AI model. Please ensure camera permissions are granted.',
          )
        }
      }
    }

    initMediaPipe()

    return () => {
      isMounted = false

      // Cancel animation loop
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }

      // Stop MediaStream tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      // Close MediaPipe landmarker
      if (landmarkerRef.current) {
        landmarkerRef.current.close()
        landmarkerRef.current = null
      }
    }
  }, [])

  // Start detect loop once camera is playing
  useEffect(() => {
    if (isCameraStarted && !isLoading) {
      animFrameIdRef.current = requestAnimationFrame(detectLoop)
    }

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
    }
  }, [isCameraStarted, isLoading, detectLoop])

  const handleRetake = () => {
    setCapturedImage(null)
    setHeartDetected(false)
    setCountdown(null)
    consecutiveFramesRef.current = 0
    setConsecutiveCount(0)
  }

  const handleDownload = () => {
    if (!capturedImage) return
    const link = document.createElement('a')
    link.href = capturedImage
    link.download = `heart-photo-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6">
      {/* Hidden Webcam Source Video */}
      <video ref={videoRef} playsInline muted className="hidden" />

      {/* Main Viewport Container */}
      <div className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden bg-[#3B2A22]/90 border-4 border-[#E0D8C8] shadow-2xl flex items-center justify-center">
        {/* Loading Spinner State */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#3B2A22] z-50 flex flex-col items-center justify-center space-y-4 p-6 text-center text-white">
            <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <p className="font-lato text-sm tracking-wider uppercase text-[#FAF7F1]/90">
              {loadingText}
            </p>
          </div>
        )}

        {/* Permission Error State */}
        {permissionError && (
          <div className="absolute inset-0 bg-[#3B2A22] z-40 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <p className="text-sm font-lato text-red-300">{permissionError}</p>
          </div>
        )}

        {/* Countdown Ping Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-2">
            <span className="text-8xl sm:text-9xl font-serif text-white font-bold animate-ping">
              {countdown}
            </span>
            <span className="text-sm font-serif text-[#FAF7F1] tracking-widest uppercase">
              Hold Your Heart Gesture!
            </span>
          </div>
        )}

        {/* Live Mirror Canvas */}
        {!capturedImage && (
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
        )}

        {/* Captured Final Image Result */}
        {capturedImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedImage}
            alt="Heart Hands Snapshot"
            className="w-full h-full object-cover z-20 animate-in fade-in duration-300"
          />
        )}

        {/* Live Gesture Detection Progress HUD */}
        {!capturedImage && !isLoading && (
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white flex items-center gap-2">
              <span className="text-xl">{heartDetected ? '💖' : '🫶'}</span>
              <span className="text-xs font-medium tracking-wide">
                {heartDetected
                  ? 'Heart Detected! Snapping...'
                  : consecutiveCount > 0
                    ? `Forming Heart... (${consecutiveCount}/30)`
                    : 'Make a Heart gesture with both hands!'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Controls for Captured Snapshot */}
      {capturedImage && (
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
            {t('photoBooth.download')}
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
