import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import createCardCopyReveal from './cardCopyReveal'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({ ignoreMobileResize: true })

const TILT_MAX = -4
function offsetWithin(el, ancestor) {
  let x = 0
  let y = 0
  let node = el
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
  }
  return { x, y }
}
export default function useTransferScene({
  heroTrackRef,
  trackRef,
  transferRefs,
  slotRefs,
  copyRef,
  lockedRef,
  resolveActive,
}) {
  useLayoutEffect(() => {
    const heroTrack = heroTrackRef.current
    const track = trackRef.current
    if (!heroTrack || !track) return undefined

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const viewport = heroTrack.querySelector('.hero-viewport')
      const cups = heroTrack.querySelector('.hero-cups')
      const probe = heroTrack.querySelector('.hero-handoff-probe')
      const creamRise = heroTrack.querySelector('.hero-cream-rise')
      const wordmark = heroTrack.querySelector('.hero-wordmark')
      const panel = heroTrack.querySelector('.hero-panel')
      const panelInner = heroTrack.querySelector('.hero-panel-inner')
      const beanPlanes = heroTrack.querySelectorAll('.hero-bean-parallax')
      if (!viewport || !cups || !probe || !creamRise) return undefined

      const layer = transferRefs.layer.current
      const cup = transferRefs.cup.current
      const tilt = transferRefs.tilt.current
      if (!layer || !cup || !tilt || !transferRefs.crop.current) return undefined

      const showcaseViewport = track.querySelector('.showcase-viewport')
      if (!showcaseViewport) return undefined

      const src = { x: 0, y: 0, w: 0, ready: false }
      const dst = { x: 0, y: 0, w: 0, ready: false }
      const flight = { t: 0 }
      const activeCupElRef = { current: null }
      const swap = { v: 1 }
      const applySwap = () =>
        activeCupElRef.current?.style.setProperty('--cup-swap', swap.v.toFixed(4))
      const cue = { v: 0 }
      const applyLayerVisibility = () =>
        gsap.set(layer, { autoAlpha: cue.v > 0.5 && src.ready && dst.ready ? 1 : 0 })

      const measure = () => {
        src.ready = false
        dst.ready = false
        const slotImg = slotRefs.image.current
        if (!slotImg) return
        const dw = slotImg.offsetWidth
        if (!dw) return
        const to = offsetWithin(slotImg, showcaseViewport)
        dst.x = to.x
        dst.y = to.y
        dst.w = dw
        dst.ready = true

        const index = resolveActive(true)
        const cupEls = cups.querySelectorAll('.hero-cup')
        const cupEl = cupEls[index]
        const heroImg = cupEl?.querySelector('.hero-cup-img')
        if (!cupEl || !heroImg) return

        const w = heroImg.offsetWidth
        if (!w) return
        const { x, y } = offsetWithin(cupEl, viewport)
        src.x = x - w / 2
        src.y = y
        src.w = w
        src.ready = true
        cupEls.forEach((el) => el.style.removeProperty('--cup-swap'))
        activeCupElRef.current = cupEl
        applySwap()
        applyLayerVisibility()
      }
      const paint = (t) => {
        if (!src.ready || !dst.ready) return

        const slotImg = slotRefs.image.current
        const liveY = slotImg ? slotImg.getBoundingClientRect().top : dst.y
        const lock = t * t * t
        const aimY = dst.y + (liveY - dst.y) * lock

        const x = src.x + (dst.x - src.x) * t
        const y = src.y + (aimY - src.y) * t
        const s = (src.w + (dst.w - src.w) * t) / src.w

        cup.style.transform =
          `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s.toFixed(5)})`
        tilt.style.transform = `rotate(${(TILT_MAX * Math.sin(Math.PI * t)).toFixed(3)}deg)`
      }

      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      tl.fromTo(creamRise, { yPercent: 0 }, { yPercent: -50, duration: 0.7, ease: 'power1.inOut' }, 0)

      if (wordmark) {
        tl.fromTo(
          wordmark,
          { yPercent: 0, autoAlpha: 1 },
          { yPercent: -200, autoAlpha: 0, duration: 0.65, ease: 'power1.in' },
          0.02,
        )
      }

      if (beanPlanes.length) {
        tl.fromTo(
          beanPlanes,
          { y: 0 },
          {
            y: (_i, target) => -240 * parseFloat(target.dataset.depth || '1'),
            duration: 0.7,
            ease: 'power1.out',
          },
          0,
        )
      }
      if (panel && panelInner) {
        tl.fromTo(
          panelInner,
          { y: 0 },
          { y: () => panel.offsetHeight, duration: 0.12, ease: 'power2.in' },
          0,
        )
      }
      tl.fromTo(cue, { v: 0 }, { v: 1, duration: 0.001, onUpdate: applyLayerVisibility }, 0.12)
      tl.fromTo(
        swap,
        { v: 1 },
        { v: 0, duration: 0.001, onUpdate: applySwap },
        0.15,
      )
      tl.fromTo(
        flight,
        { t: 0 },
        { t: 1, duration: 0.85, ease: 'power2.inOut', onUpdate: () => paint(flight.t) },
        0.15,
      )
      if (transferRefs.shadow.current) {
        tl.fromTo(transferRefs.shadow.current, { opacity: 1 }, { opacity: 0, duration: 0.25 }, 0.15)
        tl.fromTo(
          transferRefs.shadow.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.22, ease: 'power2.out', immediateRender: false },
          0.78,
        )
      }
      gsap.set([slotRefs.image.current, slotRefs.shadow.current].filter(Boolean), { opacity: 0 })
      const setLock = (self) => {
        lockedRef.current = self.progress > 0
      }
      let copyReveal = null
      const arm = (self) => {
        setLock(self)
        tl.render(tl.time(), false, true)

        measure()
        paint(flight.t)
        copyReveal?.st.kill()
        copyReveal?.tl.kill()
        copyReveal = createCardCopyReveal({ root: track, copy: copyRef.current })
      }

      const st = ScrollTrigger.create({
        trigger: track,
        start: () => `top bottom+=${probe.offsetHeight}`,
        end: 'top top',
        scrub: 0.6,
        invalidateOnRefresh: true,
        animation: tl,
        onEnter: arm,
        onEnterBack: arm,
        onRefresh: arm,
        onLeave: setLock,
        onLeaveBack: setLock,
      })

      let fontsPending = true
      document.fonts?.ready.then(() => {
        if (fontsPending) ScrollTrigger.refresh()
      })

      let decodePending = true
      const imgs = [transferRefs.image.current, slotRefs.image.current].filter(Boolean)
      Promise.all(imgs.map((img) => img.decode?.().catch(() => {}) ?? Promise.resolve())).then(
        () => {
          if (decodePending) ScrollTrigger.refresh()
        },
      )

      return () => {
        fontsPending = false
        decodePending = false
        st.kill()
        tl.kill()
        copyReveal?.st.kill()
        copyReveal?.tl.kill()
        cups
          .querySelectorAll('.hero-cup')
          .forEach((el) => el.style.removeProperty('--cup-swap'))
        cup.style.removeProperty('transform')
        tilt.style.removeProperty('transform')
        layer.style.removeProperty('opacity')
        layer.style.removeProperty('visibility')
      }
    })

    return () => mm.revert()
  }, [heroTrackRef, trackRef, transferRefs, slotRefs, copyRef, lockedRef, resolveActive])
}
