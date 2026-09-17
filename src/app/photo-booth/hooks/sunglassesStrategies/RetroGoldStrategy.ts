import { EyePosition, FilterCategory, SunglassesStrategy } from './types'

/**
 * Concrete Strategy 3: Retro Gold Aviator Sunglasses
 */
export class RetroGoldStrategy implements SunglassesStrategy {
  id = 'gold_aviator'

  name = 'Retro Gold Aviators'

  category: FilterCategory = 'glasses'

  draw(ctx: CanvasRenderingContext2D, eyePos: EyePosition): void {
    const { centerX, centerY, distance, angleRad } = eyePos
    const width = distance * 2.35
    const height = distance * 0.9
    const halfW = width / 2
    const halfH = height / 2

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angleRad)

    // Double bridge (Top bar & Center bar)
    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = distance * 0.05

    // Top bridge bar
    ctx.beginPath()
    ctx.moveTo(-halfW * 0.35, -halfH * 0.8)
    ctx.lineTo(halfW * 0.35, -halfH * 0.8)
    ctx.stroke()

    // Lower bridge bar
    ctx.beginPath()
    ctx.moveTo(-halfW * 0.2, -halfH * 0.4)
    ctx.lineTo(halfW * 0.2, -halfH * 0.4)
    ctx.stroke()

    // Aviator teardrop lens drawer
    const drawTeardropLens = (cx: number) => {
      ctx.save()
      const radius = halfW * 0.38
      const topY = -halfH * 0.6
      const bottomY = halfH * 0.65

      ctx.beginPath()
      ctx.moveTo(cx - radius, topY)
      ctx.lineTo(cx + radius, topY)
      ctx.quadraticCurveTo(cx + radius * 1.1, (topY + bottomY) / 2, cx, bottomY)
      ctx.quadraticCurveTo(cx - radius * 1.1, (topY + bottomY) / 2, cx - radius, topY)
      ctx.closePath()

      // Amber/Gold Gradient
      const grad = ctx.createLinearGradient(cx, topY, cx, bottomY)
      grad.addColorStop(0, 'rgba(180, 120, 40, 0.85)')
      grad.addColorStop(1, 'rgba(100, 60, 15, 0.92)')
      ctx.fillStyle = grad
      ctx.fill()

      // Metallic Gold rim
      ctx.lineWidth = distance * 0.06
      ctx.strokeStyle = '#FACC15'
      ctx.stroke()

      // Reflection
      ctx.beginPath()
      ctx.moveTo(cx - radius * 0.5, topY + (bottomY - topY) * 0.15)
      ctx.lineTo(cx - radius * 0.1, topY + (bottomY - topY) * 0.15)
      ctx.lineTo(cx - radius * 0.4, topY + (bottomY - topY) * 0.7)
      ctx.lineTo(cx - radius * 0.6, topY + (bottomY - topY) * 0.7)
      ctx.closePath()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.fill()

      ctx.restore()
    }

    drawTeardropLens(-halfW * 0.45)
    drawTeardropLens(halfW * 0.45)

    ctx.restore()
  }
}

