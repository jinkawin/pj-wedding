import { HandGestureStrategy } from './types'
import { calculateDistance, isExtended } from './utils'

export const okHandStrategy: HandGestureStrategy = {
  id: 'ok',
  label: 'OK Hand',
  emoji: '👌',
  handsRequired: 1,
  detect: (hands) =>
    hands.some((landmarks) => {
      const [thumbTip, indexTip, indexPIP, middleTip, middlePIP, ringTip, ringPIP, pinkyTip, pinkyPIP] = [
        landmarks[4],
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
        !thumbTip ||
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

      const isCircleFormed = calculateDistance(thumbTip, indexTip) < 0.06

      return (
        isCircleFormed &&
        isExtended(middleTip, middlePIP) &&
        isExtended(ringTip, ringPIP) &&
        isExtended(pinkyTip, pinkyPIP)
      )
    }),
}

