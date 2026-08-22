const BACK_PATHS = [
  'M -90 296 C 190 202, 358 330, 540 432',
  'M 902 424 C 1060 318, 1162 250, 1530 184',
  'M 124 520 C 260 428, 448 470, 476 572 C 498 652, 376 706, 296 652',
]

const FRONT_PATHS = [
  'M 530 426 C 642 494, 806 502, 910 420',
]

export default function Rope({ layer = 'back', className = '' }) {
  const id = `rope-fade-${layer}`
  const paths = layer === 'front' ? FRONT_PATHS : BACK_PATHS

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 700"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1440" y2="0">
          <stop offset="0%" stopColor="#c8a970" stopOpacity="0" />
          <stop offset="11%" stopColor="#c8a970" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#c8a970" stopOpacity="1" />
          <stop offset="86%" stopColor="#c8a970" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#c8a970" stopOpacity="0" />
        </linearGradient>
      </defs>

      {paths.map((d) => (
        <path
          key={d}
          d={d}
          stroke={`url(#${id})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}
