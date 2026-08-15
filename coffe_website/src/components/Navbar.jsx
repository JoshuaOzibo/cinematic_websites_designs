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
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled ? 'bg-cream/80 shadow-[0_1px_0_rgba(122,90,64,0.15)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-14"
      >
        <a
          href="#home"
          className="text-[1.6rem] font-semibold tracking-[-0.03em] text-espresso"
        >
          coffeelo
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="link-underline text-[0.98rem] font-medium text-mid transition-colors hover:text-espresso"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#collections"
            className="rounded-full bg-rust px-7 py-2.5 text-[0.95rem] font-medium text-cream transition-transform duration-300 hover:scale-[1.04]"
          >
            Shop
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-bark/25 text-espresso md:hidden"
          >
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
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
          className="mx-5 mb-4 rounded-2xl border border-bark/15 bg-cream/95 px-5 py-3 backdrop-blur-md sm:mx-8 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-bark/10 last:border-0">
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[1.05rem] font-medium text-mid transition-colors hover:text-espresso"
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
