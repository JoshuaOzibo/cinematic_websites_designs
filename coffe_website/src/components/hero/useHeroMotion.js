import { useCallback, useLayoutEffect, useRef } from 'react'
import { clamp } from './colorUtils'

function computeTarget(track, handoffPx, steps) {
  const distance = track.offsetHeight - window.innerHeight - handoffPx
  const scrolled = -track.getBoundingClientRect().top
  return distance > 0 ? clamp(scrolled / distance, 0, 1) * steps : 0
}

export default function useHeroMotion(trackRef, { steps = 2, damping = 0.085, handoffRef } = {}) {
  const storeRef = useRef(null)
  if (!storeRef.current) {
    storeRef.current = { target: 0, pos: 0, subs: new Set(), frame: 0, last: 0 }
  }

  const subscribe = useCallback((fn) => {
    const store = storeRef.current
    store.subs.add(fn)
    fn(store.pos)
    return () => store.subs.delete(fn)
  }, [])


  const getTarget = useCallback(() => {
    const track = trackRef.current
    if (!track) return storeRef.current.target
    return computeTarget(track, handoffRef?.current?.offsetHeight ?? 0, steps)
  }, [trackRef, handoffRef, steps])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const store = storeRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ease = reduced ? 1 : damping

    const emit = () => {
      for (const fn of store.subs) fn(store.pos)
    }

    const measure = () => {
      store.target = computeTarget(track, handoffRef?.current?.offsetHeight ?? 0, steps)
    }

    const tick = (now) => {
      const diff = store.target - store.pos
      if (Math.abs(diff) < 0.0004) {
        store.pos = store.target
        store.frame = 0
        emit()
        return
      }
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
  }, [trackRef, steps, damping, handoffRef])

  return { subscribe, getTarget }
}
