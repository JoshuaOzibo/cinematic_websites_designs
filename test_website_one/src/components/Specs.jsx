import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SPECS_DATA = [
  { label: 'Combined Power', value: '1,015 CV', detail: 'V12 + 3 Electric Motors' },
  { label: 'Acceleration 0-100 km/h', value: '2.5 s', detail: '0-200 km/h in < 7.0 s' },
  { label: 'Top Speed', value: '> 350 km/h', detail: 'Electronically limited' },
  { label: 'Engine Type', value: '6.5L V12', detail: 'Naturally Aspirated' },
  { label: 'Transmission', value: '8-Speed DCT', detail: 'Dual-Clutch Gearbox' },
  { label: 'Electric Range', value: '100% Electric', detail: 'Citta (City) mode driving' },
];

export default function Specs() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in section headers
      gsap.fromTo(
        '.spec-header',
        { opacity: 0, y: 30 },
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

      // Cascade anim for grid cards
      const cards = gridRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="specs"
      className="w-full min-h-screen py-32 bg-white flex flex-col items-center justify-center px-6 md:px-12 z-10 relative"
    >
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="spec-header text-center mb-20">
          <span className="text-xs font-extrabold tracking-widest text-brand-orange uppercase bg-brand-orange/10 px-4 py-1.5 rounded-full">
            Engineering Marvel
          </span>
          <h2 className="font-heading font-black text-4xl md:text-6xl text-brand-dark uppercase mt-4 tracking-tight">
            TECHNICAL SPECIFICATIONS
          </h2>
          <div className="w-20 h-1 bg-brand-orange mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Specs Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full"
        >
          {SPECS_DATA.map((spec, i) => (
            <div
              key={i}
              className="bg-studio-bg/40 border border-brand-dark/5 p-8 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-2xl hover:border-brand-orange/30 group cursor-pointer"
            >
              <span className="font-sans text-xs font-semibold uppercase text-brand-dark/40 tracking-wider group-hover:text-brand-orange transition-colors">
                {spec.label}
              </span>
              <h3 className="font-heading font-black text-4xl md:text-5xl text-brand-dark mt-2 tracking-tight group-hover:scale-[1.02] transition-transform origin-left">
                {spec.value}
              </h3>
              <p className="font-sans text-sm text-brand-dark/60 mt-2 font-medium">
                {spec.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
