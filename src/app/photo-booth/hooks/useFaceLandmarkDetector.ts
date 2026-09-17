'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { FaceLandmarker, FilesetResolver, NormalizedLandmark } from '@mediapipe/tasks-vision'
import {
  EyePosition,
  SunglassesStrategy,
  getSunglassesStrategy,
} from './sunglassesStrategies'

interface UseFaceLandmarkDetectorParams {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  isEnabled?: boolean
  strategyId?: string
}

export function useFaceLandmarkDetector({
  videoRef,
  canvasRef,
  isEnabled = true,
  strategyId = 'classic',
}: UseFaceLandmarkDetectorParams) {
  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const animFrameIdRef = useRef<number | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Initializing Face AI...')
  const [detectedFacesCount, setDetectedFacesCount] = useState<number>(0)
  const [eyePositions, setEyePositions] = useState<EyePosition[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<SunglassesStrategy>(() => {
    return getSunglassesStrategy(strategyId) ?? getSunglassesStrategy('classic')!
  })

  useEffect(() => {
    const nextStrategy = getSunglassesStrategy(strategyId) ?? getSunglassesStrategy('classic')!
    setSelectedStrategy(nextStrategy)
  }, [strategyId])

  // Extract EyePosition geometry in screen coordinates from 478 face landmarks
  const extractEyePosition = (
    landmarks: NormalizedLandmark[],
    faceIndex: number,
    width: number,
    height: number,
  ): EyePosition => {
    // Subject's Left eye center (landmarks 263 & 362, appears on Screen Left)
    const leftInner = landmarks[362] || landmarks[263]
    const leftOuter = landmarks[263] || landmarks[362]
    const rawLeftX = (leftInner.x + leftOuter.x) / 2
    const rawLeftY = (leftInner.y + leftOuter.y) / 2

    // Subject's Right eye center (landmarks 33 & 133, appears on Screen Right)
    const rightInner = landmarks[133] || landmarks[33]
    const rightOuter = landmarks[33] || landmarks[133]
    const rawRightX = (rightInner.x + rightOuter.x) / 2
    const rawRightY = (rightInner.y + rightOuter.y) / 2

    // Convert normalized coords to Screen Pixel Coords (matching mirrored view)
    const screenLeftX = (1 - rawLeftX) * width
    const screenLeftY = rawLeftY * height

    const screenRightX = (1 - rawRightX) * width
    const screenRightY = rawRightY * height

    const sDx = screenRightX - screenLeftX
    const sDy = screenRightY - screenLeftY

    const distance = Math.sqrt(sDx * sDx + sDy * sDy)
    const angleRad = Math.atan2(sDy, sDx)
    const centerX = (screenLeftX + screenRightX) / 2
    const centerY = (screenLeftY + screenRightY) / 2

    return {
      centerX,
      centerY,
      distance,
      angleRad,
      faceIndex,
    }
  }

  // Draw sunglasses overlays for up to 3 faces onto canvas context
  const renderSunglassesOverlay = useCallback(
    (ctx: CanvasRenderingContext2D, positions: EyePosition[]) => {
      const activeStrategy = getSunglassesStrategy(strategyId) ?? getSunglassesStrategy('classic')!
      positions.slice(0, 3).forEach((pos) => {
        activeStrategy.draw(ctx, pos)
      })
    },
    [strategyId],
  )

  // Initialize MediaPipe Face Landmarker with max 3 faces
  useEffect(() => {
    let isMounted = true

    const initFaceLandmarker = async () => {
      try {
        setLoadingText('Loading MediaPipe Vision WASM...')
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
        )

        if (!isMounted) return

        setLoadingText('Loading Face Landmarker Model (Max 3 Faces)...')
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numFaces: 3, // Max 3 faces requirement
        })

        if (!isMounted) return

        landmarkerRef.current = landmarker
        setIsLoading(false)
      } catch {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    initFaceLandmarker()

    return () => {
      isMounted = false
      if (landmarkerRef.current) {
        landmarkerRef.current.close()
        landmarkerRef.current = null
      }
    }
  }, [])

  return {
    landmarkerRef,
    isLoading,
    loadingText,
    detectedFacesCount,
    setDetectedFacesCount,
    eyePositions,
    setEyePositions,
    selectedStrategy,
    extractEyePosition,
    renderSunglassesOverlay,
  }
}
