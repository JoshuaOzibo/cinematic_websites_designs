import Bean from './hero/Bean'

/**
 * Hero layout:
 *
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  [navbar — fixed, transparent]                              │
 *  │                                                             │
 *  │  ░ floating coffee beans (z-5) ░                           │
 *  │                                                             │
 *  │       C  O  F  F  E  E  (giant wordmark, z-10)             │
 *  │                                                             │
 *  │   [left cup]        [right cup]    ← z-20, side cups       │
 *  │                                                             │
 *  │         ╭──── cream arch ────╮     ← upward arch           │
 *  │        [  CENTER CUP  ]            ← z-40, straddles arch  │
 *  │  ──────────────────────────────────────────────────────    │
 *  │  text   │  CTA buttons  │  badges  (cream zone, z-30)      │
 *  └─────────────────────────────────────────────────────────────┘
 */

const BEANS = [
  { top: '8%',  left: '4%',  size: 52, rotate: -28, dur: '5.2s', delay: '0s',   y: '-20px', x: '8px'  },
  { top: '12%', left: '16%', size: 30, rotate: 44,  dur: '4.1s', delay: '0.7s', y: '-14px', x: '-5px' },
  { top: '5%',  left: '38%', size: 24, rotate: 12,  dur: '3.8s', delay: '1.2s', y: '-12px', x: '6px'  },
  { top: '4%',  left: '58%', size: 28, rotate: -52, dur: '4.7s', delay: '0.3s', y: '-16px', x: '-7px' },
  { top: '9%',  left: '76%', size: 44, rotate: 22,  dur: '5.0s', delay: '0.9s', y: '-22px', x: '5px'  },
  { top: '16%', left: '90%', size: 26, rotate: -16, dur: '3.6s', delay: '1.5s', y: '-13px', x: '8px'  },
  { top: '30%', left: '2%',  size: 34, rotate: 66,  dur: '4.4s', delay: '0.5s', y: '-18px', x: '-6px' },
  { top: '26%', left: '94%', size: 32, rotate: -38, dur: '4.9s', delay: '1.1s', y: '-17px', x: '7px'  },
  { top: '42%', left: '7%',  size: 22, rotate: 80,  dur: '3.9s', delay: '0.2s', y: '-11px', x: '-4px' },
  { top: '38%', left: '90%', size: 36, rotate: -22, dur: '5.3s', delay: '1.8s', y: '-19px', x: '6px'  },
  { top: '20%', left: '42%', size: 18, rotate: 34,  dur: '3.4s', delay: '0.6s', y: '-10px', x: '-3px' },
  { top: '35%', left: '62%', size: 27, rotate: -8,  dur: '4.6s', delay: '1.4s', y: '-15px', x: '5px'  },
]

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(165deg, #c98a2e 0%, #b07020 45%, #8a5010 100%)',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Floating beans ──────────────────────────────────── */}
      {BEANS.map((bean, i) => (
        <span
          key={i}
          className="animate-float-bean pointer-events-none absolute"
          style={{
            top: bean.top,
            left: bean.left,
            zIndex: 5,
            filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.38))',
            '--bean-dur': bean.dur,
            '--bean-delay': bean.delay,
            '--bean-y': bean.y,
            '--bean-x': bean.x,
          }}
        >
          <Bean size={bean.size} rotate={bean.rotate} />
        </span>
      ))}

      {/* ── COFFEE wordmark ──────────────────────────────────── */}
      <div
        className="relative w-full flex items-end justify-center"
        style={{
          zIndex: 10,
          paddingTop: 'clamp(5.5rem, 11vw, 9rem)',
          paddingBottom: 0,
        }}
        aria-hidden="true"
      >
        <span
          className="pointer-events-none select-none font-black uppercase leading-none"
          style={{
            color: 'rgba(255,245,220,0.90)',
            fontSize: 'clamp(6.5rem, 23vw, 23rem)',
            letterSpacing: '-0.01em',
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 900,
            textShadow: 'none',
            lineHeight: 0.82,
          }}
        >
          COFFEE
        </span>
      </div>

      {/* ── Side cups + arch + center cup ───────────────────── */}
      {/*
       * Strategy:
       *  • The cream arch + cream bottom are rendered first as a block that
       *    sits below the wordmark.
       *  • The CENTER cup is absolutely positioned so its bottom 45% is hidden
       *    behind the cream arch and its top 55% floats in the amber zone.
       *  • Side cups sit in normal flow, aligned to the bottom of the amber zone.
       */}
      <div
        className="relative w-full flex-1"
        style={{ zIndex: 20, minHeight: 0 }}
      >
        {/* Side cups — in normal flow, bottom of amber zone */}
        <div
          className="relative mx-auto flex items-end justify-center w-full max-w-[1440px] px-4 sm:px-8 lg:px-14"
          style={{
            /* push them down so they align with the arch baseline */
            paddingBottom: 'clamp(2.5rem, 5vw, 5rem)',
            paddingTop: 'clamp(0.5rem, 1vw, 1.5rem)',
          }}
        >
          {/* Left cup (matcha) */}
          <div
            className="flex-shrink-0 relative"
            style={{
              width: 'clamp(110px, 17vw, 230px)',
              zIndex: 21,
              marginRight: 'clamp(30px, 6vw, 100px)',
              alignSelf: 'flex-end',
            }}
          >
            <img
              src="/images/coffee_green.webp"
              alt="Matcha iced latte"
              className="w-full"
              style={{ filter: 'none' }}
            />
          </div>

          {/* Center placeholder — same width as the real cup so layout is preserved */}
          <div
            style={{
              width: 'clamp(170px, 26vw, 360px)',
              flexShrink: 0,
              visibility: 'hidden',  /* space-holder only; real cup is absolute */
            }}
            aria-hidden="true"
          />

          {/* Right cup (berry) */}
          <div
            className="flex-shrink-0 relative"
            style={{
              width: 'clamp(110px, 17vw, 230px)',
              zIndex: 21,
              marginLeft: 'clamp(30px, 6vw, 100px)',
              alignSelf: 'flex-end',
            }}
          >
            <img
              src="/images/coffee_pink.webp"
              alt="Berry iced drink"
              className="w-full"
              style={{ filter: 'none' }}
            />
          </div>
        </div>

        {/* ── Cream arch + bottom content ─────────────────────── */}
        <div className="relative" style={{ zIndex: 30 }}>
          {/* Upward-arch SVG — peaks at center, dips on edges */}
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full"
            style={{ display: 'block', marginBottom: '-1px' }}
            fill="none"
            aria-hidden="true"
          >
            {/*
             * Arch path:
             *  Start at bottom-left (0, 120)
             *  Rise up to the left shoulder  (300, 80)
             *  Peak at center top            (720, 0)
             *  Drop to the right shoulder   (1140, 80)
             *  End at bottom-right          (1440, 120)
             *  Fill the rectangle below to seal the bottom.
             */}
            <path
              d="M0 120 C 300 120, 300 0, 720 0 C 1140 0, 1140 120, 1440 120 L1440 120 L0 120 Z"
              fill="#f5edd6"
            />
          </svg>

          {/* Cream bottom bar */}
          <div className="bg-cream px-5 pb-8 pt-4 sm:px-8 sm:pb-10 lg:px-14">
            <div className="mx-auto max-w-[1440px]">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center md:gap-8">

                {/* Left — description */}
                <p
                  className="text-[clamp(0.72rem,0.85vw,0.85rem)] font-semibold uppercase leading-relaxed tracking-wide text-espresso/75"
                  style={{ maxWidth: '24ch' }}
                >
                  Explore a world of rich aromas with our exclusive coffee blends, crafted to awaken
                  your senses. We source only the finest beans to deliver you a truly exceptional
                  experience.
                </p>

                {/* Center — CTA buttons */}
                <div className="flex items-center justify-center gap-3">
                  <a
                    href="#collections"
                    id="hero-cta-flavors"
                    className="rounded-full bg-espresso px-5 py-2.5 text-[0.82rem] font-semibold uppercase tracking-wider text-cream transition-transform duration-300 hover:scale-[1.04]"
                  >
                    Flavors
                  </a>
                  <a
                    href="#collections"
                    id="hero-cta-order"
                    className="rounded-full border-2 border-espresso px-5 py-2.5 text-[0.82rem] font-semibold uppercase tracking-wider text-espresso transition-all duration-300 hover:bg-espresso hover:text-cream"
                  >
                    Order Now
                  </a>
                  <a
                    href="#about"
                    id="hero-cta-about"
                    className="rounded-full bg-espresso px-5 py-2.5 text-[0.82rem] font-semibold uppercase tracking-wider text-cream transition-transform duration-300 hover:scale-[1.04]"
                  >
                    About
                  </a>
                </div>

                {/* Right — feature badges */}
                <div className="flex items-center justify-center gap-5 md:justify-end">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                      <path d="M5 7h18l-2.5 13H7.5L5 7z" stroke="#3d1f0a" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
                      <path d="M19.5 10.5h3.5a2.5 2.5 0 0 1 0 5h-3.5" stroke="#3d1f0a" strokeWidth="1.5" fill="none"/>
                      <path d="M10 21h8" stroke="#3d1f0a" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-[0.7rem] font-semibold text-espresso/70 leading-tight">Rich in Flavor</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                      <ellipse cx="14" cy="14" rx="7.5" ry="11" stroke="#3d1f0a" strokeWidth="1.6" fill="none"/>
                      <path d="M14 3c-3.5 4.5-3.5 17 0 22" stroke="#3d1f0a" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
                    </svg>
                    <span className="text-[0.7rem] font-semibold text-espresso/70 leading-tight">Premium Quality</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-[1.5rem] font-black text-espresso leading-none">100%</span>
                    <span className="text-[0.7rem] font-semibold text-espresso/70 leading-tight">Natural Arabica Beans</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── CENTER CUP — absolutely positioned to straddle the arch peak ── */}
        {/*
         * The cup is centred horizontally.
         * Its bottom is placed ~55% of the arch SVG height below where the
         * arch SVG starts, so ~45% of the cup is buried in the cream and
         * ~55% floats up into the amber zone above.
         * The arch height is clamp(80px…120px) → we translate by -60% of cup height.
         */}
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            /* Sit the cup bottom at the arch baseline */
            bottom: 'calc(100% - clamp(80px, 10vw, 120px) + clamp(85px, 14vw, 190px))',
            width: 'clamp(170px, 26vw, 360px)',
            zIndex: 40,
            pointerEvents: 'auto',
          }}
        >
          <img
            src="/images/coffee_brown.webp"
            alt="A tall iced coffee cold brew — the signature coffeelo drink"
            className="w-full"
            style={{ filter: 'none' }}
          />
        </div>
      </div>
    </section>
  )
}
