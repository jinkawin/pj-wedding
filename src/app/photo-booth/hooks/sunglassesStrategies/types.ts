export interface EyePosition {
  centerX: number
  centerY: number
  distance: number
  angleRad: number
  faceIndex: number
}

export type FilterCategory = 'glasses' | 'hat'

/**
 * Strategy Pattern Interface for Face Overlays
 */
export interface SunglassesStrategy {
  id: string
  name: string
  category: FilterCategory
  draw: (ctx: CanvasRenderingContext2D, eyePos: EyePosition) => void
}

