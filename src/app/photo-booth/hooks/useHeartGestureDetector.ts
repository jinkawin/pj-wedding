'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { HAND_GESTURE_STRATEGIES, HandGestureStrategy } from './handGestureStrategies'

interface UseHeartGestureDetectorParams {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onGestureLock: () => void
  isLocked: boolean
}

const GESTURE_HOLD_DURATION_MS = 500

export function useHeartGestureDetector({
  videoRef,
  canvasRef,
  onGestureLock,
  isLocked,
}: UseHeartGestureDetectorParams) {
  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const gestureStartTimeRef = useRef<number | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Initializing AI Model...')
  const [isCameraStarted, setIsCameraStarted] = useState<boolean>(false)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [heartDetected, setHeartDetected] = useState<boolean>(false)
  const [holdProgress, setHoldProgress] = useState<number>(0)
  const [matchedGesture, setMatchedGesture] = useState<HandGestureStrategy | null>(null)

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

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 1280
      canvas.height = video.videoHeight || 960
    }

    const width = canvas.width
    const height = canvas.height

    ctx.save()
    ctx.clearRect(0, 0, width, height)
    ctx.translate(width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, width, height)
    ctx.restore()

    const startTimeMs = performance.now()
    const results = landmarkerRef.current.detectForVideo(video, startTimeMs)

    let isGestureFormed = false
    let detectedStrategy: HandGestureStrategy | null = null

    if (results.landmarks && results.landmarks.length >= 1) {
      detectedStrategy =
        HAND_GESTURE_STRATEGIES.find(
          (strategy) =>
            results.landmarks.length >= strategy.handsRequired &&
            strategy.detect(results.landmarks),
        ) ?? null

      isGestureFormed = detectedStrategy !== null
    }

    if (results.landmarks) {
      ctx.save()
      ctx.translate(width, 0)
      ctx.scale(-1, 1)

      results.landmarks.forEach((landmarks) => {
        landmarks.forEach((lm) => {
          ctx.beginPath()
          ctx.arc(lm.x * width, lm.y * height, 4, 0, 2 * Math.PI)
          ctx.fillStyle = isGestureFormed ? '#FF4D6D' : '#D4AF37'
          ctx.fill()
        })
      })
      ctx.restore()
    }

    if (isGestureFormed && !isLocked) {
      const now = performance.now()
      if (gestureStartTimeRef.current === null) {
        gestureStartTimeRef.current = now
      }

      const elapsedTime = now - gestureStartTimeRef.current
      const progress = Math.min(elapsedTime / GESTURE_HOLD_DURATION_MS, 1)

      setHoldProgress(progress)
      setMatchedGesture(detectedStrategy)

      if (elapsedTime >= GESTURE_HOLD_DURATION_MS) {
        setHeartDetected(true)
        gestureStartTimeRef.current = null
        setHoldProgress(0)
        onGestureLock()
      }
    } else if (!isGestureFormed && !isLocked) {
      gestureStartTimeRef.current = null
      setHoldProgress(0)
      setHeartDetected(false)
      setMatchedGesture(null)
    }

    animFrameIdRef.current = requestAnimationFrame(detectLoop)
  }, [isLocked, onGestureLock, canvasRef, videoRef])

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

      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      if (landmarkerRef.current) {
        landmarkerRef.current.close()
        landmarkerRef.current = null
      }
    }
  }, [canvasRef, videoRef])

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

  const resetGestureState = () => {
    setHeartDetected(false)
    gestureStartTimeRef.current = null
    setHoldProgress(0)
    setMatchedGesture(null)
  }

  return {
    isLoading,
    loadingText,
    permissionError,
    heartDetected,
    holdProgress,
    matchedGesture,
    resetGestureState,
  }
}

