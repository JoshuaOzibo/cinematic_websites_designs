/**
 * A single coffee bean. Purely decorative — the hero scatters ~14 of these
 * around the cup, each with its own drift distance, duration and delay so they
 * never fall into lockstep.
 */
export default function Bean({ size = 34, rotate = 0, className = '', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ ...style, '--bean-rot': `${rotate}deg` }}
    >
      <defs>
        <radialGradient id={`bean-${rotate}-${size}`} cx="35%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#7a4419" />
          <stop offset="55%" stopColor="#4d2409" />
          <stop offset="100%" stopColor="#2b1204" />
        </radialGradient>
      </defs>
      <g transform={`rotate(${rotate} 20 20)`}>
        <ellipse cx="20" cy="20" rx="12.5" ry="16.5" fill={`url(#bean-${rotate}-${size})`} />
        <path
          d="M20 4.5c-4.6 6.4-4.6 24.6 0 31"
          stroke="#f0d9b0"
          strokeOpacity="0.55"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="15.5" cy="12.5" rx="3.4" ry="5" fill="#ffffff" fillOpacity="0.13" />
      </g>
    </svg>
  )
}
