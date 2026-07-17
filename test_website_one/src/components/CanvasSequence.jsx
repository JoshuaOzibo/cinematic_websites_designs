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

// Return the image frame path
const getFramePath = (index) => {
  return `/images/ezgif-frame-${pad(index + 1, 3)}.jpg`;
};

export default function CanvasSequence() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload Images
  useEffect(() => {
    // Disable body scroll while loading
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

    const handleImageError = (e) => {
      console.error('Failed to load image frame', e);
      // Still count as loaded to avoid locking the UI if some frame fails
      handleImageLoad();
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      imagesArray.push(img);
    }

    imagesRef.current = imagesArray;

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Set up Canvas Rendering and GSAP scroll linking
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const images = imagesRef.current;

    // Draw a frame onto the canvas (responsive contain/fit sizing)
    const drawFrame = (img) => {
      if (!img) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Ensure canvas backing store matches size multiplied by device pixel ratio
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const imgWidth = img.width;
      const imgHeight = img.height;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      // Fit to container (contain behavior)
      if (canvasRatio > imgRatio) {
        // Canvas is wider than image aspect ratio, fit to height
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      } else {
        // Canvas is taller than image aspect ratio, fit to width
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Initial render
    drawFrame(images[0]);

    // Handle Window Resize
    const handleResize = () => {
      // Find the current frame index from our GSAP tween target
      const currentFrame = Math.round(animationTarget.frame);
      drawFrame(images[currentFrame]);
    };
    window.addEventListener('resize', handleResize);

    // GSAP ScrollTrigger Sequence
    const animationTarget = { frame: 0 };
    
    // Create Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=4000', // 400vh scroll depth
        scrub: 1.0,    // smooth scrubbing
        pin: true,
        invalidateOnRefresh: true,
      }
    });

    // 1. Frame sequence animation
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

    // 2. Text Overlay Fade Animations timed along the 10s timeline
    // Card 1: Aerodynamics (Frames ~30-80)
    tl.fromTo('.card-1', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, 
      1.5
    ).to('.card-1', 
      { opacity: 0, y: -50, duration: 1.5, ease: 'power2.in' }, 
      4.0
    );

    // Card 2: Performance Hybrid (Frames ~100-150)
    tl.fromTo('.card-2', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, 
      4.5
    ).to('.card-2', 
      { opacity: 0, y: -50, duration: 1.5, ease: 'power2.in' }, 
      7.0
    );

    // Card 3: Monocoque Chassis (Frames ~170-220)
    tl.fromTo('.card-3', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, 
      7.5
    ).to('.card-3', 
      { opacity: 0, y: -50, duration: 1.5, ease: 'power2.in' }, 
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
      id="sequence-section"
      className="relative w-full h-screen bg-studio-bg overflow-hidden flex items-center justify-center select-none"
    >
      {/* 1. Loading Overlay Screen */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-studio-bg z-50 flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-6 max-w-md w-full">
            {/* Spinning Loader Logo */}
            <div className="w-16 h-16 rounded-full border-4 border-brand-dark/10 border-t-brand-orange animate-spin mb-2"></div>
            
            <div className="text-center">
              <h2 className="font-heading font-black text-2xl tracking-widest text-brand-dark uppercase">
                LOADING EXPERIENCE
              </h2>
              <p className="font-sans text-xs tracking-wider text-brand-dark/50 mt-1 uppercase">
                Preparing supercar simulator
              </p>
            </div>

            {/* Percentage Bar */}
            <div className="w-full h-1 bg-brand-dark/10 rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-brand-orange transition-all duration-300 ease-out" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            
            <span className="font-heading font-bold text-lg text-brand-orange">
              {loadingProgress}%
            </span>
          </div>
        </div>
      )}

      {/* 2. Fullscreen Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full flex items-center justify-center p-4 md:p-8"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain block max-w-6xl max-h-[85vh] drop-shadow-2xl"
        />
      </div>

      {/* 3. Narrative Floating Cards */}
      {/* Card 1: Aerodynamics */}
      <div className="card-1 absolute left-6 md:left-20 top-[30%] md:top-[35%] max-w-[320px] md:max-w-[360px] opacity-0 pointer-events-none">
        <div className="bg-white/75 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl flex items-start gap-4">
          <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl">
            <Wind size={24} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-brand-dark tracking-tight uppercase mb-1">
              Active Aerodynamics
            </h3>
            <p className="font-sans text-sm text-brand-dark/70 leading-relaxed">
              Optimized front splitters and an active rear wing adapt dynamically to optimize drag and downforce.
            </p>
          </div>
        </div>
      </div>

      {/* Card 2: Hybrid Power */}
      <div className="card-2 absolute right-6 md:right-20 bottom-[20%] md:bottom-[25%] max-w-[320px] md:max-w-[360px] opacity-0 pointer-events-none">
        <div className="bg-white/75 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl flex items-start gap-4">
          <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-brand-dark tracking-tight uppercase mb-1">
              1015 CV Hybrid Power
            </h3>
            <p className="font-sans text-sm text-brand-dark/70 leading-relaxed">
              Combining a naturally aspirated V12 engine with three electric motors for an unparalleled response.
            </p>
          </div>
        </div>
      </div>

      {/* Card 3: Lightweight Carbon Fiber Chassis */}
      <div className="card-3 absolute left-6 md:left-20 bottom-[25%] md:bottom-[30%] max-w-[320px] md:max-w-[360px] opacity-0 pointer-events-none">
        <div className="bg-white/75 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl flex items-start gap-4">
          <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-brand-dark tracking-tight uppercase mb-1">
              Monofuselage Chassis
            </h3>
            <p className="font-sans text-sm text-brand-dark/70 leading-relaxed">
              The carbon fiber structure delivers leading structural rigidity, weight savings, and superior impact safety.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
