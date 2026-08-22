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
  /* Three signals, because the curtain has three distinct moments and folding
     any two of them together costs frames:

     `unveiled`  the counter has landed and nothing is moving. Drop .site-veiled
                 here so the hero takes its first paint during the one still
                 beat in the sequence, under a panel that is still opaque. This
                 is also what *arms* the navbar and hero entrances: they build
                 their timelines paused, which is what puts every element into
                 its from-state while nobody can see it happen.
     `revealing` the panel has travelled far enough to uncover the navbar's
                 strip. Play those timelines. See revealTiming.js for the order
                 the page then arrives in.
     `introDone` the panel has gone. Unmount it and re-measure. */
  const [unveiled, setUnveiled] = useState(false)
  const [revealing, setRevealing] = useState(false)
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
  const unveilSite = useCallback(() => setUnveiled(true), [])
  const startReveal = useCallback(() => setRevealing(true), [])
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
      {!introDone && (
        <Intro onUnveil={unveilSite} onReveal={startReveal} onDone={finishIntro} />
      )}
      <Navbar armed={unveiled} ready={revealing} />
      <main className={unveiled ? undefined : 'site-veiled'}>
        <Hero
          motion={motion}
          palette={palette}
          trackRef={heroTrackRef}
          handoffRef={heroHandoffRef}
          armed={unveiled}
          ready={revealing}
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
