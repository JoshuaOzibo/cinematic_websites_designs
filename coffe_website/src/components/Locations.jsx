import Reveal from './Reveal'
import { LOCATIONS } from '../data/site'

export default function Locations() {
  return (
    <section id="locations" className="relative overflow-hidden bg-cream py-24 lg:py-32">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <Reveal className="max-w-[34rem]">
          <p className="text-[0.82rem] font-semibold tracking-[0.22em] text-rust uppercase">
            Locations
          </p>
          <h2
            className="font-display mt-4 text-espresso"
            style={{ fontSize: 'clamp(2.1rem, 5vw, 4rem)', lineHeight: 0.95, letterSpacing: '-0.025em' }}
          >
            Three bars, one roast profile
          </h2>
          <p className="mt-5 text-[1rem] leading-relaxed text-mid">
            Every bar pulls the same recipe on the same machines. Walk in for a cortado, walk
            out with beans roasted this week.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {LOCATIONS.map((location, i) => (
            <Reveal
              as="li"
              key={location.id}
              delay={i * 110}
              className="rounded-2xl border border-tan bg-cream p-8 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_rgba(61,31,10,0.13)]"
            >
              <h3
                className="font-display text-espresso"
                style={{ fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', lineHeight: 1, letterSpacing: '-0.02em' }}
              >
                {location.city}
              </h3>

              <p className="mt-5 text-[0.99rem] leading-relaxed text-mid">{location.address}</p>

              <dl className="mt-6 space-y-2 text-[0.93rem]">
                <div className="flex gap-3">
                  <dt className="w-14 shrink-0 tracking-[0.1em] text-mid/70 uppercase">Hrs</dt>
                  <dd className="text-espresso">{location.hours}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-14 shrink-0 tracking-[0.1em] text-mid/70 uppercase">Tel</dt>
                  <dd className="text-espresso">{location.phone}</dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
