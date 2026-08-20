import { COFFEE_PRODUCTS } from '../data/coffeeProducts'
import useAccentPalette from './hero/useAccentPalette'
import DynamicBackground from './hero/DynamicBackground'
import FloatingBeans from './hero/FloatingBeans'
import HeroWordmark from './hero/HeroWordmark'
import CoffeeCarousel from './hero/CoffeeCarousel'
import CreamRise from './hero/CreamRise'
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
 *
 * The track carries one extra length past the last product change,
 * --hero-handoff, measured by the zero-width probe at the bottom. The carousel
 * subtracts it, so the ring finishes turning while the hero is still pinned and
 * the centred cup sits still for the whole of the showcase handoff that
 * follows. CreamRise and the cup's departure are animated by Showcase, not
 * here; this component only provides the pieces and the room to do it in.
 */
const STEPS = COFFEE_PRODUCTS.length - 1

export default function Hero({ motion, trackRef, handoffRef }) {
  const palette = useAccentPalette(COFFEE_PRODUCTS)

  return (
    <section
      id="home"
      ref={trackRef}
      className="hero-root"
      style={{ height: `calc(100svh + ${STEPS} * var(--hero-step) + var(--hero-handoff))` }}
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
        <h1 className="sr-only">coffeelo: iced coffee, matcha and berry blends</h1>

        <div className="hero-stage">
          <FloatingBeans motion={motion} />
          <HeroWordmark />
          <CreamRise />
          <CoffeeCarousel motion={motion} products={COFFEE_PRODUCTS} />
        </div>

        <BottomInfo motion={motion} />
      </div>

      {/* Sized in CSS, measured in JS: this is how the carousel and the handoff
          agree on a length without either of them hardcoding a viewport unit. */}
      <span className="hero-handoff-probe" ref={handoffRef} aria-hidden="true" />
    </section>
  )
}
