'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { HandLandmarker, FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { HAND_GESTURE_STRATEGIES, HandGestureStrategy } from './handGestureStrategies'
import { getSunglassesStrategy } from './sunglassesStrategies'

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
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const gestureStartTimeRef = useRef<number | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Initializing AI Models...')
  const [isCameraStarted, setIsCameraStarted] = useState<boolean>(false)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [heartDetected, setHeartDetected] = useState<boolean>(false)
  const [holdProgress, setHoldProgress] = useState<number>(0)
  const [matchedGesture, setMatchedGesture] = useState<HandGestureStrategy | null>(null)

  // Face Filter Category 1: Glasses State
  const [isGlassesEnabled, setIsGlassesEnabled] = useState<boolean>(true)
  const [selectedGlassesId, setSelectedGlassesId] = useState<string>('classic')

  // Face Filter Category 2: Hat / Headband State
  const [isHatEnabled, setIsHatEnabled] = useState<boolean>(true)
  const [selectedHatId, setSelectedHatId] = useState<string>('pj_wedding')

  const [detectedFacesCount, setDetectedFacesCount] = useState<number>(0)

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

    // 1. Hand Gesture Detection
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

    // 2. Face Landmark Multi-Category Detection & Overlay (Up to 3 faces)
    const isAnyFilterActive = (isGlassesEnabled && selectedGlassesId) || (isHatEnabled && selectedHatId)

    if (isAnyFilterActive && faceLandmarkerRef.current) {
      const faceResults = faceLandmarkerRef.current.detectForVideo(video, startTimeMs)
      const faceLandmarks = faceResults.faceLandmarks || []
      setDetectedFacesCount(faceLandmarks.length)

      if (faceLandmarks.length > 0) {
        const activeGlassesStrategy = isGlassesEnabled && selectedGlassesId ? getSunglassesStrategy(selectedGlassesId) : null
        const activeHatStrategy = isHatEnabled && selectedHatId ? getSunglassesStrategy(selectedHatId) : null

        // Process up to 3 faces maximum in standard screen coordinates
        faceLandmarks.slice(0, 3).forEach((landmarks, faceIdx) => {
          // Landmark 263/362 = Subject's Left Eye (Appears on Screen Left)
          const leftInner = landmarks[362] || landmarks[263]
          const leftOuter = landmarks[263] || landmarks[362]
          const rawLeftX = (leftInner.x + leftOuter.x) / 2
          const rawLeftY = (leftInner.y + leftOuter.y) / 2

          // Landmark 33/133 = Subject's Right Eye (Appears on Screen Right)
          const rightInner = landmarks[133] || landmarks[33]
          const rightOuter = landmarks[33] || landmarks[133]
          const rawRightX = (rightInner.x + rightOuter.x) / 2
          const rawRightY = (rightInner.y + rightOuter.y) / 2

          // Convert to Screen Coordinates (matching mirrored webcam view)
          const screenLeftX = (1 - rawLeftX) * width
          const screenLeftY = rawLeftY * height

          const screenRightX = (1 - rawRightX) * width
          const screenRightY = rawRightY * height

          const sDx = screenRightX - screenLeftX
          const sDy = screenRightY - screenLeftY

          const distance = Math.sqrt(sDx * sDx + sDy * sDy)
          const angleRad = Math.atan2(sDy, sDx)
          const screenCenterX = (screenLeftX + screenRightX) / 2
          const screenCenterY = (screenLeftY + screenRightY) / 2

          const eyePos = {
            centerX: screenCenterX,
            centerY: screenCenterY,
            distance,
            angleRad,
            faceIndex: faceIdx,
          }

          // Draw Glasses category if enabled
          if (activeGlassesStrategy) {
            activeGlassesStrategy.draw(ctx, eyePos)
          }

          // Draw Hat category if enabled (Combinable with Glasses!)
          if (activeHatStrategy) {
            activeHatStrategy.draw(ctx, eyePos)
          }
        })
      }
    } else {
      setDetectedFacesCount(0)
    }

    // 3. Gesture Hold Countdown Locking
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
  }, [
    isLocked,
    onGestureLock,
    canvasRef,
    videoRef,
    isGlassesEnabled,
    selectedGlassesId,
    isHatEnabled,
    selectedHatId,
  ])

  useEffect(() => {
    let isMounted = true

    const initMediaPipe = async () => {
      try {
        setLoadingText('Loading MediaPipe Vision WASM...')
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
        )

        if (!isMounted) return

        setLoadingText('Loading Hand & Face AI Models (Max 3 Faces)...')
        const [handLandmarker, faceLandmarker] = await Promise.all([
          HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
          }),
          FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numFaces: 3, // Max 3 faces requirement
          }),
        ])

        if (!isMounted) return

        landmarkerRef.current = handLandmarker
        faceLandmarkerRef.current = faceLandmarker
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

      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close()
        faceLandmarkerRef.current = null
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
    isGlassesEnabled,
    setIsGlassesEnabled,
    selectedGlassesId,
    setSelectedGlassesId,
    isHatEnabled,
    setIsHatEnabled,
    selectedHatId,
    setSelectedHatId,
    detectedFacesCount,
  }
}
