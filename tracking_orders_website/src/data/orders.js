// Mock order store. Swap this module for a real API call — the shape below is
// what the UI components expect.

export const ORDERS = [
  {
    id: 'TRK-4821',
    carrier: 'Northwind Express',
    placedOn: 'Aug 9, 2026',
    eta: 'Aug 16, 2026',
    status: 'in_transit',
    destination: '14 Marlow Street, Leeds, LS1 4PR',
    items: [
      { name: 'Aeropress Go', qty: 1, price: 42.0 },
      { name: 'Burr grinder — matte black', qty: 1, price: 129.5 },
    ],
    events: [
      { label: 'Order placed', at: 'Aug 9, 09:14', done: true },
      { label: 'Payment confirmed', at: 'Aug 9, 09:15', done: true },
      { label: 'Packed at warehouse', at: 'Aug 11, 16:02', done: true },
      { label: 'In transit — Manchester hub', at: 'Aug 13, 07:40', done: true },
      { label: 'Out for delivery', at: 'Expected Aug 16', done: false },
      { label: 'Delivered', at: '—', done: false },
    ],
  },
  {
    id: 'TRK-1190',
    carrier: 'Halo Logistics',
    placedOn: 'Jul 28, 2026',
    eta: 'Aug 3, 2026',
    status: 'delivered',
    destination: '8 Quarry Lane, Bristol, BS1 2HD',
    items: [{ name: 'Ceramic pour-over set', qty: 2, price: 68.0 }],
    events: [
      { label: 'Order placed', at: 'Jul 28, 11:02', done: true },
      { label: 'Payment confirmed', at: 'Jul 28, 11:03', done: true },
      { label: 'Packed at warehouse', at: 'Jul 29, 08:20', done: true },
      { label: 'In transit — Bristol hub', at: 'Aug 2, 05:11', done: true },
      { label: 'Out for delivery', at: 'Aug 3, 07:55', done: true },
      { label: 'Delivered — signed by J. Ozibo', at: 'Aug 3, 13:26', done: true },
    ],
  },
  {
    id: 'TRK-7734',
    carrier: 'Northwind Express',
    placedOn: 'Aug 12, 2026',
    eta: 'Aug 21, 2026 (delayed)',
    status: 'delayed',
    destination: '221 Ferry Road, Edinburgh, EH5 3AN',
    items: [
      { name: 'Espresso machine — Lira 3', qty: 1, price: 899.0 },
      { name: 'Tamper, 58mm', qty: 1, price: 34.0 },
    ],
    events: [
      { label: 'Order placed', at: 'Aug 12, 18:33', done: true },
      { label: 'Payment confirmed', at: 'Aug 12, 18:34', done: true },
      { label: 'Packed at warehouse', at: 'Aug 14, 10:07', done: true },
      { label: 'Delayed — customs hold', at: 'Aug 15, 04:19', done: true },
      { label: 'Out for delivery', at: 'Rescheduled', done: false },
      { label: 'Delivered', at: '—', done: false },
    ],
  },
]

export const STATUS_META = {
  in_transit: { label: 'In transit', color: 'text-signal', dot: 'bg-signal' },
  delivered: { label: 'Delivered', color: 'text-go', dot: 'bg-go' },
  delayed: { label: 'Delayed', color: 'text-warn', dot: 'bg-warn' },
}

export function findOrder(query) {
  const q = query.trim().toLowerCase()
  if (!q) return null
  return ORDERS.find((o) => o.id.toLowerCase() === q) ?? null
}
