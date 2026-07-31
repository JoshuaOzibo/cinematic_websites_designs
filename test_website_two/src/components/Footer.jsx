import React, { useState } from 'react';
import { Flame, MapPin, Clock, Phone, Mail, Globe, Share2, ArrowRight, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail('');
  };

  return (
    <footer id="location" className="relative z-20 bg-[#040407] border-t border-white/10 pt-20 pb-12 px-6 md:px-12 text-slate-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.5)]">
              <Flame size={16} className="text-black fill-black" />
            </div>
            <span className="font-heading font-extrabold tracking-widest text-white uppercase text-base">
              AURA <span className="text-amber-500">ROYALE</span>
            </span>
          </div>

          <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
            A revolutionary cinematic smash burger lounge. 100% Miyazaki A5 Wagyu, 72-hour Hokkaido brioche, and 14-hour hickory smoke.
          </p>

          <div className="flex gap-3 pt-2">
            <a href="#hero" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-colors">
              <Globe size={14} />
            </a>
            <a href="#hero" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-colors">
              <Share2 size={14} />
            </a>
          </div>
        </div>


        {/* Col 2: Hours & Sourcing */}
        <div className="space-y-3">
          <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
            Flagship Hours
          </h4>
          <div className="space-y-2 text-xs font-sans text-slate-400">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-amber-500" />
              <span>Monday – Thursday: 11:30 AM – 11:30 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-orange-400" />
              <span>Friday – Sunday: 11:30 AM – 1:30 AM</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400 font-bold pt-1">
              <Flame size={13} />
              <span>Late Night Griddle Active</span>
            </div>
          </div>
        </div>

        {/* Col 3: Location */}
        <div className="space-y-3">
          <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
            Flagship Lounge
          </h4>
          <div className="space-y-2 text-xs font-sans text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <span>450 Hudson Street, West Village<br />New York, NY 10014</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Phone size={13} className="text-amber-500" />
              <span>+1 (212) 555-ROYALE</span>
            </div>
          </div>
        </div>

        {/* Col 4: VIP Newsletter */}
        <div className="space-y-3">
          <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
            VIP Smoke Pass
          </h4>
          <p className="font-sans text-xs text-slate-400">
            Subscribe for private chef tasting invites and instant 15% welcome code.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input 
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-500 font-sans"
            />
            <button 
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-black px-4 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center"
            >
              {subscribed ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </form>
          {subscribed && (
            <span className="text-[10px] font-sans font-bold text-amber-400 block animate-in fade-in">
              VIP Pass Code "ROYALE15" Sent to Email!
            </span>
          )}
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-slate-500 gap-4">
        <span>© {new Date().getFullYear()} AURA ROYALE SMOKEHOUSE. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-6">
          <a href="#hero" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
          <a href="#hero" className="hover:text-amber-400 transition-colors">Terms of Dining</a>
          <a href="#hero" className="hover:text-amber-400 transition-colors">Allergen Info</a>
        </div>
      </div>
    </footer>
  );
}
