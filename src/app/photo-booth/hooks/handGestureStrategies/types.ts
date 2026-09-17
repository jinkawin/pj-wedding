import { NormalizedLandmark } from '@mediapipe/tasks-vision'

export interface HandGestureStrategy {
  id: string
  label: string
  emoji: string
  handsRequired: 1 | 2
  detect: (hands: NormalizedLandmark[][]) => boolean
}

