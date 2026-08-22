import { Fragment } from 'react'

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
