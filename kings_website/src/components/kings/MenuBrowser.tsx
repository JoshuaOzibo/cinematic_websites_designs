import { useEffect, useRef, useState, useMemo } from "react";
import { menu, formatNaira, type MenuCategory, type MenuItem } from "@/data/menu";
import { Reveal } from "./Reveal";
import { useScrollSpy } from "./useScrollSpy";

const categoryIds = menu.map((c) => c.id);

type PriceRangeId = "all" | "under5k" | "5k-25k" | "25k-100k" | "above100k";

const PRICE_RANGES: { id: PriceRangeId; label: string }[] = [
  { id: "all", label: "All Prices" },
  { id: "under5k", label: "Under ₦5K" },
  { id: "5k-25k", label: "₦5K – ₦25K" },
  { id: "25k-100k", label: "₦25K – ₦100K" },
  { id: "above100k", label: "Above ₦100K" },
];

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
      delay={Math.min(index, 8) * 40}
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
        <p className="price shrink-0 text-[0.875rem] font-semibold text-gold">{formatNaira(item.price)}</p>
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

  // Filter & view states
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeId>("all");
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "text">("grid");

  // Keep chip scroll non-blocking and instant to eliminate scroll hanging
  useEffect(() => {
    const el = chipRow.current?.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (el && chipRow.current) {
      const row = chipRow.current;
      const target = el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2;
      row.scrollTo({ left: Math.max(0, target), behavior: "auto" });
    }
  }, [active]);

  // Price match helper
  const matchesPrice = (price: number, range: PriceRangeId) => {
    if (range === "under5k") return price < 5000;
    if (range === "5k-25k") return price >= 5000 && price <= 25000;
    if (range === "25k-100k") return price > 25000 && price <= 100000;
    if (range === "above100k") return price > 100000;
    return true;
  };

  // Filter & sort menu categories
  const filteredCategories = useMemo(() => {
    return menu.map((cat) => {
      let items = cat.items.filter((item) => {
        const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesP = matchesPrice(item.price, selectedPriceRange);
        return matchesQuery && matchesP;
      });

      if (sortOrder === "asc") {
        items = [...items].sort((a, b) => a.price - b.price);
      } else if (sortOrder === "desc") {
        items = [...items].sort((a, b) => b.price - a.price);
      }

      return {
        ...cat,
        items,
      };
    });
  }, [selectedPriceRange, sortOrder, searchQuery]);

  // Total matching item count
  const totalItemsCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  const isFiltered = selectedPriceRange !== "all" || sortOrder !== "default" || searchQuery.trim() !== "";

  const resetFilters = () => {
    setSelectedPriceRange("all");
    setSortOrder("default");
    setSearchQuery("");
  };

  return (
    <div id="menu" className="grain relative bg-background">
      {/* STICKY CONTROL BAR */}
      <div className="sticky top-[76px] z-40 border-y border-border bg-background/95 backdrop-blur-md shadow-md">
        <div className="relative mx-auto max-w-[1280px]">
          {/* Category Chips Scroll Row */}
          <div
            ref={chipRow}
            className="flex gap-2 overflow-x-auto px-4 py-2.5 sm:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-border/40"
            role="navigation"
            aria-label="Menu categories"
          >
            {menu.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                data-chip={c.id}
                data-active={active === c.id}
                className="label-track relative shrink-0 rounded-[5px] border border-transparent px-3.5 py-2 text-[0.68rem] font-semibold whitespace-nowrap text-muted-foreground transition-[color,background-color,border-color] duration-200 ease-in-out hover:text-foreground data-[active=true]:border-gold/45 data-[active=true]:bg-gold/12 data-[active=true]:text-gold"
              >
                {c.title}
              </a>
            ))}
          </div>

          {/* Filter, Sort & View Mode Controls Row */}
          <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between px-4 py-2.5 sm:px-8">
            {/* Top/Left Section: Search + View Mode Segmented Toggle */}
            <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-lg">
              {/* Search Input */}
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search food, cocktails..."
                  className="w-full bg-background-elevated border border-border/60 rounded-[5px] pl-8 pr-7 py-1.5 text-[0.78rem] text-foreground placeholder:text-muted-foreground/70 focus:border-gold/60 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-[0.75rem]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* View Mode Segmented Button */}
              <div className="flex items-center rounded-[5px] border border-border/60 bg-background-elevated p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Image Grid View"
                  aria-label="Image Grid View"
                  className={`flex items-center gap-1 rounded-[4px] px-2.5 py-1 text-[0.72rem] font-semibold transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-gold text-black font-bold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="text-[0.68rem]">Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("text")}
                  title="Editorial Text View"
                  aria-label="Editorial Text View"
                  className={`flex items-center gap-1 rounded-[4px] px-2.5 py-1 text-[0.72rem] font-semibold transition-all duration-200 ${
                    viewMode === "text"
                      ? "bg-gold text-black font-bold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-[0.68rem]">Text</span>
                </button>
              </div>
            </div>

            {/* Bottom/Right Section: Price Filter Pills & Sort Dropdown */}
            <div className="flex items-center justify-between md:justify-end gap-2 overflow-x-auto">
              <div className="flex items-center gap-1 overflow-x-auto py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink">
                {PRICE_RANGES.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedPriceRange(range.id)}
                    className={`px-2.5 py-1 rounded-[4px] text-[0.66rem] font-semibold whitespace-nowrap transition-all duration-200 ${
                      selectedPriceRange === range.id
                        ? "bg-gold text-black font-bold shadow-sm"
                        : "bg-background-elevated hover:bg-border/50 text-muted-foreground hover:text-foreground border border-border/40"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "default" | "asc" | "desc")}
                  className="bg-background-elevated border border-border/60 rounded-[5px] px-2 py-1 text-[0.7rem] font-semibold text-foreground focus:border-gold/60 focus:outline-none cursor-pointer"
                >
                  <option value="default">Sort</option>
                  <option value="asc">Low → High</option>
                  <option value="desc">High → Low</option>
                </select>

                {isFiltered && (
                  <button
                    onClick={resetFilters}
                    className="text-[0.65rem] font-bold tracking-wider uppercase text-gold hover:underline shrink-0"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filter Results Status Bar */}
          {isFiltered && (
            <div className="px-4 py-1.5 sm:px-8 bg-gold/10 border-t border-gold/20 flex items-center justify-between text-[0.7rem] text-gold font-medium">
              <span>
                Showing {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} matching active filters
              </span>
              <button onClick={resetFilters} className="font-bold underline hover:opacity-80">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MENU CATEGORIES & ITEMS */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 min-h-[50vh]">
        {totalItemsCount === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <p className="font-display text-[1.6rem] text-foreground">No menu items found</p>
            <p className="mt-2.5 text-[0.88rem] text-muted-foreground">
              No items match your selected price range or search query.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 px-5 py-2 bg-gold text-black rounded-[5px] font-bold text-[0.78rem] hover:bg-gold/90 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* IMAGE GRID VIEW */
          filteredCategories.map((category, ci) => {
            if (category.items.length === 0) return null;
            return (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-[180px] py-10 sm:py-16 lg:py-20"
              >
                <Reveal className="max-w-[38rem]">
                  <p className="kicker">{`0${ci + 1}`.slice(-2)}</p>
                  <h2 className="font-display mt-3 text-[1.8rem] leading-[1.06] text-foreground sm:text-[2.6rem]">
                    {category.title}
                  </h2>
                  <div className="rule-gold mt-5 w-24" />
                  <p className="mt-4 text-[0.92rem] leading-relaxed text-muted-foreground">
                    {category.blurb}
                  </p>
                </Reveal>

                <ul className={`mt-8 grid gap-5 sm:gap-8 ${gridClass(category.tier)}`}>
                  {category.items.map((item, i) => (
                    <ItemCard key={item.name} item={item} index={i} tier={category.tier} image={category.image} />
                  ))}
                </ul>
              </section>
            );
          })
        ) : (
          /* EDITORIAL TEXT VIEW (HIGH-RESPONSIVE LUXURY LAYOUT) */
          filteredCategories.map((category, ci) => {
            if (category.items.length === 0) return null;
            return (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-[180px] py-10 sm:py-16 lg:py-20 border-b border-border/30 last:border-0"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-16 items-start">
                  {/* Left Column — Category Header */}
                  <Reveal className="flex flex-col">
                    <p className="kicker text-[0.68rem] font-bold tracking-[0.22em] text-gold">
                      {`0${ci + 1}`} &mdash; MENU
                    </p>
                    <h2 className="font-display mt-2.5 text-[2.2rem] sm:text-[3rem] lg:text-[3.4rem] leading-[1.04] text-foreground font-medium">
                      {category.title}
                    </h2>
                    <div className="rule-gold mt-4 w-16" />
                    <p className="mt-3.5 text-[0.88rem] sm:text-[0.92rem] leading-relaxed text-muted-foreground max-w-sm">
                      {category.blurb}
                    </p>
                    <span className="mt-5 text-[0.65rem] font-bold tracking-[0.22em] uppercase text-muted-foreground/60">
                      {category.items.length} {category.items.length === 1 ? "SELECTION" : "SELECTIONS"}
                    </span>
                  </Reveal>

                  {/* Right Column — Dotted Leader Text List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-4 pt-1">
                    {category.items.map((item, i) => (
                      <div
                        key={item.name}
                        className="flex items-baseline justify-between gap-2 border-b border-border/20 pb-2.5 group"
                      >
                        <span className="font-display text-[0.95rem] sm:text-[1.05rem] text-foreground font-medium leading-snug break-words group-hover:text-gold transition-colors min-w-0">
                          {item.name}
                        </span>
                        <span className="flex-1 border-b border-dotted border-muted-foreground/30 min-w-[0.75rem] mb-1 shrink" />
                        <span className="price font-display text-[0.9rem] sm:text-[1rem] font-semibold text-gold shrink-0 ml-auto whitespace-nowrap">
                          {formatNaira(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
