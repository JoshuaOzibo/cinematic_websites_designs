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
 * `cardLightness` is the same idea one section down: the showcase card takes the
 * resolved hue and saturation and sets its own lightness from this. It needs to
 * be per product rather than a shared lift off `lightness`, because HSL
 * lightness is not perceptual — 45% of a berry pink and 45% of a matcha green
 * are nowhere near each other to look at. These three are tuned to sit at the
 * same visual weight, and to hold cream body copy above 4.5:1 on all of them.
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
 *
 * `garnish` is an optional list of cutouts — petals, fruit, ice — that sit
 * behind the cup on the showcase card. `null` on a product with no cutout shot
 * yet, so the card still renders (its gradient fill is not conditional on this)
 * just without the props. A list rather than one image because a product can
 * be shot as more than one cluster at different spots around the cup: each
 * entry's `placement` names which one — see the `.showcase-garnish--*`
 * modifiers in index.css for what each placement actually does. Every entry's
 * own width/height are separate from the cup's and from each other, since
 * their aspect ratios have nothing to do with either.
 */
export const COFFEE_PRODUCTS = [
  {
    id: 'green',
    name: 'Green Tea Cream',
    image: '/images/coffee_green.webp',
    alt: 'Iced matcha latte in a clear coffeelo cup',
    width: 1023,
    height: 1537,
    accent: { h: 82, s: 0.5, l: 0.29 },
    lightness: 0.29,
    cardLightness: 0.29,
    // Per-photo height trim: the cups are shot at different crops, so this is
    // what makes all three read as the same physical cup on screen.
    sizeFactor: 0.97,
    garnish: [
      {
        image: '/images/showcase-garnish-green-leaf.webp',
        alt: '',
        width: 412,
        height: 499,
        placement: 'left',
      },
      {
        image: '/images/showcase-garnish-green-kiwi.webp',
        alt: '',
        width: 259,
        height: 354,
        placement: 'right',
      },
    ],
    note: 'Premium matcha shaken with green tea and ripe kiwi, floated with lightly sweetened cream. Earthy and sweet, smooth underneath.',
    tagline: 'Green Tea, Kiwi and Cream',
    description:
      'A premium Matcha shaken with green tea and ripe kiwi, then floated with lightly sweetened cream. Earthy and sweet, smooth underneath, and green the whole way down.',
  },
  {
    id: 'brown',
    name: 'Coffee & Cream',
    image: '/images/coffee_brown.webp',
    alt: 'Iced coffee, macadamia and cream in a clear coffeelo cup',
    width: 1122,
    height: 1402,
    accent: { h: 22, s: 0.52, l: 0.22 },
    lightness: 0.22,
    cardLightness: 0.22,
    sizeFactor: 1,
    garnish: [
      {
        image: '/images/showcase-garnish-brown.webp',
        alt: 'Macadamia nuts, coffee beans and ice garnish',
        width: 1024,
        height: 768,
        placement: 'left',
      },
    ],
    note: 'A washed Gesha coffee layered with macadamia nut butter and rich mocha syrup, floated with lightly sweetened cream.',
    tagline: 'Coffee, Macadamia, and Cream',
    description:
      'A washed Gesha coffee layered with macadamia nut butter and rich mocha syrup, floated with lightly sweetened cream. Complex and satisfying, it is smooth with a deep roasted nut finish.',
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
    cardLightness: 0.45,
    sizeFactor: 0.97,
    garnish: [
      {
        image: '/images/showcase-garnish-pink.webp',
        alt: '',
        width: 1471,
        height: 720,
        placement: 'left',
      },
    ],
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
