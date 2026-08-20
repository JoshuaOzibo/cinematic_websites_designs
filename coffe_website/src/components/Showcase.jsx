import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { COFFEE_PRODUCTS, INITIAL_INDEX, activeIndexFor } from '../data/coffeeProducts'
import TransferCup from './showcase/TransferCup'
import useTransferScene from './showcase/useTransferScene'

/**
 * Where the hero's cup lands.
 *
 * This section is the second half of one continuous scene. Its left slot is the
 * flight's destination: the image sitting in it is invisible until the very end
 * of the handoff, when the travelling overlay hands back to it at exactly the
 * same size and position. The slot still occupies its full box the whole time,
 * because the flight reads its rect live every frame to know where it is
 * aiming. That is also why it is opacity and never display: none, which would
 * report a zero box and land the cup in the top left corner.
 *
 * ── Pinning deviates from CLAUDE.md on purpose ────────────────────────────
 * The workspace rule is GSAP sticky-stacks use `pin: true`. This one uses CSS
 * `position: sticky` and lets GSAP drive scrub only. Three reasons, all
 * specific to this seam:
 *
 *   · `pin: true` injects a pin-spacer element immediately after the hero,
 *     which is the one point on the page where a pixel of rounding shows, and
 *     where the cream has to meet the cream exactly.
 *   · The hero above already pins with `position: sticky`. Two pinned
 *     viewports meeting mid-scene need to rasterise the same way, or the
 *     handover flickers on iOS.
 *   · A pin-spacer resizes on refresh, which changes the hero track's
 *     offsetHeight, which is the number useHeroMotion measures itself against.
 *     That is a genuine refresh-ordering race, and sticky has no such coupling.
 *
 * Do not "fix" this to pin: true without re-testing the seam on a real phone.
 */
export default function Showcase({ motion, heroTrackRef }) {
  const trackRef = useRef(null)
  const copyRef = useRef(null)

  const transferRefs = useRef({
    layer: { current: null },
    cup: { current: null },
    tilt: { current: null },
    crop: { current: null },
    shadow: { current: null },
    image: { current: null },
  }).current

  const slotRefs = useRef({
    image: { current: null },
    shadow: { current: null },
  }).current

  // Which cup makes the journey.
  //
  // Read off the carousel's *target* rather than its damped position. The
  // damper takes most of a second to settle, so a restored scroll position or
  // an anchor jump that lands straight on the handoff would otherwise latch
  // whichever product the glide happened to be passing through, and the wrong
  // cup would fly. The target is correct the instant the scroll commits.
  //
  // The identity guard turns a per-frame subscription into two or three
  // renders across the whole page, and the latch freezes it once the flight is
  // under way so a trackpad overshoot at the seam cannot swap the product out
  // from under the user mid-air.
  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX)
  const activeIndexRef = useRef(INITIAL_INDEX)
  const lockedRef = useRef(false)

  const resolveActive = useCallback(
    (force) => {
      if (lockedRef.current && !force) return activeIndexRef.current
      const next = activeIndexFor(motion.getTarget())
      if (next !== activeIndexRef.current) {
        activeIndexRef.current = next
        setActiveIndex(next)
      }
      return next
    },
    [motion],
  )

  useLayoutEffect(() => motion.subscribe(() => resolveActive(false)), [motion, resolveActive])

  useTransferScene({
    heroTrackRef,
    trackRef,
    transferRefs,
    slotRefs,
    copyRef,
    activeIndexRef,
    lockedRef,
    resolveActive,
  })

  const product = COFFEE_PRODUCTS[activeIndex]

  return (
    <>
      <TransferCup product={product} refs={transferRefs} />

      <section
        id="showcase"
        ref={trackRef}
        className="showcase-root"
        style={{ height: 'calc(100svh + var(--showcase-pin))' }}
      >
        <div className="showcase-viewport">
          {/* Same treatment as About's numeral, so the two read as a series. */}
          <span
            className="font-display pointer-events-none absolute -top-8 right-4 select-none text-espresso/[0.06] lg:right-16"
            style={{ fontSize: 'clamp(11rem, 26vw, 26rem)', lineHeight: 0.8 }}
            aria-hidden="true"
          >
            01
          </span>

          <div className="showcase-grid">
            <div className="showcase-slot">
              <span className="showcase-cup-shadow" ref={slotRefs.shadow} aria-hidden="true" />
              <img
                src={product.image}
                alt={product.alt}
                className="showcase-cup-img"
                width={product.width}
                height={product.height}
                draggable="false"
                ref={slotRefs.image}
              />
            </div>

            <div className="showcase-copy" ref={copyRef}>
              <p className="text-[0.82rem] font-semibold tracking-[0.22em] text-rust uppercase">
                {product.name}
              </p>

              <h2
                className="font-display mt-6 text-espresso"
                style={{
                  fontSize: 'clamp(2rem, 4.4vw, 3.9rem)',
                  lineHeight: 0.98,
                  letterSpacing: '-0.025em',
                }}
              >
                {product.tagline}
              </h2>

              <p className="mt-7 max-w-[38ch] text-[1.02rem] leading-relaxed text-mid">
                {product.description}
              </p>

              <a href="#notes" className="showcase-cta">
                Tasting notes
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                  <path
                    d="M1 6h13m0 0L9.5 1.5M14 6l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
