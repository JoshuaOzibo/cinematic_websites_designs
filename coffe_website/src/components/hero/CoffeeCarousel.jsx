import { useLayoutEffect, useRef } from 'react'
import { focusFor, opacityFor, slotFor } from './slotMath'

/** How small a cup gets once it has fully left the centre slot.
 *  0.52 creates ~55-60% visual weight vs. the centre cup, matching the
 *  reference's dominant-centre / supporting-sides hierarchy. */
const SIDE_SCALE = 0.52

/**
 * The three product cups on their circular track.
 *
 * Every cup is anchored to the same baseline with `transform-origin: bottom`,
 * so scaling grows it *upward* out of the cream arc instead of around its
 * middle — that's what keeps all three standing on one surface. On top of the
 * scale, side cups get pushed slightly lower, dimmed and softened by a hair of
 * blur, so the centre cup reads as the sharp, lit, dominant one.
 *
 * All of it is written straight to the DOM from the motion subscription; this
 * component never re-renders while scrolling.
 *
 * ⚠ Nothing outside this file may write transform, opacity, zIndex or filter on
 * a .hero-cup. The subscription below rewrites all four on every scroll event,
 * even once the ring has settled (useHeroMotion still emits on the frame it
 * stops), so an external tween is overwritten within a frame and reads as
 * flicker. The showcase handoff needs to hide *only* the active cup at the
 * instant its overlay takes over — never the side cups, which stay exactly
 * where the ring left them for the whole scene — so opacity is published as
 * the custom property --cup-op here and multiplied in CSS by --cup-swap,
 * which the handoff sets directly on that one cup element only, never on the
 * .hero-cups container. Two writers, two properties, no collision.
 */
export default function CoffeeCarousel({ motion, products }) {
  const cupRefs = useRef([])

  // Layout effect: the cups must be placed before the first paint, or they
  // flash stacked on top of each other at the centre.
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
        // Not el.style.opacity — see the note above the component.
        el.style.setProperty('--cup-op', opacityFor(slot, count).toFixed(3))
        // Closer to centre = closer to the viewer.
        el.style.zIndex = String(30 + Math.round(focus * 10))
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
          {/* Contact shadow — scales with the cup, so it stays believable. */}
          <span className="hero-cup-shadow" />
          {/* width/height are the photo's true pixel size: they give the box an
              aspect ratio before the WebP decodes, which stops both a layout
              shift and the handoff measuring a zero-width cup. */}
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
