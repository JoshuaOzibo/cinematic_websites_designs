import { useRef } from 'react'
import { COFFEE_PRODUCTS } from './data/coffeeProducts'
import useAccentPalette from './components/hero/useAccentPalette'
import useHeroMotion from './components/hero/useHeroMotion'
import useJourneyScene from './components/showcase/useJourneyScene'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Showcase from './components/Showcase'
import ProductSpotlight from './components/ProductSpotlight'
import About from './components/About'
import Highlight from './components/Highlight'
import TastingNotes from './components/TastingNotes'
import Footer from './components/Footer'

const HERO_STEPS = COFFEE_PRODUCTS.length - 1

const emptyRef = () => ({ current: null })

/**
 * The handles one card has to expose for the cup to be able to land in it: the
 * scroll track the leg is triggered on, the slot image it aims at, the shadow
 * that appears under the cup when it settles, and the copy that reveals with
 * it. The showcase leaves `root` empty — the cup arrives there on the hero's
 * own trigger, not on one of the journey's.
 */
const stopRefs = () => ({
  root: emptyRef(),
  image: emptyRef(),
  shadow: emptyRef(),
  copy: emptyRef(),
})

/**
 * Hero, Showcase and both Spotlights are one scene, so they share one clock,
 * one palette and one cup.
 *
 * useHeroMotion lives here rather than inside Hero because Showcase needs the
 * same carousel position to know which cup is centred, and therefore which one
 * is about to fly into it. Props rather than context: a handful of siblings and
 * a handful of values.
 *
 * useAccentPalette is here for the same reason and one more. Every one of these
 * sections colours itself from the drink: the hero paints its background from
 * it, the cards fill themselves with it. Sampling the photos twice would do the
 * canvas work twice and, worse, let the sections arrive at fractionally
 * different colours if either read ever failed and fell back to the configured
 * anchor.
 *
 * ── One cup, three cards ──────────────────────────────────────────────────
 * The cup that flies out of the hero does not stop in the showcase. It carries
 * on down through the green card and into the brown one, changing drink in the
 * air, and only comes to rest in the last of them. That is one overlay element
 * crossing four sections, so the refs for it — and for each card's slot — are
 * owned here and handed down, rather than each section keeping its own and
 * having to be introduced to the others.
 *
 * `journeyLegs` is the itinerary: from which card's slot, to which card's slot,
 * and which product the cup should have become by the time it gets there. Held
 * in a ref because useJourneyScene builds its ScrollTriggers off the identity
 * of this array, and a fresh one every render would tear the scene down and
 * rebuild it on every state change the page makes.
 */
export default function App() {
  const heroTrackRef = useRef(null)
  const heroHandoffRef = useRef(null)
  const motion = useHeroMotion(heroTrackRef, {
    steps: HERO_STEPS,
    handoffRef: heroHandoffRef,
  })
  const palette = useAccentPalette(COFFEE_PRODUCTS)

  // The hero's carousel always finishes turning on the last entry in
  // COFFEE_PRODUCTS, so that is the product the showcase receives. The other
  // two get a card of their own below it — looked up by id, not hardcoded to an
  // index, so reordering COFFEE_PRODUCTS can't silently point these at the
  // wrong drink.
  const greenIndex = COFFEE_PRODUCTS.findIndex((p) => p.id === 'green')
  const brownIndex = COFFEE_PRODUCTS.findIndex((p) => p.id === 'brown')

  const transferRefs = useRef({
    layer: emptyRef(),
    cup: emptyRef(),
    tilt: emptyRef(),
    crop: emptyRef(),
    shadow: emptyRef(),
    // The photo in normal flow: whichever product flew out of the hero.
    image: emptyRef(),
    // The rest of them, stacked on it and faded in as the cup changes drink.
    // Keyed by product id so a leg can name its arrival without knowing where
    // the product sits in the array.
    byId: Object.fromEntries(COFFEE_PRODUCTS.map((p) => [p.id, emptyRef()])),
  }).current

  const stops = useRef({
    showcase: stopRefs(),
    green: stopRefs(),
    brown: stopRefs(),
  }).current

  const journeyLegs = useRef([
    { from: stops.showcase, to: stops.green, toId: 'green' },
    { from: stops.green, to: stops.brown, toId: 'brown', final: true },
  ]).current

  useJourneyScene({ transferRefs, legs: journeyLegs })

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
        <Showcase
          motion={motion}
          palette={palette}
          heroTrackRef={heroTrackRef}
          transferRefs={transferRefs}
          slotRefs={stops.showcase}
        />
        <ProductSpotlight
          product={COFFEE_PRODUCTS[greenIndex]}
          accent={palette[greenIndex]}
          refs={stops.green}
          reverse={true}
          lapBottom={true}
        />
        <ProductSpotlight
          product={COFFEE_PRODUCTS[brownIndex]}
          accent={palette[brownIndex]}
          refs={stops.brown}
          reverse={false}
        />
        <About />
        <Highlight />
        <TastingNotes />
      </main>
      <Footer />
    </>
  )
}
