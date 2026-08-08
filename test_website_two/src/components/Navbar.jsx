import React from 'react';
import { Flame, ShoppingBag, Calendar, Sparkles, MapPin } from 'lucide-react';

export default function Navbar({ cartCount, onOpenCart, onOpenReserve }) {
  return (
    <nav className="fixed top-5 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-6xl z-50 transition-all duration-300">
      <div className="glass-panel rounded-full px-6 py-3.5 flex items-center justify-between shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/10">
        
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.5)] group-hover:scale-105 transition-transform duration-300">
            <Flame size={18} className="text-black font-extrabold fill-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold tracking-widest text-white uppercase text-base leading-none">
              AURA <span className="text-amber-500">ROYALE</span>
            </span>
            <span className="font-sans text-[9px] tracking-[0.25em] text-amber-500/80 uppercase font-semibold">
              ARTISAN SMOKEHOUSE
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="#hero" className="font-sans text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" />
            <span>Anatomy</span>
          </a>
          <a href="#location" className="font-sans text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1">
            <MapPin size={13} className="text-orange-400" />
            <span>Locate Us</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <button 
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-white transition-all cursor-pointer group"
            title="View Order"
          >
            <ShoppingBag size={18} className="group-hover:scale-110 transition-transform text-amber-400" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-black text-[10px] font-extrabold flex items-center justify-center shadow-[0_0_10px_rgba(255,107,0,0.8)] animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Reserve Table Button */}
          <button 
            onClick={onOpenReserve}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black px-5 py-2.5 rounded-full font-sans text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_25px_rgba(255,107,0,0.5)] cursor-pointer flex items-center gap-2"
          >
            <Calendar size={14} className="text-black" />
            <span className="hidden sm:inline">Reserve Table</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
