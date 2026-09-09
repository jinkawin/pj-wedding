export interface PolaroidSlot {
  x: number
  y: number
  width: number
  height: number
}

export interface PolaroidStyleConfig {
  id: string
  nameKey: string
  templateAsset: string
  width: number
  height: number
  shotsRequired: number
  slots: PolaroidSlot[]
}

export const POLAROID_STYLES: PolaroidStyleConfig[] = [
  {
    id: 'singleShot',
    nameKey: 'photoBooth.polaroidStyles.singleShot',
    templateAsset: '/polaroid-1-shot.png',
    width: 724,
    height: 876,
    shotsRequired: 1,
    slots: [{ x: 54, y: 57, width: 618, height: 646 }],
  },
  {
    id: 'doubleShots',
    nameKey: 'photoBooth.polaroidStyles.doubleShots',
    templateAsset: '/polaroid-2-shots.png',
    width: 864,
    height: 1096,
    shotsRequired: 2,
    slots: [
      { x: 75, y: 38, width: 630, height: 472 },
      { x: 73, y: 586, width: 630, height: 472 },
    ],
  },
  {
    id: 'tripleShots',
    nameKey: 'photoBooth.polaroidStyles.tripleShots',
    templateAsset: '/polaroid-3-shots.png',
    width: 650,
    height: 1606,
    shotsRequired: 3,
    slots: [
      { x: 68, y: 25, width: 507, height: 499 },
      { x: 70, y: 553, width: 507, height: 497 },
      { x: 70, y: 1084, width: 507, height: 501 },
    ],
  },
]

export function renderPolaroidComposite(
  style: PolaroidStyleConfig,
  shots: HTMLCanvasElement[],
  templateImg: HTMLImageElement,
): string | null {
  if (shots.length < style.shotsRequired) return null

  const compositeCanvas = document.createElement('canvas')
  compositeCanvas.width = templateImg.naturalWidth || style.width
  compositeCanvas.height = templateImg.naturalHeight || style.height

  const ctx = compositeCanvas.getContext('2d')
  if (!ctx) return null

  const isAlphaOverlay = style.templateAsset.includes('polaroid-2-shots')

  // If using alpha overlay template, fill white background and draw photos BEHIND the overlay
  if (isAlphaOverlay) {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height)
  } else {
    // Draw base opaque template frame first
    ctx.drawImage(templateImg, 0, 0, compositeCanvas.width, compositeCanvas.height)
  }

  // Draw shots into respective slot coordinates
  shots.forEach((shotCanvas, index) => {
    if (index >= style.slots.length) return
    const slot = style.slots[index]

    const srcW = shotCanvas.width
    const srcH = shotCanvas.height
    const aspectSlot = slot.width / slot.height
    const aspectSrc = srcW / srcH

    let cropX = 0
    let cropY = 0
    let cropW = srcW
    let cropH = srcH

    if (aspectSrc > aspectSlot) {
      cropW = srcH * aspectSlot
      cropX = (srcW - cropW) / 2
    } else {
      cropH = srcW / aspectSlot
      cropY = (srcH - cropH) / 2
    }

    ctx.drawImage(
      shotCanvas,
      cropX,
      cropY,
      cropW,
      cropH,
      slot.x,
      slot.y,
      slot.width,
      slot.height,
    )
  })

  // If using alpha overlay template, draw frame overlay ON TOP of photos
  if (isAlphaOverlay) {
    ctx.drawImage(templateImg, 0, 0, compositeCanvas.width, compositeCanvas.height)
  }

  // Optional Vintage Filter application strategy
  if (style.id === 'vintage3Strip') {
    ctx.save()
    ctx.fillStyle = 'rgba(196, 113, 74, 0.08)' // Sepia warm overlay
    ctx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height)
    ctx.restore()
  }

  return compositeCanvas.toDataURL('image/png')
}

