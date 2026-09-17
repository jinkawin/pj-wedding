import { HandGestureStrategy } from './types'
import { calculateDistance } from './utils'

export const bigHeartStrategy: HandGestureStrategy = {
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

