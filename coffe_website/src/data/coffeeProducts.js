/**
 * The three hero products, in the order they sit on screen at rest:
 *
 *      green (left)      brown (centre)      pink (right)
 *
 * The hero carousel is circular, so this array order is also the scroll order:
 * scrolling advances the centre slot brown → green → pink and back again.
 *
 * `accent` is the hero background state for that product, in HSL. It is a
 * *fallback*: on mount `useAccentPalette` samples the actual product photo and
 * replaces hue + saturation with the drink's real dominant colour. Lightness is
 * always pinned to `lightness` below so no state can drift pale — the cream
 * wordmark has to stay readable on every one of them.
 */
export const COFFEE_PRODUCTS = [
  {
    id: 'green',
    name: 'Matcha Cloud',
    image: '/images/coffee_green.webp',
    alt: 'Iced matcha latte in a clear coffeelo cup',
    accent: { h: 82, s: 0.5, l: 0.29 },
    lightness: 0.29,
    // Per-photo height trim: the cups are shot at different crops, so this is
    // what makes all three read as the same physical cup on screen.
    sizeFactor: 0.97,
  },
  {
    id: 'brown',
    name: 'Signature Cold Brew',
    image: '/images/coffee_brown.webp',
    alt: 'Iced cold brew coffee in a clear coffeelo cup — the signature drink',
    accent: { h: 30, s: 0.58, l: 0.3 },
    lightness: 0.3,
    sizeFactor: 1,
  },
  {
    id: 'pink',
    name: 'Berry Cream',
    image: '/images/coffee_pink.webp',
    alt: 'Iced berry cream drink in a clear coffeelo cup',
    accent: { h: 338, s: 0.5, l: 0.33 },
    lightness: 0.33,
    sizeFactor: 0.97,
  },
]

/** Which product is centred at scroll position 0. */
export const INITIAL_INDEX = COFFEE_PRODUCTS.findIndex((p) => p.id === 'brown')
