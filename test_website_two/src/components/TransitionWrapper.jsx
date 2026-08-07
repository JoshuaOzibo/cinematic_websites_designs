import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * TransitionWrapper
 *
 * Wraps the Hero and the Feature section.
 * As the user scrolls out of the hero, the hero card slides diagonally
 * down-left (translateX: -6%, translateY: +8%, slight scale down) while the
 * feature section rises cleanly underneath — creating a seamless physical
 * hand-off between the two sections.
 *
 * Nothing inside the children is modified; all transforms are applied to the
 * outer wrapper layers only.
 */
export default function TransitionWrapper({ heroSlot, featureSlot }) {
  const wrapperRef  = useRef(null);
  const heroLayerRef    = useRef(null);
  const featureLayerRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const heroEl  = heroLayerRef.current;
    const featEl  = featureLayerRef.current;
    if (!wrapper || !heroEl || !featEl) return;

    const ctx = gsap.context(() => {
      // ── Hero exit: slides down-left as it leaves the viewport ──────────
      // Triggered once the hero's bottom edge reaches 80% of viewport height,
      // ends when it's fully off-screen. Scrub keeps it tied 1:1 to scroll.
      gsap.fromTo(heroEl,
        { x: '0%', y: '0%', scale: 1, transformOrigin: 'bottom left' },
        {
          x: '-6%',
          y:  '5%',
          scale: 0.97,
          ease: 'none',
          scrollTrigger: {
            trigger: heroEl,
            start: 'bottom 90%',  // hero bottom is near lower viewport
            end:   'bottom top',  // hero bottom exits top of screen
            scrub: 1.4,
            invalidateOnRefresh: true,
          }
        }
      );

      // ── Feature reveal: rises into place as hero exits ─────────────────
      gsap.fromTo(featEl,
        { y: 60, opacity: 0.4 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featEl,
            start: 'top 92%',
            end:   'top 30%',
            scrub: 1.2,
            invalidateOnRefresh: true,
          }
        }
      );
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative overflow-x-clip">
      {/* Hero layer — all transforms applied here, content untouched */}
      <div ref={heroLayerRef} style={{ willChange: 'transform' }}>
        {heroSlot}
      </div>

      {/* Feature layer — rises underneath the exiting hero */}
      <div ref={featureLayerRef} style={{ willChange: 'transform, opacity' }}>
        {featureSlot}
      </div>
    </div>
  );
}
