import { ARC_PATH, ARC_VIEWBOX } from './arcPath'

/**
 * The cream that swallows the hero during the showcase handoff.
 *
 * Rather than crossfading the hero's background to cream, the existing arc
 * *grows*: this is a full-viewport slab of cream with the same curve on its top
 * edge, parked just off the bottom of the stage and tweened upward by GSAP. The
 * hero reads as physically flooding into the next section instead of dissolving
 * into it, and the palette DynamicBackground writes every frame is never
 * touched, so there is nothing to fight over.
 *
 * Two pieces of geometry make this need zero JavaScript measurement:
 *
 *   · `top: 100%` puts it at the stage's bottom edge, which in a flex column
 *     with .hero-base directly below *is* the static arc's top edge. So at rest
 *     the two arcs are pixel co-located by construction, at every breakpoint.
 *   · z-index 25 is inside .hero-stage's stacking context, so it paints over
 *     the beans (5, 15) and the wordmark (10) but under the cups (30 to 40).
 *     The centred cup keeps standing in front of the rising cream, which is the
 *     whole illusion.
 */
export default function CreamRise({ innerRef }) {
  return (
    <div className="hero-cream-rise" ref={innerRef} aria-hidden="true">
      <svg
        className="hero-arc"
        viewBox={ARC_VIEWBOX}
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d={ARC_PATH} fill="var(--color-cream)" />
      </svg>
      <div className="hero-cream-fill" />
    </div>
  )
}
