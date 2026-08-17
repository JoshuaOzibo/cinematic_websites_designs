import { useRef } from 'react'
import { COFFEE_PRODUCTS } from '../data/coffeeProducts'
import useHeroMotion from './hero/useHeroMotion'
import useAccentPalette from './hero/useAccentPalette'
import DynamicBackground from './hero/DynamicBackground'
import FloatingBeans from './hero/FloatingBeans'
import HeroWordmark from './hero/HeroWordmark'
import CoffeeCarousel from './hero/CoffeeCarousel'
import BottomInfo from './hero/BottomInfo'

/**
 * Hero — a scroll-scrubbed product carousel.
 *
 *  ┌──────────────────────────────────────────────┐
 *  │  [navbar — fixed, transparent over the hero] │
 *  │   ·  ·   ░ bean planes (z-5 / z-15) ░   ·    │
 *  │      C  O  F  F  E  E   (wordmark, z-10)     │
 *  │        ┌───┐                                 │
 *  │  ┌──┐  │ ● │  ┌──┐   ← cups, z-30..40        │
 *  │  ╰───────────────────╯                       │
 *  │      ╭──── cream arc ────╮        (z-20)     │
 *  │  copy   │  actions  │  badges   (cream)      │
 *  └──────────────────────────────────────────────┘
 *
 * The <section> is a tall scroll track; everything above lives in a sticky
 * 100svh viewport inside it. One step of the track = one product change, so the
 * centre slot runs brown → green → pink as you scroll, and back on the way up.
 *
 * The single source of motion is useHeroMotion; the background, cups and beans
 * all subscribe to it and write their own styles, so scrolling never re-renders
 * this tree. Layout numbers live in index.css as --hero, --cup and --word
 * custom properties rather than being hardcoded per element.
 */
const STEPS = COFFEE_PRODUCTS.length - 1

export default function Hero() {
  const trackRef = useRef(null)
  const motion = useHeroMotion(trackRef, { steps: STEPS })
  const palette = useAccentPalette(COFFEE_PRODUCTS)

  return (
    <section
      id="home"
      ref={trackRef}
      className="hero-root"
      style={{ height: `calc(100svh + ${STEPS} * var(--hero-step))` }}
    >
      <div className="hero-viewport">
        <DynamicBackground
          motion={motion}
          products={COFFEE_PRODUCTS}
          palette={palette}
          rootRef={trackRef}
        />

        {/* Dot-grid texture — visible around the edges, fades to nothing at center */}
        <div className="hero-dot-edge" aria-hidden="true" />
        <h1 className="sr-only">coffeelo — iced coffee, matcha and berry blends</h1>

        <div className="hero-stage">
          <FloatingBeans motion={motion} />
          <HeroWordmark />
          <CoffeeCarousel motion={motion} products={COFFEE_PRODUCTS} />
        </div>

        <BottomInfo />
      </div>
    </section>
  )
}
