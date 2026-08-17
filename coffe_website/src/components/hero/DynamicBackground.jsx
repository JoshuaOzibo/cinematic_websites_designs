import { useLayoutEffect } from 'react'
import { hslString, mixHsl, smoothstep } from './colorUtils'
import { slotFor } from './slotMath'

/**
 * The hero's colour environment.
 *
 * Rather than switching between three preset backgrounds, the colour is a live
 * weighted blend of every product's accent, weighted by how close that product
 * is to the centre slot. Two consequences, both wanted:
 *
 *   - the background is *always* derived from whatever is centred, and
 *   - halfway through a scroll step you get a true 50/50 of the two drinks,
 *     so the environment changes with the cups rather than after them.
 *
 * The damped position from useHeroMotion does the rest: a fast scroll still
 * takes ~1s to settle on the new colour.
 *
 * Writes CSS custom properties on the hero root instead of React state — the
 * bottom panel's buttons read the same variables, so they re-tint for free.
 */
export default function DynamicBackground({ motion, products, palette, rootRef }) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    return motion.subscribe((pos) => {
      const weights = products.map((_, i) => {
        const slot = slotFor(i, pos, products.length)
        return smoothstep(1 - Math.min(Math.abs(slot), 1))
      })

      const blend = mixHsl(
        palette.map((color, i) => ({ color, weight: weights[i] })),
      )

      root.style.setProperty('--hero-bg', hslString(blend))
      root.style.setProperty('--hero-deep', hslString(blend))
      root.style.setProperty('--hero-lift', hslString(blend, 0, 0.04))
    })
  }, [motion, products, palette, rootRef])

  return <div className="hero-bg" aria-hidden="true" />
}
