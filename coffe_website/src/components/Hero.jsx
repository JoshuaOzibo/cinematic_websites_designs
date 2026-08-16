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
          paddingTop: 'clamp(6rem, 14vw, 12rem)',
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

      {/* ── Cups + arch + bottom content ────────────────────── */}
      {/*
       * All three cups absolutely positioned, extending below the
       * container so the cream arch (z-30) covers their bottom half.
       * Cups sit at z-20..24, arch at z-30 = arch hides cup bottoms.
       */}
      <div className="relative w-full" style={{ zIndex: 20 }}>

        {/* Cup composition area */}
        <div
          className="relative mx-auto w-full max-w-[1440px]"
          style={{
            height: 'clamp(180px, 28vw, 380px)',
          }}
        >
          {/* ── Left cup (matcha/green) ──────────────────────── */}
          <div
            className="absolute"
            style={{
              width: 'clamp(130px, 20vw, 270px)',
              left: 'clamp(40px, 12vw, 200px)',
              bottom: 'clamp(-120px, -18vw, -80px)',
              zIndex: 22,
            }}
          >
            <img
              src="/images/coffee_green.webp"
              alt="Matcha iced latte"
              className="w-full"
            />
          </div>

          {/* ── Center cup (brown/coffee) — dominant ─────────── */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: 'clamp(240px, 36vw, 480px)',
              bottom: 'clamp(-110px, -16vw, -70px)',
              zIndex: 24,
            }}
          >
            <img
              src="/images/coffee_brown.webp"
              alt="A tall iced coffee cold brew — the signature coffeelo drink"
              className="w-full"
            />
          </div>

          {/* ── Right cup (berry/pink) ───────────────────────── */}
          <div
            className="absolute"
            style={{
              width: 'clamp(130px, 20vw, 270px)',
              right: 'clamp(40px, 12vw, 200px)',
              bottom: 'clamp(-120px, -18vw, -80px)',
              zIndex: 22,
            }}
          >
            <img
              src="/images/coffee_pink.webp"
              alt="Berry iced drink"
              className="w-full"
            />
          </div>
        </div>

        {/* ── Cream arch (curves upward at center) ────────────── */}
        <div className="relative" style={{ zIndex: 30, marginTop: '-1px' }}>
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full"
            style={{ display: 'block', marginBottom: '-1px' }}
            fill="none"
            aria-hidden="true"
          >
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
      </div>
    </section>
  )
}
