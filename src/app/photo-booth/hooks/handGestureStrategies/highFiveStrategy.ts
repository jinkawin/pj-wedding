import { HandGestureStrategy } from './types'
import { calculateDistance, isExtended } from './utils'

export const highFiveStrategy: HandGestureStrategy = {
  id: 'high-five',
  label: 'High 5',
  emoji: '🖐️',
  handsRequired: 1,
  detect: (hands) =>
    hands.some((landmarks) => {
      const [
        thumbTip,
        thumbMCP,
        indexTip,
        indexPIP,
        middleTip,
        middlePIP,
        ringTip,
        ringPIP,
        pinkyTip,
        pinkyPIP,
      ] = [
        landmarks[4],
        landmarks[2],
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
        !thumbMCP ||
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

      const isThumbExtended = calculateDistance(thumbTip, pinkyTip) > 0.15 && thumbTip.y < thumbMCP.y

      return (
        isThumbExtended &&
        isExtended(indexTip, indexPIP) &&
        isExtended(middleTip, middlePIP) &&
        isExtended(ringTip, ringPIP) &&
        isExtended(pinkyTip, pinkyPIP)
      )
    }),
}

