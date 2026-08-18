import { useState } from 'react'
import Reveal from './Reveal'
import { COLLECTIONS } from '../data/site'

export default function Collections() {
  const [activeRoast, setActiveRoast] = useState('All')
  const [cartItems, setCartItems] = useState({})
  const [activeDetailModal, setActiveDetailModal] = useState(null)

  // Filter coffees by roast level profile
  const filteredCollections = COLLECTIONS.filter((item) => {
    if (activeRoast === 'All') return true
    if (activeRoast === 'Light') return item.roast.toLowerCase().includes('light')
    if (activeRoast === 'Medium') return item.roast.toLowerCase().includes('medium')
    if (activeRoast === 'Dark') return item.roast.toLowerCase().includes('dark')
    return true
  })

  const handleAddToCart = (id) => {
    setCartItems((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setCartItems((prev) => ({ ...prev, [id]: false }))
    }, 2400)
  }

  return (
    <section id="collections" className="relative overflow-hidden bg-cream py-24 lg:py-36">
      {/* Background subtle dot texture */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

      {/* Large backdrop watermark wordmark */}
      <span
        className="font-display pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[#3d1f0a]/[0.04]"
        style={{ fontSize: 'clamp(6rem, 22vw, 22rem)', lineHeight: 0.75 }}
        aria-hidden="true"
      >
        Collections
      </span>

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
        
        {/* Section Header */}
        <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#c04e1f]" />
              <p className="text-[0.82rem] font-bold tracking-[0.24em] text-[#b05828] uppercase">
                Collections
              </p>
            </div>
            <h2
              className="font-display mt-4 text-[#3d1f0a]"
              style={{
                fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
              }}
            >
              Four coffees, roasted to order
            </h2>
          </div>

          {/* Filter Pills & Description */}
          <div className="flex flex-col gap-6 lg:items-end">
            <p className="max-w-[24rem] text-[0.96rem] font-normal leading-relaxed text-[#7a5a40]">
              Rotating seasonally. Ships within 48 hours of the roast date, whole bean or ground
              to your specific brewer.
            </p>

            {/* Roast Profile Filters */}
            <div className="inline-flex rounded-full border border-[#3d1f0a]/15 bg-[#f0e7d3] p-1 shadow-inner">
              {['All', 'Light', 'Medium', 'Dark'].map((roast) => {
                const isActive = activeRoast === roast
                return (
                  <button
                    key={roast}
                    type="button"
                    onClick={() => setActiveRoast(roast)}
                    className={`rounded-full px-4 py-1.5 text-[0.8rem] font-bold tracking-[0.06em] transition-all duration-300 ${
                      isActive
                        ? 'bg-[#3d1f0a] text-[#f5edd6] shadow-md'
                        : 'text-[#6b4e36] hover:text-[#3d1f0a]'
                    }`}
                  >
                    {roast === 'All' ? 'All Roasts' : roast}
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Product Cards Grid */}
        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCollections.map((item, i) => {
            const isAdded = cartItems[item.id]

            return (
              <Reveal
                key={item.id}
                delay={i * 100}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#3d1f0a]/15 bg-[#fbf6ea] p-7 shadow-[0_4px_20px_rgba(61,31,10,0.04)] transition-all duration-500 hover:-translate-y-2 hover:border-[#3d1f0a]/30 hover:bg-[#fffdf7] hover:shadow-[0_24px_48px_rgba(61,31,10,0.12)]"
              >
                <div>
                  {/* Top Bar: Numeral Index + Origin Detail Pill */}
                  <div className="flex items-center justify-between border-b border-[#3d1f0a]/10 pb-4">
                    <span className="font-display text-[2.2rem] font-black leading-none text-[#3d1f0a]/20 group-hover:text-[#c04e1f]/40 transition-colors">
                      {item.index}
                    </span>
                    <span className="rounded-full bg-[#eee5d3] px-3 py-1 text-[0.72rem] font-bold tracking-wider text-[#6b4e36] uppercase">
                      {item.altitude} • {item.process}
                    </span>
                  </div>

                  {/* Coffee Name & Origin */}
                  <div className="mt-5">
                    <h3
                      className="font-display text-[#3d1f0a] transition-colors group-hover:text-[#c04e1f]"
                      style={{
                        fontSize: 'clamp(1.75rem, 2.3vw, 2.15rem)',
                        lineHeight: 1,
                        letterSpacing: '-0.025em',
                      }}
                    >
                      {item.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c04e1f]" />
                      <p className="text-[0.8rem] font-bold tracking-[0.14em] text-[#b05828] uppercase">
                        {item.origin}
                      </p>
                    </div>
                  </div>

                  {/* Tasting Note Chips */}
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {item.flavorChips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-md bg-[#ede3cf] px-2.5 py-1 text-[0.75rem] font-medium text-[#5c4028] transition-colors group-hover:bg-[#3d1f0a] group-hover:text-[#f5edd6]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  {/* Roast Level Pip Indicator */}
                  <div className="mt-6 flex items-center justify-between rounded-xl bg-[#eee4d0]/60 p-3">
                    <span className="text-[0.75rem] font-semibold text-[#6b4e36]">
                      Roast: <strong className="text-[#3d1f0a]">{item.roast}</strong>
                    </span>
                    <div className="flex items-center gap-1" title={`Roast Level ${item.roastLevel} of 5`}>
                      {[1, 2, 3, 4, 5].map((pip) => (
                        <span
                          key={pip}
                          className={`h-2.5 w-2.5 rounded-full transition-all ${
                            pip <= item.roastLevel
                              ? 'bg-[#3d1f0a] scale-100'
                              : 'bg-[#d8caae] scale-90'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Add to Cart */}
                <div className="mt-8 pt-4 border-t border-[#3d1f0a]/10">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#7a5a40]">
                        250g Whole Bean
                      </span>
                      <div className="font-display text-[1.8rem] font-bold text-[#3d1f0a]">
                        {item.price}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveDetailModal(item)}
                      className="text-[0.75rem] font-bold text-[#b05828] underline underline-offset-4 hover:text-[#3d1f0a]"
                    >
                      Brew Info
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(item.id)}
                    className={`w-full rounded-full py-3.5 text-[0.88rem] font-bold tracking-[0.06em] uppercase transition-all duration-300 ${
                      isAdded
                        ? 'bg-[#2a6840] text-white shadow-lg scale-[0.98]'
                        : 'bg-[#3d1f0a] text-[#f5edd6] hover:bg-[#c04e1f] hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    {isAdded ? 'Added to Bag ✓' : 'Add to Cart'}
                  </button>
                </div>
              </Reveal>
            )
          })}
        </div>

      </div>

      {/* Quick Brew Info Modal */}
      {activeDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0a02]/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#c8a970]/40 bg-[#fbf6ea] p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveDetailModal(null)}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#eee4d0] text-lg font-bold text-[#3d1f0a] hover:bg-[#3d1f0a] hover:text-white"
            >
              ✕
            </button>

            <span className="text-[0.8rem] font-bold tracking-[0.2em] text-[#c04e1f] uppercase">
              Brew Guide & Specs
            </span>
            <h3 className="font-display mt-1 text-[2.2rem] text-[#3d1f0a]">
              {activeDetailModal.name}
            </h3>
            <p className="text-[0.88rem] font-medium text-[#7a5a40]">
              {activeDetailModal.origin}
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-[#eee4d0]/60 p-5 text-[0.9rem] text-[#3d1f0a]">
              <div className="flex justify-between border-b border-[#3d1f0a]/10 pb-2">
                <span className="text-[#7a5a40]">Elevation</span>
                <span className="font-bold">{activeDetailModal.altitude}</span>
              </div>
              <div className="flex justify-between border-b border-[#3d1f0a]/10 pb-2">
                <span className="text-[#7a5a40]">Processing</span>
                <span className="font-bold">{activeDetailModal.process}</span>
              </div>
              <div className="flex justify-between border-b border-[#3d1f0a]/10 pb-2">
                <span className="text-[#7a5a40]">Ideal Brew Temp</span>
                <span className="font-bold">93°C (199°F)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a5a40]">Recommended Ratio</span>
                <span className="font-bold">1:16 (60g/L)</span>
              </div>
            </div>

            <p className="mt-5 text-[0.92rem] leading-relaxed text-[#6b4e36]">
              {activeDetailModal.notes}
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  handleAddToCart(activeDetailModal.id)
                  setActiveDetailModal(null)
                }}
                className="w-full rounded-full bg-[#3d1f0a] py-3 text-[0.88rem] font-bold text-[#f5edd6] hover:bg-[#c04e1f]"
              >
                Add {activeDetailModal.name} ({activeDetailModal.price})
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
