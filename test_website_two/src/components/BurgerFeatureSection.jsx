import React from 'react';
import { Flame, Heart, Layers, Sparkles, Home, Shield, Award, Zap } from 'lucide-react';

export default function BurgerFeatureSection() {
  return (
    <section id="features" className="w-full min-h-screen bg-white text-slate-900 py-20 md:py-32 px-6 md:px-16 flex items-center select-none overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Reserved Space for Hamburger Image */}
        <div className="lg:col-span-5 flex items-center justify-center relative min-h-[350px] md:min-h-[480px]">
          {/* Static placeholder image showing assembled burger on white */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            <img 
              src="/background-remover/ezgif-frame-096.png" 
              alt="Aura Royale Assembled Burger" 
              className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.12)]"
            />
          </div>
        </div>

        {/* Right Column: Reference Layout Matching User Image */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Headline matching image style */}
          <h2 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[0.95] text-slate-950">
            FRESH-HOT & MADE <br />
            <span className="text-[#c83232]">TO AURA ROAR</span>
          </h2>

          {/* 2x2 Feature Grid matching reference image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mt-10 md:mt-12">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-900 shrink-0 mt-1">
                <Home size={22} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-heading font-black text-lg text-slate-900 uppercase tracking-wide">
                  Handcrafted Patty
                </h3>
                <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed font-light mt-1">
                  100% Japanese A5 Wagyu smashed hot on 475°F cast iron to lock in marrow juices and crispy lacy crust.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-900 shrink-0 mt-1">
                <Heart size={22} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-heading font-black text-lg text-slate-900 uppercase tracking-wide">
                  Artisanal Glaze
                </h3>
                <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed font-light mt-1">
                  72-hour fermented Hokkaido brioche bun toasted in clarified truffle butter and organic sesame.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-900 shrink-0 mt-1">
                <Shield size={22} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-heading font-black text-lg text-slate-900 uppercase tracking-wide">
                  Vintage Cheddar
                </h3>
                <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed font-light mt-1">
                  24-month aged sharp cheddar melted over slow-simmered bourbon bacon jam and garlic confit.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-900 shrink-0 mt-1">
                <Zap size={22} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-heading font-black text-lg text-slate-900 uppercase tracking-wide">
                  Secret Sauce
                </h3>
                <p className="font-sans text-xs md:text-sm text-slate-600 leading-relaxed font-light mt-1">
                  House-crafted smoked paprika aioli with caramelized shallots and aged malt vinegar reduction.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
