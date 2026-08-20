import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ARC_PATH, ARC_VIEWBOX } from './arcPath'

gsap.registerPlugin(ScrollTrigger)

/**
 * The cream base of the hero: a wide arc, then the information panel.
 *
 * The arc is one SVG path stretched with preserveAspectRatio="none", so the
 * cream rides high across the middle and falls away toward both edges however
 * wide the viewport gets — the cups stand on the flat of it. It is deliberately
 * *not* a border-radius: a radius would curve hardest at the corners, which is
 * the opposite of the shape the composition needs.
 *
 * The two filled pills read --hero-deep, so they re-tint with the centred cup.
 *
 * ── Why the copy scrolls itself ───────────────────────────────────────────
 * This panel lives inside .hero-viewport, which is `sticky; top: 0` for the
 * whole hero track — several thousand pixels of it. Everything in there is
 * pinned by definition, so the copy, the three buttons and the badge row sat
 * glued to the bottom edge of the screen for most of the hero, which reads as
 * a fixed toolbar stuck to the window rather than as page content.
 *
 * The fix is not to fade them (that only made them look half broken) but to let
 * them travel at exactly page speed, so they leave the screen on the same
 * schedule they would have if nothing were pinned at all. Only the inner box
 * moves — the cream block around it stays, because it is the hero's own
 * background down there, and .hero-panel clips the slide.
 *
 * `scrub: true`, not a number: any smoothing would make the copy lag the page
 * and give away that it is being animated rather than simply scrolling.
 */
export default function BottomInfo() {
  const panelRef = useRef(null)
  const innerRef = useRef(null)

  useLayoutEffect(() => {
    const panel = panelRef.current
    const inner = innerRef.current
    // The hero's scroll track, not the panel. Triggering on the panel would
    // wait for *its* top edge to reach the top of the screen, and a pinned
    // element's top edge never gets there until the pin releases — which is the
    // exact behaviour being fixed. The track starts at the top of the document,
    // so measuring from it means the copy begins leaving on the first pixel of
    // scroll, the way unpinned content would.
    const track = panel?.closest('.hero-root')
    if (!panel || !inner || !track) return undefined

    const mm = gsap.matchMedia()

    // Reduced motion keeps the panel where it is. The hero's scroll tracks are
    // collapsed in that mode anyway, so there is no long pin to escape from.
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // Downward, not upward, even though "scrolls away" normally means up.
        // .hero-panel's bottom edge *is* the bottom of the screen, so leaving
        // that way the content is cut by the edge of the window and nothing
        // else — it simply runs off the bottom. Going up it would have to be
        // cut by the panel's own top edge, which sits in the middle of open
        // cream well below the arc's curve, and the copy and buttons would be
        // sliced through by a hard horizontal line hanging in the cream.
        //
        // Travel and distance are both the panel's own height, measured on
        // refresh: that is more than enough to clear the edge, and matching the
        // two keeps the movement 1:1 with the scroll.
        gsap.fromTo(
          inner,
          { y: 0 },
          {
            y: () => panel.offsetHeight,
            ease: 'none',
            scrollTrigger: {
              trigger: track,
              start: 'top top',
              end: () => `+=${panel.offsetHeight}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      }, panel)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

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

      <div className="hero-panel" ref={panelRef}>
        <div className="hero-panel-inner" ref={innerRef}>
          <p className="hero-panel-copy">
            Explore a world of rich aromas with our exclusive coffee blends, crafted to awaken
            your senses. We source only the finest beans to deliver you a truly exceptional
            experience.
          </p>

          <div className="hero-panel-actions">
            <a href="#collections" id="hero-cta-flavors" className="hero-pill hero-pill-solid">
              Flavors
            </a>
            <a href="#collections" id="hero-cta-order" className="hero-pill hero-pill-light">
              Order Now
            </a>
            <a href="#about" id="hero-cta-about" className="hero-pill hero-pill-solid">
              About
            </a>
          </div>

          <ul className="hero-badges">
            <li className="hero-badge">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M5 7h18l-2.5 13H7.5L5 7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
                <path d="M19.5 10.5h3.5a2.5 2.5 0 0 1 0 5h-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M10 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>Rich in Flavor</span>
            </li>
            <li className="hero-badge">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <ellipse cx="14" cy="14" rx="7.5" ry="11" stroke="currentColor" strokeWidth="1.6" fill="none" />
                <path d="M14 3c-3.5 4.5-3.5 17 0 22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              </svg>
              <span>Premium Quality</span>
            </li>
            <li className="hero-badge">
              <strong className="hero-badge-figure">100%</strong>
              <span>Natural Arabica Beans</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
