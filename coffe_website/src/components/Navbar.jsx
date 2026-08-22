import { useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Our Product', href: '#showcase' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useLayoutEffect(() => {
    // The bar is cream-on-transparent, which only works over the hero's amber.
    // The handoff floods the hero with cream partway through, and every section
    // below it is cream or dark, so the bar has to have taken its solid plate
    // before that flood lands.
    //
    // Anchored to the showcase rather than to a scroll offset: the hero's track
    // height changes with the breakpoint, and a measured number went stale the
    // moment the handoff was added to it. `bottom+=20%` puts the switch a fifth
    // of a viewport before the showcase appears, which is about a quarter of
    // the way through the flight and comfortably ahead of the cream.
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

  return (
    <header
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
        {/* Logo */}
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

        {/* Desktop nav links — optically centred in the bar, independent of how
            wide the logo and the right-hand cluster happen to be. */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 whitespace-nowrap lg:flex lg:gap-9">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="link-underline text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-cream/85 transition-colors hover:text-cream"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: cart + CTA */}
        <div className="flex items-center gap-3">
          {/* Cart icon */}
          <button
            type="button"
            id="nav-cart"
            aria-label="Shopping cart"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-cream/85 transition-colors hover:text-cream lg:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M3 6h18" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </button>

          {/* ORDER NOW CTA */}
          <a
            href="#showcase"
            id="nav-order-now"
            className="rounded-full bg-cream px-5 py-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-espresso transition-transform duration-300 hover:-translate-y-0.5"
          >
            Order Now
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream lg:hidden"
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

      {/* Mobile menu */}
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
