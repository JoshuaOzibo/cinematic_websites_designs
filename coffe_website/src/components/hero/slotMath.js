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
 * Fades a cup out over the last stretch of the ring, past the side slots. This
 * is the curtain the wrap-around hides behind, so it must reach 0 *before*
 * |slot| hits count/2.
 */
export function opacityFor(slot, count) {
  const dist = Math.abs(slot)
  if (dist <= 1) return 1
  // 0.8 of the remaining ring, so the cup is fully invisible for a moment
  // either side of the wrap rather than blinking out exactly on it.
  const span = (count / 2 - 1) * 0.8
  return span > 0 ? Math.max(0, 1 - (dist - 1) / span) : 1
}
