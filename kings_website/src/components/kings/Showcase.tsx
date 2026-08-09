import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import cognacImage from "@/assets/card-cognac.png";
import shishaImage from "@/assets/card-shisha.png";
import cocktailImage from "@/assets/card-cocktail.png";

const items = [
  {
    image: cognacImage,
    alt: "A bottle of Kingston XO Extra Old Cognac on a reflective surface",
    kicker: "Rare Spirits",
    title: "Kingston XO Extra Old",
    description: "An exquisite blend of aged cognacs with rich oak, vanilla and warm spice notes, poured with ceremony.",
    link: "/menu"
  },
  {
    image: shishaImage,
    alt: "Hookah shisha pipe with glowing coals and rising smoke on a glossy dark background",
    kicker: "Premium Smoke",
    title: "Aura Shisha Lounge",
    description: "Hand-selected custom hookah blends and slow-burning coconut coals, tailored for long, relaxing evenings.",
    link: "#reserve"
  },
  {
    image: cocktailImage,
    alt: "Artisanal orange cocktail garnish with rosemary sprig in a coupe glass",
    kicker: "Signature Mixes",
    title: "Craft Cocktails",
    description: "Expertly mixed craft creations featuring fresh botanical infusions and premium spirits.",
    link: "/menu"
  }
];

const STAGGER_MS = 280;
const DURATION_MS = 1400;

export function Showcase() {
  const [visible, setVisible] = useState<boolean[]>([false, false, false]);
  const gridRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<any[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearAllTimeouts();
          
          // Check if entering from the bottom of viewport (scrolling down, coming from top of page)
          const comingFromTop = entry.boundingClientRect.top > 0;
          
          if (comingFromTop) {
            // Fire each card's reveal with a staggered setTimeout
            items.forEach((_, i) => {
              const timeout = setTimeout(() => {
                setVisible((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, i * STAGGER_MS);
              timeoutsRef.current.push(timeout);
            });
          } else {
            // Immediately show all cards when scrolling up from bottom of page
            setVisible([true, true, true]);
          }
        } else {
          clearAllTimeouts();
          // Reset only when the element is below the viewport (user scrolled back up to the top/hero)
          if (entry.boundingClientRect.top > 0) {
            setVisible([false, false, false]);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      clearAllTimeouts();
    };
  }, []);

  return (
    <section id="showcase" className="grain relative bg-background-elevated py-16 sm:py-24 px-5 sm:px-8 overflow-hidden">
      {/* Subtle top divider to transition from the hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-[1400px] h-full flex flex-col justify-center">
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 lg:min-h-[75vh] w-full"
        >
          {items.map((item, i) => (
            <div
              key={item.title}
              className="h-full"
              style={{
                opacity: visible[i] ? 1 : 0,
                transform: visible[i] ? "translateY(0) scale(1)" : "translateY(-80px) scale(0.97)",
                transition: visible[i]
                  ? `opacity ${DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`
                  : "opacity 400ms ease-out, transform 400ms ease-out",
              }}
            >
              <div className="group relative h-[60vh] lg:h-full w-full overflow-hidden rounded-[24px] border border-border bg-[#0a0908] transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(201,162,75,0.08)]">
                {/* Background image container for smooth scaling */}
                <div className="absolute inset-0 h-full w-full overflow-hidden rounded-[24px]">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-[1000ms] ease-out group-hover:scale-[1.08]"
                  />
                  {/* Premium overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-9 z-10">
                  <span className="kicker text-[oklch(0.716_0.104_82)] transition-colors duration-300 group-hover:text-[oklch(0.85_0.08_82)]">
                    {item.kicker}
                  </span>

                  <h3 className="font-display mt-3 text-[1.85rem] sm:text-[2.2rem] leading-tight text-[oklch(0.943_0.014_78)] transition-all duration-300 group-hover:text-white">
                    {item.title}
                  </h3>

                  <div className="grid grid-rows-[0fr] transition-all duration-500 ease-in-out group-hover:grid-rows-[1fr] group-hover:mt-3">
                    <div className="min-h-0 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                      <p className="text-[0.9rem] leading-relaxed text-[oklch(0.735_0.017_78)]">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 transform translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.link.startsWith("/") ? (
                      <Link
                        to={item.link}
                        className="inline-flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.16em] uppercase text-[oklch(0.716_0.104_82)] group-hover:text-white transition-colors duration-300"
                      >
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
                      </Link>
                    ) : (
                      <a
                        href={item.link}
                        className="inline-flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.16em] uppercase text-[oklch(0.716_0.104_82)] group-hover:text-white transition-colors duration-300"
                      >
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
                      </a>
                    )}
                  </div>
                </div>

                {/* Ambient gold corner reflection */}
                <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-[radial-gradient(circle_at_top_right,oklch(0.716_0.104_82_/_0.15),transparent_60%)] pointer-events-none rounded-[24px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
