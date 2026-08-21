import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { COFFEE_PRODUCTS, INITIAL_INDEX, activeIndexFor } from '../data/coffeeProducts'
import { hslString } from './hero/colorUtils'
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
 *
 * ── The card ──────────────────────────────────────────────────────────────
 * Everything sits inside one rounded slab filled with the drink's own colour,
 * so the product arrives into a panel that has already turned its shade rather
 * than onto open cream. Three lightness steps off the one resolved hue —
 * --showcase-fill-light, --showcase-fill, --showcase-fill-deep — feed a
 * radial highlight and a diagonal wash in CSS, so the card reads as lit rather
 * than as a flat swatch. All three come from the same palette entry App
 * resolved from the photos, just re-lit; see cardLightness in the data file for
 * why the base step can't be a shared number across products.
 *
 * Those three custom properties are @property-registered as <color> in
 * index.css specifically so they can transition. A plain CSS transition can't
 * animate a gradient, but it can animate a *typed* custom property, and the
 * gradient re-reads that property's interpolated value every frame — so the
 * card still eases to the next product's colour on the way back up the page,
 * the way its flat predecessor did.
 *
 * The card changes nothing about the flight. The destination is still measured
 * from the slot image's laid-out offset within .showcase-viewport, and
 * offsetWithin walks the offsetParent chain, so wrapping the grid in another
 * positioned box is invisible to it.
 *
 * ── The garnish ───────────────────────────────────────────────────────────
 * An optional list of cutouts — petals, fruit, ice — around the cup, giving the
 * card the same "shot on a surface" feel as the reference instead of empty fill
 * colour. Each is absolutely positioned within the card, one stacking context
 * below the grid (see .showcase-garnish in index.css for how that negative
 * z-index is scoped so it can't leak into the page's global stack), so none of
 * them ever compete with the cup or the copy. `placement` on each entry picks
 * which `.showcase-garnish--*` modifier positions it — a product can be shot as
 * more than one cluster sitting at different spots around the cup, the way the
 * green product's leaf-and-orchid group and its kiwi slice are two separate
 * images rather than one. Optional per product because not every one has a
 * cutout shot yet — see garnish in the data file.
 */
export default function Showcase({ motion, palette, heroTrackRef }) {
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
  // Hue and saturation from the photo, lightness from the product. Same
  // division of labour extractAccent uses, for the same reason: the drink
  // decides the colour, the design decides how dark it is allowed to be.
  //
  // The light/deep steps are deltas off that same base colour (hslString's
  // ds/dl args), not independent numbers, so a product whose base is already
  // near white or near black still lightens and darkens by the same *amount*
  // rather than blowing out or crushing. hslString clamps s and l to [0, 1]
  // itself, so there is no danger of an invalid channel past either end.
  const cardBase = { ...palette[activeIndex], l: product.cardLightness }
  const cardFillLight = hslString(cardBase, 0.06, 0.16)
  const cardFill = hslString(cardBase)
  const cardFillDeep = hslString(cardBase, -0.02, -0.14)

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
          <div
            className="showcase-card"
            style={{
              '--showcase-fill-light': cardFillLight,
              '--showcase-fill': cardFill,
              '--showcase-fill-deep': cardFillDeep,
            }}
          >
            {product.garnish?.map((piece) => (
              <img
                key={piece.image}
                src={piece.image}
                alt={piece.alt}
                className={`showcase-garnish showcase-garnish--${piece.placement}`}
                width={piece.width}
                height={piece.height}
                draggable="false"
                aria-hidden="true"
              />
            ))}

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
                <p className="showcase-eyebrow">
                  {product.name}
                  <span className="showcase-eyebrow-rule" aria-hidden="true" />
                </p>

                <h2
                  className="font-display showcase-title"
                  style={{
                    fontSize: 'clamp(2rem, 4.4vw, 3.9rem)',
                    lineHeight: 0.98,
                    letterSpacing: '-0.025em',
                  }}
                >
                  {product.tagline}
                </h2>

                <p className="showcase-body">{product.description}</p>

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
        </div>
      </section>
    </>
  )
}
