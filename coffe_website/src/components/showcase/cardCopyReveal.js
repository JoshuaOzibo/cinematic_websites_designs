import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
const PIN_SHARE = 0.5
export default function createCardCopyReveal({ root, copy }) {
  if (!root || !copy) return null

  const blocks = Array.from(copy.children).filter(
    (el) => !el.classList.contains('showcase-title'),
  )
  const words = copy.querySelectorAll('.showcase-title .showcase-word')
  if (!blocks.length && !words.length) return null
  const tl = gsap.timeline()

  if (blocks.length) {
    tl.fromTo(
      blocks,
      { autoAlpha: 0, y: 34 },
      { autoAlpha: 1, y: 0, duration: 0.34, ease: 'power2.out', stagger: 0.07 },
      0,
    )
  }

  if (words.length) {
    tl.fromTo(
      words,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power3.out', stagger: 0.04 },
      0.04,
    )
  }

  const st = ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: () =>
      `+=${Math.max(1, Math.round((root.offsetHeight - window.innerHeight) * PIN_SHARE))}`,
    scrub: 0.6,
    animation: tl,
  })

  return { st, tl }
}
