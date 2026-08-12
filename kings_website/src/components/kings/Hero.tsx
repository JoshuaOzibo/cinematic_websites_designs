import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import archImage from "@/assets/hero.jpg";
import bottleImage from "@/assets/kings-bottle.webp";
import logoImg from "@/assets/logo.png";

const LETTERS = ["K", "I", "N", "G", "S"];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinSpacerRef = useRef<HTMLDivElement>(null);

  /* The arch is a doorway, so scrolling walks you through it: the aperture
     opens until the photo is the room, the bottle settles from monument to
     object, and the ink turns cream because you are inside now. The letters
     never move — they are the fixed frame the world changes behind.

     GSAP writes two numbers per frame and nothing else. All the geometry
     lives in styles.css, next to the tokens it reads, so the breakpoints
     keep driving it and there is no second copy of the arch arithmetic. */
  useEffect(() => {
    const section = sectionRef.current;
    const pinSpacer = pinSpacerRef.current;
    if (!section || !pinSpacer) return;

    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      // Force instant scroll by bypassing smooth scrolling during registration
      const html = document.documentElement;
      const originalScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      html.style.scrollBehavior = originalScrollBehavior;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.clearScrollMemory();
    // 100svh changes every time a mobile URL bar hides. Without this each one
    // is a full refresh, and a pinned section visibly jumps through it.
    ScrollTrigger.config({ ignoreMobileResize: true });

    // matchMedia is itself a gsap context, so it owns cleanup directly rather
    // than being nested inside another one. That matters here: `mm.revert()`
    // is what tears down the pin spacer and the inline custom properties, and
    // dev HMR re-runs this effect on every edit — a partial teardown would
    // stack a second pinned trigger on the same section.
    const mm = gsap.matchMedia();

    // Under 900px the arch is an in-flow box, so there is no aperture to
    // open. The reduce query has to be here rather than in the stylesheet:
    // a scrubbed timeline is not a CSS animation, so the reduced-motion
    // block in styles.css would never see it.
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      // Prevent lag spikes during screen recording or rapid scrolling
      gsap.ticker.lagSmoothing(1000, 16);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            pin: true,
            pinSpacer,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.35,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: true,
            onToggle: (self) => {
              section.dataset["aperture"] = self.isActive ? "active" : "idle";
            },
            onUpdate: (self) => {
              // The header runs charcoal-on-cream until the photo takes the
              // room. Its old fixed scroll depth is wrong now that the pin
              // has moved where that moment happens.
              document.documentElement.dataset["heroDark"] =
                self.progress > 0.45 ? "true" : "false";
            },
          },
        })
        .to(section, { "--hero-expand": 1, duration: 1, ease: "power1.out" }, 0)
        .to(section, { "--bottle-open": 1, duration: 0.95, ease: "power1.out" }, 0.04);
    });

    // Force a refresh after the first two animation frames so the pin
    // spacer is measured at the correct full-viewport width (not at the
    // narrower clientWidth that includes a visible scrollbar).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });
    });

    // --hero-word-size feeds the stage's min-height, which feeds the section
    // height, which decides where the pin ends. Playfair landing late moves it.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      mm.revert();
      // Otherwise the header stays stuck dark after the hero unmounts.
      delete document.documentElement.dataset["heroDark"];
    };
  }, []);

  return (
    // Plain block wrapper, layout-neutral — it exists only so the pin has a
    // spacer it does not have to reparent the section into. ScrollTrigger
    // writes the pin sizing onto it and restores it on revert.
    <div ref={pinSpacerRef} className="w-full overflow-hidden">
      <section
        ref={sectionRef}
        id="top"
        className="hero-light relative flex w-full min-h-[100svh] items-center overflow-hidden"
        style={{ left: 0, maxWidth: "100%" }}
      >
        <div aria-hidden className="hero-glow" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pt-32 pb-24 sm:px-10 lg:px-16">
          {/* BIG BRAND LOGO top-left and bottom-right around wordmark */}
          <div className="flex items-end justify-between gap-6">
            <div
              data-visible="true"
              className="reveal flex items-center"
              style={{ animationDelay: "140ms" }}
            >
              <img
                src={logoImg}
                alt="D Kings Logo"
                className="h-10 sm:h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-lg"
              />
            </div>

            <p
              data-visible="true"
              className="reveal kicker hidden items-center gap-2 sm:flex"
              style={{ animationDelay: "60ms" }}
            >
              <span
                aria-hidden
                className="inline-block h-px w-6 shrink-0 bg-[var(--hero-gold-ink)]"
              />
              Ogwashi, Delta State
            </p>
          </div>

          {/* Arch photo, wordmark and bottle share one positioning context so the
              letters can straddle the panel and the bottle can bleed past both. */}
          <div className="hero-stage mt-8 sm:mt-4">
            <h1 className="hero-word" aria-label="Kings Lounge">
              <span aria-hidden="true" className="hero-word__letters">
                {LETTERS.map((letter, i) => (
                  <span
                    key={letter}
                    data-visible="true"
                    className="reveal hero-word__letter"
                    style={{ animationDelay: `${300 + i * 70}ms` }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </h1>
          </div>

          <p
            aria-hidden="true"
            data-visible="true"
            className="reveal font-display text-[1.1rem] sm:text-[1.6rem] lg:text-[2.2rem] font-medium tracking-[0.25em] uppercase text-right leading-none mt-3 sm:mt-2 text-[var(--hero-ink)]"
            style={{ animationDelay: "400ms" }}
          >
            Lounge
          </p>

          <div className="mt-12 flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p
              data-visible="true"
              className="reveal max-w-[20rem] text-[clamp(0.9rem,1.1vw,1rem)] leading-[1.72] tracking-[0.005em] text-[var(--hero-ink-muted)]"
              style={{ animationDelay: "940ms" }}
            >
              A bar, a kitchen and a shisha lounge built for long evenings — rare pours, slow smoke,
              and a room lit for the camera.
            </p>
          </div>
        </div>

        {/* arch and bottle are siblings of the content div so they position
            relative to the section (100svh), not the stage inner height.
            This lets us pin their tops flush to the navbar bottom.

            The figure is a full-bleed plate cut down to the arch; __inner is the
            same cut 1px in, which is what leaves the gold showing as a hairline
            that follows the shape as it opens. */}
        <figure
          data-visible="true"
          className="arch-open hero-arch m-0"
          style={{ animationDelay: "220ms" }}
        >
          <span className="hero-arch__inner">
            <img
              src={archImage}
              alt="A bartender pouring whisky from a cut-glass decanter at Kings Lounge, Asaba"
              width={1920}
              height={1280}
              loading="eager"
              fetchPriority="high"
            />
          </span>
        </figure>

        <img
          src={bottleImage}
          alt=""
          aria-hidden="true"
          width={284}
          height={943}
          data-visible="true"
          className="rise hero-bottle"
          style={{ animationDelay: "640ms" }}
          draggable={false}
        />

        <div aria-hidden className="hero-grain" />
      </section>
    </div>
  );
}
