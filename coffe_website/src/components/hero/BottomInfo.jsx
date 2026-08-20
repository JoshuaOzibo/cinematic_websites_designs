import { useLayoutEffect, useRef } from 'react'
import { COFFEE_PRODUCTS } from '../../data/coffeeProducts'
import { ARC_PATH, ARC_VIEWBOX } from './arcPath'
import { noteOpacityFor, slotFor } from './slotMath'

/**
 * The cream base of the hero: a wide arc, then the information panel.
 *
 * The arc is one SVG path stretched with preserveAspectRatio="none", so the
 * cream rides high across the middle and falls away toward both edges however
 * wide the viewport gets — the cups stand on the flat of it. It is deliberately
 * *not* a border-radius: a radius would curve hardest at the corners, which is
 * the opposite of the shape the composition needs.
 *
 * The two filled pills read --hero-deep, so they re-tint with the centred cup.
 *
 * ── Why the copy stays put now ────────────────────────────────────────────
 * This panel lives inside .hero-viewport, which is `sticky; top: 0` for the
 * whole hero track. Everything in there is pinned by definition, and the copy
 * used to slide itself out over the first couple of hundred pixels of scroll
 * for exactly that reason: one fixed paragraph glued to the bottom of the
 * window for several thousand pixels reads as a toolbar, not as page content.
 *
 * It earns the pin now. The paragraph is the centred product's tasting note and
 * it changes as the ring turns, so the panel is a live caption on the carousel
 * rather than a static block that happens never to leave. What used to be its
 * exit — the same slide, down and out through .hero-panel's clip — now runs at
 * the end of the ring instead of the beginning, driven by the showcase handoff
 * so that the panel goes off exactly as the last product settles into place.
 * See the note beside it in useTransferScene.js.
 *
 * ── One cell, three notes ─────────────────────────────────────────────────
 * All three paragraphs are rendered, stacked in a single grid cell, and only
 * their opacity and a few pixels of drift change. Nothing re-renders while you
 * scroll and, more to the point, nothing reflows: the cell is as tall as the
 * longest note whichever one is showing, and the panel's height feeds straight
 * into where the cups stand and what the handoff measures.
 */

/** How far a note drifts as it comes and goes, in px at a full slot. */
const NOTE_TRAVEL = 32

export default function BottomInfo({ motion }) {
  const noteRefs = useRef([])

  // Layout effect for the same reason CoffeeCarousel uses one: a reload at a
  // mid-hero scroll position must paint the right note first time, not brown's.
  useLayoutEffect(() => {
    const count = COFFEE_PRODUCTS.length

    return motion.subscribe((pos) => {
      for (let i = 0; i < count; i += 1) {
        const el = noteRefs.current[i]
        if (!el) continue

        const slot = slotFor(i, pos, count)
        const opacity = noteOpacityFor(slot)

        el.style.opacity = opacity.toFixed(3)
        // Not opacity alone: a note at 0 is still in the accessibility tree, and
        // a screen reader would read all three product notes back to back.
        el.style.visibility = opacity < 0.01 ? 'hidden' : 'visible'
        // Signed, so the notes travel the same way the ring does: forward
        // scrolling walks every slot upward, so the outgoing note sinks out and
        // the incoming one comes down after it. Clamped because a note out at
        // the far side of the ring is invisible and does not need the pixels.
        const drift = Math.max(-1, Math.min(1, slot)) * NOTE_TRAVEL
        el.style.transform = `translate3d(0, ${drift.toFixed(2)}px, 0)`
      }
    })
  }, [motion])

  return (
    <div className="hero-base">
      <svg
        className="hero-arc"
        viewBox={ARC_VIEWBOX}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d={ARC_PATH} fill="var(--color-cream)" />
      </svg>

      <div className="hero-panel">
        <div className="hero-panel-inner">
          <div className="hero-panel-notes">
            {COFFEE_PRODUCTS.map((product, i) => (
              <p
                key={product.id}
                className="hero-panel-copy"
                ref={(el) => {
                  noteRefs.current[i] = el
                }}
              >
                {product.note}
              </p>
            ))}
          </div>

          <div className="hero-panel-actions">
            <a href="#collections" id="hero-cta-flavors" className="hero-pill hero-pill-solid">
              Flavors
            </a>
            <a href="#collections" id="hero-cta-order" className="hero-pill hero-pill-light">
              Order Now
            </a>
            <a href="#about" id="hero-cta-about" className="hero-pill hero-pill-solid">
              About
            </a>
          </div>

          <ul className="hero-badges">
            <li className="hero-badge">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M5 7h18l-2.5 13H7.5L5 7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
                <path d="M19.5 10.5h3.5a2.5 2.5 0 0 1 0 5h-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M10 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>Rich in Flavor</span>
            </li>
            <li className="hero-badge">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <ellipse cx="14" cy="14" rx="7.5" ry="11" stroke="currentColor" strokeWidth="1.6" fill="none" />
                <path d="M14 3c-3.5 4.5-3.5 17 0 22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              </svg>
              <span>Premium Quality</span>
            </li>
            <li className="hero-badge">
              <strong className="hero-badge-figure">100%</strong>
              <span>Natural Arabica Beans</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
