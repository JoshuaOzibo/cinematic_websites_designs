import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Bean from './hero/Bean'
import { COFFEE_PRODUCTS, NUT_IMAGES } from '../data/coffeeProducts'

/* Everything the first two screens actually paint with. The counter is real:
   it reports these files landing, not a scripted fake, which is why the list is
   the cup photos and their garnishes rather than every asset on the page. The
   sections further down load behind the curtain on their own. */
const PRELOAD = [
  ...COFFEE_PRODUCTS.map((product) => product.image),
  ...COFFEE_PRODUCTS.flatMap((product) => product.garnish.map((g) => g.image)),
  ...NUT_IMAGES,
]

/* The floor under the counter. A warm cache serves those eleven files in well
   under 100ms, and a bar that snaps to 100 the instant it appears reads as
   broken rather than fast — this is how long the type reveal needs to play out,
   and the counter is paced to arrive with it. See the gate in `tick`. */
const MIN_MS = 2400

/* And the ceiling. One stalled request must never trap a visitor behind an
   opaque black panel, so past this the counter finishes regardless. */
const BAIL_MS = 8000

/* Placed around the type rather than over it. The block runs from the left
   padding to roughly 55% at desktop and from the eyebrow down to the sub, so
   only small, blurred, dim nuts are allowed to cross it — a sharp 80px one
   behind a 0.52-opacity line of body copy reads through the text.

   `blur` and `op` are the only things that say "depth" here: the sharp, bright,
   larger nuts read as near, the small blurred dim ones as far behind them. */
const NUTS = [
  { top: '7%', left: '5%', size: 64, blur: '0px', op: 0.95, rot: -22, dur: '5.4s', delay: '0s', y: '-18px', x: '8px' },
  { top: '27%', left: '21%', size: 34, blur: '1.8px', op: 0.42, rot: 40, dur: '4.6s', delay: '0.7s', y: '-12px', x: '-6px' },
  { top: '58%', left: '41%', size: 80, blur: '0px', op: 0.9, rot: 16, dur: '6.1s', delay: '0.3s', y: '-22px', x: '-9px' },
  { top: '47%', left: '3%', size: 40, blur: '2.4px', op: 0.36, rot: -54, dur: '5.0s', delay: '1.2s', y: '-14px', x: '7px' },
  { top: '84%', left: '31%', size: 46, blur: '1.2px', op: 0.6, rot: 62, dur: '4.9s', delay: '0.5s', y: '-15px', x: '6px' },
  { top: '8%', left: '57%', size: 38, blur: '1.9px', op: 0.4, rot: -30, dur: '5.6s', delay: '1.0s', y: '-13px', x: '-7px' },
  { top: '17%', left: '83%', size: 72, blur: '0px', op: 0.95, rot: 28, dur: '5.2s', delay: '0.2s', y: '-20px', x: '9px' },
  { top: '43%', left: '93%', size: 36, blur: '2.4px', op: 0.34, rot: -14, dur: '4.4s', delay: '0.9s', y: '-12px', x: '-5px' },
  { top: '71%', left: '79%', size: 58, blur: '0.6px', op: 0.82, rot: 48, dur: '5.8s', delay: '0.4s', y: '-18px', x: '8px' },
  { top: '89%', left: '63%', size: 32, blur: '1.5px', op: 0.44, rot: -40, dur: '4.7s', delay: '1.4s', y: '-11px', x: '-6px' },
]

/* The black curtain that plays before the hero.
   Four masked lines rise out of their clip boxes, the nuts drift up through the
   ember glow behind them, the counter fills, and the whole panel lifts away.
   Unmounted by App the moment `onDone` fires — nothing here survives the exit. */
export default function Intro({ onDone }) {
  const rootRef = useRef(null)
  const countRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const countEl = countRef.current
    const barEl = barRef.current
    if (!root || !countEl || !barEl) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ── Freeze the page behind the curtain ───────────────────────────────
       A reload halfway down the page would otherwise restore that scroll
       position under an opaque panel, and the visitor would be dropped into
       the middle of the site the instant it lifted. */
    const html = document.documentElement
    const prevRestore = 'scrollRestoration' in history ? history.scrollRestoration : null
    if (prevRestore !== null) history.scrollRestoration = 'manual'
    html.classList.add('intro-lock')
    window.scrollTo(0, 0)

    let unlocked = false
    const unlock = () => {
      if (unlocked) return
      unlocked = true
      html.classList.remove('intro-lock')
      if (prevRestore !== null) history.scrollRestoration = prevRestore
    }

    /* ── Real progress ───────────────────────────────────────────────────
       `target` is the fraction that has actually landed; `shown` down in the
       ticker is what the counter says. They are deliberately two numbers: the
       gap between them is what turns a burst of cache hits into a smooth fill
       instead of a jump from 0 to 100. Fonts count as one unit because the
       headline below is Fraunces, so an unloaded face is a visible reflow. */
    const total = PRELOAD.length + 1
    const target = { value: 0 }
    const images = []
    let settled = 0
    const bump = () => {
      settled += 1
      target.value = settled / total
    }

    PRELOAD.forEach((src) => {
      const img = new Image()
      img.onload = bump
      img.onerror = bump
      img.src = src
      images.push(img)
    })

    if (document.fonts?.ready) document.fonts.ready.then(bump, bump)
    else bump()

    const bail = window.setTimeout(() => {
      target.value = 1
    }, BAIL_MS)

    let ticker = null

    const ctx = gsap.context((self) => {
      const lines = self.selector('.intro-line')
      const nuts = self.selector('.intro-nut')
      const rule = self.selector('.intro-rule')
      const glow = self.selector('.intro-glow')

      const startedAt = performance.now()
      const shown = { value: 0 }
      let exiting = false

      const paint = () => {
        countEl.textContent = String(Math.round(shown.value * 100))
        barEl.style.transform = `scaleX(${shown.value})`
      }

      const exit = () => {
        if (exiting) return
        exiting = true

        /* A held beat on 100 before anything moves. Without it the curtain
           starts lifting on the same frame the counter lands and the visitor
           never sees the number complete. */
        const out = gsap.timeline({
          delay: 0.32,
          onComplete: () => {
            unlock()
            onDone()
          },
        })

        if (reduced) {
          out.to(root, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' })
          return
        }

        /* Content leaves before its container does, and upward — the same
           direction the panel is about to travel — so the exit reads as one
           move rather than a card that empties and then slides. */
        out
          .to(lines, { yPercent: -135, duration: 0.7, ease: 'power3.in', stagger: 0.055 })
          .to(rule, { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0.15)
          .to(
            nuts,
            {
              autoAlpha: 0,
              yPercent: -55,
              scale: 0.8,
              duration: 0.65,
              ease: 'power2.in',
              stagger: { each: 0.035, from: 'random' },
            },
            0.05,
          )
          .to(root, { yPercent: -100, duration: 1.15, ease: 'power4.inOut' }, 0.5)
      }

      /* dt-corrected, the way useHeroMotion eases its own scroll position: a
         fixed per-frame fraction would fill twice as fast on a 120Hz display. */
      const tick = (_time, delta) => {
        const gate = Math.min((performance.now() - startedAt) / MIN_MS, 1)
        const to = Math.min(target.value, gate)
        const k = 1 - 0.91 ** (Math.min(delta, 64) / 16.667)
        shown.value += (to - shown.value) * k
        /* Snap once the gap is under half a percent. An exponential ease never
           actually arrives, and the counter rounds while the bar does not — so
           without this the number reads 100 for the best part of a second while
           the fill is still visibly short of the end of its track. */
        if (to - shown.value < 0.004) shown.value = to
        paint()
        if (shown.value >= 1) {
          gsap.ticker.remove(tick)
          ticker = null
          exit()
        }
      }

      paint()

      /* ── Why these are fromTo, and why every one of them passes y: 0 ──────
         The resting states are declared in CSS as translateY(130%) / (55%), so
         nothing flashes in place before this effect runs. GSAP cannot read them
         back as percentages: it parses getComputedStyle's *matrix*, where the
         browser has already resolved 130% against the element's own height, and
         it lands in `y` as a pixel figure. yPercent is left at 0.

         Tweening `yPercent: 0` against that is a no-op — it animates 0 to 0
         while the pixels in `y` sit exactly where the stylesheet put them, and
         every line stays parked below its mask for the whole intro. So the from
         half restates the offset as a percentage and zeroes the pixels in the
         same call. Anything that ever reads a percentage transform out of this
         stylesheet needs the same pair. */
      if (reduced) {
        /* No entrance at all — the lines, nuts and rule are simply already
           where the timeline would have put them. The counter still fills,
           which is information rather than motion. */
        gsap.set(lines, { yPercent: 0, y: 0 })
        gsap.set(nuts, { autoAlpha: 1, yPercent: 0, y: 0, scale: 1 })
        gsap.set([...rule, ...glow], { autoAlpha: 1 })
      } else {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .to(glow, { autoAlpha: 1, duration: 1.6, ease: 'power2.out' }, 0)
          .fromTo(
            nuts,
            { autoAlpha: 0, yPercent: 55, y: 0, scale: 0.72 },
            {
              autoAlpha: 1,
              yPercent: 0,
              scale: 1,
              duration: 1.2,
              ease: 'power2.out',
              stagger: { each: 0.055, from: 'random' },
            },
            0,
          )
          /* expo.out is the whole feel of the reveal: the line clears the mask
             almost immediately and then settles, so it reads as rising into
             place rather than sliding at a constant speed. */
          .fromTo(
            lines,
            { yPercent: 130, y: 0 },
            { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.085 },
            0.2,
          )
          .to(rule, { autoAlpha: 1, duration: 0.8 }, 0.35)
      }

      ticker = tick
      gsap.ticker.add(tick)
    }, rootRef)

    return () => {
      /* gsap.context does not own ticker callbacks, so this has to come off by
         hand or a StrictMode remount leaves two of them writing the counter. */
      if (ticker) gsap.ticker.remove(ticker)
      window.clearTimeout(bail)
      images.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
      ctx.revert()
      unlock()
    }
  }, [onDone])

  return (
    <div ref={rootRef} className="intro-root" role="status" aria-label="Loading coffeelo">
      <div className="intro-glow" aria-hidden="true" />

      <div className="intro-nuts" aria-hidden="true">
        {NUTS.map((nut, i) => (
          <span
            key={`nut-${i}`}
            className="intro-nut"
            style={{
              top: nut.top,
              left: nut.left,
              filter: `blur(${nut.blur}) drop-shadow(0 0 26px rgb(176 122 42 / 0.22))`,
            }}
          >
            {/* Two elements, two writers: GSAP drives the entrance and exit on
                the wrapper above, the hero's existing float keyframes drive the
                idle drift in here. Neither ever touches the other's transform. */}
            <span
              className="animate-float-bean intro-nut-drift"
              style={{
                opacity: nut.op,
                '--bean-rot': `${nut.rot}deg`,
                '--bean-dur': nut.dur,
                '--bean-delay': nut.delay,
                '--bean-y': nut.y,
                '--bean-x': nut.x,
              }}
            >
              <Bean size={nut.size} image={NUT_IMAGES[i % NUT_IMAGES.length]} />
            </span>
          </span>
        ))}
      </div>

      <div className="intro-type">
        <span className="intro-mask">
          <span className="intro-line intro-eyebrow">Coffee &amp; Co.</span>
        </span>

        <p className="intro-headline">
          <span className="intro-mask">
            <span className="intro-line font-display">Slow roasted,</span>
          </span>
          <span className="intro-mask">
            <span className="intro-line font-display">poured cold.</span>
          </span>
        </p>

        <span className="intro-mask">
          <span className="intro-line intro-sub">Twelve origins. One cup at a time.</span>
        </span>
      </div>

      <div className="intro-meter">
        <div className="intro-meter-row">
          <span className="intro-mask">
            <span className="intro-line intro-meter-label">Brewing</span>
          </span>
          <span className="intro-mask">
            <span className="intro-line intro-count-wrap" aria-hidden="true">
              <span ref={countRef} className="intro-count font-display-sm">
                0
              </span>
              <span className="intro-count-pct">%</span>
            </span>
          </span>
        </div>
        <div className="intro-rule">
          <span ref={barRef} className="intro-rule-fill" />
        </div>
      </div>
    </div>
  )
}
