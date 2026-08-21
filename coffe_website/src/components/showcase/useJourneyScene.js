import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import createCardCopyReveal from './cardCopyReveal'

gsap.registerPlugin(ScrollTrigger)

/** How far the cup rocks, in degrees, at the midpoint of a leg. */
const TILT_MAX = 3.6

/**
 * How far into a leg the cup becomes the next drink — one frame, no blend.
 *
 * A crossfade was the obvious thing and it was wrong. Two photos at half
 * opacity are not one translucent cup, they are two cups: the drinks are
 * different colours and the cutouts are different widths, so every frame of the
 * fade showed a doubled edge and a doubled straw. Worse, scrubbing it meant that
 * doubling was tied to the scroll wheel — hold still in the middle of the fade
 * and it just sat there, two cups deep.
 *
 * So the swap is a cut, taken at the halfway mark, where the cup is at the top
 * of its arc travelling at its fastest and the eye is least able to fix on it.
 * Exactly one photo is visible on every frame of the journey.
 */
const SWITCH_AT = 0.5

/**
 * The ease on the axis you can watch it happen on.
 *
 * Only the horizontal is eased. The vertical is deliberately linear, and that
 * is what makes the landings settle instead of swim: both cards move at page
 * speed for the whole leg, and the vertical distance between two slots is one
 * viewport — the same viewport the page scrolls through while the cup crosses
 * it. Interpolate that linearly and the two cancel exactly, so the cup holds a
 * level line across the screen. Ease it and they stop cancelling: the cup lags
 * behind the page early, dives below its own line in the second half, then has
 * to climb back into the slot from underneath. That climb was the unsteady
 * landing.
 *
 * The horizontal has no such coupling — nothing on the page moves sideways — so
 * it takes the ease, and since the whole traverse reads as left-to-right, that
 * is where the ease is legible anyway.
 */
const glide = gsap.parseEase('power2.inOut')

/**
 * Centre-x, top and height of an element, in viewport coordinates.
 *
 * Centre rather than left because consecutive stops show different photos:
 * every slot renders at the same height and takes its width from its own
 * aspect ratio, so the axis the cups share is the vertical one through their
 * middle, not their left edge.
 */
function boxOf(el) {
  const r = el.getBoundingClientRect()
  return { cx: r.left + r.width / 2, top: r.top, h: r.height }
}

/**
 * The rest of the cup's journey: showcase → green card → brown card.
 *
 * useTransferScene flies the cup out of the hero and lands it in the showcase.
 * This picks it up from there and carries it down through the two spotlight
 * cards, one leg per card, and puts it down for good in the last one.
 *
 * ── It does not touch the hero leg ────────────────────────────────────────
 * Nothing here writes anything at all until the cup has already arrived in the
 * showcase and started to leave it again — see the `total` gate in paint().
 * That is deliberate and load bearing, not a micro-optimisation. Both scenes
 * drive the same overlay element, and both are rendered by ScrollTrigger at
 * whatever progress the scroll position implies, including at page load and on
 * every refresh. Without the gate, this scene's own idea of "leg not started
 * yet" gets written over the hero flight while it is in mid-air — which is
 * what put a second, half-faded cup on top of the first one.
 *
 * ── Why the boxes are live here and frozen there ──────────────────────────
 * The hero leg has to freeze its source, because the hero stops being pinned
 * half way through the flight and a cup lerped toward a live anchor that is
 * leaving through the top of the screen bends its path the wrong way. Nothing
 * of the sort happens down here: each leg ends on the frame its destination
 * card pins, so the last thing the lerp aims at is a box that has stopped
 * moving, and a live-to-live read is both safe and the only thing that is
 * right. It is what lets the cup sit perfectly still in a pinned card without
 * this file knowing anything about the pin, and it needs no measuring pass and
 * no breakpoint-specific numbers: the cup lands correctly on the two-column
 * desktop grid and on the stacked mobile one, and a card that changed height
 * because its copy rewrapped is simply where it now is.
 *
 * ── Where the legs start and end, and where the rests come from ───────────
 * Every one of these sections is built like the showcase: a track one viewport
 * tall plus a pin, with a sticky panel inside it. A leg runs from `top bottom`
 * on its destination section (that panel's first pixel on screen) to `top top`
 * (the frame it pins), so:
 *
 *   · the cup leaves a card on the exact frame that card starts to scroll away
 *   · it arrives on the exact frame the next card pins
 *   · it then sits dead still for that card's whole --spotlight-pin, because
 *     t is 1 and the box it is pinned to has stopped moving
 *
 * The sections butt against each other, so one card's pin ending is the next
 * leg's start with nothing in between, and the showcase's own sticky range ends
 * on the frame the first of these begins. Those seams are not tuned constants,
 * they fall out of the layout — which is why the pin lengths in index.css can
 * be changed freely and the timing follows.
 *
 * ── The empty slots, and why nothing ever hands back ──────────────────────
 * Every card stands with an empty slot, permanently. The images are still
 * there, still laid out, still measured — they are the targets the legs aim at
 * — but every one of them is held at opacity 0 for the life of the page, and
 * the cup the viewer sees in any card is always the overlay. Hiding rather than
 * removing, for the same reason the showcase does it: display: none reports a
 * zero box and would land the cup in the top left corner.
 *
 * Each landing used to cross-cut from the overlay to the card's real image, on
 * the grounds that the two boxes are identical at that instant. They are
 * identical to about half a pixel, and half a pixel across a hard cut is a
 * visible shudder — worse under a scrubbed playhead, which can park mid-cut and
 * leave both cups on screen at half opacity a hair apart. Every one of those
 * swaps is gone. The overlay arrives and simply stops, which is exactly what
 * the middle card always did, and it was the only landing that ever looked
 * right. See the exit below for how it leaves at the end instead.
 *
 * Under prefers-reduced-motion this whole scene is never built, so those images
 * are never hidden and all three cards simply render their own product.
 */
export default function useJourneyScene({ transferRefs, legs }) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const layerEl = transferRefs.layer.current
      const cupEl = transferRefs.cup.current
      const tiltEl = transferRefs.tilt.current
      const cropEl = transferRefs.crop.current
      const shadowEl = transferRefs.shadow.current
      if (!layerEl || !cupEl || !tiltEl || !cropEl) return undefined

      // Every stop stands empty, for good. The overlay is the only cup on the
      // page from the moment the hero hands it over until it rides off the
      // bottom of the last card, and no slot image is ever lit — see the note
      // about the handback in useTransferScene. gsap.set inside a matchMedia
      // context is reverted with it, so nothing here leaks into a reduced-motion
      // switch or a StrictMode remount.
      const resting = legs.flatMap((leg) => [leg.to.image.current, leg.to.shadow.current])
      gsap.set(resting.filter(Boolean), { opacity: 0 })

      // The overlay's own laid-out size, unscaled, shared by every painter
      // below — they all drive the one element. offsetWidth/Height see through
      // the transforms the flight writes, and both only change with --cup-h,
      // which is a viewport unit, so this is a refresh-time read.
      const box = { w: 0, h: 0 }
      const measure = () => {
        box.w = cropEl.offsetWidth
        box.h = cropEl.offsetHeight
      }

      /**
       * Put the cup on a box, at the one scale that makes it that box.
       *
       * Every painter ends here, which is what makes the seams between them
       * invisible: a leg finishing at t = 1 and the exit tracker picking the
       * same slot up afterwards produce the same string, to the last decimal,
       * so the handover between two different ScrollTriggers cannot show.
       */
      const place = (b) => {
        const s = b.h / box.h
        cupEl.style.transform =
          `translate3d(${(b.cx - (box.w * s) / 2).toFixed(2)}px, ${b.top.toFixed(2)}px, 0) ` +
          `scale(${s.toFixed(5)})`
      }

      // One flight value per leg, all of them readable from any leg's painter.
      // The drink the cup is wearing is a property of the journey as a whole,
      // not of one leg — see paintSkins.
      const states = legs.map(() => ({ t: 0 }))

      // Which overlay photos have been written to, recorded as they are written
      // rather than read back off the refs at teardown, because the one in
      // normal flow can change identity with the carousel and cleanup has to
      // undo the element it really touched.
      const morphed = new Set()

      // The photos the cup wears, in the order it wears them: the one that flew
      // out of the hero, then one per stop. A stop whose product *is* the flown
      // one has no separate image mounted, so it falls back to that one — and
      // because the writer below merges by element, a photo standing in for two
      // stops keeps the higher of the two opacities instead of the later one.
      const skinAt = (k) =>
        (k === 0 ? null : transferRefs.byId[legs[k - 1].toId]?.current) ??
        transferRefs.image.current

      /**
       * Show exactly one drink, from one number for the whole journey.
       *
       * Counting how many legs have passed their halfway mark gives a single
       * index — 0 is the flown product, 1 is the first stop's, 2 is the
       * second's — and every photo but that one is hard off. Two independent
       * scrub timelines therefore cannot disagree about which is showing: each
       * leg paints all of them, and whichever leg the scroll is in, the answer
       * comes out the same.
       *
       * Driven from t rather than from tweens of its own so it is a pure
       * function of where the cup is: it reverses with the scrub for free, it
       * cannot be left half applied by a refresh landing mid-flight, and it
       * reads the elements fresh every frame so a re-render that changes which
       * photo is in normal flow cannot leave it writing to a detached node.
       */
      const paintSkins = () => {
        let at = 0
        for (const state of states) if (state.t >= SWITCH_AT) at += 1

        // Merged by element and taking the higher value, so a photo standing in
        // for two stops — which happens when a stop's product is the one that
        // flew, and no separate image is mounted for it — is not switched off by
        // the index it is not currently serving.
        const alpha = new Map()
        for (let k = 0; k <= legs.length; k += 1) {
          const el = skinAt(k)
          if (!el) continue
          alpha.set(el, Math.max(alpha.get(el) ?? 0, k === at ? 1 : 0))
        }

        alpha.forEach((a, el) => {
          el.style.opacity = String(a)
          morphed.add(el)
        })
      }

      const built = legs
        .map((leg, i) => {
          const root = leg.to.root.current
          const fromImg = leg.from.image.current
          const toImg = leg.to.image.current
          if (!root || !fromImg || !toImg) return null

          const state = states[i]

          const paint = () => {
            // Zero until the WebP decodes. Painting on it would divide by zero
            // and write NaN into the transform; the decode refresh in
            // useTransferScene invites us back.
            if (!box.w || !box.h) return

            // Hands off entirely until this journey has actually begun. Above
            // this point the overlay belongs to the hero flight; see the note
            // at the top of this file about the cup that got painted twice.
            let total = 0
            for (const s of states) total += s.t
            if (total <= 0) return

            const a = boxOf(fromImg)
            const b = boxOf(toImg)
            // Raw scroll fraction. The tween below is linear on purpose — the
            // ease is applied here, to one axis only. See the note on `glide`.
            const t = state.t

            place({
              cx: a.cx + (b.cx - a.cx) * glide(t),
              top: a.top + (b.top - a.top) * t,
              h: a.h + (b.h - a.h) * t,
            })

            // Leans into the direction of travel, and sin is exactly 0 at both
            // ends, so the cup leaves and lands upright however the curve in
            // between is tuned.
            const swing = Math.sin(Math.PI * t)
            const dir = b.cx < a.cx ? -1 : 1
            tiltEl.style.transform = `rotate(${(dir * TILT_MAX * swing).toFixed(3)}deg)`

            // Contact shadow belongs to a cup that is standing on something.
            // Full while it rests in a card, gone at the top of the arc.
            if (shadowEl) shadowEl.style.opacity = (1 - swing).toFixed(3)

            paintSkins()
          }

          // ⚠ Same rule as useTransferScene: every tween is a fromTo with both
          // ends written out. A plain `to` infers its start from the live DOM
          // the first time it renders, and a ScrollTrigger.refresh from a font
          // load or an image decode can land while the user is already inside a
          // leg — which would record the mid-flight state as the original and
          // make scrolling back up restore the wrong thing.
          const tl = gsap.timeline({ defaults: { ease: 'none' } })

          // The flight, spanning the whole leg. Linear here and eased inside
          // paint(), because the two axes need different curves — see `glide`.
          // The scrub is what makes the motion itself smooth: this tween is
          // scroll position, and ScrollTrigger eases the playhead toward it
          // over 0.6s, so the cup keeps moving with the wheel rather than
          // snapping to it.
          tl.fromTo(state, { t: 0 }, { t: 1, duration: 1, onUpdate: paint }, 0)

          // Nothing to stand up and nothing to put away at either end of a leg
          // any more. The overlay was already flying when this leg started and
          // is still flying when it finishes, and no slot image is ever lit, so
          // a leg is now purely a move: the flight, and the copy that arrives
          // with it.

          // The copy assembles once the cup has landed, over the first half of
          // this card's pin — its own trigger, starting on the frame this leg
          // ends. Keeping it out of the flight's timeline is what lets that
          // timeline stay exactly one unit long, which is the whole basis of
          // the landing; see cardCopyReveal.
          const copyReveal = createCardCopyReveal({ root, copy: leg.to.copy.current })

          const st = ScrollTrigger.create({
            // The section, not the panel inside it: the panel is sticky, and
            // ScrollTrigger reads a trigger's position off the DOM at refresh
            // time, so a sticky element would report wherever it happened to be
            // stuck rather than where it lives in the document.
            trigger: root,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.6,
            invalidateOnRefresh: true,
            animation: tl,
            // Re-render forced, not just re-measured. A resize changes --cup-h
            // and every card's geometry at once, and a timeline parked at its
            // end will not re-run its own onUpdate for a playhead that has not
            // moved — so without the force, the cup keeps the transform it was
            // given for the old layout and sits off its slot until the next
            // scroll nudges it.
            onRefresh: () => {
              measure()
              tl.render(tl.time(), false, true)
            },
          })

          return { st, tl, copyReveal }
        })
        .filter(Boolean)

      // ── The exit ────────────────────────────────────────────────────────
      // The cup never becomes a real image, so it has to leave the last card
      // the way a real one would: glued to that card as it scrolls off, then
      // taken down once it is past the top of the screen where nobody can see
      // it go.
      //
      // Deliberately not scrubbed, and deliberately not started until the last
      // card *unpins* rather than when it pins. Not scrubbed because a scrubbed
      // follow lags the wheel by 0.6s, and a cup that lags the card it is
      // standing in slides around inside it. Started at the unpin because that
      // is a pin's width of scroll after the last leg ends — far enough that the
      // leg's own scrub has long finished catching up, so the two painters can
      // never be writing the same element on the same frame and fighting over
      // it. Between the two there is nothing to do: the card is pinned, so the
      // cup is already in the right place and simply stays there.
      const finalStop = legs[legs.length - 1].to
      const exitRoot = finalStop.root.current
      const exitImg = finalStop.image.current
      let exitSt = null

      if (exitRoot && exitImg) {
        // `sure` means the caller knows the cup belongs on the last slot — it
        // is inside the exit range, or has just scrolled back into it. Only
        // onRefresh is unsure, because a refresh fires wherever the reader
        // happens to be, including at the top of the page in the middle of the
        // hero's own flight. Refreshes run in scroll order, so this is the last
        // painter to write on one, and without the check it would stomp the
        // hero's placement and throw the cup down the page until the next
        // scroll event corrected it. Checking against the last leg's own
        // progress rather than an exact 1, since an interrupted scrub can settle
        // a rounding error short of its target.
        const paintExit = (sure) => {
          if (!box.w || !box.h) return
          if (!sure && states[states.length - 1].t < 0.99) return
          place(boxOf(exitImg))
        }

        exitSt = ScrollTrigger.create({
          trigger: exitRoot,
          start: 'bottom bottom',
          end: 'bottom top',
          onUpdate: () => paintExit(true),
          onRefresh: () => paintExit(false),
          // Off the moment the card is fully above the fold, back on the moment
          // any of it returns — and placed before it is shown, so it can never
          // appear for a frame at wherever it was last left. gsap.set rather
          // than a tween so it is exact, and so matchMedia reverts it.
          onLeave: () => gsap.set(layerEl, { autoAlpha: 0 }),
          onEnterBack: () => {
            paintExit(true)
            gsap.set(layerEl, { autoAlpha: 1 })
          },
        })
      }

      measure()

      return () => {
        exitSt?.kill()
        built.forEach(({ st, tl, copyReveal }) => {
          st.kill()
          tl.kill()
          copyReveal?.st.kill()
          copyReveal?.tl.kill()
        })
        // matchMedia reverts what GSAP animated; the styles paint() writes by
        // hand are ours to undo, or a StrictMode remount leaves the cup tilted
        // and wearing the wrong product.
        cupEl.style.removeProperty('transform')
        tiltEl.style.removeProperty('transform')
        shadowEl?.style.removeProperty('opacity')
        morphed.forEach((el) => el.style.removeProperty('opacity'))
        morphed.clear()
      }
    })

    return () => mm.revert()
  }, [transferRefs, legs])
}
