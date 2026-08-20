import { useRef } from 'react'
import { COFFEE_PRODUCTS } from './data/coffeeProducts'
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
 * Hero and Showcase are one scene, so they share one clock.
 *
 * useHeroMotion lives here rather than inside Hero because Showcase needs the
 * same carousel position to know which cup is centred, and therefore which one
 * is about to fly into it. Props rather than context: two siblings, one value.
 */
export default function App() {
  const heroTrackRef = useRef(null)
  const heroHandoffRef = useRef(null)
  const motion = useHeroMotion(heroTrackRef, {
    steps: HERO_STEPS,
    handoffRef: heroHandoffRef,
  })

  return (
    <>
      <Navbar />
      <main>
        <Hero motion={motion} trackRef={heroTrackRef} handoffRef={heroHandoffRef} />
        <Showcase motion={motion} heroTrackRef={heroTrackRef} />
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
