import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { REVEAL } from '../revealTiming'

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Our Product', href: '#showcase' },
  { label: 'About', href: '#about' },
]

export default function Navbar({ armed, ready }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const tlRef = useRef(null)

  useLayoutEffect(() => {
    const target = document.getElementById('showcase')
    if (!target) return undefined

    const sync = (self) => setScrolled(self.isActive)
    const st = ScrollTrigger.create({
      trigger: target,
      start: 'top bottom+=20%',
      end: 'max',
      onToggle: sync,
      onRefresh: sync,
    })
    return () => st.kill()
  }, [])

  /* The bar arrives first, and everything in it comes down from above: the
     logo, then the labels out of their clip boxes, then the actions. It is the
     last strip of the page the rising curtain uncovers, which is exactly why
     it leads — the eye is already at the top when the black clears it.

     Built at `armed` and played at `ready`, for the same reason the hero's
     entrance is. See the note in useHeroEntrance.js.

     No resting state in CSS. Until the intro arms this, the navbar is simply
     itself, sitting unseen behind an opaque panel; hiding it in the stylesheet
     instead would mean a failed intro leaves the site with no navigation.

     clearProps is named rather than 'all' so the tween cannot strip the
     background/backdrop utilities the scrolled state transitions between. */
  useLayoutEffect(() => {
    if (!armed || !headerRef.current) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const ctx = gsap.context(() => {
      const clear = 'transform,opacity,visibility'
      tlRef.current = gsap
        .timeline({ paused: true, defaults: { force3D: true, ease: 'power3.out' } })
        .fromTo(
          '#nav-logo',
          { autoAlpha: 0, y: -26 },
          { autoAlpha: 1, y: 0, duration: 0.7, clearProps: clear },
          REVEAL.navbar,
        )
        /* Down into the clip boxes on the anchors, not up out of them: the
           whole bar is arriving from off the top edge. */
        .fromTo(
          '.nav-label',
          { yPercent: -120, y: 0 },
          { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07, clearProps: clear },
          REVEAL.navbar + 0.08,
        )
        .fromTo(
          '.nav-action',
          { autoAlpha: 0, y: -22 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, clearProps: clear },
          REVEAL.navbar + 0.2,
        )
    }, headerRef)

    return () => {
      tlRef.current = null
      ctx.revert()
    }
  }, [armed])

  useLayoutEffect(() => {
    if (ready) tlRef.current?.play()
  }, [ready])

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled
          ? 'bg-espresso/90 shadow-[0_1px_0_rgba(0,0,0,0.2)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-3.5 sm:px-8 lg:px-12"
      >
        <a
          href="#home"
          id="nav-logo"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cream/80 bg-cream text-[0.6rem] font-black leading-none tracking-tight text-espresso"
          aria-label="coffeelo home"
        >
          <span className="text-center leading-[1.1]">
            COFFEE<br />&amp;CO.
          </span>
        </a>
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 whitespace-nowrap lg:flex lg:gap-9">
          {LINKS.map((link) => (
            <li key={link.label}>
              {/* The clip box lives on the anchor and the travelling element is
                  the span inside it, not the other way round: .link-underline
                  paints its rule on the anchor's own background box, and
                  overflow clips descendants, never the element's own
                  background — so the underline survives a box fitted tight to
                  these all-caps labels. */}
              <a
                href={link.href}
                className="link-underline block overflow-hidden text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-cream/85 transition-colors hover:text-cream"
              >
                <span className="nav-label block">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="nav-cart"
            aria-label="Shopping cart"
            className="nav-action hidden h-9 w-9 items-center justify-center rounded-full text-cream/85 transition-colors hover:text-cream lg:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M3 6h18" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </button>

          <a
            href="#showcase"
            id="nav-order-now"
            className="nav-action rounded-full bg-cream px-5 py-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-espresso transition-transform duration-300 hover:-translate-y-0.5"
          >
            Order Now
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="nav-action flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream lg:hidden"
          >
            <svg width="16" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
              {menuOpen ? (
                <>
                  <path d="M2 1l14 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M16 1L2 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M0 1h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M0 6h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M0 11h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <ul
          id="mobile-nav"
          className="mx-5 mb-4 rounded-2xl border border-cream/15 bg-espresso/95 px-5 py-3 backdrop-blur-md sm:mx-8 lg:hidden"
        >
          {LINKS.map((link) => (
            <li key={link.label} className="border-b border-cream/10 last:border-0">
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[1rem] font-semibold uppercase tracking-wider text-cream/80 transition-colors hover:text-cream"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
