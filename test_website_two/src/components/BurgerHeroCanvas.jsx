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

  // Preload Plate BG & Background-Removed Burger Frames
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let loadedCount = 0;
    const totalToLoad = TOTAL_FRAMES + 1;

    const checkAllLoaded = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / totalToLoad) * 100);
      setLoadingProgress(percent);
      if (loadedCount === totalToLoad) {
        setIsLoaded(true);
        document.body.style.overflow = '';
      }
    };

    // Preload Plate BG
    const bgImg = new Image();
    bgImg.src = '/plate_bg.png';
    bgImg.onload = checkAllLoaded;
    bgImg.onerror = checkAllLoaded;
    bgImageRef.current = bgImg;

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

    // 1. Draw Plate BG (Cover mode)
    if (bgImg && bgImg.complete && bgImg.width > 0) {
      const bgRatio = bgImg.width / bgImg.height;
      const canvasRatio = width / height;
      let bgW, bgH, bgX = 0, bgY = 0;

      if (canvasRatio > bgRatio) {
        bgW = width;
        bgH = width / bgRatio;
        bgY = (height - bgH) / 2;
      } else {
        bgH = height;
        bgW = height * bgRatio;
        bgX = (width - bgW) / 2;
      }
      ctx.drawImage(bgImg, bgX, bgY, bgW, bgH);
    } else {
      ctx.fillStyle = '#06060a';
      ctx.fillRect(0, 0, width, height);
    }

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

      // Contact shadow directly on ceramic plate surface
      ctx.save();
      const shadowX = width / 2;
      const shadowY = bY + bH * 0.83;
      const shadowRx = bW * 0.28;
      const shadowRy = bH * 0.07;

      const shadowGrad = ctx.createRadialGradient(
        shadowX, shadowY, shadowRx * 0.1,
        shadowX, shadowY, shadowRx
      );
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
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
      className="relative w-full h-screen bg-[#06060a] overflow-hidden select-none"
    >
      {/* ─── Loading Screen ────────────────────────────────────────────── */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#06060a] z-50 flex flex-col items-center justify-center px-4">
          <div className="flex flex-col items-center gap-6 max-w-sm w-full">
            
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-amber-500/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-orange-500 animate-spin" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.6)]">
                <Flame size={28} className="text-black fill-black" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="font-heading font-extrabold text-2xl tracking-widest text-white uppercase">
                AURA <span className="text-amber-500">ROYALE</span>
              </h2>
              <p className="font-sans text-xs tracking-[0.25em] text-slate-400 mt-1 uppercase font-medium">
                LOADING TRANSPARENT BURGER FRAMES
              </p>
            </div>

            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(255,107,0,0.8)]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <span className="font-mono font-bold text-xs text-amber-500 tracking-wider">
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

      {/* ─── Vignette Overlay ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#06060a]/90 via-[#06060a]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#06060a] via-[#06060a]/60 to-transparent" />
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-[#06060a]/60 to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-[#06060a]/60 to-transparent" />
      </div>

      {/* ─── Hero Headline (Top overlay) ────────────────────────────── */}
      <div className="absolute top-28 left-6 right-6 md:left-12 md:right-12 z-20 pointer-events-none flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md mb-3 shadow-[0_0_25px_rgba(245,158,11,0.15)] pointer-events-auto">
          <Sparkles size={13} className="text-amber-400 animate-pulse" />
          <span className="font-sans text-[10px] font-extrabold tracking-[0.25em] text-amber-400 uppercase">
            SCROLL TO ASSEMBLE
          </span>
        </div>

        <h1 className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl text-white tracking-tight uppercase leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          CRAFTED IN SMOKE. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 italic font-serif">
            ELEVATED TO PERFECTION.
          </span>
        </h1>
      </div>

      {/* ─── Interactive Stage Callout Card ───────────────────────────── */}
      {activeStage && (
        <div className="absolute left-6 bottom-28 md:left-12 md:bottom-28 max-w-sm w-full z-30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          <div className="glass-card rounded-2xl p-5 border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/20 to-transparent pointer-events-none rounded-tr-2xl" />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                {activeStage.badge}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                STAGE {Math.floor((currentFrame / TOTAL_FRAMES) * 4) + 1}/4
              </span>
            </div>

            <h3 className="font-heading font-extrabold text-xl text-white uppercase tracking-wide mt-1">
              {activeStage.title}
            </h3>
            <p className="font-sans text-xs text-amber-400 font-semibold mb-2">
              {activeStage.subtitle}
            </p>
            <p className="font-sans text-xs text-slate-300 leading-relaxed font-light">
              {activeStage.desc}
            </p>
          </div>
        </div>
      )}

      {/* ─── Interactive HUD Controls Bar (Bottom) ────────────────────── */}
      <div className="absolute bottom-6 left-6 right-6 md:left-12 md:right-12 z-30 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
        
        {/* Frame Scrubber Bar */}
        <div className="glass-card rounded-full px-5 py-2.5 flex items-center gap-4 border border-white/10 w-full md:w-auto shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.5)]"
            title={isPlaying ? 'Pause Animation' : 'Auto Play Assembly'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>

          <button 
            onClick={() => {
              setCurrentFrame(0);
              drawScene(0);
              setActiveStage(null);
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 transition-all cursor-pointer"
            title="Reset to Frame 1"
          >
            <RotateCcw size={14} />
          </button>

          {/* Slider */}
          <div className="flex items-center gap-3 flex-1 md:w-64">
            <span className="text-[10px] font-mono font-bold text-amber-400">
              {pad(currentFrame + 1)}
            </span>
            <input 
              type="range"
              min="0"
              max={TOTAL_FRAMES - 1}
              value={currentFrame}
              onChange={handleManualScrub}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[10px] font-mono text-slate-400">
              {TOTAL_FRAMES}
            </span>
          </div>

          {/* Audio Grill Sizzle */}
          <button 
            onClick={toggleSizzleSound}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              !isMuted 
                ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-[0_0_12px_rgba(255,107,0,0.4)]' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isMuted ? 'Turn On Grill Sizzle Audio' : 'Mute Audio'}
          >
            {!isMuted ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>

        {/* Action Button: Order Signature Smash */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onAddToCart({
              id: 'wagyu-royale',
              name: 'The Wagyu Royale Smash',
              price: 24.50,
              desc: 'Triple A5 Wagyu, 24mo Cheddar, Bourbon Bacon Jam',
              image: '/background-remover/ezgif-frame-096.png'
            })}
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-black px-6 py-3 rounded-full font-sans text-xs font-extrabold uppercase tracking-widest transition-all duration-300 shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_40px_rgba(255,107,0,0.6)] hover:scale-105 cursor-pointer flex items-center gap-2"
          >
            <Flame size={15} className="text-black fill-black" />
            <span>Order This Burger • $24.50</span>
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none hidden lg:flex flex-col items-center gap-1 z-20 text-slate-400 opacity-70 animate-bounce">
        <span className="font-sans text-[9px] tracking-[0.2em] uppercase font-bold text-amber-400">
          EXPLORE MENU BELOW
        </span>
        <ChevronDown size={16} />
      </div>

    </section>
  );
}
