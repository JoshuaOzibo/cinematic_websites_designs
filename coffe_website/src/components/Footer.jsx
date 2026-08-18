import { useState } from 'react'
import { NAV_LINKS, SOCIAL_LINKS } from '../data/site'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [signedUp, setSignedUp] = useState(false)

  // No backend on a demo site — just acknowledge and reset.
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setSignedUp(true)
    setEmail('')
  }

  return (
    <footer className="relative text-parchment">
      {/* Curved transition matching the hero section style */}
      <div className="bg-cream overflow-hidden">
        <svg
          className="block w-full -mb-px"
          style={{ height: 'clamp(52px, 9vh, 120px)' }}
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M0 100 L0 82 C 300 82 402 6 720 6 C 1038 6 1140 82 1440 82 L1440 100 Z"
            fill="var(--color-dark)"
          />
        </svg>
      </div>

      <div className="bg-dark">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 lg:px-14">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[1.6rem] font-semibold tracking-[-0.03em]">coffeelo</p>
              <p className="mt-4 max-w-[18rem] text-[0.97rem] leading-relaxed text-parchment/70">
                Single-origin coffee, slow roasted in small batches. Traceable to the farm, priced
                in the open.
              </p>
            </div>

            <nav aria-label="Footer">
              <h2 className="text-[0.82rem] font-semibold tracking-[0.2em] text-tan uppercase">
                Explore
              </h2>
              <ul className="mt-5 space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="link-underline text-[0.97rem] text-parchment/80 transition-colors hover:text-parchment"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-[0.82rem] font-semibold tracking-[0.2em] text-tan uppercase">
                Follow
              </h2>
              <ul className="mt-5 space-y-3">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="link-underline text-[0.97rem] text-parchment/80 transition-colors hover:text-parchment"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-[0.82rem] font-semibold tracking-[0.2em] text-tan uppercase">
                Roast Notes
              </h2>
              <p className="mt-5 text-[0.97rem] leading-relaxed text-parchment/70">
                One email a month: what we are roasting, and what is landing next.
              </p>

              <form onSubmit={handleSubmit} className="mt-5">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <div className="flex overflow-hidden rounded-full border border-tan/40">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent px-5 py-3 text-[0.95rem] text-parchment placeholder:text-parchment/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 bg-rust px-6 text-[0.92rem] font-medium text-cream transition-opacity duration-300 hover:opacity-90"
                  >
                    Join
                  </button>
                </div>
              </form>

              <p aria-live="polite" className="mt-3 h-5 text-[0.88rem] text-tan">
                {signedUp ? 'Thanks — check your inbox for a confirmation.' : ''}
              </p>
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-tan/25 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.9rem] text-parchment/60">
              &copy; {new Date().getFullYear()} coffeelo roasters. All rights reserved.
            </p>
            <p className="text-[0.9rem] text-parchment/60">
              Roasted in Lagos &middot; Shipped worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
