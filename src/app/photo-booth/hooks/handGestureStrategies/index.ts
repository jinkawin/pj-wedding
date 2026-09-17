import { bigHeartStrategy } from './bigHeartStrategy'
import { highFiveStrategy } from './highFiveStrategy'
import { okHandStrategy } from './okHandStrategy'
import { HandGestureStrategy } from './types'
import { victoryHandStrategy } from './victoryHandStrategy'

export * from './types'
export * from './utils'
export * from './okHandStrategy'
export * from './victoryHandStrategy'
export * from './highFiveStrategy'
export * from './bigHeartStrategy'

export const HAND_GESTURE_STRATEGIES: HandGestureStrategy[] = [
  okHandStrategy,
  victoryHandStrategy,
  highFiveStrategy,
  bigHeartStrategy,
]

