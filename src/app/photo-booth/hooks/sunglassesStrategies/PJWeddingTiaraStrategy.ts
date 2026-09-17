import { EyePosition, FilterCategory, SunglassesStrategy } from './types'

/**
 * Concrete Strategy 5: PJ Wedding Golden Tiara / Crown Filter
 */
export class PJWeddingTiaraStrategy implements SunglassesStrategy {
  id = 'pj_wedding_tiara'

  name = 'PJ Golden Tiara'

  category: FilterCategory = 'hat'

  draw(ctx: CanvasRenderingContext2D, eyePos: EyePosition): void {
    const { centerX, centerY, distance, angleRad } = eyePos

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angleRad)

    // Position above head
    const headY = -distance * 1.35
    const crownW = distance * 2.6
    const crownH = distance * 1.1

    // Tiara Base Arc
    ctx.beginPath()
    ctx.arc(0, headY + crownH * 0.3, crownW * 0.45, Math.PI * 1.1, Math.PI * 1.9)
    ctx.lineWidth = distance * 0.08
    ctx.strokeStyle = '#D4AF37'
    ctx.stroke()

    // 5 Crown Peaks (Gold Triangles with Jewels)
    const peaks = [
      { x: -crownW * 0.4, y: headY + crownH * 0.05 },
      { x: -crownW * 0.22, y: headY - crownH * 0.15 },
      { x: 0, y: headY - crownH * 0.35 }, // Center tallest peak
      { x: crownW * 0.22, y: headY - crownH * 0.15 },
      { x: crownW * 0.4, y: headY + crownH * 0.05 },
    ]

    peaks.forEach((peak) => {
      // Golden Peak Spire
      ctx.beginPath()
      ctx.moveTo(peak.x - distance * 0.12, headY + crownH * 0.25)
      ctx.lineTo(peak.x, peak.y)
      ctx.lineTo(peak.x + distance * 0.12, headY + crownH * 0.25)
      ctx.closePath()

      const goldGrad = ctx.createLinearGradient(peak.x, headY + crownH * 0.25, peak.x, peak.y)
      goldGrad.addColorStop(0, '#D4AF37')
      goldGrad.addColorStop(1, '#FACC15')
      ctx.fillStyle = goldGrad
      ctx.fill()
      ctx.lineWidth = distance * 0.03
      ctx.strokeStyle = '#B48A1E'
      ctx.stroke()

      // Diamond Gem on top of peak
      ctx.beginPath()
      ctx.arc(peak.x, peak.y, distance * 0.07, 0, 2 * Math.PI)
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
      ctx.lineWidth = distance * 0.02
      ctx.strokeStyle = '#38BDF8'
      ctx.stroke()
    })

    // Golden Ribbon Banner with "PJ WEDDING" Text
    const bannerW = distance * 3.0
    const bannerH = distance * 0.65
    const bannerY = headY + crownH * 0.1

    ctx.beginPath()
    ctx.roundRect(-bannerW / 2, bannerY - bannerH / 2, bannerW, bannerH, distance * 0.3)
    const bannerGrad = ctx.createLinearGradient(0, bannerY - bannerH / 2, 0, bannerY + bannerH / 2)
    bannerGrad.addColorStop(0, 'rgba(59, 42, 34, 0.95)')
    bannerGrad.addColorStop(1, 'rgba(30, 20, 15, 0.98)')
    ctx.fillStyle = bannerGrad
    ctx.fill()

    ctx.lineWidth = distance * 0.06
    ctx.strokeStyle = '#D4AF37'
    ctx.stroke()

    // Gold "PJ WEDDING" Text
    const fontSize = Math.round(distance * 0.32)
    ctx.font = `bold ${fontSize}px Georgia, serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillStyle = '#FACC15'
    ctx.fillText('PJ WEDDING', 0, bannerY)

    ctx.restore()
  }
}

