import { useState } from 'react'
import CoffeeCup from './CoffeeCup'
import Bean from './Bean'

/** Where the photographic cutout goes, if you have one. */
const PHOTO_SRC = '/hero-cup.png'

/**
 * Beans scattered around the cup. Percentages are relative to the product
 * box, so the whole constellation scales with the cup instead of drifting off
 * it on small screens.
 */
const BEANS = [
  { top: '6%', left: '-6%', size: 40, rotate: -24, dur: '4.6s', delay: '0s', y: '-18px', x: '6px' },
  { top: '2%', left: '30%', size: 26, rotate: 38, dur: '3.4s', delay: '0.8s', y: '-14px', x: '-5px' },
  { top: '11%', left: '86%', size: 34, rotate: -12, dur: '5.1s', delay: '0.3s', y: '-20px', x: '8px' },
  { top: '22%', left: '-14%', size: 30, rotate: 62, dur: '3.9s', delay: '1.4s', y: '-12px', x: '-8px' },
  { top: '19%', left: '101%', size: 44, rotate: 18, dur: '4.3s', delay: '0.6s', y: '-22px', x: '5px' },
  { top: '35%', left: '92%', size: 24, rotate: -44, dur: '3.6s', delay: '1.1s', y: '-15px', x: '7px' },
  { top: '41%', left: '-10%', size: 36, rotate: 8, dur: '4.9s', delay: '0.2s', y: '-17px', x: '-6px' },
  { top: '54%', left: '104%', size: 32, rotate: 74, dur: '4.1s', delay: '1.7s', y: '-19px', x: '9px' },
  { top: '61%', left: '-16%', size: 28, rotate: -30, dur: '3.7s', delay: '0.9s', y: '-13px', x: '-7px' },
  { top: '72%', left: '96%', size: 38, rotate: 26, dur: '5.3s', delay: '0.4s', y: '-21px', x: '6px' },
  { top: '79%', left: '4%', size: 26, rotate: -56, dur: '4.4s', delay: '1.5s', y: '-16px', x: '5px' },
  { top: '88%', left: '78%', size: 34, rotate: 42, dur: '3.8s', delay: '1s', y: '-18px', x: '-6px' },
  { top: '93%', left: '26%', size: 22, rotate: -18, dur: '4.7s', delay: '0.5s', y: '-12px', x: '7px' },
  { top: '48%', left: '46%', size: 20, rotate: 84, dur: '3.5s', delay: '1.9s', y: '-11px', x: '-4px' },
]

export default function HeroProduct({ className = '' }) {
  // Stays false until the optional cutout actually decodes, so a missing file
  // simply leaves the SVG illustration in place.
  const [hasPhoto, setHasPhoto] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <img
        src={PHOTO_SRC}
        alt="A tall clear cup of iced single-origin cold brew, mid-splash"
        onLoad={() => setHasPhoto(true)}
        className={`w-full drop-shadow-[0_28px_50px_rgba(61,31,10,0.22)] ${
          hasPhoto ? 'block' : 'hidden'
        }`}
      />

      {!hasPhoto && (
        <CoffeeCup className="w-full drop-shadow-[0_28px_50px_rgba(61,31,10,0.18)]" />
      )}

      {BEANS.map((bean, i) => (
        <span
          key={i}
          className="animate-float-bean pointer-events-none absolute drop-shadow-[0_6px_10px_rgba(61,31,10,0.28)]"
          style={{
            top: bean.top,
            left: bean.left,
            '--bean-dur': bean.dur,
            '--bean-delay': bean.delay,
            '--bean-y': bean.y,
            '--bean-x': bean.x,
          }}
        >
          <Bean size={bean.size} rotate={bean.rotate} />
        </span>
      ))}
    </div>
  )
}
