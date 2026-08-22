import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { COFFEE_PRODUCTS, INITIAL_INDEX, activeIndexFor } from '../data/coffeeProducts'
import { hslString } from './hero/colorUtils'
import CardTitle from './showcase/CardTitle'
import TransferCup from './showcase/TransferCup'
import useTransferScene from './showcase/useTransferScene'

export default function Showcase({ motion, palette, heroTrackRef, transferRefs, slotRefs }) {
  const trackRef = useRef(null)
  const copyRef = slotRefs.copy
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
  const cardBase = { ...palette[activeIndex], l: product.cardLightness }
  const cardFillLight = hslString(cardBase, 0.06, 0.16)
  const cardFill = hslString(cardBase)
  const cardFillDeep = hslString(cardBase, -0.02, -0.14)
  const ctaHover = hslString(cardBase, 0.3, -0.08)

  return (
    <>
      <TransferCup product={product} products={COFFEE_PRODUCTS} refs={transferRefs} />

      <section
        id="showcase"
        ref={trackRef}
        className="showcase-root"
        style={{ height: 'calc(100svh + var(--showcase-pin))' }}
      >
        <div className="showcase-viewport">
          <div
            className="showcase-card showcase-card--full-width showcase-card--lap-bottom"
            style={{
              '--showcase-fill-light': cardFillLight,
              '--showcase-fill': cardFill,
              '--showcase-fill-deep': cardFillDeep,
              '--cta-hover': ctaHover,
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

                <CardTitle text={product.tagline} />

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
