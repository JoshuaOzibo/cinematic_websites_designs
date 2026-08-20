import { createPortal } from 'react-dom'

/**
 * The cup in flight.
 *
 * The hero cannot hand its own cup over: .hero-viewport is `overflow: clip`, so
 * the real cup physically cannot leave the hero. This is the stand-in that
 * does the travelling, a fixed layer above both sections that interpolates
 * between where the hero cup is and where the showcase slot is. Because it is
 * handed a box that exactly matches the hero cup at t=0 and one that exactly
 * matches the showcase image at t=1, both swaps are pixel identical and the
 * viewer only ever sees one continuous cup.
 *
 * Three nested transforms, because they need three different origins:
 *
 *   .transfer-cup       translate + scale, from the top left, so the lerped
 *                       box maps straight onto getBoundingClientRect values
 *   .transfer-cup-tilt  rotate, from the base, matching .hero-cup's
 *                       transform-origin so the cup rocks on its foot instead
 *                       of swinging around its lid
 *   .transfer-cup-crop  clip-path, hiding exactly as much of the cup's base as
 *                       the hero's cream arc is hiding at the moment of the
 *                       handover, then releasing as the cup lifts clear
 *
 * Only the active product is mounted. The other two would need identical box
 * metrics to share the crop, and their photos are cropped to different aspect
 * ratios, so stacking all three would size the crop box to the tallest and
 * throw the base clip off by a few percent of cup height. Swapping the mounted
 * image is safe because it only ever happens while the layer is hidden: once
 * the flight arms, the active product is latched.
 *
 * Portaled to <body> so no future transform, filter or containment on a
 * wrapping element can quietly turn `position: fixed` into `absolute`.
 */
export default function TransferCup({ product, refs }) {
  return createPortal(
    <div className="transfer-layer" ref={refs.layer} aria-hidden="true">
      <div className="transfer-cup" ref={refs.cup}>
        <div className="transfer-cup-tilt" ref={refs.tilt}>
          <div className="transfer-cup-crop" ref={refs.crop}>
            <span className="transfer-cup-shadow" ref={refs.shadow} />
            <img
              src={product.image}
              alt=""
              className="transfer-cup-img"
              width={product.width}
              height={product.height}
              style={{ height: `calc(var(--cup-h) * ${product.sizeFactor})` }}
              draggable="false"
              ref={refs.image}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
