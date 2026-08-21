import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * How much of a card's pin the copy takes to assemble.
 *
 * The reveal lives entirely inside the pinned stretch, so this is a fraction of
 * --showcase-pin / --spotlight-pin rather than of the flight. Half leaves the
 * copy finished and simply sitting there for the rest of the pin, which is what
 * makes the card feel arrived at rather than still loading when the next leg
 * takes the cup away.
 */
const PIN_SHARE = 0.5

/**
 * The copy reveal every product card shares.
 *
 * Both scenes call this — useTransferScene for the showcase's card and
 * useJourneyScene for the two below it — so the copy arrives the same way on
 * all three, and retuning it is one edit rather than three that drift.
 *
 * Two passes, not one:
 *
 *   · the eyebrow, the body and the button rise and fade as blocks
 *   · the headline goes word by word, on a much tighter stagger
 *
 * The headline is pulled out of the block pass rather than being animated
 * twice — a word rising inside a block that is itself rising reads as mush.
 * Splitting it is the point: a whole headline sliding up as one slab is
 * furniture moving, where the same words arriving in sequence is text being
 * written, and it is the largest thing on the card, so it is the one element
 * where the difference actually carries.
 *
 * ── Why this is its own ScrollTrigger, and not a tween in the flight ──────
 * It used to be added to the flight's own timeline, and that was quietly
 * breaking the landing. A scrubbed ScrollTrigger maps its scroll range across
 * the *whole* timeline, so a copy reveal sitting at 0.46 and running past the
 * end stretched the timeline to about 1.06 — which meant the flight, nominally
 * ending at 1.0, actually finished at 94% of the scroll and the last 6% went to
 * the text.
 *
 * That 6% is the hang. The entire scene is built on the flight ending on the
 * exact frame its card pins: that is the one moment the destination stops
 * moving, so the cup goes from gliding to still with nothing in between. Finish
 * early and the cup instead arrives while its card is still rising, snaps from
 * a level glide to riding up at page speed, and — on the hero leg, where the
 * destination is frozen at where the slot *will* be — visibly floats there
 * waiting for the card to come and collect it.
 *
 * So the reveal moved out into its own trigger over the pin that follows.
 * `start: 'top top'` on the card's own track is the frame that card pins, which
 * is by construction the frame the cup lands, so the copy now begins exactly
 * when the cup has finished arriving. And the flight timelines are back to a
 * duration of exactly 1, which is what they always assumed they had.
 */
export default function createCardCopyReveal({ root, copy }) {
  if (!root || !copy) return null

  const blocks = Array.from(copy.children).filter(
    (el) => !el.classList.contains('showcase-title'),
  )
  const words = copy.querySelectorAll('.showcase-title .showcase-word')
  if (!blocks.length && !words.length) return null

  // ⚠ fromTo with both ends written out, and immediateRender left on, for the
  // reasons set out at length in useTransferScene: an inferred `to` records
  // whatever the DOM happens to hold the first time it renders, and a refresh
  // can land while the user is already inside the scene. Rendering the from
  // state at build time is also what keeps the copy hidden until its card is
  // reached, rather than flashing in at full strength on load.
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
    // The card's track, not the panel: the panel is sticky, and ScrollTrigger
    // reads a trigger's position off the DOM at refresh time, so a sticky
    // element reports wherever it is currently stuck rather than where it lives.
    trigger: root,
    // The frame this card pins — which is the frame the cup finishes arriving.
    start: 'top top',
    // A share of the pin, measured rather than declared, so the two pin lengths
    // in index.css (and their per-breakpoint overrides) stay the single place
    // this timing comes from.
    end: () =>
      `+=${Math.max(1, Math.round((root.offsetHeight - window.innerHeight) * PIN_SHARE))}`,
    scrub: 0.6,
    animation: tl,
  })

  return { st, tl }
}
