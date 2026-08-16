export default function OrderTimeline({ events }) {
  // The last completed event is the order's current position on the line.
  const currentIndex = events.reduce((acc, e, i) => (e.done ? i : acc), -1)

  return (
    <ol className="relative space-y-6 pl-8">
      <span
        aria-hidden
        className="absolute top-2 bottom-2 left-[7px] w-px bg-hairline"
      />
      {events.map((event, i) => {
        const isCurrent = i === currentIndex
        return (
          <li key={event.label} className="relative">
            <span
              aria-hidden
              className={`absolute top-1 -left-[25px] size-4 rounded-full border-2 ${
                event.done
                  ? isCurrent
                    ? 'border-signal bg-signal'
                    : 'border-go bg-go'
                  : 'border-hairline bg-ink'
              }`}
            />
            <p
              className={`text-sm font-medium ${event.done ? 'text-paper' : 'text-mist'}`}
            >
              {event.label}
            </p>
            <p className="mt-0.5 text-xs text-mist">{event.at}</p>
          </li>
        )
      })}
    </ol>
  )
}
