'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  HandLandmarker,
  FilesetResolver,
  NormalizedLandmark,
} from '@mediapipe/tasks-vision'

interface UseHeartGestureDetectorParams {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onGestureLock: () => void
  isLocked: boolean
}

export function useHeartGestureDetector({
  videoRef,
  canvasRef,
  onGestureLock,
  isLocked,
}: UseHeartGestureDetectorParams) {
  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const consecutiveFramesRef = useRef<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Initializing AI Model...')
  const [isCameraStarted, setIsCameraStarted] = useState<boolean>(false)
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [heartDetected, setHeartDetected] = useState<boolean>(false)
  const [consecutiveCount, setConsecutiveCount] = useState<number>(0)

  const calculateDistance = (p1: NormalizedLandmark, p2: NormalizedLandmark): number => {
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y

    return Math.sqrt(dx * dx + dy * dy)
  }

  const checkMiniHeartGesture = useCallback(
    (landmarks: NormalizedLandmark[]): boolean => {
      const thumbTip = landmarks[4]
      const indexTip = landmarks[8]
      const indexPIP = landmarks[6]
      const middleTip = landmarks[12]
      const ringTip = landmarks[16]

      if (!thumbTip || !indexTip || !indexPIP || !middleTip || !ringTip) return false

      const distThumbIndexTip = calculateDistance(thumbTip, indexTip)
      const isMiddleFolded = middleTip.y > indexPIP.y
      const isRingFolded = ringTip.y > indexPIP.y

      const isTipTouching = distThumbIndexTip < 0.075
      const isNearFingerHeartShape =
        Math.abs(thumbTip.x - indexTip.x) < 0.06 && Math.abs(thumbTip.y - indexTip.y) < 0.07

      return isTipTouching && isNearFingerHeartShape && isMiddleFolded && isRingFolded
    },
    [],
  )

  const checkHeartHandGesture = useCallback(
    (hand1: NormalizedLandmark[], hand2: NormalizedLandmark[]): boolean => {
      const thumb1 = hand1[4]
      const index1 = hand1[8]
      const thumb2 = hand2[4]
      const index2 = hand2[8]

      if (!thumb1 || !index1 || !thumb2 || !index2) return false

      const thumbDistance = calculateDistance(thumb1, thumb2)
      const indexDistance = calculateDistance(index1, index2)

      const avgIndexY = (index1.y + index2.y) / 2
      const avgThumbY = (thumb1.y + thumb2.y) / 2
      const isShapeCorrect = avgIndexY < avgThumbY

      const isThumbTouch = thumbDistance < 0.08
      const isIndexTouch = indexDistance < 0.08

      return isThumbTouch && isIndexTouch && isShapeCorrect
    },
    [],
  )

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

    let isHeartFormed = false

    if (results.landmarks && results.landmarks.length >= 1) {
      const hasMiniHeart = results.landmarks.some((handLandmarks) =>
        checkMiniHeartGesture(handLandmarks),
      )

      const hasBigHeart =
        results.landmarks.length >= 2 &&
        checkHeartHandGesture(results.landmarks[0], results.landmarks[1])

      isHeartFormed = hasMiniHeart || hasBigHeart
    }

    if (results.landmarks) {
      ctx.save()
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

    if (isHeartFormed && !isLocked) {
      consecutiveFramesRef.current += 1
      setConsecutiveCount(consecutiveFramesRef.current)

      if (consecutiveFramesRef.current >= 30) {
        setHeartDetected(true)
        consecutiveFramesRef.current = 0
        onGestureLock()
      }
    } else if (!isHeartFormed && !isLocked) {
      consecutiveFramesRef.current = 0
      setConsecutiveCount(0)
      setHeartDetected(false)
    }

    animFrameIdRef.current = requestAnimationFrame(detectLoop)
  }, [
    checkHeartHandGesture,
    checkMiniHeartGesture,
    isLocked,
    onGestureLock,
    canvasRef,
    videoRef,
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
    consecutiveFramesRef.current = 0
    setConsecutiveCount(0)
  }

  return {
    isLoading,
    loadingText,
    permissionError,
    heartDetected,
    consecutiveCount,
    resetGestureState,
  }
}

