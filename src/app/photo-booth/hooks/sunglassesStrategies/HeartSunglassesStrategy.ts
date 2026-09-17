import { EyePosition, FilterCategory, SunglassesStrategy } from './types'

/**
 * Concrete Strategy 2: Romantic Pink Heart Sunglasses
 */
export class HeartSunglassesStrategy implements SunglassesStrategy {
  id = 'heart'

  name = 'Romantic Hearts'

  category: FilterCategory = 'glasses'

  draw(ctx: CanvasRenderingContext2D, eyePos: EyePosition): void {
    const { centerX, centerY, distance, angleRad } = eyePos
    const width = distance * 2.4
    const halfW = width / 2

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angleRad)

    // Draw single Heart shape
    const drawHeart = (cx: number, cy: number, size: number) => {
      ctx.save()
      ctx.beginPath()
      const topCurveHeight = size * 0.3
      ctx.moveTo(cx, cy + size * 0.3)
      // top left curve
      ctx.bezierCurveTo(
        cx - size * 0.5, cy - size * 0.3,
        cx - size, cy + topCurveHeight,
        cx, cy + size,
      )
      // top right curve
      ctx.bezierCurveTo(
        cx + size, cy + topCurveHeight,
        cx + size * 0.5, cy - size * 0.3,
        cx, cy + size * 0.3,
      )
      ctx.closePath()

      // Pink tint lens fill
      const grad = ctx.createLinearGradient(cx, cy - size * 0.3, cx, cy + size)
      grad.addColorStop(0, 'rgba(244, 63, 94, 0.88)')
      grad.addColorStop(1, 'rgba(225, 29, 72, 0.95)')
      ctx.fillStyle = grad
      ctx.fill()

      // Outer Heart frame border
      ctx.lineWidth = size * 0.12
      ctx.strokeStyle = '#FDA4AF'
      ctx.stroke()

      // White glare reflection
      ctx.beginPath()
      ctx.ellipse(cx - size * 0.3, cy - size * 0.05, size * 0.15, size * 0.06, -Math.PI / 4, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
      ctx.fill()

      ctx.restore()
    }

    const heartSize = distance * 0.65
    drawHeart(-halfW * 0.44, -distance * 0.25, heartSize)
    drawHeart(halfW * 0.44, -distance * 0.25, heartSize)

    // Bridge connecting hearts
    ctx.beginPath()
    ctx.moveTo(-halfW * 0.15, -distance * 0.05)
    ctx.lineTo(halfW * 0.15, -distance * 0.05)
    ctx.lineWidth = distance * 0.06
    ctx.strokeStyle = '#FDA4AF'
    ctx.stroke()

    ctx.restore()
  }
}

