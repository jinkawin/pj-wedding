import { NormalizedLandmark } from '@mediapipe/tasks-vision'

// Strategy pattern: each gesture is a self-contained detection rule so new
// gestures can be added/removed without touching the detection loop.
export interface HandGestureStrategy {
  id: string
  label: string
  emoji: string
  handsRequired: 1 | 2
  detect: (hands: NormalizedLandmark[][]) => boolean
}

const calculateDistance = (p1: NormalizedLandmark, p2: NormalizedLandmark): number => {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y

  return Math.sqrt(dx * dx + dy * dy)
}

const isExtended = (tip: NormalizedLandmark, pip: NormalizedLandmark): boolean => tip.y < pip.y
const isFolded = (tip: NormalizedLandmark, pip: NormalizedLandmark): boolean => tip.y > pip.y

const okHandStrategy: HandGestureStrategy = {
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

const victoryHandStrategy: HandGestureStrategy = {
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

const highFiveStrategy: HandGestureStrategy = {
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

const bigHeartStrategy: HandGestureStrategy = {
  id: 'big-heart',
  label: 'Big Heart',
  emoji: '🫶',
  handsRequired: 2,
  detect: (hands) => {
    if (hands.length < 2) return false
    const [hand1, hand2] = hands
    const thumb1 = hand1[4]
    const index1 = hand1[8]
    const thumb2 = hand2[4]
    const index2 = hand2[8]

    if (!thumb1 || !index1 || !thumb2 || !index2) return false

    const thumbDistance = calculateDistance(thumb1, thumb2)
    const indexDistance = calculateDistance(index1, index2)

    const avgIndexY = (index1.y + index2.y) / 2
    const avgThumbY = (thumb1.y + thumb2.y) / 2
    const isShapeCorrect = avgIndexY < avgThumbY

    return thumbDistance < 0.08 && indexDistance < 0.08 && isShapeCorrect
  },
}

export const HAND_GESTURE_STRATEGIES: HandGestureStrategy[] = [
  okHandStrategy,
  victoryHandStrategy,
  highFiveStrategy,
  bigHeartStrategy,
]
