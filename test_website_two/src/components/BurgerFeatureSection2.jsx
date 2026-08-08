import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LANDING_SLOT_2_ID, FEATURE_SECTION_2_ID } from './BurgerHeroCanvas';

gsap.registerPlugin(ScrollTrigger);

const details = [
  {
    label: 'Smoked Brisket',
    desc: 'Low-and-slow 14-hour mesquite-smoked brisket blend folded into every patty for deep, layered flavour.',
  },
  {
    label: 'Fermented Brioche',
    desc: '72-hour cold-proofed Hokkaido milk bun, brushed with cultured butter and toasted on a plancha.',
  },
  {
    label: 'Black Truffle Aioli',
    desc: 'Hand-emulsified Périgord truffle aioli aged 48 hours before plating — earthy, rich, unmistakable.',
  },
  {
    label: 'Caviar Finish',
    desc: 'A single spoonful of Oscietra caviar crowns the stack — the only garnish worthy of Aura Royale.',
  },
];

export default function BurgerFeatureSection2() {
  const sectionRef   = useRef(null);
  const eyebrowRef   = useRef(null);
  const headlineRef  = useRef(null);
  const dividerRef   = useRef(null);
  const featuresRef  = useRef(null);
  const ctaRef       = useRef(null);
  const trimmingsRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      // Copy slides in from the LEFT as the section rises (text is on the left here)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top top',
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(eyebrowRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out', duration: 0.6 },
        0.15
      );
      tl.fromTo(headlineRef.current,
        { x: -50, opacity: 0 },
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
          featuresRef.current.querySelectorAll('.feature-item-2'),
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.08, ease: 'power2.out', duration: 0.6 },
          0.7
        );
      }

      tl.fromTo(ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out', duration: 0.5 },
        1.2
      );

      // Badge + stat strip pop in once burger has landed
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
            },
          }
        );
      }

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={FEATURE_SECTION_2_ID}
      className="relative w-full min-h-screen bg-[#0e0b07] overflow-hidden select-none"
    >
      {/* Warm tint strip — RIGHT side (where the burger lands) */}
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[#110d06] pointer-events-none" />

      {/* Thin amber accent on the RIGHT edge */}
      <div className="absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b from-amber-400/0 via-amber-500/70 to-amber-400/0 pointer-events-none" />

      {/* Ambient glow behind the burger slot */}
      <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full bg-amber-600/10 blur-[120px]" />
      </div>

      {/* ── Main 50/50 grid — text LEFT, burger RIGHT ─────────────────────── */}
      <div className="relative z-10 w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">

        {/* ── LEFT: Text content ───────────────────────────────────────────── */}
        <div className="flex flex-col justify-center px-10 lg:px-16 py-24 lg:py-0">

          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            className="font-sans text-[11px] font-semibold tracking-[0.22em]
                       text-amber-500 uppercase mb-5"
          >
            The Rarest Ingredients
          </p>

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="font-heading font-black text-5xl md:text-6xl lg:text-7xl
                       uppercase leading-[0.92] tracking-tight text-slate-50"
          >
            DARK&nbsp;&amp;<br />
            DECADENT<br />
            <span className="text-amber-500">LUXE STACK</span>
          </h2>

          {/* Divider */}
          <div
            ref={dividerRef}
            className="mt-8 mb-8 h-[2px] w-16 bg-amber-500 origin-left"
          />

          {/* Feature list */}
          <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {details.map(({ label, desc }) => (
              <div key={label} className="feature-item-2 flex flex-col gap-1">
                <h3 className="font-heading font-black text-sm uppercase tracking-widest
                               text-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {label}
                </h3>
                <p className="font-sans text-sm text-slate-400 leading-relaxed pl-3.5">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="mt-12 flex items-center gap-4">
            <button
              className="font-heading font-bold text-sm uppercase tracking-widest
                         bg-amber-500 text-black px-8 py-4 rounded-full
                         hover:bg-amber-400
                         transition-all duration-300 ease-out"
            >
              Reserve a Table
            </button>
            <button
              className="font-heading font-bold text-sm uppercase tracking-widest
                         text-slate-400 border border-slate-700 px-6 py-4 rounded-full
                         hover:border-amber-500/60 hover:text-slate-200
                         transition-all duration-300 ease-out"
            >
              Discover More
            </button>
          </div>
        </div>

        {/* ── RIGHT: Landing bay for the burger ───────────────────────────── */}
        <div className="flex items-center justify-center px-8 sm:px-10 py-24 lg:py-0">
          <div className="relative w-full max-w-[560px]">

            {/*
              Landing slot 2. The canvas reads its bounding rect and lands the
              burger exactly here. Must be 16:9 to match source frames.
            */}
            <div id={LANDING_SLOT_2_ID} className="relative w-full aspect-[16/9]">

              {/* Empty frame — fades out as burger arrives */}
              <div className="burger-slot-placeholder-2 absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 rounded-[32px] border border-dashed border-amber-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[38%] aspect-square rounded-full bg-amber-500/8 blur-[60px]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[30%] aspect-square rounded-full border border-amber-500/20" />
                </div>
                <p className="absolute bottom-5 left-0 right-0 text-center font-sans
                              text-[10px] tracking-[0.28em] text-amber-500/40 uppercase">
                  Plating
                </p>
              </div>

              {/* Warm glow that grounds the burger once it settles */}
              <div className="burger-slot-image-2 absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[52%] h-[52%] rounded-full bg-amber-500/15 blur-[80px]" />
              </div>

              {/* Static burger — cross-fades in exactly where the canvas leaves off */}
              <img
                id="feature-burger-img-2"
                src="/background-remover/ezgif-frame-096.png"
                alt="Aura Royale Luxe Stack burger"
                className="burger-slot-image-2 absolute inset-0 w-full h-full object-contain"
              />
            </div>

            {/* Badge + stat strip */}
            <div ref={trimmingsRef}>
              <div className="absolute top-4 left-2 bg-[#1a1408] border border-amber-500/30
                              rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-heading font-bold text-[11px] tracking-widest
                                 text-amber-400 uppercase">Limited Edition</span>
              </div>

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%]
                              bg-[#1a1408] border border-amber-500/20 rounded-2xl
                              shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                              flex divide-x divide-amber-500/10">
                {[
                  { val: '14H',   label: 'Smoked Slow' },
                  { val: 'S1',    label: 'Oscietra Grade' },
                  { val: '∞',     label: 'Layers of Aura' },
                ].map(({ val, label }) => (
                  <div key={label} className="flex-1 text-center py-3 px-2">
                    <p className="font-heading font-black text-base text-amber-400">{val}</p>
                    <p className="font-sans text-[10px] text-amber-500/50 tracking-wider uppercase mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
