import { useLayoutEffect, useRef } from 'react'
import { focusFor, opacityFor, slotFor } from './slotMath'
const SIDE_SCALE = 0.52
export default function CoffeeCarousel({ motion, products }) {
  const cupRefs = useRef([])
  useLayoutEffect(() => {
    const count = products.length
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    return motion.subscribe((pos) => {
      for (let i = 0; i < count; i += 1) {
        const el = cupRefs.current[i]
        if (!el) continue

        const slot = slotFor(i, pos, count)
        const focus = focusFor(slot)
        const scale = SIDE_SCALE + (1 - SIDE_SCALE) * focus
        const drop = 1 - focus

        el.style.transform =
          `translate3d(calc(-50% + ${slot.toFixed(4)} * var(--cup-gap)),` +
          ` calc(${drop.toFixed(3)} * var(--cup-drop)), 0)` +
          ` scale(${scale.toFixed(4)})`
        el.style.setProperty('--cup-op', opacityFor(slot, count).toFixed(3))
        el.style.zIndex = String(20 + Math.round(focus * 20))
        el.style.filter = reduced
          ? 'none'
          : `brightness(${(0.82 + 0.18 * focus).toFixed(3)})` +
            ` saturate(${(0.88 + 0.12 * focus).toFixed(3)})` +
            ` blur(${((1 - focus) * 1.1).toFixed(2)}px)`
      }
    })
  }, [motion, products])

  return (
    <div className="hero-cups">
      {products.map((product, i) => (
        <div
          key={product.id}
          ref={(el) => {
            cupRefs.current[i] = el
          }}
          className="hero-cup"
        >
          <span className="hero-cup-shadow" />
          <img
            src={product.image}
            alt={product.alt}
            className="hero-cup-img"
            width={product.width}
            height={product.height}
            style={{ height: `calc(var(--cup-h) * ${product.sizeFactor})` }}
            draggable="false"
            fetchPriority={i === 1 ? 'high' : 'auto'}
          />
        </div>
      ))}
    </div>
  )
}
