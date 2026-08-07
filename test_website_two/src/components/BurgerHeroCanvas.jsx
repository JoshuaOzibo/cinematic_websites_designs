import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, ChevronDown } from 'lucide-react';

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

const INGREDIENT_STAGES = [
  {
    range: [10, 30],
    title: 'Artisanal Brioche Bun',
    subtitle: 'Golden & Truffle-Glazed',
    desc: 'Crafted from 72-hour fermented Japanese Hokkaido dough, toasted in clarified truffle butter and finished with toasted black sesame.',
    badge: '100% Organic Wheat',
    color: 'amber'
  },
  {
    range: [35, 60],
    title: 'A5 Japanese Wagyu Smash',
    subtitle: 'Charred at 475°F',
    desc: 'Hand-smashed on ultra-hot cast iron to lock in marrow juices, creating a crispy lacy edge and unbelievable tender melt-in-mouth texture.',
    badge: 'Marmoreal Grade 12',
    color: 'orange'
  },
  {
    range: [65, 82],
    title: 'Vintage Smoked Cheddar & Jam',
    subtitle: '24-Month Aged & Bourbon Infused',
    desc: 'Deeply aromatic sharp cheddar melted over slow-simmered bourbon bacon jam and house garlic confit aioli.',
    badge: 'Slow Smoke Aged',
    color: 'yellow'
  },
  {
    range: [88, 96],
    title: 'The Masterpiece',
    subtitle: 'Ready to Savor',
    desc: 'Served piping hot directly on our custom slate ceramic plate. An unparalleled symphony of smoke, crunch, and umami.',
    badge: 'Signature Serve',
    color: 'gold'
  }
];

export default function BurgerHeroCanvas({ onAddToCart }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const bgImageRef = useRef(null);
  const burgerFramesRef = useRef([]);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeStage, setActiveStage] = useState(null);
  const audioContextRef = useRef(null);
  const audioNodeRef = useRef(null);

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

    // Preload Burger Animation Frames (Clean PNGs with zero background)
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

  // Web Audio Synthesized Grill Sizzle Sound
  const toggleSizzleSound = () => {
    if (isMuted) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3200;
        filter.Q.value = 1.2;

        const gain = ctx.createGain();
        gain.gain.value = 0.08;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        audioNodeRef.current = { noise, gain, ctx };
        setIsMuted(false);
      } catch (e) {
        console.error('Audio initialization error', e);
      }
    } else {
      if (audioNodeRef.current) {
        try {
          audioNodeRef.current.noise.stop();
          audioNodeRef.current.ctx.close();
        } catch (e) {}
      }
      setIsMuted(true);
    }
  };

  // Canvas Drawing Routine
  const drawScene = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bgImg = bgImageRef.current;
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

    // 1. Draw Solid White Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Realistic Ground Shadow & Clean Transparent Burger PNG
    if (burgerImg && burgerImg.complete && burgerImg.width > 0) {
      const burgerRatio = burgerImg.width / burgerImg.height;
      
      let bH = height * 0.72;
      let bW = bH * burgerRatio;
      
      if (bW > width * 0.95) {
        bW = width * 0.95;
        bH = bW / burgerRatio;
      }

      const bX = (width - bW) / 2;
      const bY = (height - bH) / 2 + (height * 0.02);

      // Contact shadow directly on ceramic plate surface (Subtle soft ground shadow)
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

      // Draw 100% clean transparent PNG burger directly on top of plate
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(burgerImg, bX, bY, bW, bH);
    }

    ctx.restore();
  };

  // GSAP ScrollTrigger Sequence
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
        end: '+=3500',
        scrub: 1.0,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const currentF = Math.round(animObj.frame);
          setCurrentFrame(currentF);
          drawScene(currentF);

          const stage = INGREDIENT_STAGES.find(s => currentF >= s.range[0] && currentF <= s.range[1]);
          setActiveStage(stage || null);
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

  // Handle Play/Pause Auto Scrubbing
  useEffect(() => {
    let interval;
    if (isPlaying && isLoaded) {
      interval = setInterval(() => {
        setCurrentFrame(prev => {
          const next = (prev + 1) % TOTAL_FRAMES;
          drawScene(next);
          const stage = INGREDIENT_STAGES.find(s => next >= s.range[0] && next <= s.range[1]);
          setActiveStage(stage || null);
          return next;
        });
      }, 45);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isLoaded]);

  const handleManualScrub = (e) => {
    const val = parseInt(e.target.value, 10);
    setCurrentFrame(val);
    drawScene(val);
    const stage = INGREDIENT_STAGES.find(s => val >= s.range[0] && val <= s.range[1]);
    setActiveStage(stage || null);
  };

  return (
    <section 
      ref={sectionRef} 
      id="hero" 
      className="relative w-full h-screen bg-white overflow-hidden select-none"
    >
      {/* ─── Loading Screen ────────────────────────────────────────────── */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-6 max-w-sm w-full">
            
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-amber-500/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-orange-500 animate-spin" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.4)]">
                <Flame size={28} className="text-black fill-black" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="font-heading font-extrabold text-2xl tracking-widest text-slate-900 uppercase">
                AURA <span className="text-amber-600">ROYALE</span>
              </h2>
              <p className="font-sans text-xs tracking-[0.25em] text-slate-500 mt-1 uppercase font-medium">
                LOADING BURGER FRAMES
              </p>
            </div>

            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(255,107,0,0.8)]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <span className="font-mono font-bold text-xs text-amber-600 tracking-wider">
              {loadingProgress}% LOADED
            </span>
          </div>
        </div>
      )}

      {/* ─── Full-Bleed Canvas Scene ───────────────────────────────────── */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block z-0"
      />

      {/* ─── Light Overlay Transitions ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#06060a]/30 to-transparent" />
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none hidden lg:flex flex-col items-center gap-1 z-20 text-slate-500 opacity-80 animate-bounce">
        <span className="font-sans text-[9px] tracking-[0.2em] uppercase font-bold text-amber-600">
          EXPLORE MENU BELOW
        </span>
        <ChevronDown size={16} />
      </div>

    </section>
  );
}
