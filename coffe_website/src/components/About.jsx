import Reveal from './Reveal'

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-cream py-24 lg:py-36">
      {/* Oversized section numeral, sitting well back */}
      <span
        className="font-display pointer-events-none absolute -top-10 right-4 select-none text-espresso/[0.06] lg:right-16"
        style={{ fontSize: 'clamp(11rem, 26vw, 26rem)', lineHeight: 0.8 }}
        aria-hidden="true"
      >
        01
      </span>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] md:gap-16">
          <Reveal>
            <p className="text-[0.82rem] font-semibold tracking-[0.22em] text-rust uppercase">
              About
            </p>
            <span className="mt-5 block h-px w-16 bg-sand" />
            <p className="mt-5 max-w-[16rem] text-[0.95rem] leading-relaxed text-mid">
              Roasting in small batches since 2016, from three bars on two continents.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h2
              className="font-display text-espresso"
              style={{ fontSize: 'clamp(2.1rem, 5vw, 4.2rem)', lineHeight: 0.95, letterSpacing: '-0.025em' }}
            >
              We source the world&rsquo;s finest single-origin beans
            </h2>

            <div className="mt-8 grid gap-6 text-[1.02rem] leading-relaxed text-mid lg:grid-cols-2 lg:gap-10">
              <p>
                Every lot we buy is traced to a single farm, a single washing station, a single
                harvest window. We pay well above the commodity market and we publish what we
                paid — because a coffee that tastes this specific cannot come from an anonymous
                supply chain.
              </p>
              <p>
                Green beans land in Lagos and are roasted to order in 12kg batches, then rested
                ten days before they ship. Nothing is blended to hide a flaw, nothing is roasted
                dark to cover one. What the farm grew is what reaches your grinder.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
