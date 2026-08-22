import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { REVEAL } from '../../revealTiming'

/* ── The hero's arrival ────────────────────────────────────────────────────
   Beans fall in from above, COFFEE rises out of its clip box, then the cups
   pop up off the cream. Order and offsets live in revealTiming.js.

   ── Armed, then played ────────────────────────────────────────────────────
   Two effects, deliberately. The curtain uncovers the page from the bottom, so
   the cups and beans are on screen well before the navbar's strip is — and the
   chain does not start until it is. Building the timeline at reveal time meant
   those elements sat there fully visible for a few hundred milliseconds and
   then snapped to their from-state to animate in, which is a visible flinch.

   So the timeline is *built* at `armed` (Intro's unveil cue, while the panel is
   still opaque) and only *played* at `ready`. Every tween here is a fromTo, and
   fromTo applies its from-values the moment it is created regardless of where
   it sits in the timeline, so arming is also what hides everything — behind a
   curtain, where no one can see it happen.

   ── What this is allowed to touch, and why the list is so specific ─────────
   Almost everything in the hero already has an owner that writes to it on
   every scroll frame or re-applies a from-state on every ScrollTrigger
   refresh. Animating any of those here would either be stomped a frame later
   or would stomp them:

     .hero-cup            CoffeeCarousel rewrites transform, --cup-op, z-index
                          and filter on each of the three, every frame
     .hero-wordmark       useTransferScene owns yPercent + autoAlpha
     .hero-panel-inner    useTransferScene owns y
     .hero-cream-rise     useTransferScene owns yPercent
     .hero-bean-parallax  useTransferScene owns y
     .hero-bean-plane     FloatingBeans writes transform every pointer frame
     .animate-float-bean  the idle drift keyframes own that transform
     .hero-panel-copy     BottomInfo writes opacity/visibility/transform

   So this reaches one level in from each of them instead: the inner <svg>
   rather than the wordmark box, the <img> rather than the cup, and
   .hero-bean-fall, which exists for no other reason than to give the drop an
   element nothing else writes to.

   ── Why clearProps is named rather than 'all' ─────────────────────────────
   .hero-cup-img carries an inline height from React — `calc(var(--cup-h) * …)`
   — and clearProps: 'all' would strip it and collapse the cup. The named list
   also matters for a second reason: a leftover `transform` on the image would
   promote it into the positioned-paint layer and flip it in front of
   .hero-cup-shadow, which is a positioned sibling *earlier* in the DOM. The
   contact shadow currently paints over the cup's base and has to keep doing so
   — .hero-cup-shadow carries a z-index to hold that order steady while these
   tweens run, and clearing the transform puts the image back in normal flow. */
export default function useHeroEntrance(rootRef, { armed, ready }) {
  const tlRef = useRef(null)

  useLayoutEffect(() => {
    if (!armed || !rootRef.current) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const ctx = gsap.context(() => {
      tlRef.current = gsap
        .timeline({ paused: true, defaults: { force3D: true } })
        /* Each bean drops in from above its own slot, scattered rather than in
           rows. The distance is scaled by the plane's own parallax depth — the
           near plane travels the furthest — so the shower has the same sense of
           depth at rest that it has once the beans are drifting. */
        .fromTo(
          '.hero-bean-fall',
          {
            autoAlpha: 0,
            y: (_i, target) =>
              -260 * parseFloat(target.closest('.hero-bean-parallax')?.dataset.depth || '1'),
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            ease: 'power2.out',
            stagger: { each: 0.035, from: 'random' },
            clearProps: 'transform,opacity,visibility',
          },
          REVEAL.beans,
        )
        /* Out of .hero-wordmark's overflow: hidden, from fully below it. 100%
           of the svg's own height is exactly the height of the clip box, so it
           starts completely hidden and no letterform is ever half-cut. */
        .fromTo(
          '.hero-wordmark-svg',
          { yPercent: 100, y: 0 },
          {
            yPercent: 0,
            duration: 1.15,
            ease: 'expo.out',
            clearProps: 'transform,opacity,visibility',
          },
          REVEAL.wordmark,
        )
        /* The pop. Scaled from the base rather than the middle so the cup grows
           up out of the cream instead of inflating in place, and centre-out so
           the focused cup leads the two beside it. */
        .fromTo(
          '.hero-cup-img',
          { yPercent: 34, scale: 0.9, autoAlpha: 0, transformOrigin: '50% 100%' },
          {
            yPercent: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 1.1,
            ease: 'expo.out',
            stagger: { each: 0.11, from: 'center' },
            clearProps: 'transform,opacity,visibility',
          },
          REVEAL.cups,
        )
        .fromTo(
          '.hero-cup-shadow',
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.8,
            ease: 'sine.out',
            stagger: { each: 0.11, from: 'center' },
            clearProps: 'opacity,visibility',
          },
          REVEAL.cups + 0.3,
        )
    }, rootRef)

    return () => {
      tlRef.current = null
      ctx.revert()
    }
  }, [rootRef, armed])

  useLayoutEffect(() => {
    if (ready) tlRef.current?.play()
  }, [ready])
}
