import { COFFEE_PRODUCTS } from '../data/coffeeProducts'
import DynamicBackground from './hero/DynamicBackground'
import FloatingBeans from './hero/FloatingBeans'
import HeroWordmark from './hero/HeroWordmark'
import CoffeeCarousel from './hero/CoffeeCarousel'
import CreamRise from './hero/CreamRise'
import BottomInfo from './hero/BottomInfo'
const STEPS = COFFEE_PRODUCTS.length - 1

export default function Hero({ motion, palette, trackRef, handoffRef }) {
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
      <span className="hero-handoff-probe" ref={handoffRef} aria-hidden="true" />
    </section>
  )
}
