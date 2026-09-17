import { EyePosition, FilterCategory, SunglassesStrategy } from './types'

/**
 * Concrete Strategy 4: PJ Wedding Floating Rainbow Headband Filter
 */
export class PJWeddingHeadbandStrategy implements SunglassesStrategy {
  id = 'pj_wedding'

  name = 'PJ Rainbow'

  category: FilterCategory = 'hat'

  draw(ctx: CanvasRenderingContext2D, eyePos: EyePosition): void {
    const { centerX, centerY, distance, angleRad } = eyePos

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angleRad)

    // Position above head
    const headY = -distance * 1.4
    const bannerW = distance * 3.4
    const bannerH = distance * 0.7
    const radius = distance * 0.35

    // Rainbow Arch (6 concentric rainbow arcs)
    const rainbowColors = [
      '#FF3B30', // Red
      '#FF9500', // Orange
      '#FFCC00', // Yellow
      '#34C759', // Green
      '#007AFF', // Blue
      '#AF52DE', // Purple
    ]
    const strokeW = distance * 0.035
    const baseRadius = bannerW * 0.4

    ctx.save()
    rainbowColors.forEach((color, idx) => {
      ctx.beginPath()
      ctx.arc(0, headY, baseRadius + idx * strokeW, Math.PI, 2 * Math.PI)
      ctx.lineWidth = strokeW
      ctx.strokeStyle = color
      ctx.stroke()
    })
    ctx.restore()

    // Floating Ribbon / Banner Box
    ctx.beginPath()
    ctx.roundRect(-bannerW / 2, headY - bannerH / 2, bannerW, bannerH, radius)

    const grad = ctx.createLinearGradient(0, headY - bannerH / 2, 0, headY + bannerH / 2)
    grad.addColorStop(0, 'rgba(250, 247, 241, 0.96)')
    grad.addColorStop(1, 'rgba(245, 235, 220, 0.98)')
    ctx.fillStyle = grad
    ctx.fill()

    ctx.lineWidth = distance * 0.07
    ctx.strokeStyle = '#C4714A'
    ctx.stroke()

    // Inner Gold Accent Line
    ctx.beginPath()
    ctx.roundRect(-bannerW / 2 + 4, headY - bannerH / 2 + 4, bannerW - 8, bannerH - 8, radius * 0.8)
    ctx.lineWidth = distance * 0.02
    ctx.strokeStyle = '#D4AF37'
    ctx.stroke()

    // "PJ WEDDING" Text (No Emojis)
    const fontSize = Math.round(distance * 0.35)
    ctx.font = `bold ${fontSize}px Georgia, serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillStyle = '#C4714A'
    ctx.fillText('PJ WEDDING', 0, headY)

    ctx.restore()
  }
}

