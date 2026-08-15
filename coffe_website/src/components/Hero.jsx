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
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-cream pt-24 pb-14 lg:pt-28"
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
              <span className="pb-[1.2vw]" style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.9rem)' }}>
                An Elevated
              </span>
              <span style={{ fontSize: 'clamp(3.6rem, 13.5vw, 11.5rem)' }}>Coffee</span>
            </span>
            <span className="block" style={{ fontSize: 'clamp(3.8rem, 15.5vw, 13rem)' }}>
              Experience
            </span>
          </h1>

          {/* Layer 20 — product, pulled up over the lettering */}
          <div className="relative z-20 -mt-[15vw] w-[72%] max-w-[340px] md:-mt-[13vw] md:w-[36%] md:max-w-[420px]">
            <HeroProduct />
          </div>

          {/* Layer 25 — rope, crossing back over the product */}
          <Rope layer="front" className="z-[25] hidden md:block" />

          {/* Layer 30 — copy */}
          <div className="relative z-30 mt-8 max-w-[26rem] text-center">
            <p className="text-[clamp(1.05rem,1.5vw,1.4rem)] font-semibold text-espresso">
              Single-Origin
            </p>
            <p className="mt-3 text-[clamp(0.95rem,1.15vw,1.1rem)] leading-relaxed text-mid">
              Notes of cacao slow roasted in small batches.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
