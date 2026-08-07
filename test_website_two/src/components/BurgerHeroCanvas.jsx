import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 96;

const pad = (num, size = 3) => {
  let s = String(num);
  while (s.length < size) s = '0' + s;
  return s;
};

const getFramePath = (index) => {
  return `/background-remover/ezgif-frame-${pad(index + 1)}.png`;
};

export default function BurgerHeroCanvas() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const bgRef = useRef(null);
  const burgerFramesRef = useRef([]);
  const frameRef = useRef(0);
  const rafRef = useRef(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload Background-Removed Burger Frames
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      setLoadingProgress(percent);
      if (loadedCount === TOTAL_FRAMES) {
        setIsLoaded(true);
        document.body.style.overflow = '';
      }
    };

    const frames = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = checkAllLoaded;
      img.onerror = checkAllLoaded;
      frames.push(img);
    }
    burgerFramesRef.current = frames;

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Canvas Drawing Routine: Frame Assembly in Center of Hero
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const idx = Math.min(Math.round(frameRef.current), TOTAL_FRAMES - 1);
    const burgerImg = burgerFramesRef.current[idx];

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    // Background is now a separate div (bgRef) so canvas is transparent — burger only

    // 2. Render Burger Frame in Exact Center
    if (burgerImg && burgerImg.complete && burgerImg.width > 0) {
      const burgerRatio = burgerImg.width / burgerImg.height;
      const isDesktop = width > 768;

      let bH = height * (isDesktop ? 0.54 : 0.42);
      let bW = bH * burgerRatio;
      if (bW > width * 0.82) {
        bW = width * 0.82;
        bH = bW / burgerRatio;
      }

      const bX = (width - bW) / 2;
      const bY = (height - bH) / 2;

      // Contact Shadow under burger
      ctx.save();
      const shadowX = width / 2;
      const shadowY = bY + bH * 0.86;
      const shadowRx = bW * 0.28;
      const shadowRy = bH * 0.07;

      const shadowGrad = ctx.createRadialGradient(
        shadowX, shadowY, shadowRx * 0.1,
        shadowX, shadowY, shadowRx
      );
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.13)');
      shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.04)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(shadowX, shadowY, shadowRx, shadowRy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render transparent PNG burger frame
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(burgerImg, bX, bY, bW, bH);
    }

    ctx.restore();
  };

  // GSAP ScrollTrigger: Scrub frame assembly (0 -> 95) while pinned in Hero
  useEffect(() => {
    if (!isLoaded) return;

    draw();

    const animObj = { frame: 0 };

    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        // 2400px for frame assembly + 800px for the slide-off transition
        end: '+=3200',
        scrub: 1.0,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: () => {
          frameRef.current = animObj.frame;
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(draw);
        }
      }
    });

    // Phase 1 (0 → 10): Scrub through all 96 burger frames
    tl.to(animObj, { frame: TOTAL_FRAMES - 1, ease: 'none', duration: 10 });

    // Phase 2 (10 → 12.5): Split-door exit —
    //   White background layer slides UP (hero exits upward)
    //   Burger canvas slides DOWN (burger falls into the next section)
    gsap.set([bgRef.current, canvasRef.current], { willChange: 'transform' });

    tl.to(bgRef.current, {
      y: '-100vh',
      ease: 'power2.inOut',
      duration: 2.5,
    }, 10);

    tl.to(canvasRef.current, {
      y: '100vh',
      ease: 'power2.inOut',
      duration: 2.5,
    }, 10);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen select-none"
      style={{ overflow: 'visible' }}
    >
      {/* ─── White Background Layer (slides UP on exit) ───────────────── */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-white z-0"
      />

      {/* ─── Burger Canvas (slides DOWN on exit) ──────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-10"
      />

      {/* ─── Loading Screen ────────────────────────────────────────────── */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-6 max-w-sm w-full">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-amber-500/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-orange-500 animate-spin" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-[0_0_25px_rgba(255,107,0,0.35)]">
                <Flame size={24} className="text-black fill-black" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="font-heading font-extrabold text-xl tracking-widest text-slate-900 uppercase">
                AURA <span className="text-amber-600">ROYALE</span>
              </h2>
              <p className="font-sans text-[10px] tracking-[0.25em] text-slate-400 mt-1 uppercase font-medium">
                INITIALIZING CANVASES
              </p>
            </div>

            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
