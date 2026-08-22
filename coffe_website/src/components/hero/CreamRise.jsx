import { ARC_PATH, ARC_VIEWBOX } from './arcPath'
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
