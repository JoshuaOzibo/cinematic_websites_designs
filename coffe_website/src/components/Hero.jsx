import Bean from './hero/Bean'
import CoffeeCup from './hero/CoffeeCup'

/**
 * Hero — reference layout
 *
 * ┌──────────────────────────────────────────────────────────┐
 * │  NAVBAR (fixed overlay, transparent on this section)     │
 * │  ─────────────────────────────────────────────────────── │
 * │  ░░░░░░  C O F F E E  ░░░░░░  ← giant amber wordmark   │
 * │       [cup-left]  [cup-center]  [cup-right]              │
 * │  ╰── curved cream bottom ──────────────────────────────╯ │
 * │  description │ CTA buttons │ feature badges              │
 * └──────────────────────────────────────────────────────────┘
 */

/** Beans scattered around the hero area */
const BEANS = [
  { top: '8%',  left: '5%',   size: 48, rotate: -28, dur: '5.2s', delay: '0s',    y: '-20px', x: '8px'  },
  { top: '14%', left: '18%',  size: 32, rotate: 44,  dur: '4.1s', delay: '0.7s',  y: '-14px', x: '-5px' },
  { top: '6%',  left: '35%',  size: 26, rotate: 12,  dur: '3.8s', delay: '1.2s',  y: '-12px', x: '6px'  },
  { top: '4%',  left: '55%',  size: 30, rotate: -52, dur: '4.7s', delay: '0.3s',  y: '-16px', x: '-7px' },
  { top: '10%', left: '72%',  size: 42, rotate: 22,  dur: '5.0s', delay: '0.9s',  y: '-22px', x: '5px'  },
  { top: '18%', left: '88%',  size: 28, rotate: -16, dur: '3.6s', delay: '1.5s',  y: '-13px', x: '8px'  },
  { top: '32%', left: '3%',   size: 36, rotate: 66,  dur: '4.4s', delay: '0.5s',  y: '-18px', x: '-6px' },
  { top: '28%', left: '92%',  size: 34, rotate: -38, dur: '4.9s', delay: '1.1s',  y: '-17px', x: '7px'  },
  { top: '52%', left: '8%',   size: 24, rotate: 80,  dur: '3.9s', delay: '0.2s',  y: '-11px', x: '-4px' },
  { top: '48%', left: '88%',  size: 38, rotate: -22, dur: '5.3s', delay: '1.8s',  y: '-19px', x: '6px'  },
  { top: '22%', left: '45%',  size: 20, rotate: 34,  dur: '3.4s', delay: '0.6s',  y: '-10px', x: '-3px' },
  { top: '38%', left: '60%',  size: 29, rotate: -8,  dur: '4.6s', delay: '1.4s',  y: '-15px', x: '5px'  },
]

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #c4882a 0%, #a86820 55%, #8f5514 100%)',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Floating beans scattered across the amber zone ── */}
      {BEANS.map((bean, i) => (
        <span
          key={i}
          className="animate-float-bean pointer-events-none absolute drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
          style={{
            top: bean.top,
            left: bean.left,
            zIndex: 5,
            '--bean-dur': bean.dur,
            '--bean-delay': bean.delay,
            '--bean-y': bean.y,
            '--bean-x': bean.x,
          }}
        >
          <Bean size={bean.size} rotate={bean.rotate} />
        </span>
      ))}

      {/* ── Upper amber zone: wordmark + cups ─────────────── */}
      <div className="relative flex flex-1 flex-col" style={{ zIndex: 10 }}>

        {/* Giant "COFFEE" wordmark — fills the width */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden"
          style={{ paddingTop: 'clamp(5rem, 10vw, 8rem)' }}
          aria-hidden="true"
        >
          <span
            className="hero-wordmark pointer-events-none select-none font-black uppercase leading-none text-cream/90"
            style={{
              fontSize: 'clamp(6rem, 22vw, 22rem)',
              letterSpacing: '-0.01em',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 900,
            }}
          >
            COFFEE
          </span>
        </div>

        {/* ── Three cups row — positioned to overlap the wordmark ─ */}
        <div
          className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-14"
          style={{ zIndex: 20, marginTop: 'clamp(-14rem, -28vw, -22rem)' }}
        >
          <div className="flex items-end justify-center gap-0">

            {/* Left cup — smaller, tinted green */}
            <div
              className="relative flex-shrink-0 self-end"
              style={{
                width: 'clamp(100px, 16vw, 220px)',
                marginRight: 'clamp(-20px, -2vw, -40px)',
                zIndex: 21,
                filter: 'hue-rotate(50deg) saturate(0.7) brightness(0.88)',
                opacity: 0.92,
              }}
            >
              <CoffeeCup className="w-full drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)]" />
            </div>

            {/* Center cup — dominant, full colour */}
            <div
              className="relative z-30 flex-shrink-0"
              style={{ width: 'clamp(160px, 28vw, 380px)' }}
            >
              <CoffeeCup className="w-full drop-shadow-[0_32px_60px_rgba(0,0,0,0.45)]" />
            </div>

            {/* Right cup — smaller, tinted pink/berry */}
            <div
              className="relative flex-shrink-0 self-end"
              style={{
                width: 'clamp(100px, 16vw, 220px)',
                marginLeft: 'clamp(-20px, -2vw, -40px)',
                zIndex: 21,
                filter: 'hue-rotate(-30deg) saturate(0.65) brightness(0.9)',
                opacity: 0.92,
              }}
            >
              <CoffeeCup className="w-full drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Curved cream bottom strip ──────────────────────── */}
      <div className="relative z-30" style={{ marginTop: '-2px' }}>
        {/* SVG wave for the curved top edge */}
        <div className="relative" style={{ height: 'clamp(32px, 5vw, 60px)', overflow: 'hidden' }}>
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            fill="none"
            aria-hidden="true"
          >
            <path d="M0 60 Q360 0 720 20 Q1080 40 1440 0 L1440 60 Z" fill="#f5edd6" />
          </svg>
        </div>

        {/* Bottom content bar */}
        <div className="bg-cream px-5 pb-8 pt-2 sm:px-8 sm:pb-10 lg:px-14">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center md:gap-8">

              {/* Left — description */}
              <p className="text-[clamp(0.75rem,0.9vw,0.88rem)] font-semibold uppercase leading-relaxed tracking-wide text-espresso/80 max-w-[22ch]">
                Explore a world of rich aromas with our exclusive coffee blends, crafted to awaken
                your senses. We source only the finest beans to deliver you a truly exceptional
                experience.
              </p>

              {/* Center — CTA buttons */}
              <div className="flex items-center justify-center gap-3">
                <a
                  href="#collections"
                  id="hero-cta-flavors"
                  className="rounded-full bg-espresso px-6 py-2.5 text-[0.85rem] font-semibold uppercase tracking-wider text-cream transition-transform duration-300 hover:scale-[1.04]"
                >
                  Flavors
                </a>
                <a
                  href="#collections"
                  id="hero-cta-order"
                  className="rounded-full border-2 border-espresso px-6 py-2.5 text-[0.85rem] font-semibold uppercase tracking-wider text-espresso transition-all duration-300 hover:bg-espresso hover:text-cream"
                >
                  Order Now
                </a>
                <a
                  href="#about"
                  id="hero-cta-about"
                  className="rounded-full bg-espresso px-6 py-2.5 text-[0.85rem] font-semibold uppercase tracking-wider text-cream transition-transform duration-300 hover:scale-[1.04]"
                >
                  About
                </a>
              </div>

              {/* Right — feature badges */}
              <div className="flex items-center justify-center gap-6 md:justify-end">
                <div className="flex flex-col items-center gap-1 text-center">
                  {/* Cup icon */}
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                    <path d="M5 6h16l-2 12H7L5 6z" stroke="#3d1f0a" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
                    <path d="M18 9h3a2 2 0 0 1 0 4h-3" stroke="#3d1f0a" strokeWidth="1.5" fill="none"/>
                    <path d="M9 19h8" stroke="#3d1f0a" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[0.72rem] font-semibold text-espresso/70 leading-tight">Rich in Flavor</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  {/* Bean icon */}
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                    <ellipse cx="13" cy="13" rx="7" ry="10" stroke="#3d1f0a" strokeWidth="1.6" fill="none"/>
                    <path d="M13 3c-3 4-3 16 0 20" stroke="#3d1f0a" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
                  </svg>
                  <span className="text-[0.72rem] font-semibold text-espresso/70 leading-tight">Premium Quality</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-[1.4rem] font-black text-espresso leading-none">100%</span>
                  <span className="text-[0.72rem] font-semibold text-espresso/70 leading-tight">Natural Arabica Beans</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
