import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SPECS_DATA = [
  { label: 'Combined Power', value: '1,015', unit: 'CV', detail: 'V12 + 3 Electric Motors' },
  { label: '0 to 100 km/h', value: '2.5', unit: 's', detail: '0–200 km/h in under 7.0 s' },
  { label: 'Top Speed', value: '350+', unit: 'km/h', detail: 'Electronically governed' },
  { label: 'Engine', value: '6.5L', unit: 'V12', detail: 'Naturally Aspirated' },
  { label: 'Transmission', value: '8-Spd', unit: 'DCT', detail: 'Dual-Clutch Gearbox' },
  { label: 'Electric Mode', value: '100', unit: '%', detail: 'City mode driving' },
];

export default function Specs() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.spec-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cards = gridRef.current?.children;
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="specs"
      className="w-full min-h-screen py-32 bg-surface flex flex-col items-center justify-center px-6 md:px-12 z-10 relative overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-orange/4 blur-[150px]" />
      </div>

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent" />

      <div className="max-w-7xl w-full relative z-10">
        {/* Header */}
        <div className="spec-header text-center mb-20">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-orange uppercase px-5 py-2 rounded-full border border-brand-orange/25 glass-card mb-6">
            Engineering Marvel
          </span>
          <h2 className="font-heading font-black text-5xl md:text-7xl text-text-primary uppercase mt-4 tracking-tight italic">
            Technical Specs
          </h2>
          <div className="w-16 h-px bg-brand-orange mx-auto mt-6 shadow-[0_0_16px_rgba(249,115,22,0.8)]" />
        </div>

        {/* Specs Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full"
        >
          {SPECS_DATA.map((spec, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-8 border border-white/5 hover:border-brand-orange/25 transition-all duration-500 group cursor-pointer relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/4 transition-colors duration-500 rounded-2xl" />

              <span className="font-sans text-xs font-medium uppercase text-text-muted tracking-[0.15em] group-hover:text-brand-orange transition-colors duration-300 relative z-10">
                {spec.label}
              </span>

              <div className="flex items-end gap-1 mt-3 relative z-10">
                <h3 className="font-heading font-black text-5xl md:text-6xl text-text-primary leading-none">
                  {spec.value}
                </h3>
                <span className="font-heading font-bold text-xl text-brand-orange pb-1 ml-1">
                  {spec.unit}
                </span>
              </div>

              <p className="font-sans text-xs text-text-muted mt-3 font-light leading-relaxed relative z-10">
                {spec.detail}
              </p>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/0 group-hover:via-brand-orange/40 to-transparent transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
