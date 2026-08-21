import { useRef } from 'react'
import { COFFEE_PRODUCTS } from './data/coffeeProducts'
import useAccentPalette from './components/hero/useAccentPalette'
import useHeroMotion from './components/hero/useHeroMotion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Showcase from './components/Showcase'
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
