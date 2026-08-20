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
 *
 * `tagline` and `description` are the showcase's editorial copy. Whichever cup
 * is centred when the handoff begins is the one that flies into the showcase,
 * so its copy travels with it.
 *
 * `note` is the hero's own one-liner, shown in the cream panel under the arc
 * and swapped by BottomInfo as the ring turns. Deliberately a tighter retelling
 * of `description` rather than the same sentences: the panel sets it in spaced
 * uppercase at around 40 characters a line, where anything longer stops being
 * skimmable. Keep all three within a few words of each other — they share one
 * grid cell, so the longest of them is what sets the panel's height.
 *
 * `width`/`height` are the photos' true intrinsic pixel sizes. They are load
 * bearing twice over: they give the browser an aspect ratio before the WebP
 * decodes (so nothing shifts), and the handoff measures the cup's laid-out
 * width to work out its flight scale, which reads 0 on an undecoded image.
 */
export const COFFEE_PRODUCTS = [
  {
    id: 'green',
    name: 'Matcha Cloud',
    image: '/images/coffee_green.webp',
    alt: 'Iced matcha latte in a clear coffeelo cup',
    width: 1023,
    height: 1537,
    accent: { h: 82, s: 0.5, l: 0.29 },
    lightness: 0.29,
    // Per-photo height trim: the cups are shot at different crops, so this is
    // what makes all three read as the same physical cup on screen.
    sizeFactor: 0.97,
    note: 'Uji leaf, stone ground the morning it ships and whisked thin over ice with oat milk. Grassy and sweet, never chalky.',
    tagline: 'Stone milled at dawn, whisked to cloud',
    description:
      'Ceremonial grade leaf from Uji, ground on granite the morning it ships. Whisked thin over ice with oat milk, so it stays grassy and sweet instead of turning chalky.',
  },
  {
    id: 'brown',
    name: 'Signature Cold Brew',
    image: '/images/coffee_brown.webp',
    alt: 'Iced cold brew coffee in a clear coffeelo cup, the signature drink',
    width: 1122,
    height: 1402,
    accent: { h: 30, s: 0.58, l: 0.3 },
    lightness: 0.3,
    sizeFactor: 1,
    note: 'Kiamugumo steeped eighteen hours at cellar temperature, then pressed once. Cocoa and blackcurrant, with nothing added to hide behind.',
    tagline: 'Eighteen hours in cold water, nothing else',
    description:
      'Coarse ground Kiamugumo steeped overnight at cellar temperature, then pressed once. No heat, no dilution, nothing added to hide behind. Cocoa, blackcurrant, a long clean finish.',
  },
  {
    id: 'pink',
    name: 'Berry Cream',
    image: '/images/coffee_pink.webp',
    alt: 'Iced berry cream drink in a clear coffeelo cup',
    width: 1023,
    height: 1537,
    accent: { h: 338, s: 0.5, l: 0.33 },
    lightness: 0.33,
    sizeFactor: 0.97,
    note: 'Washed Gesha shaken with hibiscus and white peach, then floated with lightly sweetened cream. Tart on top, round underneath.',
    tagline: 'Hibiscus, stone fruit and cream',
    description:
      'A washed Gesha shaken with hibiscus and white peach, then floated with lightly sweetened cream. Tart at the top, round underneath, and pink the whole way down.',
  },
]

/** Which product is centred at scroll position 0. */
export const INITIAL_INDEX = COFFEE_PRODUCTS.findIndex((p) => p.id === 'brown')

/**
 * Which product is centred at a given carousel position.
 *
 * The inverse of `slotFor`: that function asks "where is product i?", this asks
 * "which product is at slot 0?". Closed form rather than scanning all three for
 * the highest focus, so the handoff can name the active product on any frame.
 *
 *   pos 0 → brown, pos 1 → green, pos 2 → pink
 */
export function activeIndexFor(pos) {
  const count = COFFEE_PRODUCTS.length
  return (((INITIAL_INDEX - Math.round(pos)) % count) + count) % count
}
