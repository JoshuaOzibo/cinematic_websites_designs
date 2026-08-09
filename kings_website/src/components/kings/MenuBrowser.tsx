import { useEffect, useRef } from "react";
import { menu, formatNaira, type MenuCategory, type MenuItem } from "@/data/menu";
import { Reveal } from "./Reveal";
import { useScrollSpy } from "./useScrollSpy";

const categoryIds = menu.map((c) => c.id);

function Placeholder({ seed }: { seed: number }) {
  const rotate = (seed % 4) * 22;
  return (
    <div
      aria-hidden
      className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_100%_at_50%_0%,oklch(0.3_0.02_55)_0%,oklch(0.2_0.008_55)_60%,oklch(0.165_0.006_55)_100%)]"
    >
      <svg
        viewBox="0 0 120 120"
        className="h-1/2 w-1/2 text-gold/45"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ transform: `rotate(${rotate * 0.02}deg)` }}
      >
        <circle cx="60" cy="60" r="42" opacity="0.35" />
        <path d="M32 78 L32 42 L48 58 L60 34 L72 58 L88 42 L88 78 Z" strokeLinejoin="round" />
        <line x1="32" y1="88" x2="88" y2="88" strokeLinecap="round" opacity="0.7" />
      </svg>
    </div>
  );
}

function ItemCard({
  item,
  index,
  tier,
  image,
}: {
  item: MenuItem;
  index: number;
  tier: MenuCategory["tier"];
  image: string;
}) {
  return (
    <Reveal
      as="li"
      delay={Math.min(index, 8) * 50}
      className="group surface-panel overflow-hidden transition-[border-color,box-shadow,transform] duration-250 ease-in-out hover:-translate-y-1 hover:border-gold/55 hover:shadow-[var(--shadow-card)] active:scale-[0.99]"
    >
      <div
        className={`relative overflow-hidden ${
          tier === "premium" ? "aspect-[4/5]" : tier === "standard" ? "aspect-[4/3]" : "aspect-[3/2]"
        }`}
      >
        <Placeholder seed={index} />
        <img
          src={image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-250 ease-in-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,13,12,0.55),transparent_55%)] transition-transform duration-250 ease-in-out group-hover:scale-105" />
      </div>
      <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
        <h3 className="label-track text-[0.8rem] font-semibold leading-snug text-foreground">
          {item.name}
        </h3>
        <p className="price shrink-0 text-[0.875rem] font-semibold">{formatNaira(item.price)}</p>
      </div>
    </Reveal>
  );
}

function gridClass(tier: MenuCategory["tier"]) {
  if (tier === "premium") return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  if (tier === "compact") return "grid-cols-2 lg:grid-cols-4";
  return "grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3";
}

export function MenuBrowser() {
  const active = useScrollSpy(categoryIds, 260);
  const chipRow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chipRow.current?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (el && chipRow.current) {
      const row = chipRow.current;
      const target = el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2;
      row.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }
  }, [active]);

  return (
    <div id="menu" className="grain relative bg-background">
      <div className="sticky top-[76px] z-40 border-y border-border bg-background/95 backdrop-blur-md">
        <div className="relative mx-auto max-w-[1280px]">
          <div
            ref={chipRow}
            className="flex gap-2 overflow-x-auto px-5 py-3 sm:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="navigation"
            aria-label="Menu categories"
          >
            {menu.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                data-chip={c.id}
                data-active={active === c.id}
                className="label-track relative shrink-0 rounded-[5px] border border-transparent px-4 py-2.5 text-[0.68rem] font-semibold whitespace-nowrap text-muted-foreground transition-[color,background-color,border-color] duration-250 ease-in-out hover:text-foreground data-[active=true]:border-gold/45 data-[active=true]:bg-gold/12 data-[active=true]:text-gold"
              >
                {c.title}
              </a>
            ))}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-[linear-gradient(to_right,transparent,var(--background))] sm:hidden"
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {menu.map((category, ci) => (
          <section
            key={category.id}
            id={category.id}
            className="scroll-mt-[150px] py-16 sm:py-20 lg:py-[6.5rem]"
          >
            <Reveal className="max-w-[38rem]">
              <p className="kicker">{`0${ci + 1}`.slice(-2)}</p>
              <h2 className="font-display mt-4 text-[2rem] leading-[1.06] text-foreground sm:text-[2.6rem]">
                {category.title}
              </h2>
              <div className="rule-gold mt-6 w-24" />
              <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
                {category.blurb}
              </p>
            </Reveal>

            <ul className={`mt-12 grid gap-6 sm:gap-8 ${gridClass(category.tier)}`}>
              {category.items.map((item, i) => (
                <ItemCard key={item.name} item={item} index={i} tier={category.tier} image={category.image} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
