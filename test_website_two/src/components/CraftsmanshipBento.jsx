import React, { useState, useEffect } from 'react';
import { Flame, ShieldCheck, Clock, Thermometer, Award, Sparkles, Cpu, RefreshCw } from 'lucide-react';

export default function CraftsmanshipBento() {
  const [griddleTemp, setGriddleTemp] = useState(476);
  const [activeSearTime, setActiveSearTime] = useState(142);

  // Live griddle temperature micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setGriddleTemp(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(470, Math.min(482, prev + delta));
      });
      setActiveSearTime(prev => prev + 1);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="craftsmanship" className="relative z-20 py-24 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[10px] font-extrabold tracking-[0.25em] text-amber-500 uppercase px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5">
          CULINARY ARCHITECTURE
        </span>
        <h2 className="font-heading font-extrabold text-4xl md:text-6xl text-white uppercase tracking-tight italic mt-4">
          CRAFTSMANSHIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">& DIAGNOSTICS</span>
        </h2>
        <p className="font-sans text-sm text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed font-light">
          We combine old-world smokehouse techniques with precision heat metrics to guarantee every single bite is extraordinary.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Griddle Heat Telemetry (Live Ticker) */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col justify-between h-80 relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
              <Thermometer size={24} />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              LIVE GRIDDLE TEMP
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
              Maillard Reaction Target
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="font-mono font-extrabold text-5xl text-white">
                {griddleTemp}°F
              </h3>
              <span className="text-xs text-amber-400 font-bold uppercase">OPTIMAL SEAR</span>
            </div>
          </div>

          <div className="w-full bg-black/40 p-3 rounded-2xl border border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-300">
            <span>Sear Crust Index: 99.4%</span>
            <span className="text-amber-400 font-bold">Cast Iron #04</span>
          </div>
        </div>

        {/* Card 2: 100% Japanese A5 Wagyu Traceability */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col justify-between h-80 md:col-span-2 relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/20">
                <Award size={24} />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-xl text-white uppercase tracking-tight">
                  100% Miyazaki A5 Wagyu
                </h4>
                <span className="text-xs text-amber-400 font-semibold">BMS Grade 12 Certified Sourcing</span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              ORIGIN: MIYAZAKI, JAPAN
            </span>
          </div>

          <p className="font-sans text-xs text-slate-300 leading-relaxed font-light my-4">
            Our smash beef is custom blended daily using whole muscle cuts of A5 Wagyu chuck, short rib, and dry-aged brisket. This ratio delivers supreme oleic acid richness that melts instantly on hot steel.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
            <div>
              <span className="font-mono font-extrabold text-xl text-white block">100%</span>
              <span className="text-[9px] font-sans text-slate-400 uppercase">Single Origin</span>
            </div>
            <div>
              <span className="font-mono font-extrabold text-xl text-amber-400 block">72 HRS</span>
              <span className="text-[9px] font-sans text-slate-400 uppercase">Dry Aging</span>
            </div>
            <div>
              <span className="font-mono font-extrabold text-xl text-orange-400 block">0%</span>
              <span className="text-[9px] font-sans text-slate-400 uppercase">Fillers / Hormones</span>
            </div>
          </div>
        </div>

        {/* Card 3: 72-Hour Hokkaido Brioche Dough */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col justify-between h-80 md:col-span-2 relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-xl text-white uppercase tracking-tight">
                  72-Hour Fermented Hokkaido Brioche
                </h4>
                <span className="text-xs text-slate-400">Pillowy Soft with Golden Crust</span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              BAKED FRESH DAILY
            </span>
          </div>

          <p className="font-sans text-xs text-slate-300 leading-relaxed font-light my-4">
            Each bun undergoes a triple cold-fermentation process using organic high-protein Hokkaido wheat flour and cultured French butter. Before serving, buns are toasted face-down in clarified black truffle butter.
          </p>

          <div className="w-full bg-black/40 p-3 rounded-2xl border border-white/5 flex justify-between items-center text-xs font-mono text-slate-300">
            <span>Today's Batch Baked: 450 Buns</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Sparkles size={13} /> Truffle Toasting Active
            </span>
          </div>
        </div>

        {/* Card 4: House Bourbon Smoke Jam */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col justify-between h-80 relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/20">
              <Flame size={24} />
            </div>
            <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/20">
              14-HOUR SMOKE
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
              Bourbon Bacon Jam
            </span>
            <h4 className="font-heading font-extrabold text-2xl text-white uppercase tracking-tight mt-1">
              Hickory Embers
            </h4>
          </div>

          <p className="font-sans text-xs text-slate-300 leading-relaxed font-light">
            Slow-simmered in copper kettles with Kentucky small-batch bourbon, caramelized shallots, and applewood bacon.
          </p>
        </div>

      </div>

    </section>
  );
}
