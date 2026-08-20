import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
 * happens well inside the pin. The destination stays live, which is what lets
 * the same code land the cup on a two-column desktop grid and a stacked mobile
 * one with no breakpoint-specific maths anywhere.
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
      // The wrapper, not .hero-bean-plane: see the note at the top of this
      // file and the one above FloatingBeans.jsx.
      const beanPlanes = heroTrack.querySelectorAll('.hero-bean-parallax')
      const base = heroTrack.querySelector('.hero-base')
      if (!viewport || !cups || !probe || !creamRise) return undefined

      const layer = transferRefs.layer.current
      const cup = transferRefs.cup.current
      const tilt = transferRefs.tilt.current
      if (!layer || !cup || !tilt || !transferRefs.crop.current) return undefined

      // Frozen source box, in viewport coordinates as of the last refresh.
      const src = { x: 0, y: 0, w: 0, ready: false }
      const flight = { t: 0 }
      // Which .hero-cup element is currently making the trip. Mutable rather
      // than a value closed over at timeline-build time, because the swap
      // tween below is built once but has to hide whichever cup turns out to
      // be active whenever the flight actually arms.
      const activeCupElRef = { current: null }

      const measure = () => {
        src.ready = false

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
      }

      const paint = (t) => {
        if (!src.ready) return
        const slotImg = slotRefs.image.current
        if (!slotImg) return

        // One rect read, before any write, so the frame costs a single layout.
        const to = slotImg.getBoundingClientRect()
        if (!to.width) return

        const x = src.x + (to.left - src.x) * t
        const y = src.y + (to.top - src.y) * t
        const s = (src.w + (to.width - src.w) * t) / src.w

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
      const swap = { v: 1 }
      const clip = { v: 1 }

      // The hero dissolves. Cream first, because the rising curve is what the
      // rest of the exit reads against.
      // -50 of a 200svh slab is one viewport of travel. See .hero-cream-rise.
      tl.fromTo(creamRise, { yPercent: 0 }, { yPercent: -50, duration: 0.34 }, 0)

      // Opposing motion: the hero's own content rises while the active cup is
      // about to fall. yPercent rather than a px or vh amount, so the distance
      // is relative to each element's own box — which is already the thing
      // the --word-h / bean-plane sizing tunes per breakpoint — instead of a
      // second, disconnected distance this file would have to keep in sync.
      if (wordmark) {
        tl.fromTo(
          wordmark,
          { yPercent: 0, autoAlpha: 1 },
          { yPercent: -70, autoAlpha: 0, duration: 0.32 },
          0.02,
        )
      }
      // Layered by depth, same values FloatingBeans already uses for its own
      // pointer parallax (far 0.45, near 1), read off the wrapper rather than
      // duplicated here, so the two can't drift apart. No fade: beans are
      // meant to drift through the scene and clip against the viewport edge
      // as they go, never blink out.
      if (beanPlanes.length) {
        tl.fromTo(
          beanPlanes,
          { y: 0 },
          {
            y: (_i, target) => -80 * parseFloat(target.dataset.depth || '1'),
            duration: 0.4,
          },
          0,
        )
      }
      if (base) {
        tl.fromTo(base, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.18 }, 0.1)
      }

      // The swap, in three ordered beats. The overlay appears while the hero
      // cup is still there and still exactly beneath it, then that one cup
      // (never its neighbours, never the container) goes out, and only after
      // that does the flight start moving. Overlapping them the other way
      // round would put two copies of the cup on screen in two different
      // places.
      tl.fromTo(layer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, 0.14)
      tl.fromTo(
        swap,
        { v: 1 },
        {
          v: 0,
          duration: 0.001,
          onUpdate: () => activeCupElRef.current?.style.setProperty('--cup-swap', swap.v.toFixed(4)),
        },
        0.19,
      )

      // The flight. A proxy tween rather than reading the timeline's own
      // progress, so it can carry its own ease and its own sub-range.
      tl.fromTo(
        flight,
        { t: 0 },
        { t: 1, duration: 0.72, ease: 'power2.inOut', onUpdate: () => paint(flight.t) },
        0.2,
      )

      // The cup arrives at 0.92, but the showcase's sticky pin does not engage
      // until 1.0, so for that last stretch the destination is still scrolling
      // upward. Without something to keep repainting, the cup would sit frozen
      // in viewport coordinates and visibly drift off the slot by 4% of the
      // flight length, which is 69px on a 1080p screen. This holds it glued.
      const hold = { v: 0 }
      tl.fromTo(
        hold,
        { v: 0 },
        { v: 1, duration: 0.08, onUpdate: () => paint(1) },
        0.92,
      )
      // Release the crop that was hiding the cup's base behind the cream arc,
      // as the cup lifts clear of it.
      const cropEl = transferRefs.crop.current
      tl.fromTo(
        clip,
        { v: 1 },
        {
          v: 0,
          duration: 0.1,
          onUpdate: () => cropEl.style.setProperty('--cup-clip', clip.v.toFixed(4)),
        },
        0.2,
      )
      // A contact shadow on an airborne cup reads as a mistake.
      if (transferRefs.shadow.current) {
        tl.fromTo(transferRefs.shadow.current, { opacity: 1 }, { opacity: 0, duration: 0.24 }, 0.2)
      }

      // The showcase writes itself while the cup is still arriving.
      const copyItems = copyRef.current?.children
      if (copyItems?.length) {
        tl.fromTo(
          copyItems,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
            stagger: 0.05,
          },
          0.55,
        )
      }

      // Hand back to the real image, then stand the overlay down.
      if (slotRefs.image.current) {
        tl.fromTo(slotRefs.image.current, { opacity: 0 }, { opacity: 1, duration: 0.02 }, 0.9)
      }
      if (slotRefs.shadow.current) {
        tl.fromTo(slotRefs.shadow.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.88)
      }
      // immediateRender: false so this second write to the layer does not stomp
      // the show tween's from-state while the timeline is being built.
      tl.fromTo(
        layer,
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 0.001, immediateRender: false },
        1,
      )

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
        // matchMedia reverts what GSAP animated; these are hand-written and so
        // are ours to undo, or a StrictMode remount leaves a cup hidden.
        cups
          .querySelectorAll('.hero-cup')
          .forEach((el) => el.style.removeProperty('--cup-swap'))
        cropEl.style.removeProperty('--cup-clip')
        cup.style.removeProperty('transform')
        tilt.style.removeProperty('transform')
      }
    })

    return () => mm.revert()
  }, [heroTrackRef, trackRef, transferRefs, slotRefs, copyRef, lockedRef, resolveActive])
}
