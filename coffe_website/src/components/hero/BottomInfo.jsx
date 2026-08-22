import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { COFFEE_PRODUCTS } from '../../data/coffeeProducts'
import { ARC_PATH, ARC_VIEWBOX } from './arcPath'
import { noteOpacityFor, slotFor } from './slotMath'
import { REVEAL } from '../../revealTiming'
const NOTE_TRAVEL = 32

const BADGE_TRAVEL = 130

export default function BottomInfo({ motion, armed, ready }) {
  const noteRefs = useRef([])
  const actionsRef = useRef(null)
  const badgeRefs = useRef([])
  const entranceRef = useRef(null)
  useLayoutEffect(() => {
    const count = COFFEE_PRODUCTS.length

    return motion.subscribe((pos) => {
      for (let i = 0; i < count; i += 1) {
        const el = noteRefs.current[i]
        if (!el) continue

        const slot = slotFor(i, pos, count)
        const opacity = noteOpacityFor(slot)

        el.style.opacity = opacity.toFixed(3)

        el.style.visibility = opacity < 0.01 ? 'hidden' : 'visible'
        const drift = Math.max(-1, Math.min(1, slot)) * NOTE_TRAVEL
          el.style.transform = `translate3d(0, ${drift.toFixed(2)}px, 0)`
      }
    })
  }, [motion])
  useLayoutEffect(() => {
    const actionsEl = actionsRef.current
    const badgeEls = badgeRefs.current.filter(Boolean)
    if (!actionsEl && !badgeEls.length) return undefined

    const mm = gsap.matchMedia()
    let unsubscribe
    const live = new Set()
    const track = (tween) => {
      live.add(tween)
      tween.eventCallback('onComplete', () => live.delete(tween))
      return tween
    }

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let lastStep = null
      unsubscribe = motion.subscribe((pos) => {
        const step = Math.round(pos)
        if (lastStep === null) {
          lastStep = step
          return
        }
        if (step === lastStep) return
        lastStep = step

        if (actionsEl) {
          track(
            gsap
              .timeline()
              .to(actionsEl.children, {
                autoAlpha: 0.25,
                y: 10,
                duration: 0.16,
                ease: 'power2.in',
                stagger: 0.03,
              })
              .to(actionsEl.children, {
                autoAlpha: 1,
                y: 0,
                duration: 0.32,
                ease: 'power2.out',
                stagger: 0.04,
              }),
          )
        }

        badgeEls.forEach((el, i) => {
          track(
            gsap
              .timeline({ delay: i * 0.05 })
              .to(el, { yPercent: BADGE_TRAVEL, autoAlpha: 0, duration: 0.26, ease: 'power2.in' })
              .set(el, { yPercent: -BADGE_TRAVEL })
              .to(el, { yPercent: 0, autoAlpha: 1, duration: 0.36, ease: 'power2.out' }),
          )
        })
      })
    })

    return () => {
      unsubscribe?.()
      live.forEach((tween) => tween.kill())
      const pills = actionsEl ? Array.from(actionsEl.children) : []
      gsap.set([...pills, ...badgeEls], { clearProps: 'all' })
      mm.revert()
    }
  }, [motion])

  /* The panel's own arrival, cued by Intro rather than by mount — the hero is
     built behind an opaque curtain, so an entrance that fired on mount played
     out where nobody could see it and the panel was simply *there* the moment
     the black lifted.

     Deliberately separate from the step-change subscription above: this depends
     on the reveal cues, and folding it in would tear that subscription down and
     rebuild it every time one of them fires.

     Built at `armed` and played at `ready` — see the note in useHeroEntrance.js
     for why those are two different moments. The panel sits under the arc, so
     the rising curtain uncovers it first of anything on the page, and it would
     otherwise be visible in its finished state for the best part of a second
     before being asked to animate in.

     The badges rise out of .hero-badge's existing overflow: hidden — the same
     clip box the carousel already swaps them through — so this reveal and the
     one that runs on every product change are the same move. */
  useLayoutEffect(() => {
    if (!armed) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const actionsEl = actionsRef.current
    const badgeEls = badgeRefs.current.filter(Boolean)
    const notesEl = actionsEl?.parentElement?.querySelector('.hero-panel-notes')
    const badgeList = badgeEls[0]?.closest('.hero-badges')

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { force3D: true } })
      entranceRef.current = tl

      /* The note stack, not the notes themselves. Each .hero-panel-copy has its
         opacity rewritten on every scroll frame by the subscription above, so
         the only free handle is their shared grid cell — and multiplying a
         parent's opacity by theirs is not a conflict. */
      if (notesEl) {
        tl.fromTo(
          notesEl,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
          },
          REVEAL.panel,
        )
      }

      /* The bordered frame arrives just ahead of what rises inside it. Without
         this the three outlines sat there empty for a beat, which read as
         something failing to load rather than as a reveal. */
      if (badgeList) {
        tl.fromTo(
          badgeList,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.5,
            ease: 'sine.out',
            clearProps: 'opacity,visibility',
          },
          REVEAL.panel + 0.06,
        )
      }

      if (actionsEl) {
        tl.fromTo(
          actionsEl.children,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.09,
            clearProps: 'transform,opacity,visibility',
          },
          REVEAL.panel,
        )
      }

      if (badgeEls.length) {
        tl.fromTo(
          badgeEls,
          { yPercent: 120, y: 0, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.85,
            ease: 'expo.out',
            stagger: 0.08,
            clearProps: 'transform,opacity,visibility',
          },
          REVEAL.panel + 0.14,
        )
      }
    })

    return () => {
      entranceRef.current = null
      ctx.revert()
    }
  }, [armed])

  useLayoutEffect(() => {
    if (ready) entranceRef.current?.play()
  }, [ready])

  return (
    <div className="hero-base">
      <svg
        className="hero-arc"
        viewBox={ARC_VIEWBOX}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d={ARC_PATH} fill="var(--color-cream)" />
      </svg>

      <div className="hero-panel">
        <div className="hero-panel-inner">
          <div className="hero-panel-notes">
            {COFFEE_PRODUCTS.map((product, i) => (
              <p
                key={product.id}
                className="hero-panel-copy"
                ref={(el) => {
                  noteRefs.current[i] = el
                }}
              >
                {product.note}
              </p>
            ))}
          </div>

          <div className="hero-panel-actions" ref={actionsRef}>
            <a href="#showcase" id="hero-cta-flavors" className="hero-pill hero-pill-solid">
              Flavors
            </a>
            <a href="#showcase" id="hero-cta-order" className="hero-pill hero-pill-light">
              Order Now
            </a>
            <a href="#about" id="hero-cta-about" className="hero-pill hero-pill-solid">
              About
            </a>
          </div>

          <ul className="hero-badges">
            <li className="hero-badge">
              <div className="hero-badge-inner" ref={(el) => { badgeRefs.current[0] = el }}>
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <path d="M5 7h18l-2.5 13H7.5L5 7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
                  <path d="M19.5 10.5h3.5a2.5 2.5 0 0 1 0 5h-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M10 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>Rich in Flavor</span>
              </div>
            </li>
            <li className="hero-badge">
              <div className="hero-badge-inner" ref={(el) => { badgeRefs.current[1] = el }}>
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <ellipse cx="14" cy="14" rx="7.5" ry="11" stroke="currentColor" strokeWidth="1.6" fill="none" />
                  <path d="M14 3c-3.5 4.5-3.5 17 0 22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                </svg>
                <span>Premium Quality</span>
              </div>
            </li>
            <li className="hero-badge">
              <div className="hero-badge-inner" ref={(el) => { badgeRefs.current[2] = el }}>
                <strong className="hero-badge-figure">100%</strong>
                <span>Natural Arabica Beans</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
