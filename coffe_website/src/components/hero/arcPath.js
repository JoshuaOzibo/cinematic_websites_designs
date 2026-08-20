/**
 * The one cream arc, shared by every place that draws it.
 *
 * Three components stamp this shape: the hero's cream base (BottomInfo), the
 * cream mass that rises during the showcase handoff (CreamRise), and the
 * footer (filled dark instead of cream). They have to stay identical — the
 * handoff literally lerps a cup across the boundary between the first two, and
 * a few pixels of drift there reads as a broken seam. One constant, no copies.
 *
 * The path is drawn in a 1440x100 viewBox and stretched with
 * preserveAspectRatio="none", so the arc rides high across the middle and falls
 * away toward both edges however wide the viewport gets.
 */
export const ARC_VIEWBOX = '0 0 1440 100'

export const ARC_PATH =
  'M0 100 L0 82 C 300 82 402 6 720 6 C 1038 6 1140 82 1440 82 L1440 100 Z'

/**
 * How high the arc's crest sits, as a fraction of the rendered arc height.
 * The control points peak at y=6 of the 100-unit viewBox, so the cream's top
 * edge at the centre of the screen is 6% down from the top of the arc box.
 *
 * The handoff needs this to work out how much of the cup the arc is currently
 * hiding. If you retune the path, retune this with it.
 */
export const ARC_PEAK = 0.06
