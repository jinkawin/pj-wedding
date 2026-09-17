import { EyePosition, FilterCategory, SunglassesStrategy } from './types'

/**
 * Concrete Strategy 6: PJ Wedding Party Cone Hat & Confetti Filter
 */
export class PJWeddingPartyStrategy implements SunglassesStrategy {
  id = 'pj_wedding_party'

  name = 'PJ Party Hat'

  category: FilterCategory = 'hat'

  draw(ctx: CanvasRenderingContext2D, eyePos: EyePosition): void {
    const { centerX, centerY, distance, angleRad } = eyePos

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angleRad)

    // Position higher up above head
    const headY = -distance * 2.3
    const coneW = distance * 1.5
    const coneH = distance * 1.8
    const coneTopY = headY - coneH * 0.5
    const coneBaseY = headY + coneH * 0.4

    // Festive Party Cone Body (Striped Gradient Cone)
    ctx.beginPath()
    ctx.moveTo(0, coneTopY)
    ctx.lineTo(-coneW / 2, coneBaseY)
    ctx.quadraticCurveTo(0, coneBaseY + distance * 0.2, coneW / 2, coneBaseY)
    ctx.closePath()

    const coneGrad = ctx.createLinearGradient(-coneW / 2, coneTopY, coneW / 2, coneBaseY)
    coneGrad.addColorStop(0, '#FF2D55')
    coneGrad.addColorStop(0.33, '#FF9500')
    coneGrad.addColorStop(0.66, '#FACC15')
    coneGrad.addColorStop(1, '#AF52DE')
    ctx.fillStyle = coneGrad
    ctx.fill()

    ctx.lineWidth = distance * 0.04
    ctx.strokeStyle = '#FFFFFF'
    ctx.stroke()

    // Diagonal Party Polka Dots / Accents
    const dotColors = ['#FFFFFF', '#FACC15', '#38BDF8', '#FF2D55']
    const dots = [
      { x: -distance * 0.2, y: headY },
      { x: distance * 0.25, y: headY + distance * 0.2 },
      { x: 0, y: headY - distance * 0.3 },
      { x: -distance * 0.1, y: headY + distance * 0.35 },
    ]

    dots.forEach((dot, idx) => {
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, distance * 0.08, 0, 2 * Math.PI)
      ctx.fillStyle = dotColors[idx % dotColors.length]
      ctx.fill()
    })

    // Fluffy Pom-Pom on Top of Cone
    ctx.beginPath()
    ctx.arc(0, coneTopY, distance * 0.16, 0, 2 * Math.PI)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
    ctx.lineWidth = distance * 0.03
    ctx.strokeStyle = '#FFCC00'
    ctx.stroke()

    // Neon Party Banner "PJ WEDDING" across Cone Base
    const bannerW = distance * 3.2
    const bannerH = distance * 0.68
    const bannerY = coneBaseY - distance * 0.05

    ctx.beginPath()
    ctx.roundRect(-bannerW / 2, bannerY - bannerH / 2, bannerW, bannerH, distance * 0.35)
    const bannerGrad = ctx.createLinearGradient(0, bannerY - bannerH / 2, 0, bannerY + bannerH / 2)
    bannerGrad.addColorStop(0, '#FF2D55')
    bannerGrad.addColorStop(1, '#C4714A')
    ctx.fillStyle = bannerGrad
    ctx.fill()

    ctx.lineWidth = distance * 0.06
    ctx.strokeStyle = '#FFFFFF'
    ctx.stroke()

    // "PJ WEDDING" Text
    const fontSize = Math.round(distance * 0.34)
    ctx.font = `bold ${fontSize}px Georgia, serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillStyle = '#FFFFFF'
    ctx.fillText('PJ WEDDING', 0, bannerY)

    // Confetti Particles Floating Around Head
    const confettiList = [
      { x: -bannerW * 0.6, y: headY - distance * 0.4, color: '#FF2D55', r: distance * 0.06 },
      { x: bannerW * 0.65, y: headY - distance * 0.2, color: '#FACC15', r: distance * 0.07 },
      { x: -bannerW * 0.55, y: bannerY + distance * 0.3, color: '#38BDF8', r: distance * 0.05 },
      { x: bannerW * 0.58, y: bannerY + distance * 0.3, color: '#AF52DE', r: distance * 0.06 },
    ]

    confettiList.forEach((c) => {
      ctx.beginPath()
      ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI)
      ctx.fillStyle = c.color
      ctx.fill()
    })

    ctx.restore()
  }
}

