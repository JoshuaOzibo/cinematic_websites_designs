import { useEffect, useRef } from 'react'
import Bean from './Bean'

/**
 * Two parallax planes of coffee beans.
 *
 * `far` beans are small, blurred and sit behind the wordmark; `near` beans are
 * larger, sharp, and sit in front of it but behind the cups. Each plane gets
 * its own drift factor, so pointer movement and scroll separate them in depth.
 *
 * Positions deliberately avoid the middle band where the cups stand — the beans
 * are atmosphere around the composition, not confetti over it.
 */
const PLANES = [
  {
    id: 'far',
    depth: 0.45,
    zIndex: 5,
    blur: '1.6px',
    opacity: 0.55,
    beans: [
      { top: '14%', left: '11%', size: 26, rotate: -24, dur: '5.6s', delay: '0.2s', y: '-14px', x: '7px' },
      { top: '9%', left: '31%', size: 20, rotate: 38, dur: '4.4s', delay: '0.9s', y: '-11px', x: '-5px' },
      { top: '6%', left: '63%', size: 23, rotate: -48, dur: '5.1s', delay: '1.4s', y: '-13px', x: '6px' },
      { top: '18%', left: '86%', size: 22, rotate: 16, dur: '4.8s', delay: '0.5s', y: '-12px', x: '-6px' },
      { top: '46%', left: '5%', size: 18, rotate: 72, dur: '4.2s', delay: '1.1s', y: '-10px', x: '5px' },
      { top: '41%', left: '95%', size: 19, rotate: -34, dur: '5.4s', delay: '0.7s', y: '-12px', x: '-5px' },
      { top: '30%', left: '37%', size: 17, rotate: 52, dur: '4.7s', delay: '1.7s', y: '-11px', x: '-4px' },
      { top: '27%', left: '69%', size: 21, rotate: -12, dur: '5.9s', delay: '0.3s', y: '-13px', x: '6px' },
    ],
  },
  {
    id: 'near',
    depth: 1,
    zIndex: 15,
    blur: '0px',
    opacity: 0.98,
    beans: [
      { top: '21%', left: '17%', size: 54, rotate: -32, dur: '5.2s', delay: '0s', y: '-20px', x: '9px' },
      { top: '34%', left: '7%', size: 38, rotate: 54, dur: '4.6s', delay: '0.8s', y: '-16px', x: '-7px' },
      { top: '12%', left: '46%', size: 32, rotate: 18, dur: '4.1s', delay: '1.3s', y: '-14px', x: '6px' },
      { top: '25%', left: '78%', size: 50, rotate: 26, dur: '5.5s', delay: '0.4s', y: '-21px', x: '-8px' },
      { top: '38%', left: '89%', size: 34, rotate: -18, dur: '4.9s', delay: '1.6s', y: '-15px', x: '7px' },
      { top: '50%', left: '27%', size: 30, rotate: 66, dur: '4.3s', delay: '1s', y: '-13px', x: '-6px' },
      { top: '44%', left: '73%', size: 42, rotate: -44, dur: '5.7s', delay: '1.2s', y: '-18px', x: '8px' },
      { top: '8%', left: '58%', size: 36, rotate: 34, dur: '4.5s', delay: '0.6s', y: '-16px', x: '-7px' },
    ],
  },
]

export default function FloatingBeans({ motion }) {
  const planeRefs = useRef([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: 0, y: 0 }
    let scrollDrift = 0

    const paint = () => {
      PLANES.forEach((plane, i) => {
        const el = planeRefs.current[i]
        if (!el) return
        const dx = pointer.x * 22 * plane.depth
        const dy = pointer.y * 14 * plane.depth + scrollDrift * plane.depth
        el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`
      })
    }

    // Beans lift gently as the carousel advances — a second depth cue on top
    // of their idle float.
    const unsubscribe = motion.subscribe((pos) => {
      scrollDrift = -pos * 26
      paint()
    })

    if (reduced) return unsubscribe

    let frame = 0
    const onPointerMove = (event) => {
      // −1 … 1 from the centre of the viewport.
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0
          paint()
        })
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      unsubscribe()
      window.removeEventListener('pointermove', onPointerMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [motion])

  return (
    <>
      {PLANES.map((plane, i) => (
        <div
          key={plane.id}
          ref={(el) => {
            planeRefs.current[i] = el
          }}
          className="hero-bean-plane"
          style={{ zIndex: plane.zIndex, opacity: plane.opacity }}
          aria-hidden="true"
        >
          {plane.beans.map((bean, j) => (
            <span
              key={`${plane.id}-${j}`}
              className="animate-float-bean absolute"
              style={{
                top: bean.top,
                left: bean.left,
                '--bean-rot': `${bean.rotate}deg`,
                '--bean-dur': bean.dur,
                '--bean-delay': bean.delay,
                '--bean-y': bean.y,
                '--bean-x': bean.x,
                // Kept per-bean rather than on the plane so the plane's own
                // transform stays compositor-only while you move the pointer.
                filter: `blur(${plane.blur}) drop-shadow(0 6px 12px rgba(24, 10, 2, 0.32))`,
              }}
            >
              {/* Rotation lives on the wrapper so the float keyframes can add
                  a little rotational drift to it. */}
              <Bean size={bean.size} />
            </span>
          ))}
        </div>
      ))}
    </>
  )
}
