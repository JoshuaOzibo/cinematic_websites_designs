import { useEffect, useState } from 'react'
import { extractAccent, mixHsl } from './colorUtils'

/**
 * How much of the final hue comes from the photograph rather than from the
 * product's configured accent.
 *
 * Not 1: these three drinks are all photographed warm, and their honest
 * averages come out at 25° (brown ✓), 55° (mustard, not matcha) and 1° (red,
 * not berry). Blending the measured hue halfway toward the product's anchor
 * keeps every state genuinely derived from its cup — the brown state still
 * follows the roast, and re-shooting a product still moves its background —
 * while making sure the green state reads green and the pink state reads pink.
 */
const PHOTO_HUE_WEIGHT = 0.5

/**
 * Resolves one accent colour per product by sampling its photo.
 *
 * Starts from the anchors in the product data so the hero paints correctly on
 * the very first frame, then blends in the photo-derived colour once the images
 * decode (a few ms, and the anchors are deliberately close, so the swap is
 * imperceptible). If a canvas read fails the anchor simply stays.
 */
export default function useAccentPalette(products) {
  const [palette, setPalette] = useState(() => products.map((p) => p.accent))

  useEffect(() => {
    let alive = true

    Promise.all(
      products.map((product) =>
        extractAccent(product.image, { lightness: product.lightness })
          .then((photo) =>
            mixHsl([
              { color: photo, weight: PHOTO_HUE_WEIGHT },
              { color: product.accent, weight: 1 - PHOTO_HUE_WEIGHT },
            ]),
          )
          .catch(() => product.accent),
      ),
    ).then((resolved) => {
      if (alive) setPalette(resolved)
    })

    return () => {
      alive = false
    }
  }, [products])

  return palette
}
