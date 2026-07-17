import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const detailsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, delay: 0.5 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          '-=1.0'
        )
        .fromTo(
          detailsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0 },
          '-=0.8'
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'bounce.out' },
          '-=0.4'
        );

      // Loop scroll indicator animation
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        opacity: 0.4,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="overview"
      className="relative w-full h-screen flex flex-col justify-between items-center text-center px-4 py-24 select-none overflow-hidden bg-studio-bg"
    >
      {/* Top spacer */}
      <div></div>

      {/* Main Content */}
      <div className="max-w-5xl z-10">
        <h1
          ref={titleRef}
          className="font-heading font-black text-6xl md:text-8xl lg:text-[10rem] tracking-tight uppercase leading-none text-brand-dark mb-4 drop-shadow-sm"
        >
          SHAPE THE<br />
          <span className="text-brand-orange">FUTURE</span>
        </h1>
        <p
          ref={subtitleRef}
          className="font-sans font-semibold text-lg md:text-2xl tracking-widest uppercase text-brand-dark/80 max-w-2xl mx-auto"
        >
          The First Super Sports V12 Hybrid Plug-in HPEV
        </p>
        <p
          ref={detailsRef}
          className="font-sans text-sm md:text-base text-brand-dark/60 max-w-xl mx-auto mt-4"
        >
          1015 CV of combined power, combining an all-new naturally aspirated V12 engine with three electric motors.
        </p>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="flex flex-col items-center gap-2 cursor-pointer z-10"
        onClick={() => {
          document.getElementById('sequence-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="font-sans text-xs font-semibold tracking-widest uppercase text-brand-dark/50">
          Scroll to explore
        </span>
        <div className="w-6 h-10 border-2 border-brand-dark/30 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-scroll"></div>
        </div>
      </div>
    </section>
  );
}
