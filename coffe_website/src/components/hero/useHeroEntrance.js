import { useLayoutEffect } from 'react'
import gsap from 'gsap'

/* ── The hero's arrival ────────────────────────────────────────────────────
   Runs once, cued by Intro the frame its curtain starts travelling, so the
   hero is assembling itself as it is uncovered rather than snapping into place
   after the black has gone.

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
     .hero-bean-plane     FloatingBeans writes transform every pointer frame
     .hero-panel-copy     BottomInfo writes opacity/visibility/transform

   So this reaches one level in from each of them instead. The inner <svg>
   rather than the wordmark box, the <img> rather than the cup, opacity on the
   bean *parallax* wrapper (useTransferScene only ever writes y there, never
   opacity). Every one of those is unowned, and the composition reads the same.

   ── Why clearProps is named rather than 'all' ─────────────────────────────
   .hero-cup-img carries an inline height from React — `calc(var(--cup-h) * …)`
   — and clearProps: 'all' would strip it and collapse the cup. The named list
   also matters for a second reason: a leftover `transform` on the image would
   promote it into the positioned-paint layer and flip it in front of
   .hero-cup-shadow, which is a positioned sibling *earlier* in the DOM. The
   contact shadow currently paints over the cup's base, and it has to keep
   doing so. Clearing the transform puts the image back in normal flow. */
export default function useHeroEntrance(rootRef, ready) {
  useLayoutEffect(() => {
    if (!ready || !rootRef.current) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out', force3D: true } })

      tl.fromTo(
        '.hero-bean-parallax',
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1.5,
          ease: 'sine.out',
          stagger: 0.14,
          clearProps: 'opacity,visibility',
        },
        0,
      )
        /* Centre out: the focused cup leads and the two side cups follow it up,
           which is the same order the carousel reads them in. */
        .fromTo(
          '.hero-cup-img',
          { yPercent: 18, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.4,
            stagger: { each: 0.11, from: 'center' },
            clearProps: 'transform,opacity,visibility',
          },
          0.05,
        )
        .fromTo(
          '.hero-cup-shadow',
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 1,
            ease: 'sine.out',
            stagger: { each: 0.11, from: 'center' },
            clearProps: 'opacity,visibility',
          },
          0.35,
        )
        /* Last, and from furthest down. It sits at the top of the frame, which
           is the last strip the curtain uncovers, so it arrives into a view the
           eye has already settled on. */
        .fromTo(
          '.hero-wordmark-svg',
          { yPercent: 26, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.35,
            clearProps: 'transform,opacity,visibility',
          },
          0.3,
        )
    }, rootRef)

    return () => ctx.revert()
  }, [rootRef, ready])
}
