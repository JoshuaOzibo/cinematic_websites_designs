/** All the site copy in one place, so sections stay layout-only. */

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Collections', href: '#collections' },
  { label: 'Notes', href: '#notes' },
  { label: 'Locations', href: '#locations' },
]

export const COLLECTIONS = [
  {
    id: 'kiamugumo',
    index: '01',
    name: 'Kiamugumo',
    origin: 'Kirinyaga, Kenya',
    notes: 'Blackcurrant, brown sugar, a long tomato-leaf finish.',
    flavorChips: ['Blackcurrant', 'Brown Sugar', 'Tomato Leaf'],
    roast: 'Medium',
    roastLevel: 3,
    altitude: '1,800m',
    process: 'Washed',
    price: '$24',
    bgTint: 'bg-[#f0e4cc]',
    badgeColor: 'text-[#c04e1f]',
  },
  {
    id: 'finca-la-ilusion',
    index: '02',
    name: 'La Ilusión',
    origin: 'Huila, Colombia',
    notes: 'Cacao nib, red apple, panela sweetness.',
    flavorChips: ['Cacao Nib', 'Red Apple', 'Panela'],
    roast: 'Medium-dark',
    roastLevel: 4,
    altitude: '1,650m',
    process: 'Honey',
    price: '$22',
    bgTint: 'bg-[#ede0c8]',
    badgeColor: 'text-[#bc6c25]',
  },
  {
    id: 'gesha-village',
    index: '03',
    name: 'Gesha Village',
    origin: 'Bench Maji, Ethiopia',
    notes: 'Jasmine, bergamot, white peach, tea-like body.',
    flavorChips: ['Jasmine', 'Bergamot', 'White Peach'],
    roast: 'Light',
    roastLevel: 1,
    altitude: '2,000m',
    process: 'Natural',
    price: '$38',
    bgTint: 'bg-[#f7ece0]',
    badgeColor: 'text-[#7a5a40]',
  },
  {
    id: 'nightshift',
    index: '04',
    name: 'Nightshift',
    origin: 'House blend',
    notes: 'Dark chocolate, toasted pecan, raw honey.',
    flavorChips: ['Dark Chocolate', 'Toasted Pecan', 'Raw Honey'],
    roast: 'Dark',
    roastLevel: 5,
    altitude: 'Blend',
    process: 'Washed / Natural',
    price: '$19',
    bgTint: 'bg-[#e8dcb8]',
    badgeColor: 'text-[#3d1f0a]',
  },
]

export const MARQUEE_PHRASES = [
  'SINGLE ORIGIN',
  'SLOW ROASTED',
  'ETHICALLY SOURCED',
  'SMALL BATCH',
]

export const STATS = [
  { value: '12+', label: 'Origins' },
  { value: '100%', label: 'Arabica' },
  { value: '48hr', label: 'Roast Cycle' },
  { value: 'Zero', label: 'Additives' },
]

export const ARTICLES = [
  {
    id: 'water',
    category: 'Brew Guide',
    date: 'March 4, 2026',
    title: 'Water is 98% of your cup',
    excerpt:
      'Mineral content does more for extraction than any grinder upgrade. Here is the recipe we mix in every one of our bars, and why 75ppm is the number we keep coming back to.',
  },
  {
    id: 'harvest',
    category: 'Origin',
    date: 'February 19, 2026',
    title: 'Four days in Kirinyaga at harvest',
    excerpt:
      'Cherry arrives at the washing station before dawn. We followed one day-lot from picking to raised bed to see exactly what our price premium pays for.',
  },
  {
    id: 'rest',
    category: 'Roasting',
    date: 'January 30, 2026',
    title: 'Why we rest every batch for 10 days',
    excerpt:
      'Fresh off the drum is not the same as ready. Degassing changes what your palate reads as acidity — and the difference between day three and day ten is not subtle.',
  },
]

export const LOCATIONS = [
  {
    id: 'lagos',
    city: 'Lagos',
    address: '14 Akin Adesola Street, Victoria Island',
    hours: 'Mon–Sat · 7am – 8pm',
    phone: '+234 812 004 0110',
  },
  {
    id: 'lisbon',
    city: 'Lisbon',
    address: 'Rua da Boavista 62, Cais do Sodré',
    hours: 'Daily · 8am – 7pm',
    phone: '+351 21 340 8890',
  },
  {
    id: 'brooklyn',
    city: 'Brooklyn',
    address: '211 Wythe Avenue, Williamsburg',
    hours: 'Mon–Sun · 7am – 6pm',
    phone: '+1 718 555 0142',
  },
]

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'X / Twitter', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'Journal', href: '#notes' },
]
