import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const detailsRef = useRef(null);
  const statsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(badgeRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, delay: 0.3 })
        .fromTo(titleRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4 }, '-=0.6')
        .fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.9')
        .fromTo(detailsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, '-=0.8')
        .fromTo(statsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, '-=0.7')
        .fromTo(scrollIndicatorRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');

      // Floating scroll dot
      gsap.to(scrollIndicatorRef.current, {
        y: 12,
        opacity: 0.3,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const STATS = [
    { value: '1,015', unit: 'CV', label: 'Combined Power' },
    { value: '2.5', unit: 's', label: '0–100 km/h' },
    { value: '350+', unit: 'km/h', label: 'Top Speed' },
  ];

  return (
    <section
      ref={containerRef}
      id="overview"
      className="relative w-full min-h-screen flex flex-col justify-between items-center text-center px-6 py-28 select-none overflow-hidden bg-studio-bg"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-brand-orange/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-orange/5 blur-[100px]" />
      </div>

      {/* Decorative line accents */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 items-center">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-brand-orange/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
        <div className="w-px h-24 bg-gradient-to-b from-brand-orange/40 to-transparent" />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 items-center">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-brand-orange/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
        <div className="w-px h-24 bg-gradient-to-b from-brand-orange/40 to-transparent" />
      </div>

      {/* Top spacer */}
      <div />

      {/* Main Content */}
      <div className="max-w-6xl z-10 flex flex-col items-center">
        {/* Badge */}
        <div ref={badgeRef} className="mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card text-xs font-semibold tracking-[0.2em] text-brand-orange uppercase border border-brand-orange/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
            World Premiere · 2026
          </span>
        </div>

        <h1
          ref={titleRef}
          className="font-heading font-black text-6xl md:text-8xl lg:text-[9rem] xl:text-[10.5rem] tracking-tight leading-[0.88] text-text-primary mb-6"
          style={{ letterSpacing: '-0.02em' }}
        >
          SHAPE THE<br />
          <span className="text-gradient italic">FUTURE</span>
        </h1>

        <p
          ref={subtitleRef}
          className="font-sans font-light text-base md:text-xl tracking-[0.15em] uppercase text-text-muted max-w-2xl mx-auto mt-2"
        >
          The First Super Sports V12 Hybrid Plug-in HPEV
        </p>

        <p
          ref={detailsRef}
          className="font-sans text-sm md:text-base text-text-muted max-w-xl mx-auto mt-5 leading-relaxed font-light"
        >
          1,015 CV of combined power. A naturally aspirated V12 and three electric motors.
          Engineering perfection for a new era of performance.
        </p>

        {/* Stats Row */}
        <div ref={statsRef} className="flex items-center gap-0 mt-14 glass-card rounded-2xl overflow-hidden divide-x divide-white/8">
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col items-center px-8 py-5">
              <span className="font-heading font-black text-3xl md:text-4xl text-text-primary leading-none">
                {stat.value}
                <span className="text-brand-orange text-2xl">{stat.unit}</span>
              </span>
              <span className="font-sans text-xs text-text-muted tracking-widest uppercase mt-1.5 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="flex flex-col items-center gap-3 cursor-pointer z-10 mt-10"
        onClick={() => {
          document.getElementById('cinematic')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="font-sans text-[10px] font-medium tracking-[0.25em] uppercase text-text-muted/50">
          Scroll to explore
        </span>
        <div className="w-5 h-9 border border-white/20 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-1 bg-brand-orange rounded-full" />
        </div>
      </div>
    </section>
  );
}
