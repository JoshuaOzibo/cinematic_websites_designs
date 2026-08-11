import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cognacImage from "@/assets/card-cognac.png";
import shishaImage from "@/assets/card-shisha.png";
import cocktailImage from "@/assets/card-cocktail.png";
import whiskeyImage from "@/assets/02_whiskey_rocks_glass.png";
import espressoMartiniImage from "@/assets/04_espresso_martini.png";

/* Entrance stagger between the three columns. Not the scroll animation —
   that one is scrubbed and owns no clock of its own. */
const ENTER_STEP_MS = 280;

/* All three plates are 512×1024. Declared so the intrinsic ratio is known
   before the bytes land. */
const PLATE_W = 512;
const PLATE_H = 1024;

/* ─── card data ──────────────────────────────────────────── */
type Item = {
  image: string;
  alt: string;
  kicker: string;
  title: string;
  description: string;
  link: string;
};

const COGNAC: Item = {
  image: cognacImage,
  alt: "A bottle of Kingston XO Extra Old Cognac on a reflective surface",
  kicker: "Rare Spirits",
  title: "Kingston XO Extra Old",
  description:
    "An exquisite blend of aged cognacs with rich oak, vanilla and warm spice notes, poured with ceremony.",
  link: "/menu",
};

const SHISHA: Item = {
  image: shishaImage,
  alt: "Hookah shisha pipe with glowing coals and rising smoke on a glossy dark background",
  kicker: "Premium Smoke",
  title: "Aura Shisha Lounge",
  description:
    "Hand-selected custom hookah blends and slow-burning coconut coals, tailored for long, relaxing evenings.",
  link: "#reserve",
};

const COCKTAIL: Item = {
  image: cocktailImage,
  alt: "Artisanal orange cocktail garnish with rosemary sprig in a coupe glass",
  kicker: "Signature Mixes",
  title: "Craft Cocktails",
  description:
    "Expertly mixed craft creations featuring fresh botanical infusions and premium spirits.",
  link: "/menu",
};

const WHISKEY: Item = {
  image: whiskeyImage,
  alt: "A crystal rocks glass filled with small-batch bourbon over hand-carved ice",
  kicker: "Aged Whiskies",
  title: "Single Malt & Bourbon",
  description:
    "Small-batch whiskies poured over crystal-clear ice spheres, capturing rich charred oak and caramel aromas.",
  link: "/menu",
};

const ESPRESSO_MARTINI: Item = {
  image: espressoMartiniImage,
  alt: "Artisanal espresso martini topped with coffee beans in a chilled glass",
  kicker: "Nightcap Special",
  title: "Espresso Martini",
  description:
    "Freshly pulled espresso shaken with artisanal vodka and coffee liqueur, finished with dark chocolate velvet.",
  link: "/menu",
};

/* ─── reusable card shell ────────────────────────────────── */
function Card({ item }: { item: Item }) {
  const cta = (
    <>
      <span>Discover More</span>
      <svg
        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </>
  );
  const ctaClass =
    "inline-flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.16em] uppercase text-primary group-hover:text-white transition-colors duration-300";

  return (
    <div className="showcase-card group relative h-full w-full overflow-hidden rounded-[24px] border border-border bg-[var(--showcase-plate)] transition-[border-color,box-shadow] duration-500 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(201,162,75,0.08)]">
      {/* image */}
      <div className="absolute inset-0 overflow-hidden rounded-[24px]">
        <img
          src={item.image}
          alt={item.alt}
          width={PLATE_W}
          height={PLATE_H}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center transition-transform duration-[1000ms] ease-out group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>

      {/* text */}
      <div className="showcase-card__pad absolute inset-0 flex flex-col justify-end p-6 sm:p-9 z-10">
        <span className="kicker transition-colors duration-300">{item.kicker}</span>
        <h3 className="showcase-card__title font-display mt-3 text-[1.85rem] sm:text-[2.2rem] leading-tight text-cream transition-colors duration-300 group-hover:text-white">
          {item.title}
        </h3>
        <div className="grid grid-rows-[0fr] transition-all duration-500 ease-in-out group-hover:grid-rows-[1fr] group-hover:mt-3">
          <div className="min-h-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <p className="showcase-card__desc text-[0.9rem] leading-relaxed">{item.description}</p>
          </div>
        </div>
        <div className="mt-6 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {item.link.startsWith("/") ? (
            <Link to={item.link} className={ctaClass}>
              {cta}
            </Link>
          ) : (
            <a href={item.link} className={ctaClass}>
              {cta}
            </a>
          )}
        </div>
      </div>

      {/* ambient corner glow */}
      <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-[radial-gradient(circle_at_top_right,oklch(0.716_0.104_82_/_0.15),transparent_60%)] pointer-events-none rounded-[24px]" />
    </div>
  );
}

/* ─── the arriving photo ─────────────────────────────────
 *
 * Decorative by construction: it is the same plate the opposite column's card
 * already shows, with that card's title and description already on screen. A
 * second announcement would be noise, so it is hidden from the tree.
 *
 * Eager, though. It is off-frame for the whole first half of the scrub, which
 * is exactly the condition under which a lazy image decides not to load and
 * then pops in mid-animation. It costs nothing: same import, same hashed URL
 * as the card, so it resolves from cache either way.
 */
function FlyPanel({ item }: { item: Item }) {
  const cta = (
    <>
      <span>Discover More</span>
      <svg
        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </>
  );
  const ctaClass =
    "inline-flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.16em] uppercase text-primary group-hover:text-white transition-colors duration-300";

  return (
    <div className="showcase-fly showcase-card group relative overflow-hidden rounded-[24px] border border-border bg-[var(--showcase-plate)] transition-[border-color,box-shadow] duration-500 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(201,162,75,0.08)]">
      {/* image */}
      <div className="absolute inset-0 overflow-hidden rounded-[24px]">
        <img
          src={item.image}
          alt={item.alt}
          width={PLATE_W}
          height={PLATE_H}
          loading="eager"
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-cover object-center transition-transform duration-[1000ms] ease-out group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>

      {/* text */}
      <div className="showcase-card__pad absolute inset-0 flex flex-col justify-end p-6 sm:p-9 z-10">
        <span className="kicker transition-colors duration-300">{item.kicker}</span>
        <h3 className="showcase-card__title font-display mt-3 text-[1.85rem] sm:text-[2.2rem] leading-tight text-cream transition-colors duration-300 group-hover:text-white">
          {item.title}
        </h3>
        <div className="grid grid-rows-[0fr] transition-all duration-500 ease-in-out group-hover:grid-rows-[1fr] group-hover:mt-3">
          <div className="min-h-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <p className="showcase-card__desc text-[0.9rem] leading-relaxed">{item.description}</p>
          </div>
        </div>
        <div className="mt-6 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {item.link.startsWith("/") ? (
            <Link to={item.link} className={ctaClass}>
              {cta}
            </Link>
          ) : (
            <a href={item.link} className={ctaClass}>
              {cta}
            </a>
          )}
        </div>
      </div>

      {/* ambient corner glow */}
      <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-[radial-gradient(circle_at_top_right,oklch(0.716_0.104_82_/_0.15),transparent_60%)] pointer-events-none rounded-[24px]" />
    </div>
  );
}

/* ─── main component ─────────────────────────────────────── */
export function Showcase() {
  const [entered, setEntered] = useState(false);

  const pinSpacerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* ── entrance: one observer, one state flip, then done ──
   *
   * Deliberately not folded into the scrubbed timeline. The entrance also has
   * to run on mobile and under prefers-reduced-motion, where the matchMedia
   * context below never executes at all.
   */
  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setEntered(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* ── the pinned scrub ── */
  useEffect(() => {
    const section = sectionRef.current;
    const pinSpacer = pinSpacerRef.current;
    if (!section || !pinSpacer) return;

    gsap.registerPlugin(ScrollTrigger);

    // matchMedia is itself a gsap context and owns its own cleanup, so it is
    // not nested inside another one. Reduced motion is part of the query
    // rather than a CSS concern: a scrubbed timeline is not a CSS animation,
    // so styles.css's global reduced-motion block can never reach it. When
    // this query does not match, no timeline exists and the stylesheet's
    // static composition stands.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=130%",
            // Pin the section, not a child. Nothing in its ancestor chain
            // (main → body) carries a transform, which position: fixed
            // needs — and fixed is also what sidesteps the sticky failure
            // that body's `overflow-x: hidden` would otherwise cause.
            pin: true,
            // Same reasoning as Hero: left to itself ScrollTrigger builds a
            // spacer and moves the section into it, detaching this subtree
            // and restarting every CSS animation inside — here, the three
            // card entrances. Handing it a spacer that is already the
            // parent trips ScrollTrigger's own `parentNode !== spacer`
            // guard, so the move is skipped and the entrance runs once.
            pinSpacer,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.9,
            invalidateOnRefresh: true,
            // Hero is pinned directly above at the default priority 0.
            // Higher priority refreshes first, so -1 guarantees we measure
            // our start only after its pin spacer has been sized.
            refreshPriority: -1,
            onToggle: (self) => {
              section.dataset["mosaic"] = self.isActive ? "active" : "idle";
            },
          },
        })
        // fromTo, not to. With invalidateOnRefresh a `.to()` re-records its
        // start from whatever the value happens to be at refresh time, so a
        // refresh fired mid-pin — a font landing, a resize, Hero's own
        // fonts.ready refresh — would latch 0.5 as the origin and the scrub
        // would never travel back to zero on the way up.
        .fromTo(
          section,
          { "--showcase-split": 0 },
          { "--showcase-split": 1, duration: 0.6, ease: "power2.inOut" },
          0,
        )
        // Lagged behind the split so the card has mostly retreated by the
        // time the photo lands on the space it vacated.
        .fromTo(
          section,
          { "--showcase-fly": 0 },
          { "--showcase-fly": 1, duration: 0.7, ease: "power3.out" },
          0.12,
        )
        // A scrub maps trigger progress onto the timeline's own duration, so
        // without a tail the last frame of motion IS the unpin. This lets
        // the finished mosaic sit for the final fifth of the pin and release
        // cleanly into Story.
        .to({}, { duration: 0.18 });
    });

    return () => {
      mm.revert();
      delete section.dataset["mosaic"];
    };
  }, []);

  // The delay rides a custom property rather than `animationDelay`: the
  // reveal-down rule sets the `animation` shorthand at !important, which both
  // resets animation-delay to 0s and outranks an inline style, so an inline
  // delay is silently discarded and all three columns land together.
  const tileProps = (index: number, compress = false) => ({
    className: "showcase-tile reveal reveal-down",
    "data-visible": entered,
    "data-compress": compress ? "true" : undefined,
    style: { "--reveal-delay": `${index * ENTER_STEP_MS}ms` } as CSSProperties,
  });

  /* ── render ──
   *
   * One DOM tree at every width. The layout switch is entirely in the
   * stylesheet, which is what lets the server-rendered markup be correct on
   * arrival — there is no isDesktop state, so nothing to reconcile and no
   * height to jump on hydration.
   */
  return (
    <div ref={pinSpacerRef} id="showcase">
      <section ref={sectionRef} className="showcase grain bg-background-elevated px-5 sm:px-8">
        {/* hairline top divider */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"
        />

        <div className="showcase-inner">
          <div ref={gridRef} className="showcase-grid">
            {/* LEFT — cognac card compresses upwards, whiskey arrives from the bottom-left */}
            <div className="showcase-col" data-side="left" data-fly-pos="bottom">
              <div {...tileProps(0, true)}>
                <Card item={COGNAC} />
              </div>
              <FlyPanel item={WHISKEY} />
            </div>

            {/* CENTRE — anchored, full height for the whole scrub */}
            <div className="showcase-col">
              <div {...tileProps(1)}>
                <Card item={SHISHA} />
              </div>
            </div>

            {/* RIGHT — cocktail card compresses, espresso martini arrives from the top-right */}
            <div className="showcase-col" data-side="right">
              <div {...tileProps(2, true)}>
                <Card item={COCKTAIL} />
              </div>
              <FlyPanel item={ESPRESSO_MARTINI} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
