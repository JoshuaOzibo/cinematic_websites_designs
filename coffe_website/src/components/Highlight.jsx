import Reveal from './Reveal'
import { MARQUEE_PHRASES, STATS } from '../data/site'

/** One pass of the marquee text; the track renders it twice so -50% loops seamlessly. */
function MarqueeRun() {
  return (
    <span className="flex shrink-0 items-center">
      {MARQUEE_PHRASES.map((phrase) => (
        <span key={phrase} className="flex items-center">
          <span className="font-display-sm px-8 text-[clamp(1.4rem,3.2vw,2.6rem)] whitespace-nowrap text-parchment">
            {phrase}
          </span>
          <span className="text-[clamp(1.4rem,3.2vw,2.6rem)] text-tan">·</span>
        </span>
      ))}
    </span>
  )
}

export default function Highlight() {
  return (
    <section className="relative overflow-hidden bg-dark py-24 lg:py-32">
      <div className="dot-grid-dark pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 text-center sm:px-8 lg:px-14">
        <Reveal>
          <p className="text-[0.82rem] font-semibold tracking-[0.22em] text-tan uppercase">
            The Difference
          </p>
          {/* mx-auto here rather than on the h2 itself: overflow-hidden on an
              inline-flow width would clip the mask to the wrapper's own box,
              and centring has to happen on that outer box for the heading to
              land in the same place it did before the wrapper existed.

              No max-width: the old 16ch cap forced "Taste the Difference"
              onto two cramped lines at every viewport, reading as shrunk
              rather than as a deliberate stack. Left to size off its own
              clamp()'d font instead, it runs close to one line at desktop
              widths and wraps only where the section's own padding actually
              requires it — which is what "responsive" means here, rather
              than an arbitrary character count. */}
          <div className="mx-auto mt-6 overflow-hidden">
            <h2
              className="font-display mask-title text-parchment"
              style={{ fontSize: 'clamp(2.4rem, 6.5vw, 5.5rem)', lineHeight: 0.92, letterSpacing: '-0.03em' }}
            >
              Taste the Difference
            </h2>
          </div>
          <p className="mx-auto mt-7 max-w-[38rem] text-[1.02rem] leading-relaxed text-parchment/70">
            Slow-roasted profiles built over dozens of test batches, then locked. The same cup,
            every bag, every season — until the harvest tells us otherwise.
          </p>
        </Reveal>
      </div>

      {/* Marquee */}
      <div className="relative mt-16 flex overflow-hidden border-y border-tan/25 py-6">
        <div className="animate-marquee flex w-max">
          <MarqueeRun />
          <span aria-hidden="true" className="flex">
            <MarqueeRun />
          </span>
        </div>
      </div>

      <div className="relative mx-auto mt-16 w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                {/* No width cap here either — same reasoning as the headline
                    above: the wrapper sizes to the value's own clamp()'d font,
                    so it stays correct at every breakpoint rather than being
                    pinned to a number tuned for one. transitionDelay matches
                    this stat's own stagger, so the value rises out of its mask
                    on the same beat its card fades up on, not a beat behind
                    every other stat's mask (mask-title carries no delay of its
                    own in index.css, since the other two callers are singular
                    headlines with nothing to stagger against). */}
                <div className="overflow-hidden">
                  <span
                    className="font-display mask-title block text-tan"
                    style={{
                      fontSize: 'clamp(2.6rem, 5vw, 4rem)',
                      lineHeight: 1,
                      transitionDelay: `${i * 100}ms`,
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
                <span className="mt-3 block text-[0.88rem] tracking-[0.18em] text-parchment/75 uppercase">
                  {stat.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
