import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { COFFEE_PRODUCTS } from '../../data/coffeeProducts'
import { ARC_PATH, ARC_VIEWBOX } from './arcPath'
import { noteOpacityFor, slotFor } from './slotMath'
const NOTE_TRAVEL = 32

const BADGE_TRAVEL = 130

export default function BottomInfo({ motion }) {
  const noteRefs = useRef([])
  const actionsRef = useRef(null)
  const badgeRefs = useRef([])
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
      if (actionsEl) {
        track(
          gsap.fromTo(
            actionsEl.children,
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08, delay: 0.15 },
          ),
        )
      }

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
