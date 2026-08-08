import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 96;
const FRAME_RATIO = 1280 / 720;     // source frames are 16:9 with the burger centred

/** Scroll (in viewport heights) spent assembling the burger, while genuinely pinned. */
const ASSEMBLY_VH = 2.7;
/** Short pause, still pinned, between "assembly done" and "unpin". */
const BEAT_VH = 0.3;
/** Scroll spent (after unpin, real page scroll) flying the burger into each landing slot. */
const TRAVEL_VH = 1;
const TRACK_VH = ASSEMBLY_VH + BEAT_VH + TRAVEL_VH;
/** Travel progress at which the canvas hands off to each static <img> in its slot. */
const HANDOFF = 0.99;  // Start crossfade very late so canvas & static img are nearly co-located

/** Landing targets */
export const LANDING_SLOT_ID        = 'burger-landing-slot';
export const LANDING_SLOT_2_ID      = 'burger-landing-slot-2';
export const FEATURE_SECTION_ID     = 'features';
export const FEATURE_SECTION_2_ID   = 'features-2';

const pad = (num, size = 3) => String(num).padStart(size, '0');
const getFramePath = (index) => `/background-remover/ezgif-frame-${pad(index + 1)}.png`;

const lerp    = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const getHeroBox = (w, h) => {
  const desktop = w > 768;
  let bh = h * (desktop ? 0.66 : 0.52);
  let bw = bh * FRAME_RATIO;
  const maxW = w * (desktop ? 0.9 : 0.96);
  if (bw > maxW) { bw = maxW; bh = bw / FRAME_RATIO; }
  return { x: (w - bw) / 2, y: (h - bh) / 2, w: bw, h: bh };
};

export default function BurgerHeroCanvas() {
  const sectionRef = useRef(null);
  const pinRef     = useRef(null);
  const canvasRef  = useRef(null);
  const framesRef  = useRef([]);

  const frameRef   = useRef(0);   // 0 → 95, assembly
  const travelRef  = useRef(0);   // 0→1, hero → slot 1
  const travel2Ref = useRef(0);   // 0→1, hero-center → slot 2
  const rafRef     = useRef(null);
  const canvasSizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded]               = useState(false);

  // ── Preload all frames ─────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    let loadedCount = 0;
    const onSettled = () => {
      loadedCount++;
      setLoadingProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      if (loadedCount === TOTAL_FRAMES) {
        setIsLoaded(true);
        document.body.style.overflow = '';
      }
    };
    const frames = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = onSettled;
      img.onerror = onSettled;
      frames.push(img);
    }
    framesRef.current = frames;
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── Scroll-driven rendering ────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    const section   = sectionRef.current;
    const pinTarget = pinRef.current;
    if (!section || !pinTarget) return;

    const syncSize = (canvas) => {
      const w   = canvas.clientWidth;
      const h   = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const c   = canvasSizeRef.current;
      if (c.w !== w || c.h !== h || c.dpr !== dpr) {
        canvas.width  = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvasSizeRef.current = { w, h, dpr };
      }
      return { w, h, dpr };
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { w, h, dpr } = syncSize(canvas);

      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const idx = Math.min(Math.max(Math.round(frameRef.current), 0), TOTAL_FRAMES - 1);
      const img = framesRef.current[idx];
      if (!img || !img.complete || !img.naturalWidth) { ctx.restore(); return; }

      const t  = clamp01(travelRef.current);
      const t2 = clamp01(travel2Ref.current);

      // ── Determine which flight phase is active ───────────────────────────
      // Phase 2: hero-centre → slot 1  (t  0→1, t2 = 0)
      // Phase 3: slot 1      → slot 2  (t2 0→1, t  = 1)
      // Resting: t = 1, t2 = 0         → static img in slot 1 holds, canvas hidden
      const inPhase2 = t > 0 && t2 === 0;
      const inPhase3 = t2 > 0;
      const resting  = t === 1 && t2 === 0;

      // Alpha controls canvas visibility at the tail end of each flight.
      let alpha;
      if (inPhase3) {
        alpha = t2 <= HANDOFF ? 1 : 1 - (t2 - HANDOFF) / (1 - HANDOFF);
      } else {
        alpha = t  <= HANDOFF ? 1 : 1 - (t  - HANDOFF) / (1 - HANDOFF);
      }

      const shouldHide = resting || alpha <= 0.002;
      canvas.style.visibility = shouldHide ? 'hidden' : 'visible';
      if (shouldHide) { ctx.restore(); return; }

      // ── Compute the burger's bounding box for this frame ─────────────────
      let box = getHeroBox(w, h); // default: centred in the viewport (Phase 2 start)

      if (inPhase3) {
        // Phase 3: burger travels from slot 1's live rect → slot 2's live rect.
        // getBoundingClientRect() tracks each element's viewport position every
        // frame, so as slot 1 scrolls off the top and slot 2 rises from below,
        // the burger naturally follows — a true physical lift-off and landing.
        const slot1 = document.getElementById(LANDING_SLOT_ID);
        const slot2 = document.getElementById(LANDING_SLOT_2_ID);
        if (slot1 && slot2) {
          const r1 = slot1.getBoundingClientRect();
          const r2 = slot2.getBoundingClientRect();
          const e  = easeInOutCubic(t2);
          box = {
            x: lerp(r1.left,   r2.left,   e),
            y: lerp(r1.top,    r2.top,    e),
            w: lerp(r1.width,  r2.width,  e),
            h: lerp(r1.height, r2.height, e),
          };
        }
      } else if (inPhase2) {
        // Phase 2: burger travels from hero centre → slot 1's live rect.
        const slot1 = document.getElementById(LANDING_SLOT_ID);
        if (slot1) {
          const r = slot1.getBoundingClientRect();
          const e = easeInOutCubic(t);
          box = {
            x: lerp(box.x, r.left,   e),
            y: lerp(box.y, r.top,    e),
            w: lerp(box.w, r.width,  e),
            h: lerp(box.h, r.height, e),
          };
        }
      }

      ctx.globalAlpha = alpha;
      ctx.drawImage(img, box.x, box.y, box.w, box.h);
      ctx.restore();
    };

    const handleResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };
    window.addEventListener('resize', handleResize);
    draw();

    const ctxGsap = gsap.context(() => {

      // ── Phase 1: assemble (pinned, 1:1 scrub) ───────────────────────────
      const assembly = { frame: 0 };
      gsap.to(assembly, {
        frame: TOTAL_FRAMES - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: pinTarget,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate() {
          frameRef.current = assembly.frame;
          draw();
        },
      });

      // ── Phase 2: fly hero → slot 1 (left side of BurgerFeatureSection) ──
      const feature = document.getElementById(FEATURE_SECTION_ID);
      if (feature) {
        const travel = { t: 0 };
        gsap.to(travel, {
          t: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: feature,
            start: 'top bottom',
            end: 'top top+=20%',
            scrub: true,
            invalidateOnRefresh: true,
          },
          onUpdate() {
            travelRef.current = travel.t;
            document.documentElement.style.setProperty('--burger-travel', String(travel.t));
            draw();
          },
        });
      }

      // ── Phase 3: fly hero-center → slot 2 (right side of BurgerFeatureSection2) ──
      // The burger re-launches from the viewport center and travels to slot 2 as
      // the second section scrolls into view — exactly mirroring Phase 2.
      const feature2 = document.getElementById(FEATURE_SECTION_2_ID);
      if (feature2) {
        const travel2 = { t: 0 };
        gsap.to(travel2, {
          t: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: feature2,
            start: 'top+=30% bottom',
            end: 'top top+=20%',
            scrub: true,
            invalidateOnRefresh: true,
          },
          onUpdate() {
            travel2Ref.current = travel2.t;
            document.documentElement.style.setProperty('--burger-travel-2', String(travel2.t));
            draw();
          },
        });
      }

    }, section);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ctxGsap.revert();
    };
  }, [isLoaded]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full select-none"
      style={{ height: `${TRACK_VH * 100}vh` }}
    >
      <div ref={pinRef} className="h-screen w-full overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,176,60,0.10),rgba(255,255,255,0)_62%)]" />
      </div>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full block z-30 pointer-events-none"
        style={{ willChange: 'contents' }}
      />

      {!isLoaded && (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center px-4">
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
