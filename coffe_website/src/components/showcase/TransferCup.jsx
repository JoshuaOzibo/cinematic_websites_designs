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
 *   .transfer-cup-crop  the box the image is measured in — no clipping any
 *                       more, since the hero cup it takes over from is itself
 *                       uncropped; see the note on the class in index.css
 *
 * Only the active product is mounted. The three photos are cropped to different
 * aspect ratios, so stacking all of them would size this box to the tallest and
 * throw the flight's scale off by a few percent of cup height. Swapping the
 * mounted image is safe because it only ever happens while the layer is hidden:
 * once the flight arms, the active product is latched.
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
