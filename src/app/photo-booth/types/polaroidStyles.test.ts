import { describe, it, expect } from 'vitest'
import { POLAROID_STYLES } from './polaroidStyles'

describe('POLAROID_STYLES', () => {
  it('offers 1, 2 and 3 shot layouts with unique ids', () => {
    expect(POLAROID_STYLES.map((s) => s.shotsRequired).sort()).toEqual([1, 2, 3])
    expect(new Set(POLAROID_STYLES.map((s) => s.id)).size).toBe(POLAROID_STYLES.length)
  })

  it.each(POLAROID_STYLES.map((s) => [s.id, s] as const))('%s has one slot per shot, inside the template', (_id, style) => {
    expect(style.slots).toHaveLength(style.shotsRequired)
    for (const slot of style.slots) {
      expect(slot.x).toBeGreaterThanOrEqual(0)
      expect(slot.y).toBeGreaterThanOrEqual(0)
      expect(slot.x + slot.width).toBeLessThanOrEqual(style.width)
      expect(slot.y + slot.height).toBeLessThanOrEqual(style.height)
    }
  })

  it.each(POLAROID_STYLES.map((s) => [s.id, s] as const))('%s slots do not overlap vertically', (_id, style) => {
    const sorted = [...style.slots].sort((a, b) => a.y - b.y)
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].y).toBeGreaterThanOrEqual(sorted[i - 1].y + sorted[i - 1].height)
    }
  })

  it('points at template images that exist in public/', async () => {
    const { existsSync } = await import('node:fs')
    const { join } = await import('node:path')
    for (const style of POLAROID_STYLES) {
      expect(existsSync(join(process.cwd(), 'public', style.templateAsset)), style.templateAsset).toBe(true)
    }
  })
})
