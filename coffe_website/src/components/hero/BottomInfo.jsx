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
 */
export default function BottomInfo() {
  return (
    <div className="hero-base">
      <svg
        className="hero-arc"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M0 100 L0 82 C 300 82 402 6 720 6 C 1038 6 1140 82 1440 82 L1440 100 Z"
          fill="var(--color-cream)"
        />
      </svg>

      <div className="hero-panel">
        <div className="hero-panel-inner">
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
