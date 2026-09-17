import { describe, it, expect, vi } from 'vitest'
import {
  SUNGLASSES_STRATEGIES,
  getSunglassesStrategy,
  getStrategiesByCategory,
  ClassicWayfarerStrategy,
  HeartSunglassesStrategy,
  RetroGoldStrategy,
  PJWeddingHeadbandStrategy,
  PJWeddingTiaraStrategy,
  PJWeddingPartyStrategy,
  EyePosition,
} from './sunglassesStrategies'

describe('Sunglasses & Face Filter Strategies (Design Pattern Verification)', () => {
  it('registers all 6 concrete strategies in the registry with correct categories', () => {
    expect(SUNGLASSES_STRATEGIES.length).toBe(6)
    expect(SUNGLASSES_STRATEGIES.map((s) => s.id)).toEqual([
      'classic',
      'heart',
      'gold_aviator',
      'pj_wedding',
      'pj_wedding_tiara',
      'pj_wedding_party',
    ])

    const glasses = getStrategiesByCategory('glasses')
    expect(glasses.map((s) => s.id)).toEqual(['classic', 'heart', 'gold_aviator'])

    const hats = getStrategiesByCategory('hat')
    expect(hats.map((s) => s.id)).toEqual(['pj_wedding', 'pj_wedding_tiara', 'pj_wedding_party'])
  })

  it('retrieves strategy by id using factory function getSunglassesStrategy', () => {
    expect(getSunglassesStrategy('classic')).toBeInstanceOf(ClassicWayfarerStrategy)
    expect(getSunglassesStrategy('heart')).toBeInstanceOf(HeartSunglassesStrategy)
    expect(getSunglassesStrategy('gold_aviator')).toBeInstanceOf(RetroGoldStrategy)
    expect(getSunglassesStrategy('pj_wedding')).toBeInstanceOf(PJWeddingHeadbandStrategy)
    expect(getSunglassesStrategy('pj_wedding_tiara')).toBeInstanceOf(PJWeddingTiaraStrategy)
    expect(getSunglassesStrategy('pj_wedding_party')).toBeInstanceOf(PJWeddingPartyStrategy)
    // Fallback to null for unknown
    expect(getSunglassesStrategy('unknown')).toBeNull()
  })

  it('executes draw method on PJWeddingPartyStrategy without crashing canvas context', () => {
    const mockCtx = {
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      bezierCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      roundRect: vi.fn(),
      arc: vi.fn(),
      ellipse: vi.fn(),
      fillText: vi.fn(),
      createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: '',
      textBaseline: '',
    } as unknown as CanvasRenderingContext2D

    const eyePos: EyePosition = {
      centerX: 200,
      centerY: 150,
      distance: 60,
      angleRad: 0.1,
      faceIndex: 0,
    }

    const strategy = new PJWeddingPartyStrategy()
    expect(() => strategy.draw(mockCtx, eyePos)).not.toThrow()
    expect(mockCtx.save).toHaveBeenCalled()
    expect(mockCtx.translate).toHaveBeenCalledWith(200, 150)
    expect(mockCtx.rotate).toHaveBeenCalledWith(0.1)
    expect(mockCtx.fillText).toHaveBeenCalledWith('PJ WEDDING', 0, expect.any(Number))
    expect(mockCtx.restore).toHaveBeenCalled()
  })
})
