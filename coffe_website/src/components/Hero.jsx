import HeroProduct from './hero/HeroProduct'
import Rope from './hero/Rope'

/**
 * The hero is a stack of deliberate layers:
 *
 *   0  dot-grid texture
 *   0  the rope, back half — approach and exit
 *  10  the giant "An Elevated Coffee / Experience" lettering
 *  20  the product (cup + flying beans)
 *  25  the rope, front half — the span crossing over the cup
 *  30  the copy block
 *
 * Two things here are the design, not accidents: the product sits ON TOP of
 * the lettering and cuts through the letterforms, and the rope passes behind
 * the cup then back over it so the two tangle. Don't shrink the type to avoid
 * the collision, and keep the rope's two halves on either side of z-20.
 *
 * The composition is centred as a single column. The cup stays in normal flow
 * and is pulled up over the lettering with a negative margin rather than being
 * absolutely positioned — that way the copy beneath it can never collide with
 * it, whatever the cup scales to.
 */
export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-cream pt-16 pb-6 sm:pt-20 sm:pb-8 lg:pt-20 lg:pb-8 lg:min-h-screen lg:max-h-[960px]"
    >
      {/* Layer 0 — texture */}
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="relative flex flex-col items-center">
          {/* Layer 0 — rope, behind the product */}
          <Rope layer="back" className="z-0" />

          {/* Layer 10 — the lettering */}
          <h1
            className="font-display relative z-10 text-center text-espresso"
            style={{ lineHeight: 0.82, letterSpacing: '-0.03em' }}
          >
            <span className="flex flex-wrap items-end justify-center gap-x-[2.5vw]">
              <span className="pb-[1.2vw]" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3.2rem)' }}>
                An Elevated
              </span>
              <span style={{ fontSize: 'clamp(3rem, 10.5vw, 9.2rem)' }}>Coffee</span>
            </span>
            <span className="block" style={{ fontSize: 'clamp(3.2rem, 12vw, 10.5rem)' }}>
              Experience
            </span>
          </h1>

          {/* Layer 20 — product, pulled up over the lettering */}
          <div className="relative z-20 -mt-[14vw] w-[66%] max-w-[280px] sm:max-w-[320px] md:-mt-[11.5vw] md:w-[33%] md:max-w-[360px] lg:max-w-[380px]">
            <HeroProduct />
          </div>

          {/* Layer 25 — rope, crossing back over the product */}
          <Rope layer="front" className="z-[25] hidden md:block" />

          {/* Layer 30 — copy */}
          <div className="relative z-30 mt-3 sm:mt-4 md:mt-5 max-w-[26rem] text-center">
            <p className="text-[clamp(1rem,1.3vw,1.25rem)] font-semibold text-espresso">
              Single-Origin
            </p>
            <p className="mt-1.5 text-[clamp(0.88rem,1.05vw,1rem)] leading-relaxed text-mid">
              Notes of cacao slow roasted in small batches.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
