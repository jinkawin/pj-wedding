import { ClassicWayfarerStrategy } from './ClassicWayfarerStrategy'
import { HeartSunglassesStrategy } from './HeartSunglassesStrategy'
import { PJWeddingHeadbandStrategy } from './PJWeddingHeadbandStrategy'
import { PJWeddingPartyStrategy } from './PJWeddingPartyStrategy'
import { PJWeddingTiaraStrategy } from './PJWeddingTiaraStrategy'
import { RetroGoldStrategy } from './RetroGoldStrategy'
import { FilterCategory, SunglassesStrategy } from './types'

export * from './types'
export * from './ClassicWayfarerStrategy'
export * from './HeartSunglassesStrategy'
export * from './RetroGoldStrategy'
export * from './PJWeddingHeadbandStrategy'
export * from './PJWeddingTiaraStrategy'
export * from './PJWeddingPartyStrategy'

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

