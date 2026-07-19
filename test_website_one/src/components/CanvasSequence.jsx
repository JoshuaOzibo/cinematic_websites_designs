import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Zap, Wind } from 'lucide-react';

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

export default function CanvasSequence() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

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

    // Cover-style drawing: fills canvas edge-to-edge, crops to maintain aspect ratio
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

      // Cover behavior: fill entire canvas, crop excess
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
        {/* Top vignette */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand-dark/60 to-transparent" />
        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-brand-dark/80 to-transparent" />
        {/* Left vignette */}
        <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-brand-dark/40 to-transparent" />
        {/* Right vignette */}
        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-brand-dark/40 to-transparent" />
      </div>

      {/* 4. Section label — fades in at start, out early */}
      <div className="seq-label absolute top-8 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none z-10">
        <span className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-white/50 border border-white/10 px-4 py-2 rounded-full glass-card">
          Cinematic Experience
        </span>
      </div>

      {/* 5. Floating Info Cards */}
      {/* Card 1 — Bottom Left */}
      <div className="card-1 absolute left-6 md:left-12 bottom-16 md:bottom-20 max-w-[300px] md:max-w-[340px] opacity-0 pointer-events-none z-20">
        <div className="glass-card-light rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-start gap-4">
          <div className="p-2.5 bg-brand-orange/15 text-brand-orange rounded-xl flex-shrink-0">
            <Wind size={22} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-text-primary tracking-tight uppercase mb-1">
              Active Aerodynamics
            </h3>
            <p className="font-sans text-xs text-text-muted leading-relaxed font-light">
              Adaptive front splitters and active rear wing optimize drag and downforce at every speed.
            </p>
          </div>
        </div>
      </div>

      {/* Card 2 — Top Right */}
      <div className="card-2 absolute right-6 md:right-12 top-1/2 -translate-y-1/2 max-w-[300px] md:max-w-[340px] opacity-0 pointer-events-none z-20">
        <div className="glass-card-light rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-start gap-4">
          <div className="p-2.5 bg-brand-orange/15 text-brand-orange rounded-xl flex-shrink-0">
            <Zap size={22} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-text-primary tracking-tight uppercase mb-1">
              1,015 CV Hybrid
            </h3>
            <p className="font-sans text-xs text-text-muted leading-relaxed font-light">
              A naturally aspirated V12 with three electric motors delivering unparalleled instantaneous response.
            </p>
          </div>
        </div>
      </div>

      {/* Card 3 — Bottom Right */}
      <div className="card-3 absolute right-6 md:right-12 bottom-16 md:bottom-20 max-w-[300px] md:max-w-[340px] opacity-0 pointer-events-none z-20">
        <div className="glass-card-light rounded-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-start gap-4">
          <div className="p-2.5 bg-brand-orange/15 text-brand-orange rounded-xl flex-shrink-0">
            <Shield size={22} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-text-primary tracking-tight uppercase mb-1">
              Monofuselage Chassis
            </h3>
            <p className="font-sans text-xs text-text-muted leading-relaxed font-light">
              Carbon fiber monocoque delivers maximum structural rigidity with radical weight savings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
