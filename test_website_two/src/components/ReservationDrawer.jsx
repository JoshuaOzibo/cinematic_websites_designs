import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Calendar, Clock, Users, Check, Flame, ShoppingBag, ArrowRight } from 'lucide-react';

export default function ReservationDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  initialTab = 'cart'
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('2026-08-01');
  const [timeSlot, setTimeSlot] = useState('7:30 PM');
  const [isReserved, setIsReserved] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08875; // NYC tax rate sample
  const total = subtotal + tax;

  const handleBookTable = (e) => {
    e.preventDefault();
    setIsReserved(true);
    setTimeout(() => {
      setIsReserved(false);
      onClose();
    }, 2200);
  };

  const handleCheckoutOrder = () => {
    setIsOrdered(true);
    setTimeout(() => {
      setIsOrdered(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in">
      
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md h-full bg-[#0a0a12] border-l border-white/10 p-6 flex flex-col justify-between shadow-[0_0_80px_rgba(0,0,0,0.95)] z-10 overflow-y-auto">
        
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-amber-500 fill-amber-500" />
              <span className="font-heading font-extrabold text-lg text-white uppercase tracking-wider">
                AURA <span className="text-amber-500">ROYALE</span>
              </span>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex bg-black/50 p-1 rounded-xl border border-white/5 mb-6">
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex-1 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'cart' 
                  ? 'bg-amber-500 text-black shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag size={14} />
              <span>Your Order ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
            </button>

            <button
              onClick={() => setActiveTab('reserve')}
              className={`flex-1 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'reserve' 
                  ? 'bg-amber-500 text-black shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar size={14} />
              <span>VIP Table</span>
            </button>
          </div>

          {/* TAB 1: CART ITEMS */}
          {activeTab === 'cart' && (
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-3">
                  <ShoppingBag size={40} className="text-slate-600" />
                  <p className="font-sans text-sm font-light">Your order is currently empty.</p>
                  <span className="text-xs text-amber-500 font-semibold">Select items from our menu to begin.</span>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="glass-card rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-heading font-bold text-sm text-white uppercase">{item.name}</h4>
                      <span className="font-mono text-xs text-amber-400 font-bold block mt-0.5">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono text-xs font-bold text-white px-1">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: VIP TABLE RESERVATION */}
          {activeTab === 'reserve' && (
            <form onSubmit={handleBookTable} className="space-y-4">
              <div>
                <label className="font-sans text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Party Size (Guests)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 4, 6, 8].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                        guests === num 
                          ? 'bg-amber-500 text-black border-amber-500' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-sans text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Reservation Date
                </label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="font-sans text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['5:30 PM', '7:00 PM', '8:30 PM', '9:45 PM', '10:30 PM'].map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                        timeSlot === slot 
                          ? 'bg-amber-500 text-black border-amber-500' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isReserved}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-sans text-xs font-extrabold uppercase tracking-widest shadow-[0_8px_25px_rgba(245,158,11,0.4)] cursor-pointer flex items-center justify-center gap-2"
                >
                  {isReserved ? (
                    <>
                      <Check size={16} />
                      <span>Reservation Confirmed!</span>
                    </>
                  ) : (
                    <>
                      <Calendar size={15} />
                      <span>Book VIP Table</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer Checkout Summary (For Cart Tab) */}
        {activeTab === 'cart' && cartItems.length > 0 && (
          <div className="border-t border-white/10 pt-4 mt-6 space-y-3">
            <div className="flex justify-between text-xs font-sans text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-sans text-slate-400">
              <span>Est. Tax (8.875%)</span>
              <span className="font-mono text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-heading font-extrabold text-white border-t border-white/10 pt-2">
              <span>TOTAL</span>
              <span className="font-mono text-amber-400">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckoutOrder}
              disabled={isOrdered}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-black font-sans text-xs font-extrabold uppercase tracking-widest shadow-[0_8px_30px_rgba(245,158,11,0.5)] cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
              {isOrdered ? (
                <>
                  <Check size={16} />
                  <span>Order Placed & Kitchen Notified!</span>
                </>
              ) : (
                <>
                  <span>Place Order • ${total.toFixed(2)}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
