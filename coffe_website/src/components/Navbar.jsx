import { useEffect, useState } from 'react'
import { NAV_LINKS } from '../data/site'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
        className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-14"
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

        {/* Desktop nav links — centered */}
        <ul className="hidden items-center gap-8 md:flex">
          {[
            { label: 'Home', href: '#home' },
            { label: 'Flavors', href: '#collections' },
            { label: 'Our Product', href: '#about' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#locations' },
          ].map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="link-underline text-[0.88rem] font-semibold uppercase tracking-wider text-cream/90 transition-colors hover:text-cream"
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
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream/80 transition-colors hover:border-cream hover:text-cream md:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M3 6h18" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </button>

          {/* ORDER NOW CTA */}
          <a
            href="#collections"
            id="nav-order-now"
            className="rounded-full border-2 border-cream/80 bg-transparent px-5 py-2 text-[0.8rem] font-semibold uppercase tracking-wider text-cream transition-all duration-300 hover:bg-cream hover:text-espresso"
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream md:hidden"
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
          className="mx-5 mb-4 rounded-2xl border border-cream/15 bg-espresso/95 px-5 py-3 backdrop-blur-md sm:mx-8 md:hidden"
        >
          {[
            { label: 'Home', href: '#home' },
            { label: 'Flavors', href: '#collections' },
            { label: 'Our Product', href: '#about' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#locations' },
          ].map((link) => (
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
