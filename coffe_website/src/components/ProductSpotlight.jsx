import { hslString } from './hero/colorUtils'
import CardTitle from './showcase/CardTitle'
export default function ProductSpotlight({
  product,
  accent,
  refs,
  reverse = true,
  lapBottom = false,
}) {
  const cardBase = { ...accent, l: product.cardLightness }
  const cardFillLight = hslString(cardBase, 0.06, 0.16)
  const cardFill = hslString(cardBase)
  const cardFillDeep = hslString(cardBase, -0.02, -0.14)
  const ctaHover = hslString(cardBase, 0.3, -0.08)

  const cardClasses = [
    'showcase-card',
    reverse ? 'showcase-card--reverse' : '',
    'showcase-card--full-width',
    'showcase-card--lap-top',
    lapBottom ? 'showcase-card--lap-bottom' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const slot = (
    <div className={`showcase-slot${reverse ? ' showcase-slot--reverse' : ''}`}>
      <span className="showcase-cup-shadow" ref={refs.shadow} aria-hidden="true" />
      <img
        src={product.image}
        alt={product.alt}
        className="showcase-cup-img"
        width={product.width}
        height={product.height}
        draggable="false"
        ref={refs.image}
      />
    </div>
  )

  const copy = (
    <div className="showcase-copy" ref={refs.copy}>
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
  )

  return (
    <section
      id={`spotlight-${product.id}`}
      ref={refs.root}
      className={`spotlight-root w-full ${lapBottom ? '' : 'mb-16 lg:mb-24'}`}
      style={{ height: 'calc(100svh + var(--spotlight-pin))' }}
    >
      <div className="spotlight-container w-full max-w-none">
        <div
          className={cardClasses}
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

          <div className={`showcase-grid${reverse ? ' showcase-grid--reverse' : ''}`}>
            {reverse ? (
              <>
                {copy}
                {slot}
              </>
            ) : (
              <>
                {slot}
                {copy}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
