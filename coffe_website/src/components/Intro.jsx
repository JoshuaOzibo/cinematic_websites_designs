import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Bean from './hero/Bean'
import { COFFEE_PRODUCTS, NUT_IMAGES } from '../data/coffeeProducts'

/* Only what is on screen the moment the curtain lifts: the three cups and the
   nuts. The counter is real — it reports these files landing, not a scripted
   fake — so what goes in this list is also what the visitor is made to wait
   for. The showcase garnishes were in here and came out: they are two screens
   down, they are the largest images on the site, and holding an opaque panel up
   while they decode buys nothing anyone can see. They load behind the curtain
   on their own. */
const PRELOAD = [...COFFEE_PRODUCTS.map((product) => product.image), ...NUT_IMAGES]

/* ── The beats ─────────────────────────────────────────────────────────────
   Seconds from the moment the curtain starts, and the order is the point: the
   screen is black and then it is black with nuts drifting in it, for a full
   beat and a half, before a single word arrives. Nothing competes for the eye
   at the same time as anything else.

   COUNT_START is not a decoration — it is when the meter's own mask opens, and
   the progress gate below is offset by it so the number climbs from 0 as it
   appears rather than showing up already most of the way full. */
const BEAT = {
  nuts: 0.45,
  type: 1.75,
  meter: 2.65,
}
const COUNT_START_MS = BEAT.meter * 1000

/* How long the counter takes to cross once it starts. Real progress can only
   hold it back, never speed it up: a warm cache serves those eleven files in
   under 100ms and a bar that snaps to full the instant it appears reads as
   broken rather than fast. */
const FILL_MS = 1700

/* The ceiling. One stalled request must never trap a visitor behind an opaque
   black panel, so past this the counter finishes regardless. */
const BAIL_MS = 8000

/* ── The lift, and when the page behind is allowed to start ───────────────
   The curtain travels up, so it uncovers the page from the bottom and the
   navbar's strip last. TOP_CLEAR is the fraction of the lift at which the top
   of the screen is actually visible, and it is where `onReveal` fires: any
   earlier and the navbar performs its entrance underneath a panel that is
   still covering it.

   0.78 is power3.inOut's own curve, not a guess. For the back half that ease is
   p = 1 - 4(1 - t)^3, so it has already travelled 95% of the way at t = 0.768
   and 96% at t = 0.785 — enough to have cleared a navbar occupying the top ~5%
   of any viewport this runs on. Change LIFT_EASE and this number is wrong. */
const LIFT_AT = 0.45
const LIFT_DUR = 1.05
const LIFT_EASE = 'power3.inOut'
const TOP_CLEAR = 0.78

/* Placed around the type rather than over it. The block runs from the left
   padding to roughly 55% at desktop and from the eyebrow down to the sub, so
   only small, blurred, dim nuts are allowed to cross it — a sharp 80px one
   behind a 0.52-opacity line of body copy reads through the text.

   `blur` and `op` are the only things that say "depth" here: the sharp, bright,
   larger nuts read as near, the small blurred dim ones as far behind them. */
const NUTS = [
  { top: '7%', left: '5%', size: 64, blur: 0, op: 0.95, rot: -22, dur: '5.4s', delay: '0s', y: '-18px', x: '8px' },
  { top: '27%', left: '21%', size: 34, blur: 1.8, op: 0.42, rot: 40, dur: '4.6s', delay: '0.7s', y: '-12px', x: '-6px' },
  { top: '58%', left: '41%', size: 80, blur: 0, op: 0.9, rot: 16, dur: '6.1s', delay: '0.3s', y: '-22px', x: '-9px' },
  { top: '47%', left: '3%', size: 40, blur: 2.4, op: 0.36, rot: -54, dur: '5.0s', delay: '1.2s', y: '-14px', x: '7px' },
  { top: '84%', left: '31%', size: 46, blur: 1.2, op: 0.6, rot: 62, dur: '4.9s', delay: '0.5s', y: '-15px', x: '6px' },
  { top: '8%', left: '57%', size: 38, blur: 1.9, op: 0.4, rot: -30, dur: '5.6s', delay: '1.0s', y: '-13px', x: '-7px' },
  { top: '17%', left: '83%', size: 72, blur: 0, op: 0.95, rot: 28, dur: '5.2s', delay: '0.2s', y: '-20px', x: '9px' },
  { top: '43%', left: '93%', size: 36, blur: 2.4, op: 0.34, rot: -14, dur: '4.4s', delay: '0.9s', y: '-12px', x: '-5px' },
  { top: '71%', left: '79%', size: 58, blur: 0.6, op: 0.82, rot: 48, dur: '5.8s', delay: '0.4s', y: '-18px', x: '8px' },
  { top: '89%', left: '63%', size: 32, blur: 1.5, op: 0.44, rot: -40, dur: '4.7s', delay: '1.4s', y: '-11px', x: '-6px' },
]

/* The black curtain that plays before the hero.
   Nuts drift up through the ember glow on their own, then four masked lines
   rise out of their clip boxes, then the meter opens and fills, then the whole
   panel lifts away. Unmounted by App the moment `onDone` fires.

   Two cues fire before that, and the gap between them is the point:

   `onUnveil` — the counter has landed and the exit is queued, but nothing has
   moved yet. This is the only genuinely still moment in the whole sequence, and
   it is where the page behind gets to do its first paint: twenty bean
   keyframes, a masked dot grid and three cup photos, all rasterised for the
   first time while the curtain is opaque and no animation is running. Firing it
   with `onReveal` instead put that work on exactly the frame the curtain
   started moving, and it cost most of the frames in the exit.

   `onReveal` — the panel starts travelling. Cue for the hero and navbar to
   begin their own entrances, so the page assembles itself as the curtain clears
   rather than snapping into place after it has gone. */
export default function Intro({ onUnveil, onReveal, onDone }) {
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
       headline is Fraunces, so an unloaded face is a visible reflow. */
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
    let raf = 0
    let revealed = false
    /* Guarded because it is reachable from two places — the exit timeline's own
       cue and the reduced-motion branch — and the hero must not run its
       entrance twice. */
    const reveal = () => {
      if (revealed) return
      revealed = true
      onReveal()
    }

    const ctx = gsap.context((self) => {
      const lines = self.selector('.intro-line')
      const nuts = self.selector('.intro-nut')
      const rule = self.selector('.intro-rule')

      let startedAt = 0
      const shown = { value: 0 }
      let exiting = false
      let painted = -1

      /* Only touches the DOM when the rounded figure actually moves. Writing
         the same string into textContent sixty times a second is a style
         invalidation per frame for no visible change, and this runs alongside
         the reveal it must not compete with. */
      const paint = () => {
        const pct = Math.round(shown.value * 100)
        if (pct === painted) return
        painted = pct
        countEl.textContent = String(pct)
        barEl.style.transform = `scaleX(${(pct / 100).toFixed(3)})`
      }

      const exit = () => {
        if (exiting) return
        exiting = true

        /* Before the delay, not inside it: the page behind needs the whole of
           this still beat to paint itself, not what is left of it. */
        onUnveil()

        /* A held beat on 100 before anything moves. Without it the curtain
           starts lifting on the same frame the counter lands and the visitor
           never sees the number complete. */
        const out = gsap.timeline({
          delay: 0.35,
          onComplete: () => {
            unlock()
            onDone()
          },
        })

        if (reduced) {
          out.call(reveal).to(root, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' })
          return
        }

        /* Content leaves before its container does, and upward — the same
           direction the panel is about to travel — so the exit reads as one
           move rather than a card that empties and then slides. */
        out
          .to(lines, {
            yPercent: -135,
            duration: 0.7,
            ease: 'power3.in',
            stagger: 0.05,
            force3D: true,
          })
          .to(rule, { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0.1)
          .to(
            nuts,
            {
              autoAlpha: 0,
              yPercent: -50,
              scale: 0.82,
              duration: 0.65,
              ease: 'power2.in',
              stagger: { each: 0.03, from: 'random' },
              force3D: true,
            },
            0.05,
          )
          .to(
            root,
            { yPercent: -100, duration: LIFT_DUR, ease: LIFT_EASE, force3D: true },
            LIFT_AT,
          )
          /* Not at LIFT_AT: the navbar is the last thing this panel uncovers,
             and it has to be on screen before it is asked to perform. */
          .call(reveal, null, LIFT_AT + LIFT_DUR * TOP_CLEAR)
      }

      /* dt-corrected, the way useHeroMotion eases its own scroll position: a
         fixed per-frame fraction would fill twice as fast on a 120Hz display. */
      const tick = (_time, delta) => {
        const gate = Math.min(
          Math.max(performance.now() - startedAt - COUNT_START_MS, 0) / FILL_MS,
          1,
        )
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
      let tl = null

      if (reduced) {
        /* No entrance at all — the lines, nuts and rule are simply already
           where the timeline would have put them. The counter still fills,
           which is information rather than motion. */
        gsap.set(lines, { yPercent: 0, y: 0 })
        gsap.set(nuts, { autoAlpha: 1, yPercent: 0, y: 0, scale: 1 })
        gsap.set(rule, { autoAlpha: 1 })
      } else {
        tl = gsap
          .timeline({ paused: true, defaults: { ease: 'power3.out', force3D: true } })
          /* The nuts get the screen to themselves for a beat and a half. Long
             durations and a wide stagger are the whole reason this reads as
             drifting rather than arriving. */
          .fromTo(
            nuts,
            { autoAlpha: 0, yPercent: 55, y: 0, scale: 0.72 },
            {
              autoAlpha: 1,
              yPercent: 0,
              scale: 1,
              duration: 1.35,
              ease: 'power2.out',
              stagger: { each: 0.06, from: 'random' },
            },
            BEAT.nuts,
          )
          /* expo.out is the whole feel of the reveal: the line clears the mask
             almost immediately and then settles, so it reads as rising into
             place rather than sliding at a constant speed. */
          .fromTo(
            lines,
            { yPercent: 130, y: 0 },
            { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.13 },
            BEAT.type,
          )
          .to(rule, { autoAlpha: 1, duration: 0.8, ease: 'sine.out' }, BEAT.meter)
      }

      /* ── Why the curtain waits two frames before it moves ────────────────
         Intro mounts in the same React commit as the entire site behind it, so
         the frames immediately after this effect are the most contended of the
         whole page life: React building the hero, showcase and two spotlights,
         and the browser laying all of it out. Starting the timeline here put
         the nuts' drift straight into that, and the first second of it dropped
         frames every time.

         Two rAFs is the cheapest way to say "after the commit has been laid
         out and painted once". It costs about 30ms of black nobody can
         distinguish from the 250ms of black that follows it by design, and the
         nuts get a clean main thread to drift in.

         startedAt is set here rather than at effect time for the same reason:
         it is the counter's clock, and it has to agree with the timeline's. */
      const begin = () => {
        raf = 0
        startedAt = performance.now()
        tl?.play()
        ticker = tick
        gsap.ticker.add(tick)
      }
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(begin)
      })
    }, rootRef)

    return () => {
      /* gsap.context does not own ticker callbacks, so this has to come off by
         hand or a StrictMode remount leaves two of them writing the counter. */
      if (ticker) gsap.ticker.remove(ticker)
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(bail)
      images.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
      ctx.revert()
      unlock()
    }
  }, [onUnveil, onReveal, onDone])

  return (
    <div ref={rootRef} className="intro-root" role="status" aria-label="Loading coffeelo">
      <div className="intro-nuts" aria-hidden="true">
        {NUTS.map((nut, i) => (
          <span key={`nut-${i}`} className="intro-nut" style={{ top: nut.top, left: nut.left }}>
            {/* Two elements, two writers: GSAP drives the entrance and exit on
                the wrapper above, the hero's existing float keyframes drive the
                idle drift in here. Neither ever touches the other's transform.

                The depth blur goes on the image itself, not on either of them.
                A filter on an element that is being transformed every frame has
                to be re-rasterised every frame; on the image it is rasterised
                once and the two transforms above just composite the result. */}
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
              <Bean
                size={nut.size}
                image={NUT_IMAGES[i % NUT_IMAGES.length]}
                style={nut.blur ? { filter: `blur(${nut.blur}px)` } : undefined}
              />
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
