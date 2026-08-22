
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
    accent: { h: 25, s: 0.52, l: 0.28 },
    lightness: 0.28,
    cardLightness: 0.28,
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

export const INITIAL_INDEX = COFFEE_PRODUCTS.findIndex((p) => p.id === 'brown')
export function activeIndexFor(pos) {
  const count = COFFEE_PRODUCTS.length
  return (((INITIAL_INDEX - Math.round(pos)) % count) + count) % count
}
