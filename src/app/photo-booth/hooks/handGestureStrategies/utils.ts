import { NormalizedLandmark } from '@mediapipe/tasks-vision'

export const calculateDistance = (p1: NormalizedLandmark, p2: NormalizedLandmark): number => {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y

  return Math.sqrt(dx * dx + dy * dy)
}

export const isExtended = (tip: NormalizedLandmark, pip: NormalizedLandmark): boolean => tip.y < pip.y
export const isFolded = (tip: NormalizedLandmark, pip: NormalizedLandmark): boolean => tip.y > pip.y

