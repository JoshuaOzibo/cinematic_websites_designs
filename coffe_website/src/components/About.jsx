import Reveal from './Reveal'

export default function About() {
  const pillars = [
    {
      stat: '100%',
      label: 'Single Farm Traced',
      desc: 'Every lot is sourced directly from a single farm and washing station.',
    },
    {
      stat: '12kg',
      label: 'Micro-Batch Roast',
      desc: 'Precision roasted in small 12kg batches to unlock peak flavor notes.',
    },
    {
      stat: '10 Days',
      label: 'Resting & Degassing',
      desc: 'Rested for maximum clarity and balance before entering your cup.',
    },
    {
      stat: '3 Bars',
      label: 'Across 2 Continents',
      desc: 'Crafting signature coffee experiences in Lagos, London, and beyond.',
    },
  ]

  return (
    <section id="about" className="relative overflow-hidden bg-cream py-20 lg:py-32">
      {/* Background subtle ambient dot grid */}
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
        {/* Top Section Header */}
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-rust" />
              <p className="text-[0.82rem] font-bold tracking-[0.22em] text-rust uppercase">
                Our Craft & Heritage
              </p>
            </div>

            {/* The mask: sized to the heading's own layout box regardless of
                its transform (overflow: hidden establishes that, transforms
                never affect layout size), so it clips exactly to the text
                whichever of the two lines the viewport wraps it onto. */}
            <div className="mt-4 overflow-hidden">
              <h2
                className="font-display text-espresso about-title"
                style={{
                  fontSize: 'clamp(2.2rem, 4.8vw, 4rem)',
                  lineHeight: 1.02,
                  letterSpacing: '-0.025em',
                }}
              >
                We source the world&rsquo;s finest single-origin beans
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Main Content Grid */}
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <Reveal delay={100}>
              <div className="p-8 sm:p-10 rounded-3xl bg-[#efe5cd]/80 border border-espresso/10 backdrop-blur-sm shadow-sm">
                <p className="text-[1.08rem] leading-relaxed text-espresso font-medium">
                  Every lot we buy is traced to a single farm, a single washing station, and a single harvest window. We pay well above the commodity market rate and publish what we paid. A coffee that tastes this specific cannot come from an anonymous supply chain.
                </p>
                <div className="mt-6 pt-6 border-t border-espresso/10 text-[0.98rem] leading-relaxed text-mid">
                  Green beans land in Lagos and are roasted to order in 12kg batches, then rested ten days before shipping. Nothing is blended to hide a flaw, and nothing is roasted dark to cover one. What the farm grew is what reaches your grinder.
                </div>
              </div>
            </Reveal>

            {/* Subtle Brand Tagline Strip */}
            <Reveal delay={150}>
              <div className="flex items-center gap-4 px-2">
                <span className="h-px flex-1 bg-espresso/15" />
                <span className="text-[0.78rem] font-bold tracking-widest text-mid uppercase">
                  Roasting in small batches since 2016
                </span>
                <span className="h-px flex-1 bg-espresso/15" />
              </div>
            </Reveal>
          </div>

          {/* Right Cards Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {pillars.map((pillar, idx) => (
              <Reveal key={pillar.label} delay={120 + idx * 60}>
                <div className="h-full p-6 rounded-2xl bg-white/70 border border-espresso/10 shadow-sm flex flex-col justify-between">
                  <div>
                    {/* Pops in a beat after the card's own fade-up, reading
                        `.reveal-in` off the same Reveal wrapper rather than a
                        second observer — see the rule in index.css. */}
                    <span className="about-stat-pop font-display text-3xl sm:text-4xl text-espresso">
                      {pillar.stat}
                    </span>
                    <h3 className="mt-2 text-[0.92rem] font-bold tracking-wider text-espresso uppercase">
                      {pillar.label}
                    </h3>
                  </div>
                  <p className="mt-4 text-[0.88rem] leading-relaxed text-mid">
                    {pillar.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
