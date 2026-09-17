import { EyePosition, FilterCategory, SunglassesStrategy } from './types'

/**
 * Concrete Strategy 1: Classic Black Wayfarer Sunglasses
 */
export class ClassicWayfarerStrategy implements SunglassesStrategy {
  id = 'classic'

  name = 'Classic Black'

  category: FilterCategory = 'glasses'

  draw(ctx: CanvasRenderingContext2D, eyePos: EyePosition): void {
    const { centerX, centerY, distance, angleRad } = eyePos
    const width = distance * 2.3
    const height = distance * 0.85
    const halfW = width / 2
    const halfH = height / 2

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angleRad)

    // Frame outer contour
    ctx.beginPath()
    // Top bar
    ctx.moveTo(-halfW, -halfH * 0.7)
    ctx.lineTo(halfW, -halfH * 0.7)
    // Right rim
    ctx.quadraticCurveTo(halfW * 1.05, 0, halfW * 0.85, halfH * 0.8)
    ctx.quadraticCurveTo(halfW * 0.4, halfH * 1.1, halfW * 0.1, halfH * 0.4)
    // Bridge
    ctx.lineTo(-halfW * 0.1, halfH * 0.4)
    // Left rim
    ctx.quadraticCurveTo(-halfW * 0.4, halfH * 1.1, -halfW * 0.85, halfH * 0.8)
    ctx.quadraticCurveTo(-halfW * 1.05, 0, -halfW, -halfH * 0.7)
    ctx.closePath()

    // Frame stroke and fill
    ctx.fillStyle = '#111827'
    ctx.fill()
    ctx.lineWidth = distance * 0.08
    ctx.strokeStyle = '#030712'
    ctx.stroke()

    // Lenses (Left & Right)
    const drawLens = (offsetX: number) => {
      ctx.save()
      const lensW = halfW * 0.78
      const lensH = halfH * 1.2
      const lensX = offsetX - lensW / 2
      const lensY = -halfH * 0.5

      ctx.beginPath()
      ctx.roundRect(lensX, lensY, lensW, lensH, [lensW * 0.1, lensW * 0.1, lensW * 0.4, lensW * 0.4])

      // Dark gradient lens
      const grad = ctx.createLinearGradient(0, lensY, 0, lensY + lensH)
      grad.addColorStop(0, 'rgba(30, 41, 59, 0.95)')
      grad.addColorStop(1, 'rgba(15, 23, 42, 0.98)')
      ctx.fillStyle = grad
      ctx.fill()

      // Glare / Reflection Highlight
      ctx.beginPath()
      ctx.moveTo(lensX + lensW * 0.2, lensY + lensH * 0.15)
      ctx.lineTo(lensX + lensW * 0.6, lensY + lensH * 0.15)
      ctx.lineTo(lensX + lensW * 0.35, lensY + lensH * 0.7)
      ctx.lineTo(lensX + lensW * 0.15, lensY + lensH * 0.7)
      ctx.closePath()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.fill()

      ctx.restore()
    }

    drawLens(-halfW * 0.45)
    drawLens(halfW * 0.45)

    // Gold frame pin accents on outer corners
    ctx.fillStyle = '#D4AF37'
    ctx.beginPath()
    ctx.arc(-halfW * 0.88, -halfH * 0.3, distance * 0.04, 0, 2 * Math.PI)
    ctx.arc(halfW * 0.88, -halfH * 0.3, distance * 0.04, 0, 2 * Math.PI)
    ctx.fill()

    ctx.restore()
  }
}

