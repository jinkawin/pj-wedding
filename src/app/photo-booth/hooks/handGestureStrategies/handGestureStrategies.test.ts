import { describe, it, expect } from 'vitest'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import {
  HAND_GESTURE_STRATEGIES,
  okHandStrategy,
  victoryHandStrategy,
  highFiveStrategy,
  bigHeartStrategy,
  calculateDistance,
  isExtended,
  isFolded,
} from './index'

const TIP = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 } as const
const PIP = { thumbMcp: 2, index: 6, middle: 10, ring: 14, pinky: 18 } as const

const point = (x: number, y: number): NormalizedLandmark => ({ x, y, z: 0, visibility: 1 })

const buildHand = (overrides: Record<number, NormalizedLandmark> = {}): NormalizedLandmark[] => {
  const hand = Array.from({ length: 21 }, () => point(0.5, 0.5))
  for (const [index, landmark] of Object.entries(overrides)) hand[Number(index)] = landmark

  return hand
}

const extend = (tip: number, pip: number): Record<number, NormalizedLandmark> => ({
  [pip]: point(0.5, 0.5),
  [tip]: point(0.5, 0.3),
})

const fold = (tip: number, pip: number): Record<number, NormalizedLandmark> => ({
  [pip]: point(0.5, 0.5),
  [tip]: point(0.5, 0.7),
})

describe('landmark utils', () => {
  it('computes euclidean distance', () => {
    expect(calculateDistance(point(0, 0), point(0.3, 0.4))).toBeCloseTo(0.5)
    expect(calculateDistance(point(0.2, 0.2), point(0.2, 0.2))).toBe(0)
  })

  it('treats a smaller y as extended and a larger y as folded', () => {
    expect(isExtended(point(0, 0.2), point(0, 0.5))).toBe(true)
    expect(isExtended(point(0, 0.8), point(0, 0.5))).toBe(false)
    expect(isFolded(point(0, 0.8), point(0, 0.5))).toBe(true)
    expect(isFolded(point(0, 0.2), point(0, 0.5))).toBe(false)
  })

  it('treats equal y as neither extended nor folded', () => {
    expect(isExtended(point(0, 0.5), point(0, 0.5))).toBe(false)
    expect(isFolded(point(0, 0.5), point(0, 0.5))).toBe(false)
  })
})

describe('registry', () => {
  it('lists the four gestures with unique ids', () => {
    expect(HAND_GESTURE_STRATEGIES.map((s) => s.id)).toEqual(['ok', 'victory', 'high-five', 'big-heart'])
    expect(new Set(HAND_GESTURE_STRATEGIES.map((s) => s.id)).size).toBe(HAND_GESTURE_STRATEGIES.length)
  })

  it('only the big heart needs two hands', () => {
    expect(HAND_GESTURE_STRATEGIES.filter((s) => s.handsRequired === 2).map((s) => s.id)).toEqual(['big-heart'])
  })

  it('never detects anything without hands', () => {
    for (const strategy of HAND_GESTURE_STRATEGIES) expect(strategy.detect([])).toBe(false)
  })

  it('never throws on partial landmark arrays', () => {
    for (const strategy of HAND_GESTURE_STRATEGIES) {
      expect(() => strategy.detect([[], []])).not.toThrow()
      expect(strategy.detect([[], []])).toBe(false)
    }
  })
})

describe('okHandStrategy', () => {
  const okHand = () =>
    buildHand({
      [TIP.thumb]: point(0.4, 0.4),
      [TIP.index]: point(0.42, 0.4),
      ...extend(TIP.middle, PIP.middle),
      ...extend(TIP.ring, PIP.ring),
      ...extend(TIP.pinky, PIP.pinky),
    })

  it('detects thumb touching index with the other fingers up', () => {
    expect(okHandStrategy.detect([okHand()])).toBe(true)
  })

  it('rejects when thumb and index are apart', () => {
    const hand = okHand()
    hand[TIP.index] = point(0.6, 0.4)
    expect(okHandStrategy.detect([hand])).toBe(false)
  })

  it('rejects when a remaining finger is folded', () => {
    const hand = okHand()
    Object.assign(hand, { [TIP.pinky]: point(0.5, 0.7) })
    expect(okHandStrategy.detect([hand])).toBe(false)
  })

  it('matches if any one of several hands makes the sign', () => {
    expect(okHandStrategy.detect([buildHand(), okHand()])).toBe(true)
  })
})

describe('victoryHandStrategy', () => {
  const victory = () =>
    buildHand({
      ...extend(TIP.index, PIP.index),
      ...extend(TIP.middle, PIP.middle),
      ...fold(TIP.ring, PIP.ring),
      ...fold(TIP.pinky, PIP.pinky),
    })

  it('detects index and middle up with ring and pinky down', () => {
    expect(victoryHandStrategy.detect([victory()])).toBe(true)
  })

  it('rejects an open palm', () => {
    const hand = victory()
    hand[TIP.ring] = point(0.5, 0.3)
    expect(victoryHandStrategy.detect([hand])).toBe(false)
  })

  it('rejects a fist', () => {
    const hand = victory()
    hand[TIP.index] = point(0.5, 0.7)
    hand[TIP.middle] = point(0.5, 0.7)
    expect(victoryHandStrategy.detect([hand])).toBe(false)
  })
})

describe('highFiveStrategy', () => {
  const openPalm = () =>
    buildHand({
      [PIP.thumbMcp]: point(0.3, 0.6),
      [TIP.thumb]: point(0.2, 0.3),
      ...extend(TIP.index, PIP.index),
      ...extend(TIP.middle, PIP.middle),
      ...extend(TIP.ring, PIP.ring),
      [PIP.pinky]: point(0.8, 0.5),
      [TIP.pinky]: point(0.8, 0.3),
    })

  it('detects five spread fingers', () => {
    expect(highFiveStrategy.detect([openPalm()])).toBe(true)
  })

  it('rejects when the thumb is tucked next to the pinky', () => {
    const hand = openPalm()
    hand[TIP.thumb] = point(0.75, 0.3)
    expect(highFiveStrategy.detect([hand])).toBe(false)
  })

  it('rejects when one finger is folded', () => {
    const hand = openPalm()
    hand[TIP.middle] = point(0.5, 0.7)
    expect(highFiveStrategy.detect([hand])).toBe(false)
  })
})

describe('bigHeartStrategy', () => {
  const left = () => buildHand({ [TIP.thumb]: point(0.49, 0.6), [TIP.index]: point(0.47, 0.4) })
  const right = () => buildHand({ [TIP.thumb]: point(0.52, 0.6), [TIP.index]: point(0.54, 0.4) })

  it('detects two hands with thumbs together and index tips together above them', () => {
    expect(bigHeartStrategy.detect([left(), right()])).toBe(true)
  })

  it('needs two hands', () => {
    expect(bigHeartStrategy.detect([left()])).toBe(false)
  })

  it('rejects when the thumbs are far apart', () => {
    const far = buildHand({ [TIP.thumb]: point(0.9, 0.6), [TIP.index]: point(0.54, 0.4) })
    expect(bigHeartStrategy.detect([left(), far])).toBe(false)
  })

  it('rejects when the index tips are below the thumbs', () => {
    const l = buildHand({ [TIP.thumb]: point(0.49, 0.4), [TIP.index]: point(0.47, 0.6) })
    const r = buildHand({ [TIP.thumb]: point(0.52, 0.4), [TIP.index]: point(0.54, 0.6) })
    expect(bigHeartStrategy.detect([l, r])).toBe(false)
  })
})
