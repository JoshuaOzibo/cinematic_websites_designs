import Reveal from './Reveal'
import { COLLECTIONS } from '../data/site'

export default function Collections() {
  return (
    <section id="collections" className="relative overflow-hidden bg-cream py-24 lg:py-32">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      {/* Faded backdrop word */}
      <span
        className="font-display pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-espresso/[0.05]"
        style={{ fontSize: 'clamp(5rem, 19vw, 18rem)', lineHeight: 0.8 }}
        aria-hidden="true"
      >
        Collection
      </span>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[0.82rem] font-semibold tracking-[0.22em] text-rust uppercase">
              Collections
            </p>
            <h2
              className="font-display mt-4 text-espresso"
              style={{ fontSize: 'clamp(2.1rem, 5vw, 4rem)', lineHeight: 0.95, letterSpacing: '-0.025em' }}
            >
              Four coffees, roasted to order
            </h2>
          </div>
          <p className="max-w-[22rem] text-[0.98rem] leading-relaxed text-mid">
            Rotating seasonally. Ships within 48 hours of the roast date, whole bean or ground
            to your brewer.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              delay={i * 110}
              className="group flex flex-col rounded-2xl border border-bark/30 bg-cream p-7 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_rgba(61,31,10,0.13)]"
            >
              <span className="font-display-sm text-[2.4rem] leading-none text-espresso/15">
                {item.index}
              </span>

              <h3
                className="font-display mt-5 text-espresso"
                style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)', lineHeight: 1, letterSpacing: '-0.02em' }}
              >
                {item.name}
              </h3>

              <p className="mt-2 text-[0.8rem] font-medium tracking-[0.14em] text-rust uppercase">
                {item.origin}
              </p>

              <p className="mt-4 flex-1 text-[0.97rem] leading-relaxed text-mid">{item.notes}</p>

              <div className="mt-6 flex items-baseline justify-between">
                <span className="font-display-sm text-[1.5rem] text-espresso">{item.price}</span>
                <span className="text-[0.82rem] tracking-[0.1em] text-mid uppercase">
                  {item.roast}
                </span>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-full border border-espresso/70 py-3 text-[0.92rem] font-medium text-espresso transition-colors duration-300 hover:bg-espresso hover:text-cream"
              >
                Add to cart
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
