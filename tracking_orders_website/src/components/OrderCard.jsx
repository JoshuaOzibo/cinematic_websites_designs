import OrderTimeline from './OrderTimeline'
import StatusBadge from './StatusBadge'

function money(n) {
  return n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })
}

export default function OrderCard({ order }) {
  const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <section className="overflow-hidden rounded-2xl border border-hairline bg-slate-panel">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{order.id}</h2>
          <p className="mt-1 text-sm text-mist">
            {order.carrier} · placed {order.placedOn}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <div className="grid gap-8 px-6 py-6 md:grid-cols-[1.1fr_1fr]">
        <div>
          <h3 className="mb-5 text-xs font-semibold tracking-widest text-mist uppercase">
            Progress
          </h3>
          <OrderTimeline events={order.events} />
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-widest text-mist uppercase">
              Estimated delivery
            </h3>
            <p className="text-xl font-semibold">{order.eta}</p>
            <p className="mt-1 text-sm text-mist">{order.destination}</p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-widest text-mist uppercase">
              Items
            </h3>
            <ul className="divide-y divide-hairline rounded-xl border border-hairline">
              {order.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                >
                  <span>
                    {item.name}
                    <span className="text-mist"> × {item.qty}</span>
                  </span>
                  <span className="tabular-nums">{money(item.price * item.qty)}</span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-4 px-4 py-3 text-sm font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{money(total)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
