import { useLayoutEffect } from 'react'
import { hslString, mixHsl, smoothstep } from './colorUtils'
import { slotFor } from './slotMath'

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
