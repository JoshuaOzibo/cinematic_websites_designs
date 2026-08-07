import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * BurgerScrollBridge
 *
 * Activates ONLY after the hero pin has fully released (assembly complete).
 * Triggers off the hero section's bottom exiting the viewport — guaranteeing
 * the full frame assembly plays before any slide begins.
 *
 * Then slides a position:fixed burger overlay from viewport center
 * (hero resting position) into the feature section's left column.
 * Hero canvas fades to white simultaneously so the burger appears to leave.
 */
export default function BurgerScrollBridge({ heroSectionId, featureSectionId }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const el         = overlayRef.current;
    const heroSec    = document.getElementById(heroSectionId);
    const featureSec = document.getElementById(featureSectionId);
    const heroCanvas = document.getElementById('hero-assembly-canvas');
    const featureImg = document.getElementById('feature-burger-img');
    if (!el || !heroSec || !featureSec) return;

    const vW      = window.innerWidth;
    const vH      = window.innerHeight;
    const desktop = vW > 768;

    // ── Burger dimensions ─────────────────────────────────────────────────
    const startSize = vH * (desktop ? 0.54 : 0.42);
    const endSize   = vH * (desktop ? 0.50 : 0.36);

    // ── Start coords: viewport centre (where hero burger lives) ──────────
    const startLeft = vW / 2;
    const startTop  = vH / 2;

    // ── End coords: centre of feature section left column ────────────────
    const colW    = desktop ? vW * 0.41 : vW;
    const endLeft = desktop ? colW / 2 : vW / 2;
    // Feature section midpoint — calculate once on mount, stable enough
    const endTop  = vH * (desktop ? 0.38 : 0.36);

    // Set overlay hidden at hero-center position
    gsap.set(el, {
      left:          startLeft,
      top:           startTop,
      xPercent:      -50,
      yPercent:      -50,
      width:         startSize,
      opacity:       0,
      pointerEvents: 'none',
    });

    // ── ScrollTrigger: trigger on HERO bottom leaving top of viewport ─────
    // This guarantees we're past the pin (assembly done) before anything slides.
    const st = ScrollTrigger.create({
      trigger:             heroSec,
      start:               'bottom top',       // hero bottom exits viewport top — pin fully done
      end:                 `+=${vH * 1.2}`,    // 1.2 viewport-heights of additional scroll
      scrub:               0.9,
      invalidateOnRefresh: true,

      onEnter: () => {
        // Assembly is done — begin slide, fade hero canvas out
        gsap.set(el, { opacity: 1 });
        if (heroCanvas) {
          heroCanvas.style.transition = 'opacity 0.3s ease';
          heroCanvas.style.opacity    = '0';
        }
        if (featureImg) featureImg.style.opacity = '0';
      },

      onLeaveBack: () => {
        // User scrolled back up — restore hero canvas, hide bridge
        gsap.set(el, { opacity: 0 });
        if (heroCanvas) heroCanvas.style.opacity = '1';
        if (featureImg) featureImg.style.opacity = '0';
      },

      onUpdate: (self) => {
        const p    = self.progress;
        // Smooth cubic ease-in-out for natural slide feel
        const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;

        const curLeft = startLeft + (endLeft - startLeft) * ease;
        const curTop  = startTop  + (endTop  - startTop)  * ease;
        const curSize = startSize + (endSize - startSize)  * ease;

        gsap.set(el, {
          left:    curLeft,
          top:     curTop,
          width:   curSize,
          xPercent: -50,
          yPercent: -50,
        });

        // Last 20%: bridge fades out → static feature image fades in
        if (p > 0.80) {
          const fade = (p - 0.80) / 0.20;
          gsap.set(el, { opacity: 1 - fade });
          if (featureImg) featureImg.style.opacity = String(fade);
        } else {
          gsap.set(el, { opacity: 1 });
          if (featureImg) featureImg.style.opacity = '0';
        }
      },

      onLeave: () => {
        // Fully landed — hide overlay, lock static image in
        gsap.set(el, { opacity: 0 });
        if (featureImg) {
          featureImg.style.transition = 'opacity 0.3s ease';
          featureImg.style.opacity    = '1';
        }
      },
    });

    return () => st.kill();
  }, [heroSectionId, featureSectionId]);

  return (
    <img
      ref={overlayRef}
      src="/background-remover/ezgif-frame-096.png"
      alt=""
      aria-hidden="true"
      style={{
        position:      'fixed',
        zIndex:        999,
        pointerEvents: 'none',
        height:        'auto',
        opacity:       0,
        willChange:    'transform, opacity, width',
        filter:        'drop-shadow(0 20px 30px rgba(0,0,0,0.12))',
      }}
    />
  );
}
