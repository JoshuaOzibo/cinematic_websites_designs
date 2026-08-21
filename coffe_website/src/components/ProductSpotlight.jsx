import { hslString } from './hero/colorUtils'
import CardTitle from './showcase/CardTitle'

/**
 * A card the travelling cup lands in, and rests in.
 *
 * Structurally this is the showcase over again: a track one viewport tall plus
 * a pin, a sticky panel inside it, and the same .showcase-card and friends
 * filling that panel. Two of these follow the showcase, and together the three
 * are one continuous run of colour down the page — see the lap-top / lap-bottom
 * modifiers, and the note in useJourneyScene about why their seams are load
 * bearing rather than decorative.
 *
 * The pin is what gives the cup somewhere to stand. It arrives on the frame
 * this panel sticks, then this card holds the viewport for --spotlight-pin of
 * scroll with the cup motionless in it, and only when the panel releases does
 * the next leg begin. Sticky rather than ScrollTrigger's own pin, for the
 * reasons set out in Showcase.jsx: the panels either side of this one are
 * sticky too, and pinned viewports that meet mid-scene have to rasterise the
 * same way.
 *
 * ── The slot is empty on purpose ──────────────────────────────────────────
 * The cup in this card is not this card's image. It is the same overlay cup
 * that flew out of the hero, carried on down by useJourneyScene, changing drink
 * on the way. The image below is still rendered and still laid out, because it
 * is the box the flight aims at, but the scene holds it at opacity 0 — every
 * card except the last one, where the cup stops and the real image takes over
 * for good. `refs` is how the scene reaches all of that: the card it triggers
 * on, the slot image it aims at, the shadow that appears with it, and the copy
 * it reveals as the cup arrives.
 *
 * Which is also why there is no Reveal wrapper here, unlike every other section
 * on the page. Two reasons, and the second is the hard one: the copy's entrance
 * is the cup's arrival now, scrubbed by the same scroll rather than fired by a
 * separate observer; and Reveal animates a transform on the wrapper, which
 * getBoundingClientRect would fold into the slot's position and hand the flight
 * a destination that is 28px off and drifting.
 *
 * `accent` is that product's entry from the palette App resolved from the
 * photos — the same one Showcase.jsx reads for its own card, kept as one source
 * so this card and the real one never disagree about the drink's colour.
 */
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
  // The button's hover fill. Saturation pushed well past the card's own so the
  // pill reads unmistakably as *this drink* — green on the matcha card, berry
  // on the pink one — rather than as the generic dark brown it used to hover
  // to. Only slightly darker than the card, because the depth is doing nothing
  // here: it is the hue that has to carry it, and cream type still clears 4.5:1
  // on all three at this lightness.
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
      // A track, exactly like the showcase's: one viewport for the panel plus
      // the pin it rests through. Margin and never padding for the breathing
      // room under the last card — padding sits inside the sticky panel's
      // containing block and would read as extra pin instead of as cream.
      style={{ height: 'calc(100svh + var(--spotlight-pin))' }}
    >
      <div className="spotlight-container w-full max-w-none">
        <div
          className={cardClasses}
          style={{
            '--showcase-fill-light': cardFillLight,
            '--showcase-fill': cardFill,
            '--showcase-fill-deep': cardFillDeep,
            // Ordinary custom property, deliberately not registered with
            // @property the way the three fills above are. Those declare
            // inherits: false so they can animate as colours, which also means
            // a descendant reading one back gets the registration's initial
            // value rather than this card's. .showcase-cta is a descendant, so
            // its hover colour has to travel on a plain, inheriting property.
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
