import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import createCardCopyReveal from './cardCopyReveal'

gsap.registerPlugin(ScrollTrigger)
const TILT_MAX = 3.6
const SWITCH_AT = 0.5
const glide = gsap.parseEase('power2.inOut')
function boxOf(el) {
  const r = el.getBoundingClientRect()
  return { cx: r.left + r.width / 2, top: r.top, h: r.height }
}
export default function useJourneyScene({ transferRefs, legs }) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const layerEl = transferRefs.layer.current
      const cupEl = transferRefs.cup.current
      const tiltEl = transferRefs.tilt.current
      const cropEl = transferRefs.crop.current
      const shadowEl = transferRefs.shadow.current
      if (!layerEl || !cupEl || !tiltEl || !cropEl) return undefined

      const resting = legs.flatMap((leg) => [leg.to.image.current, leg.to.shadow.current])
      gsap.set(resting.filter(Boolean), { opacity: 0 })
      const box = { w: 0, h: 0 }
      const measure = () => {
        box.w = cropEl.offsetWidth
        box.h = cropEl.offsetHeight
      }
      const place = (b) => {
        const s = b.h / box.h
        cupEl.style.transform =
          `translate3d(${(b.cx - (box.w * s) / 2).toFixed(2)}px, ${b.top.toFixed(2)}px, 0) ` +
          `scale(${s.toFixed(5)})`
      }
      const states = legs.map(() => ({ t: 0 }))
      const morphed = new Set()
      const skinAt = (k) =>
        (k === 0 ? null : transferRefs.byId[legs[k - 1].toId]?.current) ??
        transferRefs.image.current
      const paintSkins = () => {
        let at = 0
        for (const state of states) if (state.t >= SWITCH_AT) at += 1
        const alpha = new Map()
        for (let k = 0; k <= legs.length; k += 1) {
          const el = skinAt(k)
          if (!el) continue
          alpha.set(el, Math.max(alpha.get(el) ?? 0, k === at ? 1 : 0))
        }

        alpha.forEach((a, el) => {
          el.style.opacity = String(a)
          morphed.add(el)
        })
      }

      const built = legs
        .map((leg, i) => {
          const root = leg.to.root.current
          const fromImg = leg.from.image.current
          const toImg = leg.to.image.current
          if (!root || !fromImg || !toImg) return null

          const state = states[i]

          const paint = () => {
            if (!box.w || !box.h) return
            let total = 0
            for (const s of states) total += s.t
            if (total <= 0) return

            const a = boxOf(fromImg)
            const b = boxOf(toImg)
            const t = state.t

            place({
              cx: a.cx + (b.cx - a.cx) * glide(t),
              top: a.top + (b.top - a.top) * t,
              h: a.h + (b.h - a.h) * t,
            })
            const swing = Math.sin(Math.PI * t)
            const dir = b.cx < a.cx ? -1 : 1
            tiltEl.style.transform = `rotate(${(dir * TILT_MAX * swing).toFixed(3)}deg)`

            if (shadowEl) shadowEl.style.opacity = (1 - swing).toFixed(3)

            paintSkins()
          }
          const tl = gsap.timeline({ defaults: { ease: 'none' } })
          tl.fromTo(state, { t: 0 }, { t: 1, duration: 1, onUpdate: paint }, 0)

          const copyReveal = createCardCopyReveal({ root, copy: leg.to.copy.current })

          const st = ScrollTrigger.create({
            trigger: root,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.6,
            invalidateOnRefresh: true,
            animation: tl,
            onRefresh: () => {
              measure()
              tl.render(tl.time(), false, true)
            },
          })

          return { st, tl, copyReveal }
        })
        .filter(Boolean)
      const finalStop = legs[legs.length - 1].to
      const exitRoot = finalStop.root.current
      const exitImg = finalStop.image.current
      let exitSt = null

      if (exitRoot && exitImg) {
        const paintExit = (sure) => {
          if (!box.w || !box.h) return
          if (!sure && states[states.length - 1].t < 0.99) return
          place(boxOf(exitImg))
        }

        exitSt = ScrollTrigger.create({
          trigger: exitRoot,
          start: 'bottom bottom',
          end: 'bottom top',
          onUpdate: () => paintExit(true),
          onRefresh: () => paintExit(false),
          onLeave: () => gsap.set(layerEl, { autoAlpha: 0 }),
          onEnterBack: () => {
            paintExit(true)
            gsap.set(layerEl, { autoAlpha: 1 })
          },
        })
      }

      measure()

      return () => {
        exitSt?.kill()
        built.forEach(({ st, tl, copyReveal }) => {
          st.kill()
          tl.kill()
          copyReveal?.st.kill()
          copyReveal?.tl.kill()
        })
        cupEl.style.removeProperty('transform')
        tiltEl.style.removeProperty('transform')
        shadowEl?.style.removeProperty('opacity')
        morphed.forEach((el) => el.style.removeProperty('opacity'))
        morphed.clear()
      }
    })

    return () => mm.revert()
  }, [transferRefs, legs])
}
