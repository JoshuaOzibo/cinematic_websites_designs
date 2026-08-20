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
      const heroBase = heroTrack.querySelector('.hero-base')
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

      // Both ends are frozen, so this is a straight line across the viewport
      // and costs no layout read at all — the whole flight is one transform
      // write per frame.
      const paint = (t) => {
        if (!src.ready || !dst.ready) return

        const x = src.x + (dst.x - src.x) * t
        const y = src.y + (dst.y - src.y) * t
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

      // .hero-base — the arc plus the cream panel under it carrying the intro
      // copy, the three CTAs and the badge row — retires as the flight arms, so
      // the cup crosses an unbroken field of cream instead of sliding over a
      // strip that is visibly still the hero's.
      //
      // Belt and braces rather than duplication: BottomInfo already slides that
      // copy out of .hero-panel's clip in the first couple of hundred pixels of
      // the page, so by the time this runs there is normally nothing left to
      // hide. Normally. That slide is a separate ScrollTrigger measured against
      // the panel's own height, and anything that leaves it short — a refresh
      // landing badly, a font reflow changing the height after the tween has
      // already resolved it — strands the buttons on screen for the rest of the
      // hero, which is exactly where they must not be. This does not care how
      // the panel got here; from the first frame of the scene it is gone.
      //
      // Two things keep it a clean cut rather than the half-transparent mess an
      // earlier version produced. power2.in holds the panel solid and then drops
      // it, over an eighth of the scene, instead of spending a quarter of the
      // flight at 50% and reading as a rendering fault. And it fades onto an
      // identical surface: .hero-cream-rise is parked directly underneath with
      // the same arc path in the same place and the same fill, so the curve does
      // not blink out — the rising copy of it simply becomes the one you are
      // looking at, and no frame of this shows hero background.
      //
      // Opacity only. BottomInfo owns `y` on .hero-panel-inner inside this box
      // and will keep writing it; the two never touch the same property.
      if (heroBase) {
        tl.fromTo(heroBase, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12, ease: 'power2.in' }, 0)
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

      // Contact shadow fade during flight.
      if (transferRefs.shadow.current) {
        tl.fromTo(transferRefs.shadow.current, { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0.15)
      }

      // The showcase copy reveals on the right as active coffee arrives on the left.
      const copyItems = copyRef.current?.children
      if (copyItems?.length) {
        tl.fromTo(
          copyItems,
          { autoAlpha: 0, y: 35 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            stagger: 0.06,
          },
          0.5,
        )
      }

      // Hand back to the real image, then stand the overlay down — both on the
      // last frame of the scene, not before it.
      //
      // The handback cannot be staggered ahead of the end any more. The overlay
      // now flies to where the slot will be *once pinned*, so for the run-in the
      // real slot is still below that point, sliding up to meet it. Fading the
      // real image in early would light it up while it is still short of its
      // resting place and put two cups on screen at different heights — the
      // same double image the swap at the hero end is careful to avoid. At
      // progress 1 the showcase has pinned, the two boxes are identical, and
      // the exchange is invisible.
      if (slotRefs.image.current) {
        tl.fromTo(slotRefs.image.current, { opacity: 0 }, { opacity: 1, duration: 0.001 }, 1)
      }
      if (slotRefs.shadow.current) {
        tl.fromTo(slotRefs.shadow.current, { opacity: 0 }, { opacity: 1, duration: 0.001 }, 1)
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
        cup.style.removeProperty('transform')
        tilt.style.removeProperty('transform')
      }
    })

    return () => mm.revert()
  }, [heroTrackRef, trackRef, transferRefs, slotRefs, copyRef, lockedRef, resolveActive])
}
