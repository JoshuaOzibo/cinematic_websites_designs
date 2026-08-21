import Reveal from './Reveal'
import { hslString } from './hero/colorUtils'

/**
 * A second, static instance of the showcase card — for a product that never
 * gets to fly in from the hero.
 *
 * Showcase.jsx's card only ever shows one product: the hero's carousel always
 * finishes turning on the last entry in COFFEE_PRODUCTS right as the handoff
 * begins, so every other product's tagline, description and garnish, however
 * complete, is otherwise unreachable by scrolling the page normally. Rather
 * than rebuild that card, this reuses its markup and CSS — .showcase-card,
 * .showcase-grid, .showcase-eyebrow, .showcase-garnish, and so on all carry no
 * dependency on the scroll-pin machinery, so they drop straight into an
 * ordinary section with none of it: no ScrollTrigger, no cup-transfer overlay,
 * just Reveal's fade-in, the same one every other section on the page uses.
 *
 * `accent` is that product's entry from the palette App resolved from the
 * photos — the same one Showcase.jsx reads for its own card, kept as one
 * source so this card and the real one never disagree about the drink's
 * colour.
 */
export default function ProductSpotlight({ product, accent }) {
  const cardBase = { ...accent, l: product.cardLightness }
  const cardFillLight = hslString(cardBase, 0.06, 0.16)
  const cardFill = hslString(cardBase)
  const cardFillDeep = hslString(cardBase, -0.02, -0.14)

  return (
    <section
      id={`spotlight-${product.id}`}
      className="spotlight-root relative overflow-hidden bg-cream py-16 lg:py-24 w-full"
    >
      <div className="relative w-full max-w-none px-4 sm:px-8 lg:px-12">
        <Reveal>
          <div
            className="showcase-card showcase-card--reverse showcase-card--full-width"
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

            <div className="showcase-grid showcase-grid--reverse">
              <div className="showcase-copy">
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

              <div className="showcase-slot showcase-slot--reverse">
                <span className="showcase-cup-shadow" aria-hidden="true" />
                <img
                  src={product.image}
                  alt={product.alt}
                  className="showcase-cup-img"
                  width={product.width}
                  height={product.height}
                  draggable="false"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
