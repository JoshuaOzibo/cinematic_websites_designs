import { useEffect, useState } from 'react'
import { extractAccent, mixHsl } from './colorUtils'

const PHOTO_HUE_WEIGHT = 0.5

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
