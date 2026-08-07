import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home, Heart, Shield, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function BurgerFeatureSection() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Content panel rises into view as section enters the viewport
      // (hero slides off above, this section is already in normal flow beneath)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          end: 'top 15%',
          scrub: 1.0,
          invalidateOnRefresh: true
        }
      });

      // Right content: smooth rise
      tl.fromTo(contentRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Feature grid items: staggered rise
      if (gridRef.current && gridRef.current.children) {
        tl.fromTo(gridRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, ease: 'power2.out' },
          0.15
        );
      }

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      id="features" 
      className="relative w-full min-h-screen bg-white text-slate-900 py-20 md:py-32 px-6 md:px-16 flex items-center select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Burger image slides down into place as hero scrolls off */}
        <div ref={imageRef} className="lg:col-span-5 flex items-center justify-center relative min-h-[350px] md:min-h-[480px]">
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            <img 
              id="feature-burger-img"
              src="/background-remover/ezgif-frame-096.png" 
              alt="Aura Royale Assembled Burger" 
              className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.12)]"
            />
          </div>
        </div>

        {/* Right Column: Reference Layout Matching User Image */}
        <div ref={contentRef} className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Headline matching user reference image */}
          <h2 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[0.95] text-slate-950">
            FRESH-HOT & MADE <br />
            <span className="text-[#c83232]">TO AURA ROAR</span>
          </h2>

          {/* 2x2 Feature Grid matching reference image */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mt-10 md:mt-12">
            
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
