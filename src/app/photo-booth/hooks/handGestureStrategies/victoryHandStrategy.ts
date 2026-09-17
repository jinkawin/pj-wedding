import { HandGestureStrategy } from './types'
import { isExtended, isFolded } from './utils'

export const victoryHandStrategy: HandGestureStrategy = {
  id: 'victory',
  label: 'Victory Hand',
  emoji: '✌️',
  handsRequired: 1,
  detect: (hands) =>
    hands.some((landmarks) => {
      const [indexTip, indexPIP, middleTip, middlePIP, ringTip, ringPIP, pinkyTip, pinkyPIP] = [
        landmarks[8],
        landmarks[6],
        landmarks[12],
        landmarks[10],
        landmarks[16],
        landmarks[14],
        landmarks[20],
        landmarks[18],
      ]

      if (
        !indexTip ||
        !indexPIP ||
        !middleTip ||
        !middlePIP ||
        !ringTip ||
        !ringPIP ||
        !pinkyTip ||
        !pinkyPIP
      ) {
        return false
      }

      return (
        isExtended(indexTip, indexPIP) &&
        isExtended(middleTip, middlePIP) &&
        isFolded(ringTip, ringPIP) &&
        isFolded(pinkyTip, pinkyPIP)
      )
    }),
}

