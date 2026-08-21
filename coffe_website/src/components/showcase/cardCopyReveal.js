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
 * Positioned in timeline units, so this is scrubbed by the scroll like
 * everything else in the scene it is added to: the copy assembles as the cup
 * comes in and disassembles if you scroll back up.
 *
 * `at` is where the block pass starts. The words follow a beat later so the
 * eyebrow has established itself first.
 */
export default function addCardCopyReveal(tl, copyEl, at) {
  if (!copyEl) return

  const blocks = Array.from(copyEl.children).filter(
    (el) => !el.classList.contains('showcase-title'),
  )
  const words = copyEl.querySelectorAll('.showcase-title .showcase-word')

  // ⚠ fromTo with both ends written out, and immediateRender left on, for the
  // reasons set out at length in useTransferScene: an inferred `to` records
  // whatever the DOM happens to hold the first time it renders, and a refresh
  // can land while the user is already inside the scene. Rendering the from
  // state at build time is also what keeps the copy hidden until its card is
  // reached, rather than flashing in at full strength on load.
  if (blocks.length) {
    tl.fromTo(
      blocks,
      { autoAlpha: 0, y: 34 },
      { autoAlpha: 1, y: 0, duration: 0.34, ease: 'power2.out', stagger: 0.07 },
      at,
    )
  }

  if (words.length) {
    tl.fromTo(
      words,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power3.out', stagger: 0.04 },
      at + 0.04,
    )
  }
}
