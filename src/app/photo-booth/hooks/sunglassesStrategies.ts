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

/**
 * Factory / Registry Pattern for Sunglasses & Face Filter Strategies
 */
export const SUNGLASSES_STRATEGIES: SunglassesStrategy[] = [
  new ClassicWayfarerStrategy(),
  new HeartSunglassesStrategy(),
  new RetroGoldStrategy(),
  new PJWeddingHeadbandStrategy(),
  new PJWeddingTiaraStrategy(),
  new PJWeddingPartyStrategy(),
]

export function getSunglassesStrategy(id: string): SunglassesStrategy | null {
  return SUNGLASSES_STRATEGIES.find((s) => s.id === id) ?? null
}

export function getStrategiesByCategory(category: FilterCategory): SunglassesStrategy[] {
  return SUNGLASSES_STRATEGIES.filter((s) => s.category === category)
}
