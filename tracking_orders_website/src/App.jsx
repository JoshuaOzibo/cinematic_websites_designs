import { useState } from 'react'
import OrderCard from './components/OrderCard'
import StatusBadge from './components/StatusBadge'
import TrackingForm from './components/TrackingForm'
import { ORDERS, findOrder } from './data/orders'

export default function App() {
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  function handleSearch(query) {
    if (!query.trim()) {
      setOrder(null)
      setError('Enter a tracking number to continue.')
      return
    }
    const match = findOrder(query)
    setOrder(match)
    setError(match ? '' : `No order found for “${query.trim()}”.`)
  }

  function selectOrder(id) {
    setOrder(findOrder(id))
    setError('')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="text-sm font-semibold tracking-widest uppercase">
            Parcel<span className="text-signal">Track</span>
          </span>
          <nav className="text-sm text-mist">
            <a href="#recent" className="transition hover:text-paper">
              Recent orders
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Where is my order?
        </h1>
        <p className="mt-3 max-w-xl text-mist">
          Enter the tracking number from your confirmation email to see every
          scan, hand-off and delivery estimate in one place.
        </p>

        <div className="mt-8 max-w-2xl">
          <TrackingForm onSearch={handleSearch} error={error} />
        </div>

        {order && (
          <div className="mt-12">
            <OrderCard order={order} />
          </div>
        )}

        <section id="recent" className="mt-16">
          <h2 className="text-xs font-semibold tracking-widest text-mist uppercase">
            Recent orders
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {ORDERS.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => selectOrder(o.id)}
                  className={`w-full rounded-xl border bg-slate-panel px-4 py-4 text-left transition hover:border-signal/60 ${
                    order?.id === o.id ? 'border-signal' : 'border-hairline'
                  }`}
                >
                  <span className="block font-semibold">{o.id}</span>
                  <span className="mt-1 block text-sm text-mist">{o.carrier}</span>
                  <span className="mt-3 block">
                    <StatusBadge status={o.status} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-hairline">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-mist">
          ParcelTrack — demo data only, no live carrier integration.
        </div>
      </footer>
    </div>
  )
}
