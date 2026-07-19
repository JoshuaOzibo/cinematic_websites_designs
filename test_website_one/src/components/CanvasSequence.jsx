import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Zap, Wind, X, ArrowUpRight, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;

const pad = (num, size) => {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
};

const getFramePath = (index) => {
  return `/images/ezgif-frame-${pad(index + 1, 3)}.jpg`;
};

const POPUP_DETAILS = {
  aero: {
    title: 'Active Aerodynamics',
    icon: <Wind size={28} />,
    description: 'The active aerodynamic system on the Revuelto is fully integrated with the vehicle dynamics control systems. Depending on the driving mode and dynamic conditions, the active rear wing changes its position to manage aerodynamic load and resistance.',
    extended: 'This yields a 66% increase in front aerodynamic load and a 74% increase in rear load compared to the Aventador Ultimae under high-downforce configurations.',
    specs: [
      { label: 'Rear Wing Positions', value: '3 Modes' },
      { label: 'Downforce Increase', value: '+74%' },
      { label: 'Front Splitter', value: 'Active Carbon' }
    ]
  },
  hybrid: {
    title: '1,015 CV Hybrid',
    icon: <Zap size={28} />,
    description: "The hybrid powertrain integrates Lamborghini's iconic 6.5-liter naturally aspirated V12 engine with three electric motors (two on the front axle and one integrated into the double-clutch gearbox).",
    extended: 'Power is delivered to all four wheels, featuring active torque vectoring on the front axle to maximize cornering agility and traction.',
    specs: [
      { label: 'Engine Power', value: '825 CV @ 9250 RPM' },
      { label: 'Front Axle Motors', value: '2x 110 kW (Vectoring)' },
      { label: 'Rear Axle Motor', value: '110 kW (DCT Integrated)' }
    ]
  },
  chassis: {
    title: 'Monofuselage Chassis',
    icon: <Shield size={28} />,
    description: 'The Monofuselage represents a monumental leap forward in chassis engineering. Constructed entirely of carbon fiber, it consists of a monocoque passenger cell made of forged composite.',
    extended: 'This achieves a 10% weight reduction and a 25% torsional stiffness increase over the Aventador chassis.',
    specs: [
      { label: 'Torsional Stiffness', value: '40,000 Nm/deg' },
      { label: 'Material', value: 'Forged Carbon Fiber' },
      { label: 'Front Frame', value: 'Carbon Crumple Zone' }
    ]
  }
};

export default function CanvasSequence() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePopup, setActivePopup] = useState(null);

  // Preload Images
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    let loadedCount = 0;
    const imagesArray = [];

    const handleImageLoad = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      setLoadingProgress(percent);
      if (loadedCount === TOTAL_FRAMES) {
        setIsLoaded(true);
        document.body.style.overflow = '';
      }
    };

    const handleImageError = () => handleImageLoad();

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      imagesArray.push(img);
    }

    imagesRef.current = imagesArray;
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Canvas Rendering + GSAP
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const images = imagesRef.current;

    const drawFrame = (img) => {
      if (!img) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;

      let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    drawFrame(images[0]);

    const animationTarget = { frame: 0 };

    const handleResize = () => {
      drawFrame(images[Math.round(animationTarget.frame)]);
    };
    window.addEventListener('resize', handleResize);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=4000',
        scrub: 1.2,
        pin: true,
        invalidateOnRefresh: true,
      }
    });

    // Frame sequence
    tl.to(animationTarget, {
      frame: TOTAL_FRAMES - 1,
      snap: 'frame',
      ease: 'none',
      duration: 10,
      onUpdate: () => {
        const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(animationTarget.frame));
        drawFrame(images[frameIndex]);
      }
    }, 0);

    // Cinematic label animations
    tl.fromTo('.seq-label',
      { opacity: 0, letterSpacing: '0.3em' },
      { opacity: 1, letterSpacing: '0.12em', duration: 1.5 },
      0.5
    ).to('.seq-label', { opacity: 0, duration: 0.8 }, 2.0);

    // Card 1: Aerodynamics
    tl.fromTo('.card-1',
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 1.5, ease: 'power2.out' },
      1.5
    ).to('.card-1',
      { opacity: 0, x: -40, duration: 1.2, ease: 'power2.in' },
      4.0
    );

    // Card 2: Hybrid Power
    tl.fromTo('.card-2',
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 1.5, ease: 'power2.out' },
      4.5
    ).to('.card-2',
      { opacity: 0, x: 40, duration: 1.2, ease: 'power2.in' },
      7.0
    );

    // Card 3: Chassis
    tl.fromTo('.card-3',
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 1.5, ease: 'power2.out' },
      7.5
    ).to('.card-3',
      { opacity: 0, x: -40, duration: 1.2, ease: 'power2.in' },
      9.5
    );

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded]);

  return (
    <section
      ref={sectionRef}
      id="cinematic"
      className="relative w-full h-screen bg-brand-dark overflow-hidden select-none"
    >
      {/* 1. Loading Screen */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-studio-bg z-50 flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-6 max-w-xs w-full">
            {/* Spinning ring */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div className="absolute inset-0 rounded-full border-t-2 border-brand-orange animate-spin" />
              <div className="absolute inset-[6px] rounded-full flex items-center justify-center">
                <span className="font-heading font-black text-xl text-brand-orange">Ω</span>
              </div>
            </div>

            <div className="text-center">
              <h2 className="font-heading font-black text-xl tracking-[0.2em] text-text-primary uppercase">
                LOADING EXPERIENCE
              </h2>
              <p className="font-sans text-xs tracking-widest text-text-muted/50 mt-1 uppercase">
                Preparing supercar simulator
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-px bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-orange transition-all duration-300 ease-out shadow-[0_0_12px_rgba(249,115,22,0.8)]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <span className="font-sans font-semibold text-sm text-brand-orange tracking-widest">
              {loadingProgress}%
            </span>
          </div>
        </div>
      )}

      {/* 2. Full-bleed Canvas — no padding, edge to edge */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* 3. Top cinematic gradient vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand-dark/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-brand-dark/80 to-transparent" />
        <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-brand-dark/40 to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-brand-dark/40 to-transparent" />
      </div>

      {/* 4. Section label */}
      <div className="seq-label absolute top-8 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none z-10">
        <span className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-white/50 border border-white/10 px-4 py-2 rounded-full glass-card">
          Cinematic Experience
        </span>
      </div>

      {/* 5. Floating Info Cards (Interactive) */}
      {/* Card 1 — Bottom Left */}
      <div className="card-1 absolute left-6 md:left-12 bottom-16 md:bottom-20 max-w-[300px] md:max-w-[340px] opacity-0 pointer-events-none z-20">
        <div 
          onClick={() => setActivePopup('aero')}
          className="bg-slate-950/75 backdrop-blur-md border border-white/10 pointer-events-auto cursor-pointer rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-start gap-4 transition-all duration-300 hover:scale-[1.03] hover:border-brand-orange/40 group"
        >
          <div className="p-2.5 bg-brand-orange/20 text-brand-orange rounded-xl flex-shrink-0 group-hover:bg-brand-orange/30 transition-colors">
            <Wind size={22} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white tracking-tight uppercase mb-1 flex items-center gap-1.5">
              Active Aerodynamics
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </h3>
            <p className="font-sans text-xs text-slate-200 leading-relaxed font-light mb-2">
              Adaptive front splitters and active rear wing optimize drag and downforce at every speed.
            </p>
            <span className="text-[10px] text-brand-orange font-semibold tracking-wider uppercase group-hover:underline">
              Tap to Expand Spec
            </span>
          </div>
        </div>
      </div>

      {/* Card 2 — Top Right */}
      <div className="card-2 absolute right-6 md:right-12 top-1/3 -translate-y-1/2 max-w-[300px] md:max-w-[340px] opacity-0 pointer-events-none z-20">
        <div 
          onClick={() => setActivePopup('hybrid')}
          className="bg-slate-950/75 backdrop-blur-md border border-white/10 pointer-events-auto cursor-pointer rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-start gap-4 transition-all duration-300 hover:scale-[1.03] hover:border-brand-orange/40 group"
        >
          <div className="p-2.5 bg-brand-orange/20 text-brand-orange rounded-xl flex-shrink-0 group-hover:bg-brand-orange/30 transition-colors">
            <Zap size={22} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white tracking-tight uppercase mb-1 flex items-center gap-1.5">
              1,015 CV Hybrid
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </h3>
            <p className="font-sans text-xs text-slate-200 leading-relaxed font-light mb-2">
              A naturally aspirated V12 with three electric motors delivering unparalleled instantaneous response.
            </p>
            <span className="text-[10px] text-brand-orange font-semibold tracking-wider uppercase group-hover:underline">
              Tap to Expand Spec
            </span>
          </div>
        </div>
      </div>

      {/* Card 3 — Bottom Right */}
      <div className="card-3 absolute right-6 md:right-12 bottom-16 md:bottom-20 max-w-[300px] md:max-w-[340px] opacity-0 pointer-events-none z-20">
        <div 
          onClick={() => setActivePopup('chassis')}
          className="bg-slate-950/75 backdrop-blur-md border border-white/10 pointer-events-auto cursor-pointer rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-start gap-4 transition-all duration-300 hover:scale-[1.03] hover:border-brand-orange/40 group"
        >
          <div className="p-2.5 bg-brand-orange/20 text-brand-orange rounded-xl flex-shrink-0 group-hover:bg-brand-orange/30 transition-colors">
            <Shield size={22} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white tracking-tight uppercase mb-1 flex items-center gap-1.5">
              Monofuselage Chassis
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </h3>
            <p className="font-sans text-xs text-slate-200 leading-relaxed font-light mb-2">
              Carbon fiber monocoque delivers maximum structural rigidity with radical weight savings.
            </p>
            <span className="text-[10px] text-brand-orange font-semibold tracking-wider uppercase group-hover:underline">
              Tap to Expand Spec
            </span>
          </div>
        </div>
      </div>

      {/* 6. Detail PopUp Modal */}
      {activePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-lg bg-slate-900/95 border border-white/15 rounded-3xl p-8 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Abstract light aura behind popup */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-orange/10 blur-[60px]" />
            
            {/* Close Button */}
            <button 
              onClick={() => setActivePopup(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 cursor-pointer text-slate-300 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            {/* Icon & Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3.5 bg-brand-orange/20 text-brand-orange rounded-2xl">
                {POPUP_DETAILS[activePopup].icon}
              </div>
              <div>
                <span className="font-sans text-[10px] tracking-[0.2em] font-semibold text-brand-orange uppercase">
                  Technical Spec Sheet
                </span>
                <h3 className="font-heading font-black text-2xl md:text-3xl text-white tracking-tight uppercase mt-1 italic">
                  {POPUP_DETAILS[activePopup].title}
                </h3>
              </div>
            </div>

            {/* Description & Extended Content */}
            <div className="space-y-4 mb-8">
              <p className="font-sans text-sm text-slate-100 leading-relaxed font-normal">
                {POPUP_DETAILS[activePopup].description}
              </p>
              <p className="font-sans text-xs text-slate-300 leading-relaxed font-light">
                {POPUP_DETAILS[activePopup].extended}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="border-t border-white/10 pt-6">
              <div className="grid grid-cols-1 gap-3">
                {POPUP_DETAILS[activePopup].specs.map((spec, i) => (
                  <div 
                    key={i} 
                    className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/5 border border-white/5"
                  >
                    <span className="font-sans text-xs text-slate-300 font-light">{spec.label}</span>
                    <span className="font-sans text-xs text-white font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent" />
          </div>
        </div>
      )}
    </section>
  );
}
