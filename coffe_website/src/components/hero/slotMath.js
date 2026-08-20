import { smoothstep } from './colorUtils'
import { INITIAL_INDEX } from '../../data/coffeeProducts'

/**
 * Where each product sits, given the carousel position.
 *
 * A "slot" is a signed, continuous position measured in product widths:
 *
 *      -1            0            +1
 *     left        centre        right
 *
 * The ring wraps at ±count/2 (±1.5 for three products), so a cup that leaves
 * the right edge re-appears at the left edge. That crossover happens at the
 * extreme of the ring, where `opacityFor` has already faded the cup out — so
 * the loop is seamless and scroll can keep going in one direction forever.
 *
 * At pos 0 the product at INITIAL_INDEX (brown) is centred; each whole step of
 * pos advances the ring by one product: brown → green → pink → brown.
 */
export function slotFor(index, pos, count) {
  const half = count / 2
  const raw = index - INITIAL_INDEX + pos
  return ((((raw + half) % count) + count) % count) - half
}

/** 1 when a cup is dead centre, 0 once it has reached a side position. */
export function focusFor(slot) {
  return smoothstep(1 - Math.min(Math.abs(slot), 1))
}

/**
 * Fades the hero panel's note in and out with its product.
 *
 * Deliberately *not* focusFor. At the moment two products change places they
 * both sit at |slot| = 0.5, so a focus-shaped curve would hold each of them at
 * half opacity and print two paragraphs of uppercase over one another, which is
 * unreadable in a way three overlapping cups never are.
 *
 * So this one closes before the crossing and opens after it: the outgoing note
 * is gone by FADE, the incoming one has not started, and there is a short beat
 * with the cell empty. That beat is what makes it read as a swap rather than a
 * dissolve. It is about 60px of scroll, less than a fifth of a second at the
 * damped glide, so nothing appears to be missing.
 *
 * HOLD is generous on purpose: it keeps each note at full opacity for most of
 * its product's step, including the whole of the last one, where the note has
 * to stay legible right up to the point the panel slides away.
 */
const NOTE_HOLD = 0.3
const NOTE_FADE = 0.46

export function noteOpacityFor(slot) {
  const dist = Math.abs(slot)
  if (dist <= NOTE_HOLD) return 1
  if (dist >= NOTE_FADE) return 0
  return smoothstep(1 - (dist - NOTE_HOLD) / (NOTE_FADE - NOTE_HOLD))
}

/**
 * Fades a cup out over the very end of the ring. This is the curtain the
 * wrap-around hides behind, so it must reach 0 *before* |slot| hits count/2,
 * where the slot flips sign.
 *
 * The fade is kept late and short on purpose: the third cup stays visible out
 * at the edge of frame for most of a step, and re-enters from the opposite edge
 * as the next one takes the centre, so the composition never drops to two cups.
 */
export function opacityFor(slot, count) {
  const dist = Math.abs(slot)
  const end = count / 2 - 0.02
  const start = count / 2 - 0.2
  if (dist <= start) return 1
  return Math.max(0, 1 - (dist - start) / (end - start))
}
