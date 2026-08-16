import { STATUS_META } from '../data/orders'

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status]
  if (!meta) return null

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-hairline bg-ink/60 px-3 py-1 text-xs font-medium ${meta.color}`}
    >
      <span className={`size-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}
