import { useRef } from 'react'
import { COFFEE_PRODUCTS } from './data/coffeeProducts'
import useAccentPalette from './components/hero/useAccentPalette'
import useHeroMotion from './components/hero/useHeroMotion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Showcase from './components/Showcase'
import ProductSpotlight from './components/ProductSpotlight'
import About from './components/About'
import Collections from './components/Collections'
import Highlight from './components/Highlight'
import TastingNotes from './components/TastingNotes'
import Locations from './components/Locations'
import Footer from './components/Footer'

const HERO_STEPS = COFFEE_PRODUCTS.length - 1

/**
 * Hero and Showcase are one scene, so they share one clock and one palette.
 *
 * useHeroMotion lives here rather than inside Hero because Showcase needs the
 * same carousel position to know which cup is centred, and therefore which one
 * is about to fly into it. Props rather than context: two siblings, one value.
 *
 * useAccentPalette is here for the same reason and one more. Both sections
 * colour themselves from the drink: the hero paints its background from it, the
 * showcase fills its card with it. Sampling the photos twice would do the canvas
 * work twice and, worse, let the two arrive at fractionally different colours if
 * either read ever failed and fell back to the configured anchor.
 */
export default function App() {
  const heroTrackRef = useRef(null)
  const heroHandoffRef = useRef(null)
  const motion = useHeroMotion(heroTrackRef, {
    steps: HERO_STEPS,
    handoffRef: heroHandoffRef,
  })
  const palette = useAccentPalette(COFFEE_PRODUCTS)
  // The showcase above only ever flies in the last product in the array (see
  // ProductSpotlight's own doc comment) — the rest get a static section of
  // their own instead of going unseen. Looked up by id, not hardcoded to an
  // index, so reordering COFFEE_PRODUCTS can't silently point this at the
  // wrong drink.
  const greenIndex = COFFEE_PRODUCTS.findIndex((p) => p.id === 'green')

  return (
    <>
      <Navbar />
      <main>
        <Hero
          motion={motion}
          palette={palette}
          trackRef={heroTrackRef}
          handoffRef={heroHandoffRef}
        />
        <Showcase motion={motion} palette={palette} heroTrackRef={heroTrackRef} />
        <ProductSpotlight product={COFFEE_PRODUCTS[greenIndex]} accent={palette[greenIndex]} />
        <About />
        <Collections />
        <Highlight />
        <TastingNotes />
        <Locations />
      </main>
      <Footer />
    </>
  )
}
