import { useState } from 'react'

export default function TrackingForm({ onSearch, error }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="tracking-id" className="sr-only">
          Tracking number
        </label>
        <input
          id="tracking-id"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a tracking number — e.g. TRK-4821"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-hairline bg-slate-panel px-4 py-3 text-paper placeholder:text-mist/70 outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/30"
        />
        <button
          type="submit"
          className="rounded-xl bg-signal px-6 py-3 font-semibold text-ink transition hover:brightness-110 active:brightness-95"
        >
          Track order
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-warn">{error}</p>}
    </form>
  )
}
