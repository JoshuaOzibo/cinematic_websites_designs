import { useCallback, useLayoutEffect, useRef } from 'react'
import { clamp } from './colorUtils'

/**
 * The single clock the whole hero runs on.
 *
 * Scroll position over the hero track is mapped to a continuous carousel
 * position (0 → `steps`, one whole step per product change) and then *damped*:
 * `pos` chases `target` by a fixed fraction each frame, so a flick of the wheel
 * still resolves as a slow ~1s glide instead of snapping. Scrubbing backwards
 * reverses just as smoothly — nothing here is a one-shot trigger.
 *
 * Subscribers get called with the damped position every frame and write to the
 * DOM themselves. Nothing re-renders React while you scroll, which is what
 * keeps three 1000px cup images, a blur and a gradient at 60fps.
 *
 * (GSAP/ScrollTrigger would be the obvious tool here, but it isn't installed
 * and this project ships zero runtime dependencies beyond React — the ~30 lines
 * below are the part of ScrollTrigger the hero actually needs.)
 */
export default function useHeroMotion(trackRef, { steps = 2, damping = 0.085 } = {}) {
  const storeRef = useRef(null)
  if (!storeRef.current) {
    storeRef.current = { target: 0, pos: 0, subs: new Set(), frame: 0, last: 0 }
  }

  /** Register a per-frame reader. Called immediately with the current value. */
  const subscribe = useCallback((fn) => {
    const store = storeRef.current
    store.subs.add(fn)
    fn(store.pos)
    return () => store.subs.delete(fn)
  }, [])

  // Layout effect so a reload at a mid-hero scroll position paints the right
  // frame straight away, with no visible jump from position 0.
  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const store = storeRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Reduced motion still scrubs with the scroll, it just doesn't glide after it.
    const ease = reduced ? 1 : damping

    const emit = () => {
      for (const fn of store.subs) fn(store.pos)
    }

    const measure = () => {
      const distance = track.offsetHeight - window.innerHeight
      const scrolled = -track.getBoundingClientRect().top
      store.target = distance > 0 ? clamp(scrolled / distance, 0, 1) * steps : 0
    }

    const tick = (now) => {
      const diff = store.target - store.pos
      if (Math.abs(diff) < 0.0004) {
        store.pos = store.target
        store.frame = 0
        emit()
        return
      }
      // Time-based decay rather than a flat per-frame fraction, so the glide
      // lasts the same ~900ms on a 60Hz screen, a 120Hz screen and a throttled
      // background tab.
      //
      // dt is clamped at both ends: a long stall must not teleport the cups,
      // and it must never go negative — rAF hands back the timestamp of the
      // frame it is *servicing*, which can predate the performance.now() taken
      // when the loop started. A negative exponent there sends the decay to
      // Infinity and every transform to NaN.
      const dt = Math.min(Math.max(now - store.last, 0), 64)
      store.last = now
      store.pos += diff * (ease >= 1 ? 1 : 1 - (1 - ease) ** (dt / 16.667))
      emit()
      store.frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!store.frame) {
        store.last = performance.now()
        store.frame = requestAnimationFrame(tick)
      }
    }

    const onScroll = () => {
      measure()
      start()
    }

    // Land on the right frame immediately — including on a restored scroll
    // position after a reload, where there should be no intro slide.
    measure()
    store.pos = store.target
    emit()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (store.frame) cancelAnimationFrame(store.frame)
      store.frame = 0
    }
  }, [trackRef, steps, damping])

  return { subscribe }
}
