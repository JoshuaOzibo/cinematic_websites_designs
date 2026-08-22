import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from './Reveal'
import { ARTICLES } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

const ICONS = [
  (
    <svg key="dripper" width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M9 5h10l-2.2 9a4 4 0 0 1-1 1.8L14 17l-1.8-1.2a4 4 0 0 1-1-1.8L9 5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 5 7.5 4M19 5l1.5-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M14 17v5.2M10.5 22.2h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg key="sprig" width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 23V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M14 9c-3-3-3-6 0-8 3 2 3 5 0 8z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M14 14c-3-1.5-5-1-6.5 1.2 2 2 4.3 1.8 6.5-.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M14 18c3-1.5 5-1 6.5 1.2-2 2-4.3 1.8-6.5-.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  (
    <svg key="sack" width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M9 9h10l1.2 12.5a2 2 0 0 1-2 2.2H9.8a2 2 0 0 1-2-2.2L9 9z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M11 9c0-3 1-5 3-5s3 2 3 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11.5 14.5h5M11.2 18h5.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
]

function CornerFlourish({ className }) {
  return (
    <svg
      className={className}
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4c30 6 46 22 52 52M4 4c6 30 22 46 52 52"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M40 36c8-4 16-2 20 6M52 60c8-4 16-2 20 6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="60" cy="42" r="2.4" fill="currentColor" />
      <circle cx="72" cy="66" r="2.4" fill="currentColor" />
    </svg>
  )
}
export default function TastingNotes() {
  const trackRef = useRef(null)
  const progressFillRef = useRef(null)
  const itemRefs = useRef(ARTICLES.map(() => ({ icon: null, card: null })))

  useLayoutEffect(() => {
    const track = trackRef.current
    const fill = progressFillRef.current
    if (!track || !fill) return undefined

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const items = itemRefs.current
      if (items.some((item) => !item.icon || !item.card)) return undefined

      // Every card starts hidden, including the first — there used to be a
      // fromTo living inside the scrubbed timeline for that one too, which is
      // exactly what is being removed here. A tween inside a scrubbed
      // timeline ties its whole span proportionally to scroll position, so
      // parking the wheel mid-transition parks the card mid-fade right along
      // with it. Below, each card's reveal runs as its own tween instead, on
      // its own clock: once it starts, it plays to completion regardless of
      // what the scrollbar does next. Only the bar stays genuinely scrubbed.
      gsap.set(items.flatMap((item) => [item.icon, item.card]), { autoAlpha: 0, y: 36 })

      // Where along the bar's own fill each card's step begins, read against
      // the bar's progress rather than the ScrollTrigger's raw one. Scrub
      // easing means those two lag each other slightly, and the bar's fill is
      // what the eye is actually tracking — keying the cards off anything
      // else would let one arrive slightly ahead of the bar reaching its node.
      const THRESHOLDS = [0, 0.42, 0.82]
      let activeStep = -1
      const stepTweens = items.map(() => null)

      const setStep = (i, entering) => {
        stepTweens[i]?.kill()
        const targets = [items[i].icon, items[i].card]
        // .to, not .fromTo: a card reversed mid-reveal by scrolling back
        // needs to continue smoothly from wherever it actually is, not snap
        // to a hardcoded start first.
        stepTweens[i] = entering
          ? gsap.to(targets, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 })
          : gsap.to(targets, { autoAlpha: 0, y: 36, duration: 0.32, ease: 'power2.in', stagger: 0.04 })
      }

      // Steps the whole way to wherever `step` is, one at a time, so a fast
      // scroll that jumps straight from step 0 to step 2 still plays step 1's
      // reveal rather than skipping straight past it.
      const applyStep = (step) => {
        if (step === activeStep) return
        if (step > activeStep) {
          for (let s = activeStep + 1; s <= step; s += 1) setStep(s, true)
        } else {
          for (let s = activeStep; s > step; s -= 1) setStep(s, false)
        }
        activeStep = step
      }

      const tl = gsap.timeline({ defaults: { ease: 'none' } })

      // The bar: the only thing actually scrubbed here.
      tl.fromTo(fill, { width: '0%' }, { width: '100%', duration: 1 }, 0)

      tl.eventCallback('onUpdate', () => {
        const p = tl.progress()
        let step = 0
        for (let i = THRESHOLDS.length - 1; i >= 0; i -= 1) {
          if (p >= THRESHOLDS[i]) {
            step = i
            break
          }
        }
        applyStep(step)
      })

      const st = ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.8}`,
        pin: true,
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true,
      })

      return () => {
        st.kill()
        tl.kill()
        stepTweens.forEach((t) => t?.kill())
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="notes" ref={trackRef} className="relative overflow-hidden py-20 lg:py-28">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#fdfbf4] p-6 shadow-[0_40px_80px_-40px_rgb(61_31_10_/_0.28)] sm:p-10 lg:p-14">
          <CornerFlourish className="pointer-events-none absolute -left-6 -top-6 text-clay/25" />
          <CornerFlourish className="pointer-events-none absolute -bottom-6 -right-6 rotate-180 text-clay/25" />

          <Reveal className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[0.82rem] font-semibold tracking-[0.22em] text-rust uppercase">
                Tasting Notes
              </p>
              <div className="mt-4 overflow-hidden">
                <h2
                  className="font-display mask-title text-espresso"
                  style={{
                    fontSize: 'clamp(2.1rem, 5vw, 4rem)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.025em',
                  }}
                >
                  From the roastery journal
                </h2>
              </div>
            </div>
            <a
              href="#notes"
              className="inline-flex items-center gap-2 rounded-full border border-rust/35 px-5 py-2.5 text-[0.78rem] font-bold tracking-[0.12em] text-rust uppercase transition-colors duration-300 hover:bg-rust hover:text-cream"
            >
              View all entries
              <span aria-hidden="true">&rarr;</span>
            </a>
          </Reveal>

          <div className="relative mt-16">
            <div className="absolute inset-x-2 top-8 hidden h-2.5 -translate-y-1/2 overflow-hidden rounded-full bg-clay/25 lg:block">
              <div ref={progressFillRef} className="h-full w-0 bg-clay" />
            </div>

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              {ARTICLES.map((article, i) => (
                <div key={article.id} className="relative">
                  <div
                    ref={(el) => {
                      itemRefs.current[i].icon = el
                    }}
                    className="relative z-10 mx-auto -mb-8 hidden h-16 w-16 items-center justify-center rounded-full border-4 border-[#fdfbf4] bg-clay text-cream shadow-[0_10px_24px_-8px_rgb(188_108_37_/_0.45)] lg:flex"
                  >
                    {ICONS[i]}
                  </div>

                  <Reveal
                    as="article"
                    delay={i * 110}
                    className="lg:contents"
                  >
                    <div
                      ref={(el) => {
                        itemRefs.current[i].card = el
                      }}
                      className="h-full rounded-2xl border border-clay/20 bg-[#f6efe0] p-6 pt-6 shadow-sm lg:pt-14"
                    >
                      <div className="flex items-center gap-2.5 text-[0.8rem] font-semibold tracking-[0.16em] text-rust uppercase">
                        <span className="text-clay lg:hidden">{ICONS[i]}</span>
                        {article.category}:
                        <span className="font-normal tracking-normal text-mid normal-case">
                          {article.date}
                        </span>
                      </div>

                      <h3
                        className="font-display mt-4 text-espresso"
                        style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.85rem)', lineHeight: 1.08, letterSpacing: '-0.015em' }}
                      >
                        {article.title}
                      </h3>
                      <p className="mt-3 text-[0.96rem] leading-relaxed text-mid">
                        {article.excerpt}
                      </p>

                      <a
                        href="#notes"
                        className="group mt-5 inline-flex items-center gap-2 text-[0.9rem] font-semibold uppercase tracking-[0.08em] text-espresso"
                      >
                        Read more
                        <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                          &rarr;
                        </span>
                      </a>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
