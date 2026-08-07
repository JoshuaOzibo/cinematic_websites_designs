import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 96;
const FRAME_RATIO = 1280 / 720;     // source frames are 16:9 with the burger centred

/** Hero scroll track height, in viewport heights. Sticky panel unsticks at (TRACK - 1). */
const TRACK_VH = 4;
/** Assembly finishes this many viewport-heights in, leaving a short beat before the flight. */
const ASSEMBLY_VH = 2.7;
/** Travel progress at which the canvas hands off to the static <img> in the slot. */
const HANDOFF = 0.88;

/** Landing target rendered by BurgerFeatureSection. */
export const LANDING_SLOT_ID = 'burger-landing-slot';
/** Section the flight is timed against. */
export const FEATURE_SECTION_ID = 'features';

const pad = (num, size = 3) => String(num).padStart(size, '0');

const getFramePath = (index) => `/background-remover/ezgif-frame-${pad(index + 1)}.png`;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** The burger's resting box in the hero: a 16:9 frame centred in the viewport. */
const getHeroBox = (w, h) => {
  const desktop = w > 768;
  let bh = h * (desktop ? 0.66 : 0.52);
  let bw = bh * FRAME_RATIO;
  const maxW = w * (desktop ? 0.9 : 0.96);
  if (bw > maxW) {
    bw = maxW;
    bh = bw / FRAME_RATIO;
  }
  return { x: (w - bw) / 2, y: (h - bh) / 2, w: bw, h: bh };
};

export default function BurgerHeroCanvas() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);

  const frameRef = useRef(0);      // 0 → 95, assembly
  const travelRef = useRef(0);     // 0 = hero centre, 1 = landed in the feature slot
  const rafRef = useRef(null);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Preload every assembly frame ───────────────────────────────────────────
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

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ── Scroll-driven rendering ────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    const section = sectionRef.current;
    if (!section) return;

    /**
     * Draws the current frame at the current point along the hero → slot flight.
     * The landing box is read live from the slot's bounding rect, so the burger
     * tracks the section as it scrolls up and lands exactly on it.
     */
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const idx = Math.min(Math.max(Math.round(frameRef.current), 0), TOTAL_FRAMES - 1);
      const img = framesRef.current[idx];
      if (!img || !img.complete || !img.naturalWidth) {
        ctx.restore();
        return;
      }

      const t = clamp01(travelRef.current);

      // Fade the canvas out over the last stretch; the static slot <img> fades in
      // to meet it. By then both occupy the same box, so the swap is invisible.
      const alpha = t <= HANDOFF ? 1 : 1 - (t - HANDOFF) / (1 - HANDOFF);
      canvas.style.visibility = alpha <= 0.002 ? 'hidden' : 'visible';
      if (alpha <= 0.002) {
        ctx.restore();
        return;
      }

      let box = getHeroBox(w, h);

      if (t > 0) {
        const slot = document.getElementById(LANDING_SLOT_ID);
        if (slot) {
          const r = slot.getBoundingClientRect();
          const e = easeInOutCubic(t);
          box = {
            x: lerp(box.x, r.left, e),
            y: lerp(box.y, r.top, e),
            w: lerp(box.w, r.width, e),
            h: lerp(box.h, r.height, e),
          };
        }
      }

      ctx.globalAlpha = alpha;

      // Contact shadow, sat under the burger's base (~0.755 down the 16:9 frame)
      const sx = box.x + box.w * 0.5;
      const sy = box.y + box.h * 0.755;
      const rx = box.w * 0.18;
      const ry = box.h * 0.038;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.scale(1, ry / rx);
      const shadow = ctx.createRadialGradient(0, 0, rx * 0.1, 0, 0, rx);
      shadow.addColorStop(0, 'rgba(0, 0, 0, 0.16)');
      shadow.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
      shadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.drawImage(img, box.x, box.y, box.w, box.h);
      ctx.restore();
    };

    const scheduleDraw = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => scheduleDraw();
    window.addEventListener('resize', handleResize);

    const ctxGsap = gsap.context(() => {
      // ── Phase 1: assemble the burger while the hero panel is stuck ──────────
      const assembly = { frame: 0 };
      gsap.to(assembly, {
        frame: TOTAL_FRAMES - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + window.innerHeight * ASSEMBLY_VH,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          frameRef.current = assembly.frame;
          scheduleDraw();
        },
      });

      // ── Phase 2: fly the finished burger into the feature section's slot ────
      // Runs from the moment the feature section touches the bottom of the
      // viewport until its top reaches the top — exactly the window in which the
      // hero panel unsticks and slides away, so the burger appears to ride down
      // out of the hero and settle into the empty frame.
      const feature = document.getElementById(FEATURE_SECTION_ID);
      if (feature) {
        const travel = { t: 0 };
        gsap.to(travel, {
          t: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: feature,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            travelRef.current = travel.t;
            // Drives the slot placeholder out and the static burger in (see index.css)
            document.documentElement.style.setProperty('--burger-travel', String(travel.t));
            scheduleDraw();
          },
        });
      }
    }, section);

    // Later sections settle after mount; make sure trigger ends are measured right.
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
      {/* ─── Sticky hero panel — unsticks and slides away as the burger departs ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,176,60,0.10),rgba(255,255,255,0)_62%)]" />
      </div>

      {/* ─── Travelling burger. Fixed to the viewport so it can outlive the hero. ───
          Must stay clear of transformed ancestors, or `fixed` would resolve
          against them instead of the viewport. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full block z-30 pointer-events-none"
      />

      {/* ─── Loading Screen ────────────────────────────────────────────────────── */}
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
