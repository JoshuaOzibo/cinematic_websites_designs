import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LANDING_SLOT_ID, FEATURE_SECTION_ID } from './BurgerHeroCanvas';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    label: 'Handcrafted Patty',
    desc: '100% Japanese A5 Wagyu smashed on 475°F cast iron — lacy crust, maximum marrow.',
  },
  {
    label: 'Artisanal Glaze',
    desc: '72-hour fermented Hokkaido brioche toasted in clarified truffle butter.',
  },
  {
    label: 'Vintage Cheddar',
    desc: '24-month sharp cheddar over slow-simmered bourbon bacon jam and garlic confit.',
  },
  {
    label: 'Secret Sauce',
    desc: 'Smoked paprika aioli with caramelised shallots and aged malt vinegar reduction.',
  },
];

export default function BurgerFeatureSection() {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const dividerRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const trimmingsRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      // ── Right-hand copy, scrubbed in as the section rises ──────────────────
      // Deliberately matches the burger's flight window so text and burger
      // arrive together.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top top',
          scrub: 1.1,
          invalidateOnRefresh: true,
        }
      });

      tl.fromTo(eyebrowRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out', duration: 0.6 },
        0.15
      );

      tl.fromTo(headlineRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power3.out', duration: 0.8 },
        0.25
      );

      tl.fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, ease: 'power2.out', duration: 0.5 },
        0.6
      );

      if (featuresRef.current) {
        tl.fromTo(
          featuresRef.current.querySelectorAll('.feature-item'),
          { x: 40, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.08, ease: 'power2.out', duration: 0.6 },
          0.7
        );
      }

      tl.fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', duration: 0.5 },
        1.2
      );

      // ── Badge + stat strip: pop in only once the burger has actually landed ──
      if (trimmingsRef.current) {
        gsap.fromTo(
          trimmingsRef.current.children,
          { y: 14, opacity: 0, scale: 0.96 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.5, stagger: 0.1, ease: 'back.out(1.6)',
            scrollTrigger: {
              trigger: section,
              start: 'top top+=15%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            }
          }
        );
      }

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={FEATURE_SECTION_ID}
      className="relative w-full min-h-screen bg-white overflow-hidden select-none"
    >
      {/* ── Subtle warm tint strip behind burger side ─────────────────── */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-[#fdfaf7] pointer-events-none" />

      {/* ── Thin amber accent line on the left edge ───────────────────── */}
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-amber-400/0 via-amber-500/70 to-amber-400/0 pointer-events-none" />

      {/* ── Main 50/50 grid ───────────────────────────────────────────── */}
      <div className="relative z-10 w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* ── LEFT: Landing bay for the hero burger ───────────────────── */}
        <div className="flex items-center justify-center px-8 sm:px-10 py-24 lg:py-0">
          <div className="relative w-full max-w-[560px]">

            {/*
              The landing slot. Its bounding rect IS the flight target — the hero
              canvas reads it every frame and lands the burger exactly on it, then
              hands off to the static image below. Keep it 16:9 to match the
              source frames, or the handoff will visibly jump.
            */}
            <div id={LANDING_SLOT_ID} className="relative w-full aspect-[16/9]">

              {/* Empty frame — fades out as the burger comes in to fill it */}
              <div className="burger-slot-placeholder absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 rounded-[32px] border border-dashed border-slate-200/90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[38%] aspect-square rounded-full bg-amber-400/10 blur-[60px]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[30%] aspect-square rounded-full border border-slate-200/80" />
                </div>
                <p className="absolute bottom-5 left-0 right-0 text-center font-sans
                              text-[10px] tracking-[0.28em] text-slate-300 uppercase">
                  Plating
                </p>
              </div>

              {/* Warm glow that grounds the burger once it settles */}
              <div className="burger-slot-image absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[52%] h-[52%] rounded-full bg-amber-400/15 blur-[80px]" />
              </div>

              {/* Static burger — cross-fades in exactly where the canvas leaves off */}
              <img
                id="feature-burger-img"
                src="/background-remover/ezgif-frame-096.png"
                alt="Aura Royale assembled burger"
                className="burger-slot-image absolute inset-0 w-full h-full object-contain"
              />
            </div>

            {/* Badge + stat strip */}
            <div ref={trimmingsRef}>
              <div className="absolute top-4 right-2 bg-white border border-amber-200
                              rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-heading font-bold text-[11px] tracking-widest
                                 text-slate-700 uppercase">Chef's Signature</span>
              </div>

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%]
                              bg-white border border-slate-100 rounded-2xl
                              shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                              flex divide-x divide-slate-100">
                {[
                  { val: '475°F', label: 'Cast Iron' },
                  { val: 'A5', label: 'Wagyu Grade' },
                  { val: '96', label: 'Craft Layers' },
                ].map(({ val, label }) => (
                  <div key={label} className="flex-1 text-center py-3 px-2">
                    <p className="font-heading font-black text-base text-slate-900">{val}</p>
                    <p className="font-sans text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── RIGHT: Text Content ─────────────────────────────────────── */}
        <div className="flex flex-col justify-center px-10 lg:px-16 py-24 lg:py-0">

          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            className="font-sans text-[11px] font-semibold tracking-[0.22em]
                       text-amber-600 uppercase mb-5"
          >
            Anatomy of a Masterpiece
          </p>

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="font-heading font-black text-5xl md:text-6xl lg:text-7xl
                       uppercase leading-[0.92] tracking-tight text-slate-950"
          >
            FRESH-HOT<br />
            &amp; MADE<br />
            <span className="text-[#c83232]">TO AURA ROAR</span>
          </h2>

          {/* Divider */}
          <div
            ref={dividerRef}
            className="mt-8 mb-8 h-[2px] w-16 bg-amber-500 origin-left"
          />

          {/* Feature list */}
          <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {features.map(({ label, desc }) => (
              <div key={label} className="feature-item flex flex-col gap-1">
                <h3 className="font-heading font-black text-sm uppercase tracking-widest
                               text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {label}
                </h3>
                <p className="font-sans text-sm text-slate-500 leading-relaxed pl-3.5">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="mt-12 flex items-center gap-4">
            <button
              className="font-heading font-bold text-sm uppercase tracking-widest
                         bg-slate-950 text-white px-8 py-4 rounded-full
                         hover:bg-amber-500 hover:text-black
                         transition-all duration-300 ease-out"
            >
              Order Now
            </button>
            <button
              className="font-heading font-bold text-sm uppercase tracking-widest
                         text-slate-600 border border-slate-200 px-6 py-4 rounded-full
                         hover:border-slate-400 hover:text-slate-900
                         transition-all duration-300 ease-out"
            >
              View Menu
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
