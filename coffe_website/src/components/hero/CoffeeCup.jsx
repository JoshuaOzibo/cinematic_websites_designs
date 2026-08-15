/**
 * Iced cold-brew in a clear takeaway cup, drawn as one inline SVG.
 *
 * Layer order (bottom → top): splash crown behind the rim, cup shadow, coffee
 * body, ice, glass shell + highlights, brand roundel, foreground splash and
 * droplets. Coordinates are tuned to the 520 × 780 viewBox — if you retune the
 * body path, the coffee fill and rim ellipses have to move with it.
 *
 * This is the stand-in for a photographic cutout: drop a transparent PNG at
 * public/hero-cup.png and HeroProduct swaps to it automatically.
 */
export default function CoffeeCup({ className = '' }) {
  return (
    <svg
      viewBox="0 0 520 780"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="A tall clear cup of iced single-origin cold brew, mid-splash, surrounded by flying coffee beans"
    >
      <defs>
        {/* Cold brew: dark at the base, lighter where the milk cuts through */}
        <linearGradient id="cup-brew" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c99e6a" />
          <stop offset="14%" stopColor="#8d5a2b" />
          <stop offset="42%" stopColor="#5a300f" />
          <stop offset="78%" stopColor="#3d1f0a" />
          <stop offset="100%" stopColor="#2a1305" />
        </linearGradient>

        {/* The plastic itself — barely there, just enough to read as glass */}
        <linearGradient id="cup-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="18%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="84%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
        </linearGradient>

        <linearGradient id="cup-cream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf1dc" />
          <stop offset="100%" stopColor="#e2c193" />
        </linearGradient>

        <linearGradient id="splash-cream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf6e6" />
          <stop offset="100%" stopColor="#d9b47f" />
        </linearGradient>

        <radialGradient id="cup-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7a5a40" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#7a5a40" stopOpacity="0" />
        </radialGradient>

        {/* Keeps the brew, ice and inner highlights inside the cup walls */}
        <clipPath id="cup-interior">
          <path d="M116 244 L154 690 Q157 722 188 722 L332 722 Q363 722 366 690 L404 244 Z" />
        </clipPath>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="260" cy="726" rx="150" ry="30" fill="url(#cup-shadow)" />

      {/* ── Splash behind the cup ─────────────────────────────────────────── */}
      <g opacity="0.95">
        <path
          d="M128 250c-14-58 6-104 44-132 26-19 22 34 6 62-13 23-31 43-50 70Z"
          fill="url(#splash-cream)"
          opacity="0.9"
        />
        <path
          d="M392 252c22-52 12-102-20-136-24-25-26 28-14 58 10 26 24 46 34 78Z"
          fill="url(#splash-cream)"
          opacity="0.9"
        />
        <path
          d="M198 214c-24-48-26-104-4-146 14-27 34 12 32 46-2 32-14 60-28 100Z"
          fill="url(#splash-cream)"
          opacity="0.75"
        />
      </g>

      {/* ── Coffee body ───────────────────────────────────────────────────── */}
      <g clipPath="url(#cup-interior)">
        <rect x="100" y="286" width="320" height="450" fill="url(#cup-brew)" />

        {/* Milk swirl folding through the brew */}
        <path
          d="M120 372c46 26 96-18 144 4s72 46 132 18l14-46-292-10Z"
          fill="#e9cda2"
          opacity="0.55"
        />
        <path
          d="M126 420c52 22 84-24 132-6s86 40 140 8"
          stroke="#e9cda2"
          strokeOpacity="0.4"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* Ice, seen through the plastic */}
        <g fill="#ffffff" fillOpacity="0.22" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="2">
          <rect x="150" y="330" width="84" height="80" rx="10" transform="rotate(-14 192 370)" />
          <rect x="268" y="352" width="92" height="86" rx="10" transform="rotate(11 314 395)" />
          <rect x="182" y="452" width="88" height="82" rx="10" transform="rotate(6 226 493)" />
          <rect x="272" y="512" width="76" height="72" rx="9" transform="rotate(-9 310 548)" />
          <rect x="164" y="576" width="70" height="66" rx="9" transform="rotate(15 199 609)" />
        </g>

        {/* Inner wall highlights */}
        <path d="M126 300 L162 700 L186 700 L150 300 Z" fill="#ffffff" fillOpacity="0.16" />
        <path d="M382 300 L352 700 L372 700 L400 300 Z" fill="#ffffff" fillOpacity="0.1" />
      </g>

      {/* Surface of the drink */}
      <ellipse cx="260" cy="288" rx="145" ry="27" fill="url(#cup-cream)" />
      <ellipse cx="260" cy="288" rx="145" ry="27" fill="#ffffff" fillOpacity="0.25" />
      <ellipse cx="238" cy="284" rx="52" ry="12" fill="#ffffff" fillOpacity="0.45" />

      {/* ── Glass shell ───────────────────────────────────────────────────── */}
      <path
        d="M116 244 L154 690 Q157 722 188 722 L332 722 Q363 722 366 690 L404 244 Z"
        fill="url(#cup-glass)"
      />
      <path
        d="M116 244 L154 690 Q157 722 188 722 L332 722 Q363 722 366 690 L404 244"
        stroke="#ffffff"
        strokeOpacity="0.62"
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M116 244 L154 690 Q157 722 188 722 L332 722 Q363 722 366 690 L404 244"
        stroke="#7a5a40"
        strokeOpacity="0.28"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />

      {/* Vertical specular streaks on the plastic */}
      <path d="M148 268 L178 664 L192 664 L164 268 Z" fill="#ffffff" fillOpacity="0.5" />
      <path d="M372 268 L346 664 L356 664 L382 268 Z" fill="#ffffff" fillOpacity="0.32" />

      {/* Rim */}
      <ellipse cx="260" cy="244" rx="144" ry="28" fill="#ffffff" fillOpacity="0.35" />
      <ellipse
        cx="260"
        cy="244"
        rx="144"
        ry="28"
        stroke="#ffffff"
        strokeOpacity="0.85"
        strokeWidth="5"
        fill="none"
      />
      <ellipse
        cx="260"
        cy="244"
        rx="144"
        ry="28"
        stroke="#7a5a40"
        strokeOpacity="0.25"
        strokeWidth="1.5"
        fill="none"
      />

      {/* ── Brand roundel ─────────────────────────────────────────────────── */}
      <g opacity="0.92">
        <circle
          cx="260"
          cy="500"
          r="52"
          stroke="#ffffff"
          strokeOpacity="0.9"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M260 468c-13 18-13 46 0 64"
          stroke="#ffffff"
          strokeOpacity="0.9"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M244 470c-16 6-27 20-27 34"
          stroke="#ffffff"
          strokeOpacity="0.55"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <text
          x="260"
          y="586"
          textAnchor="middle"
          fill="#ffffff"
          fillOpacity="0.92"
          fontFamily="DM Sans, sans-serif"
          fontSize="40"
          fontWeight="600"
          letterSpacing="-1"
        >
          coffeelo
        </text>
      </g>

      {/* ── Foreground splash + droplets ──────────────────────────────────── */}
      <g>
        <path
          d="M232 240c-30-46-40-98-24-146 10-30 40-8 42 26 2 40-8 76-18 120Z"
          fill="url(#splash-cream)"
        />
        <path
          d="M300 244c26-40 44-86 38-132-4-32-38-18-44 14-7 38 0 76 6 118Z"
          fill="url(#splash-cream)"
        />
        <path
          d="M262 232c-10-52-6-108 14-150 12-24 30 8 26 42-5 40-24 70-40 108Z"
          fill="#fdf6e6"
          opacity="0.92"
        />
      </g>

      <g className="animate-splash" style={{ '--splash-dur': '3.2s' }}>
        <ellipse cx="176" cy="112" rx="13" ry="17" fill="#e8c795" transform="rotate(-18 176 112)" />
        <ellipse cx="368" cy="96" rx="11" ry="15" fill="#e8c795" transform="rotate(22 368 96)" />
      </g>
      <g className="animate-splash" style={{ '--splash-dur': '4.1s', '--splash-delay': '0.6s' }}>
        <ellipse cx="404" cy="176" rx="9" ry="12" fill="#dcb47c" transform="rotate(14 404 176)" />
        <ellipse cx="132" cy="182" rx="8" ry="11" fill="#dcb47c" transform="rotate(-12 132 182)" />
        <circle cx="300" cy="62" r="7" fill="#f0d7ad" />
      </g>
      <g className="animate-splash" style={{ '--splash-dur': '3.7s', '--splash-delay': '1.2s' }}>
        <circle cx="212" cy="52" r="6" fill="#f0d7ad" />
        <circle cx="440" cy="240" r="5.5" fill="#dcb47c" />
        <circle cx="94" cy="252" r="5" fill="#dcb47c" />
      </g>
    </svg>
  )
}
