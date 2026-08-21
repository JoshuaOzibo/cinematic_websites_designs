import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import createCardCopyReveal from './cardCopyReveal'

gsap.registerPlugin(ScrollTrigger)

// iOS collapses and expands its toolbar mid-scroll, which changes
// window.innerHeight by 60 to 100px. Without this, ScrollTrigger treats that as
// a resize and refreshes in the middle of the flight, teleporting the cup.
ScrollTrigger.config({ ignoreMobileResize: true })

/** How far the cup rocks, in degrees, at the midpoint of its flight. */
const TILT_MAX = -4

/**
 * Distance from an element to a positioned ancestor, in layout pixels.
 *
 * getBoundingClientRect would be simpler but it includes transforms, and every
 * cup is mid-transform at all times. offsetLeft/offsetTop see through them to
 * the laid-out box, which is what the flight needs to start from.
 */
function offsetWithin(el, ancestor) {
  let x = 0
  let y = 0
  let node = el
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
  }
  return { x, y }
}

/**
 * The hero-to-showcase handoff: one scrubbed scene spanning two sections.
 *
 * ── Why the source box is frozen ──────────────────────────────────────────
 * The obvious implementation lerps between two live getBoundingClientRect
 * calls. That fails here, because for the second half of the scene the hero is
 * no longer pinned: it is scrolling up at page speed. A cup weighted 70% to an
 * anchor that is leaving through the top of the screen rises first and then has
 * to come back down into the slot, so the flight path bends the wrong way and
 * the product reads as being dragged rather than handed over.
 *
 * Instead the source is measured once per refresh, in layout coordinates, and
 * held. It is valid because .hero-viewport is `sticky; top: 0`, so while the
 * hero is pinned its layout offsets *are* viewport coordinates, and the swap
 * happens well inside the pin.
 *
 * The destination is the other way round twice over: frozen where the cup is
 * far from it, live where it is closing on it. Both halves of that are there to
 * fix a specific artefact — see the note on paint(), which is where the two are
 * blended. Between them, the flight needs no breakpoint-specific maths: the
 * same code lands the cup on the two-column desktop grid and the stacked mobile
 * one because it aims at wherever the slot has laid itself out.
 *
 * ── Why the pin is CSS, not ScrollTrigger ─────────────────────────────────
 * See the note in Showcase.jsx.
 *
 * ── What this may not touch ───────────────────────────────────────────────
 * Never write transform, opacity, zIndex or filter directly on a .hero-cup.
 * CoffeeCarousel rewrites all four on every scroll event and would overwrite
 * any tween within a frame. The one exception is --cup-swap, a custom
 * property CoffeeCarousel reads but never writes, set here on exactly the
 * active cup at the instant its overlay takes over. Never .hero-bean-plane
 * either, for the same reason: FloatingBeans owns its transform. The upward
 * bean parallax below animates .hero-bean-parallax, one layer out, instead.
 *
 * ── Only the active cup moves ─────────────────────────────────────────────
 * The two side cups are never referenced by this file at all: no tween, no
 * property, nothing. CoffeeCarousel's own positioning already holds them
 * still for the whole handoff (the carousel position is clamped at `steps`
 * throughout), so leaving them alone is what keeps them "stationary" rather
 * than something this scene has to enforce.
 *
 * Holding still is not the same as staying put on screen, though. The cream
 * tween below is what actually retires them: they sit at z-index 20, the
 * cream slab at 25, so the rise passes in front of them and they are covered
 * a few hundred pixels of scroll before .hero-viewport reaches the end of its
 * sticky range and starts scrolling away. That ordering only works because
 * .hero-cups has no z-index of its own — see the note above it in index.css.
 * Give .hero-cups a z-index and it becomes a stacking context, the cream can
 * no longer come between the two cup layers, and the side cups ride visibly
 * up the screen at the tail of this scene.
 */
export default function useTransferScene({
  heroTrackRef,
  trackRef,
  transferRefs,
  slotRefs,
  copyRef,
  lockedRef,
  resolveActive,
}) {
  useLayoutEffect(() => {
    const heroTrack = heroTrackRef.current
    const track = trackRef.current
    if (!heroTrack || !track) return undefined

    const mm = gsap.matchMedia()

    // Reduced motion gets no scene at all. The stylesheet collapses both scroll
    // tracks to zero and leaves the showcase image visible, so the two sections
    // simply scroll past one another. gsap.matchMedia re-runs this if the user
    // changes the setting while the page is open.
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const viewport = heroTrack.querySelector('.hero-viewport')
      const cups = heroTrack.querySelector('.hero-cups')
      const probe = heroTrack.querySelector('.hero-handoff-probe')
      const creamRise = heroTrack.querySelector('.hero-cream-rise')
      const wordmark = heroTrack.querySelector('.hero-wordmark')
      const panel = heroTrack.querySelector('.hero-panel')
      const panelInner = heroTrack.querySelector('.hero-panel-inner')
      // The wrapper, not .hero-bean-plane: see the note at the top of this
      // file and the one above FloatingBeans.jsx.
      const beanPlanes = heroTrack.querySelectorAll('.hero-bean-parallax')
      if (!viewport || !cups || !probe || !creamRise) return undefined

      const layer = transferRefs.layer.current
      const cup = transferRefs.cup.current
      const tilt = transferRefs.tilt.current
      if (!layer || !cup || !tilt || !transferRefs.crop.current) return undefined

      const showcaseViewport = track.querySelector('.showcase-viewport')
      if (!showcaseViewport) return undefined

      // Frozen source box, in viewport coordinates as of the last refresh.
      const src = { x: 0, y: 0, w: 0, ready: false }
      // Frozen destination box, same coordinate space. See measure().
      const dst = { x: 0, y: 0, w: 0, ready: false }
      const flight = { t: 0 }
      // Which .hero-cup element is currently making the trip. Mutable rather
      // than a value closed over at timeline-build time, because the swap
      // tween below is built once but has to hide whichever cup turns out to
      // be active whenever the flight actually arms.
      const activeCupElRef = { current: null }

      // The hero cup's half of the overlay handover, 1 visible → 0 hidden.
      // Declared up here rather than beside the tween that drives it because
      // measure() has to be able to re-publish it; see applySwap below.
      const swap = { v: 1 }

      // Single writer for --cup-swap. Publishing through one function is what
      // keeps the tween and measure() from disagreeing about which cup is
      // hidden and how far.
      const applySwap = () =>
        activeCupElRef.current?.style.setProperty('--cup-swap', swap.v.toFixed(4))

      const measure = () => {
        src.ready = false
        dst.ready = false

        // Where the slot will sit once .showcase-viewport is pinned. Measured
        // in layout coordinates for the same reason the source is: while that
        // sticky viewport is at top: 0 its layout offsets *are* viewport
        // coordinates, and the flight ends on the frame it pins.
        //
        // Deliberately not the slot's live getBoundingClientRect. Reading it
        // live is what made the cup dive: at the start of the scene the slot is
        // still most of a viewport *below* the fold, so lerping toward it drove
        // the cup down past the bottom of the screen before the showcase
        // scrolled up far enough to pull it back. The path bent through a
        // trough, the cup spent the middle of the flight half cropped by the
        // viewport edge, and the screen it left behind read as empty.
        const slotImg = slotRefs.image.current
        if (!slotImg) return
        const dw = slotImg.offsetWidth
        if (!dw) return
        const to = offsetWithin(slotImg, showcaseViewport)
        dst.x = to.x
        dst.y = to.y
        dst.w = dw
        dst.ready = true

        // Re-resolve first, forcing past the latch: measure only ever runs at a
        // flight boundary, which is exactly where the product should be pinned
        // down. Reading the settled target here rather than trusting the last
        // subscription tick is what stops a scroll restore from measuring one
        // cup and flying another.
        const index = resolveActive(true)
        const cupEls = cups.querySelectorAll('.hero-cup')
        const cupEl = cupEls[index]
        const heroImg = cupEl?.querySelector('.hero-cup-img')
        if (!cupEl || !heroImg) return

        // Reads 0 until the WebP decodes. Painting on a zero width divides by
        // zero and writes NaN into every transform, so bail and wait for the
        // decode refresh below.
        const w = heroImg.offsetWidth
        if (!w) return

        // Deliberately not measured off the overlay image. resolveActive above
        // can have just queued a React render, so the overlay may still be
        // showing the previous product for one more frame, and the three photos
        // are not the same aspect ratio. It does not need measuring anyway: the
        // overlay is the same photo under the same `calc(var(--cup-h) * factor)`
        // rule as the hero cup, and --cup-h is on :root precisely so the
        // portaled layer resolves it identically. Its natural width *is* w.
        const { x, y } = offsetWithin(cupEl, viewport)
        // .hero-cup sits at left: 50% and carries its own -50% inside the
        // transform CoffeeCarousel writes, so the painted left edge is half a
        // cup further left than the laid-out box.
        src.x = x - w / 2
        src.y = y
        src.w = w
        src.ready = true

        // Reset every cup's swap opacity to visible first. A cup that was
        // active on a previous pass through this scene, with a different
        // product centred, must not be left hidden if it is not the one
        // travelling this time.
        cupEls.forEach((el) => el.style.removeProperty('--cup-swap'))
        activeCupElRef.current = cupEl

        // Then immediately re-publish whatever the timeline is currently
        // holding. The reset above is only meant to clear *stale* cups, but on
        // its own it also wipes the live one: measure() runs from arm(), and
        // arm() runs on onRefresh as well as on enter. The swap tween is
        // duration 0.001, so its onUpdate will not fire again unless the scrub
        // happens to cross that sliver — meaning a ScrollTrigger.refresh()
        // landing mid-flight (the fonts.ready and img.decode refreshes at the
        // bottom of this file, or any resize) would leave the hero cup at full
        // opacity underneath the travelling overlay, and the product renders in
        // two places until the timeline next crosses 0.15.
        applySwap()
      }

      /**
       * ── Why the destination is frozen early and live late ────────────────
       * A frozen destination is what stops the cup diving: at the start of the
       * scene the slot is most of a viewport below the fold, and a cup lerped
       * toward it goes down before it comes up (see measure()). But a
       * destination that is frozen all the way through has its own tell at the
       * other end. The showcase card rises at page speed right up to the frame
       * it pins, while power2.inOut brings the cup to a near halt before then —
       * so for the last stretch the cup hovers in place and the card slides up
       * behind it, arriving to collect it. That is the hang.
       *
       * So the aim moves from the frozen box to the live one as the cup closes,
       * on a cubic. Early on the live position barely counts, which keeps the
       * dive away; by the end the cup is tracking the card outright, matching
       * its speed, so the two come to rest together on the frame it pins. The
       * two boxes are the same box at that frame, so this changes neither end of
       * the flight — only how it gets there. The cubic keeps the middle honest
       * too: at the halfway point it pulls the cup about six pixels off the old
       * straight line, which is nothing, and the correction is all in the last
       * third where it is needed.
       */
      const paint = (t) => {
        if (!src.ready || !dst.ready) return

        const slotImg = slotRefs.image.current
        const liveY = slotImg ? slotImg.getBoundingClientRect().top : dst.y
        const lock = t * t * t
        const aimY = dst.y + (liveY - dst.y) * lock

        const x = src.x + (dst.x - src.x) * t
        const y = src.y + (aimY - src.y) * t
        const s = (src.w + (dst.w - src.w) * t) / src.w

        cup.style.transform =
          `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s.toFixed(5)})`
        // sin is exactly 0 at both ends, so the cup leaves and lands upright
        // however the curve in between is tuned.
        tilt.style.transform = `rotate(${(TILT_MAX * Math.sin(Math.PI * t)).toFixed(3)}deg)`
      }

      const tl = gsap.timeline({ defaults: { ease: 'none' } })

      // ⚠ Every tween here is a fromTo with both ends written out, and none is
      // a plain `to` or `set`. Those infer their start value from the live DOM
      // the first time they render, and this timeline does not always first
      // render at progress 0: a ScrollTrigger.refresh from the webfont load or
      // an image decode can land while the user is already inside the scene.
      // When that happens an inferred `to` records the already-faded state as
      // the original, and scrolling back up restores the hero to *hidden*.
      // Explicit from values cost nothing and make the scene reversible no
      // matter when it is first rendered.
      //
      // Custom properties go through proxy objects rather than being handed to
      // GSAP as `--name` targets, for the same reason plus one more: GSAP would
      // have to round-trip them through getComputedStyle and infer they are
      // numbers. A proxy plus setProperty is unambiguous.

      // The hero dissolves. Cream rises across the transition to swallow the hero.
      tl.fromTo(creamRise, { yPercent: 0 }, { yPercent: -50, duration: 0.7, ease: 'power1.inOut' }, 0)

      // Opposing motion: the hero's "COFFEE" typography moves UP out of the viewport
      // while the active coffee moves DOWN into the showcase.
      if (wordmark) {
        tl.fromTo(
          wordmark,
          { yPercent: 0, autoAlpha: 1 },
          { yPercent: -200, autoAlpha: 0, duration: 0.65, ease: 'power1.in' },
          0.02,
        )
      }

      // Layered depth parallax: floating beans move UPWARD through the hero.
      // Foreground beans move faster (-240px * 1 = -240px), background beans move slower (-240px * 0.45 = -108px).
      // They do not fade, remaining visible as they float up through the scene.
      if (beanPlanes.length) {
        tl.fromTo(
          beanPlanes,
          { y: 0 },
          {
            y: (_i, target) => -240 * parseFloat(target.dataset.depth || '1'),
            duration: 0.7,
            ease: 'power1.out',
          },
          0,
        )
      }

      // The hero panel leaves: the note, the three CTAs and the badge row slide
      // down and out through .hero-panel's clip, so the cup crosses an unbroken
      // field of cream instead of passing over a strip that is visibly still
      // the hero's.
      //
      // This scene is where that exit belongs, even though the panel is
      // BottomInfo's. The panel is a live caption on the carousel now — its
      // note changes with the centred product — so it has to survive the whole
      // ring and leave the moment the ring is finished with it. That moment is
      // this trigger's start, by construction: the scene arms on the frame the
      // carousel stops turning, with the last product settled and centred. So
      // "the panel goes off when the ring reaches its last product" and
      // "progress 0 of the handoff" are the same instant, and putting the tween
      // here means it is scrubbed by the same clock as everything else in the
      // flight rather than racing a second trigger to the same seam.
      //
      // Travel is the panel's own height, resolved on refresh, which is more
      // than enough to clear a box whose bottom edge is the bottom of the
      // screen. Fading it instead was tried and looked broken: a quarter of the
      // flight spent with the buttons hanging at 50% reads as a rendering
      // fault, where sliding them off the bottom of the window reads as content
      // leaving. power2.in over an eighth of the scene keeps it decisive.
      //
      // Nothing else writes y on this element — BottomInfo drives only the
      // notes inside it, and only their opacity and drift.
      if (panel && panelInner) {
        tl.fromTo(
          panelInner,
          { y: 0 },
          { y: () => panel.offsetHeight, duration: 0.12, ease: 'power2.in' },
          0,
        )
      }

      // The swap: overlay layer appears while hero active cup disappears.
      // Left and right side cups are untouched and stay in their hero positions (z-index 20, behind CreamRise).
      tl.fromTo(layer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, 0.12)
      tl.fromTo(
        swap,
        { v: 1 },
        { v: 0, duration: 0.001, onUpdate: applySwap },
        0.15,
      )

      // The flight: the active cup travels left and slightly up into the
      // showcase slot. It runs all the way to the end of the scene rather than
      // finishing early and holding, because t = 1 has to land on the exact
      // frame .showcase-viewport pins — that is the one moment the frozen
      // destination and the real slot's live position are the same box, and it
      // is where the overlay hands back below.
      tl.fromTo(
        flight,
        { t: 0 },
        { t: 1, duration: 0.85, ease: 'power2.inOut', onUpdate: () => paint(flight.t) },
        0.15,
      )

      // Contact shadow: off the ground for the flight, back under the cup as it
      // sets down. It has to come back now, because the overlay is what the
      // viewer keeps looking at after it lands — there is no real image
      // underneath waiting to supply its own shadow. See the handback note
      // below for why that changed.
      if (transferRefs.shadow.current) {
        tl.fromTo(transferRefs.shadow.current, { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0.15)
        tl.fromTo(
          transferRefs.shadow.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.22, ease: 'power2.out', immediateRender: false },
          0.78,
        )
      }

      // The showcase copy assembles on the right once the coffee has landed on
      // the left — blocks rising, headline word by word, across the first half
      // of this section's pin. Its own trigger rather than a tween in this
      // timeline, which is load bearing for the landing as much as for the
      // timing; see cardCopyReveal. Shared with the two cards below so all
      // three read the same.
      const copyReveal = createCardCopyReveal({ root: track, copy: copyRef.current })

      // ── There is no handback any more ────────────────────────────────────
      // This used to end by cross-cutting to the slot's real image and standing
      // the overlay down, both on the last frame. It was invisible in theory and
      // never quite invisible in practice, and it is gone.
      //
      // The theory said the two boxes are identical at progress 1, so the swap
      // costs nothing. They are identical to about half a pixel: the flight's
      // frozen destination comes from offsetLeft/offsetTop, which browsers round
      // to whole pixels, while the real image sits wherever a fractional grid
      // column puts it. Half a pixel of disagreement across a hard cut is a
      // visible shudder, and with a scrubbed playhead the cut is not always one
      // frame — park the wheel mid-swap and both cups sit there at half opacity,
      // a hair apart, which is the doubled cup that kept showing up.
      //
      // So the overlay simply stays. It is the cup for the whole journey now:
      // this flight, both flights below it in useJourneyScene, and the ride off
      // the bottom of the last card. Nothing is ever exchanged for anything, so
      // there is nothing left to misalign. What used to be the destination
      // image is held at opacity 0 from here on — still laid out, because the
      // flight and the legs below still measure it to know where to aim.
      gsap.set([slotRefs.image.current, slotRefs.shadow.current].filter(Boolean), { opacity: 0 })

      // Latch the active product for the whole flight and everything past it.
      // Without this, a trackpad overshoot at the seam flips the rounded
      // carousel index and swaps the product out from under the user mid-air.
      const setLock = (self) => {
        lockedRef.current = self.progress > 0
      }

      // Re-measuring as the flight arms is what keeps the source box honest.
      // The carousel can change which product is centred at any point before
      // this, and measure() both records that cup's geometry and points the
      // swap tween at it. Doing it here rather than on every index change is
      // enough, because the latch above means the product cannot change again
      // once we are past this point.
      const arm = (self) => {
        setLock(self)
        measure()
        paint(flight.t)
      }

      const st = ScrollTrigger.create({
        trigger: track,
        // The frame the carousel finishes turning: the showcase's top edge is
        // still one handoff-length below the fold, and the hero is pinned.
        start: () => `top bottom+=${probe.offsetHeight}`,
        // The frame the showcase's own sticky pin engages.
        end: 'top top',
        scrub: 0.6,
        invalidateOnRefresh: true,
        animation: tl,
        onEnter: arm,
        onEnterBack: arm,
        onRefresh: arm,
        onLeave: setLock,
        onLeaveBack: setLock,
      })

      // Fraunces and Anton load with display=swap. When they land, .hero-panel
      // reflows, which changes .hero-base's height, which moves the stage's
      // bottom edge and therefore every offset measured above.
      let fontsPending = true
      document.fonts?.ready.then(() => {
        if (fontsPending) ScrollTrigger.refresh()
      })

      // Same for the cup photos: measure() bails while they are still zero
      // width, so it has to be invited back once they decode.
      let decodePending = true
      const imgs = [transferRefs.image.current, slotRefs.image.current].filter(Boolean)
      Promise.all(imgs.map((img) => img.decode?.().catch(() => {}) ?? Promise.resolve())).then(
        () => {
          if (decodePending) ScrollTrigger.refresh()
        },
      )

      return () => {
        fontsPending = false
        decodePending = false
        st.kill()
        tl.kill()
        copyReveal?.st.kill()
        copyReveal?.tl.kill()
        // matchMedia reverts what GSAP animated; these are hand-written and so
        // are ours to undo, or a StrictMode remount leaves a cup hidden.
        cups
          .querySelectorAll('.hero-cup')
          .forEach((el) => el.style.removeProperty('--cup-swap'))
        cup.style.removeProperty('transform')
        tilt.style.removeProperty('transform')
      }
    })

    return () => mm.revert()
  }, [heroTrackRef, trackRef, transferRefs, slotRefs, copyRef, lockedRef, resolveActive])
}
