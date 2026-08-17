/**
 * The giant cream "COFFEE" behind the cups.
 *
 * Drawn as SVG text with `textLength` + `lengthAdjust="spacingAndGlyphs"` and
 * `preserveAspectRatio="none"`, which means the word is stretched to exactly
 * fill its box in both axes. Two things fall out of that:
 *
 *   - the editorial ultra-condensed-and-tall look of the reference comes from
 *     the box ratio, not from the font's natural proportions, and
 *   - it fills the same way at every viewport width and even before the webfont
 *     has loaded, so there is no reflow and no font-metric guesswork.
 *
 * The box is sized by --word-* tokens in index.css.
 */
export default function HeroWordmark() {
  return (
    <div className="hero-wordmark" aria-hidden="true">
      <svg
        viewBox="0 0 1000 280"
        preserveAspectRatio="none"
        focusable="false"
        className="hero-wordmark-svg"
      >
        <text
          x="500"
          y="240"
          textAnchor="middle"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fontSize="262"
          fill="currentColor"
        >
          COFFEE
        </text>
      </svg>
    </div>
  )
}
