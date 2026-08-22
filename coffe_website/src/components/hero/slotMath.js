import { smoothstep } from './colorUtils'
import { INITIAL_INDEX } from '../../data/coffeeProducts'

export function slotFor(index, pos, count) {
  const half = count / 2
  const raw = index - INITIAL_INDEX + pos
  return ((((raw + half) % count) + count) % count) - half
}

export function focusFor(slot) {
  return smoothstep(1 - Math.min(Math.abs(slot), 1))
}

const NOTE_HOLD = 0.3
const NOTE_FADE = 0.46

export function noteOpacityFor(slot) {
  const dist = Math.abs(slot)
  if (dist <= NOTE_HOLD) return 1
  if (dist >= NOTE_FADE) return 0
  return smoothstep(1 - (dist - NOTE_HOLD) / (NOTE_FADE - NOTE_HOLD))
}

export function opacityFor(slot, count) {
  const dist = Math.abs(slot)
  const end = count / 2 - 0.02
  const start = count / 2 - 0.2
  if (dist <= start) return 1
  return Math.max(0, 1 - (dist - start) / (end - start))
}
