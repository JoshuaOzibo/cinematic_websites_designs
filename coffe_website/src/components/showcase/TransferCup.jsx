import { createPortal } from 'react-dom'

/**
 * The cup in flight.
 *
 * The hero cannot hand its own cup over: .hero-viewport is `overflow: clip`, so
 * the real cup physically cannot leave the hero. This is the stand-in that
 * does the travelling, a fixed layer above every section that interpolates
 * between where one cup is and where the next slot is. Because it is handed a
 * box that exactly matches the hero cup at t=0 and one that exactly matches a
 * slot image at t=1, every swap is pixel identical and the viewer only ever
 * sees one continuous cup.
 *
 * Three nested transforms, because they need three different origins:
 *
 *   .transfer-cup       translate + scale, from the top left, so the lerped
 *                       box maps straight onto getBoundingClientRect values
 *   .transfer-cup-tilt  rotate, from the base, matching .hero-cup's
 *                       transform-origin so the cup rocks on its foot instead
 *                       of swinging around its lid
 *   .transfer-cup-crop  the box the image is measured in — no clipping any
 *                       more, since the hero cup it takes over from is itself
 *                       uncropped; see the note on the class in index.css
 *
 * ── Why every product is mounted ──────────────────────────────────────────
 * The journey does not stop at the showcase. The same cup carries on down into
 * the two spotlight cards below it, and each of those is a different drink — so
 * the overlay has to be able to *become* the next product mid-air rather than
 * cut to it.
 *
 * Exactly one image is in normal flow: the product that flew out of the hero.
 * It alone sizes .transfer-cup-crop, and therefore the whole flight, which is
 * why the others cannot simply be stacked in flow — the three photos are
 * cropped to different aspect ratios and the box would size itself to the
 * tallest, throwing the scale off by a few percent of cup height. The rest are
 * absolutely positioned (see .transfer-cup-img--morph), so they are outside
 * that measurement entirely: each one fills the crop's height, keeps its own
 * aspect ratio, and centres on the same axis. That is exactly how the slot
 * images below render too — one shared --showcase-cup-h, width from the photo —
 * so whichever one is showing on arrival matches the real image underneath it.
 *
 * They sit at opacity 0 until useJourneyScene crossfades them; nothing here
 * animates on its own.
 *
 * Portaled to <body> so no future transform, filter or containment on a
 * wrapping element can quietly turn `position: fixed` into `absolute`.
 */
export default function TransferCup({ product, products, refs }) {
  return createPortal(
    <div className="transfer-layer" ref={refs.layer} aria-hidden="true">
      <div className="transfer-cup" ref={refs.cup}>
        <div className="transfer-cup-tilt" ref={refs.tilt}>
          <div className="transfer-cup-crop" ref={refs.crop}>
            {products.map((entry) => {
              const isFlying = entry.id === product.id

              return (
                <img
                  key={entry.id}
                  src={entry.image}
                  alt=""
                  className={`transfer-cup-img${isFlying ? '' : ' transfer-cup-img--morph'}`}
                  width={entry.width}
                  height={entry.height}
                  // Only the flown product carries the hero's own sizing. The
                  // others take their height from the crop box, which is what
                  // keeps a morph the same size as the cup it replaces.
                  style={isFlying ? { height: `calc(var(--cup-h) * ${entry.sizeFactor})` } : undefined}
                  draggable="false"
                  ref={isFlying ? refs.image : refs.byId[entry.id]}
                />
              )
            })}

            {/* Last, so it stays above every one of the images the way it was
                above the single one before them. */}
            <span className="transfer-cup-shadow" ref={refs.shadow} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
