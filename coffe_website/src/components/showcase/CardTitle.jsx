import { Fragment } from 'react'

/**
 * The headline on a product card, split into words.
 *
 * One span per word, so the reveal can stagger across the line instead of
 * moving the whole headline as a single block — see addCardCopyReveal, which
 * finds them by class. Split here in the markup rather than by walking text
 * nodes at animation time, because the scenes below run inside gsap.matchMedia
 * and would have to undo a DOM rewrite on every revert.
 *
 * The spaces are their own text nodes between the spans, deliberately. A
 * trailing space *inside* an inline-block is collapsed away at its edge, so
 * folding them into the words runs the whole headline together.
 *
 * Shared by both cards that have one — the showcase's and the spotlights' — so
 * the type scale lives in one place and the two can't drift apart.
 */
export default function CardTitle({ text }) {
  const words = text.split(/\s+/).filter(Boolean)

  return (
    <h2
      className="font-display showcase-title"
      style={{
        fontSize: 'clamp(2rem, 4.4vw, 3.9rem)',
        lineHeight: 0.98,
        letterSpacing: '-0.025em',
      }}
    >
      {words.map((word, i) => (
        <Fragment key={`${i}-${word}`}>
          {i > 0 ? ' ' : null}
          <span className="showcase-word">{word}</span>
        </Fragment>
      ))}
    </h2>
  )
}
