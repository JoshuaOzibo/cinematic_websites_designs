
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
