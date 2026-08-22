import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { COFFEE_PRODUCTS } from './data/coffeeProducts'
import useAccentPalette from './components/hero/useAccentPalette'
import useHeroMotion from './components/hero/useHeroMotion'
import useJourneyScene from './components/showcase/useJourneyScene'
import Intro from './components/Intro'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Showcase from './components/Showcase'
import ProductSpotlight from './components/ProductSpotlight'
import About from './components/About'
import Highlight from './components/Highlight'
import TastingNotes from './components/TastingNotes'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

const HERO_STEPS = COFFEE_PRODUCTS.length - 1

const emptyRef = () => ({ current: null })
const stopRefs = () => ({
  root: emptyRef(),
  image: emptyRef(),
  shadow: emptyRef(),
  copy: emptyRef(),
})

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const heroTrackRef = useRef(null)
  const heroHandoffRef = useRef(null)
  const motion = useHeroMotion(heroTrackRef, {
    steps: HERO_STEPS,
    handoffRef: heroHandoffRef,
  })
  const palette = useAccentPalette(COFFEE_PRODUCTS)

  const greenIndex = COFFEE_PRODUCTS.findIndex((p) => p.id === 'green')
  const brownIndex = COFFEE_PRODUCTS.findIndex((p) => p.id === 'brown')

  const transferRefs = useRef({
    layer: emptyRef(),
    cup: emptyRef(),
    tilt: emptyRef(),
    crop: emptyRef(),
    shadow: emptyRef(),
    image: emptyRef(),
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

  /* Stable across renders so Intro's effect is not torn down and rebuilt (which
     would restart the whole curtain) every time anything above re-renders. */
  const finishIntro = useCallback(() => setIntroDone(true), [])

  useEffect(() => {
    if (!introDone) return
    /* Everything below measured itself while the curtain held the scrollbar
       hidden and the page pinned at the top. Both are true again now, so give
       ScrollTrigger and useHeroMotion — which listens on resize — a chance to
       re-read the layout before the visitor's first scroll. */
    ScrollTrigger.refresh()
    window.dispatchEvent(new Event('resize'))
  }, [introDone])

  return (
    <>
      {!introDone && <Intro onDone={finishIntro} />}
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
