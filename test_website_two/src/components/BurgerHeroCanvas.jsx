import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 96;

const pad = (num, size = 3) => {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
};

const getFramePath = (index) => {
  return `/background-remover/ezgif-frame-${pad(index + 1)}.png`;
};

export default function BurgerHeroCanvas() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const burgerFramesRef = useRef([]);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Preload Background-Removed Burger Frames
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let loadedCount = 0;
    const totalToLoad = TOTAL_FRAMES;

    const checkAllLoaded = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / totalToLoad) * 100);
      setLoadingProgress(percent);
      if (loadedCount === totalToLoad) {
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

  // Canvas Drawing Routine: Draw Burger in Exact Center on White Background
  const drawScene = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const burgerImg = burgerFramesRef.current[frameIndex];

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Pure White Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 2. Render Burger Frame in Exact Center
    if (burgerImg && burgerImg.complete && burgerImg.width > 0) {
      const burgerRatio = burgerImg.width / burgerImg.height;
      
      const isDesktop = width > 768;
      let bH = height * (isDesktop ? 0.68 : 0.48);
      let bW = bH * burgerRatio;
      
      if (bW > width * 0.90) {
        bW = width * 0.90;
        bH = bW / burgerRatio;
      }

      // Centered Position
      const bX = (width - bW) / 2;
      const bY = (height - bH) / 2 + (height * 0.02);

      // Contact Shadow
      ctx.save();
      const shadowX = width / 2;
      const shadowY = bY + bH * 0.83;
      const shadowRx = bW * 0.28;
      const shadowRy = bH * 0.07;

      const shadowGrad = ctx.createRadialGradient(
        shadowX, shadowY, shadowRx * 0.1,
        shadowX, shadowY, shadowRx
      );
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.12)');
      shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.04)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(shadowX, shadowY, shadowRx, shadowRy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw 100% clean transparent PNG burger
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(burgerImg, bX, bY, bW, bH);
    }

    ctx.restore();
  };

  // GSAP ScrollTrigger: Scrub frame assembly (0 -> 95) while pinned in Hero
  useEffect(() => {
    if (!isLoaded) return;

    drawScene(0);

    const animObj = { frame: 0 };

    const handleResize = () => {
      drawScene(Math.round(animObj.frame));
    };
    window.addEventListener('resize', handleResize);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2500',
        scrub: 1.0,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: () => {
          const currentF = Math.round(animObj.frame);
          setCurrentFrame(currentF);
          drawScene(currentF);
        }
      }
    });

    tl.to(animObj, {
      frame: TOTAL_FRAMES - 1,
      ease: 'none',
      duration: 10
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded]);

  return (
    <section 
      ref={sectionRef} 
      id="hero" 
      className="relative w-full h-screen bg-white overflow-hidden select-none border-b border-slate-100"
    >
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

      {/* ─── Clean Canvas Scene (Zero Text) ────────────────────────────── */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block z-0"
      />
    </section>
  );
}
