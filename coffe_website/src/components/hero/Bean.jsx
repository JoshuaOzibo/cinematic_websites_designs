/**
 * A single coffee bean photo. Purely decorative — FloatingBeans scatters a
 * dozen of these across two parallax planes, each with its own drift
 * distance, duration and delay so they never fall into lockstep.
 */
export default function Bean({ image, size = 34, className = '', style }) {
  return (
    <img
      src={image}
      alt=""
      draggable="false"
      className={className}
      style={{ width: size, height: 'auto', display: 'block', ...style }}
    />
  )
}
