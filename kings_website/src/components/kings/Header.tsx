import { useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo.png";
import { useScrollSpy } from "./useScrollSpy";
import { menu } from "@/data/menu";

const NAV = [
  { id: "bar", label: "Bar" },
  { id: "kitchen", label: "Kitchen" },
  { id: "wine", label: "Wine & Champagne" },
  { id: "shisha", label: "Shisha" },
  { id: "cocktails", label: "Cocktails" },
  { id: "photo-shoot", label: "Photo Shoot" },
];

export interface HeaderProps {
  mode?: "home" | "menu";
}

interface SearchMenuProps {
  onSelect: () => void;
}

function SearchMenu({ onSelect }: SearchMenuProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prepare search items (categories + individual menu items)
  const searchItems = menu.flatMap((category) => {
    const items = category.items.map((item) => ({
      type: "item" as const,
      name: item.name,
      categoryId: category.id,
      categoryName: category.title,
    }));
    const cat = {
      type: "category" as const,
      name: category.title,
      categoryId: category.id,
      categoryName: category.title,
    };
    return [cat, ...items];
  });

  const filteredItems = query.trim() === ""
    ? searchItems.filter((item) => item.type === "category")
    : searchItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

  const handleItemClick = (categoryId: string) => {
    setIsOpen(false);
    setQuery("");
    onSelect();
    
    // Set URL hash to trigger navigation & scroll
    window.location.hash = categoryId;
    
    const el = document.getElementById(categoryId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search menu..."
          className="w-full h-10 pl-9 pr-8 bg-background border border-border rounded-[5px] text-[0.85rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition-all duration-200"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </span>
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-[260px] overflow-y-auto rounded-[5px] border border-border bg-background-elevated shadow-lift">
          {filteredItems.length > 0 ? (
            <ul className="py-1.5" role="listbox">
              {filteredItems.map((item, idx) => (
                <li key={`${item.categoryId}-${item.name}-${idx}`}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(item.categoryId)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gold/10 transition-colors duration-150 flex flex-col gap-0.5"
                  >
                    <span className="text-[0.82rem] font-semibold text-foreground">
                      {item.name}
                    </span>
                    {item.type === "item" && (
                      <span className="text-[0.68rem] text-muted-foreground uppercase tracking-wider">
                        in {item.categoryName}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-[0.82rem] text-muted-foreground">
              No results for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Header({ mode = "home" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const active = useScrollSpy(
    mode === "menu" ? NAV.map((n) => n.id) : [],
    220,
  );

  // Sync initial theme on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("kl-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    // While the hero's aperture is pinned it owns this decision: the header
    // has to turn dark when the photo does, and the pin moved that moment away
    // from any fixed scroll depth. The threshold is the fallback for the
    // widths and motion preferences where the pin never runs.
    const onScroll = () => {
      if (mode === "menu") {
        setScrolled(window.scrollY > 0);
      } else {
        const heroDark = document.documentElement.dataset["heroDark"];
        setScrolled(
          heroDark === "true" ||
            (heroDark === undefined && window.scrollY > window.innerHeight * 0.7),
        );
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Until `scrolled` the cream hero owns the viewport, so the header runs
          dark-on-cream. Both variants only re-point custom properties, so
          `text-gold`, `btn-ghost-gold` and the hamburger re-tint for free. */}
      <header
        className={`kl-header fixed inset-x-0 top-0 z-50 h-[76px] border-b ${
          mode === "menu" || scrolled ? "kl-header--dark" : "kl-header--cream"
        }`}
      >
        <div className="mx-auto grid h-full max-w-[1280px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-8 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
          {mode === "home" ? (
            <a href="#top" className="flex min-w-0 items-center gap-3">
              <img src={logoImg} alt="D Royal Lounge Logo" className="h-9 w-auto object-contain shrink-0" />
              <span className="font-display mt-4 truncate text-[1.15rem] leading-none tracking-[0.22em] text-[var(--hdr-ink)]">
                ROYAL LOUNGE
              </span>
            </a>
          ) : (
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <img src={logoImg} alt="D Royal Lounge Logo" className="h-9 w-auto object-contain shrink-0" />
              <span className="font-display mt-4 truncate text-[1.15rem] leading-none tracking-[0.22em] text-[var(--hdr-ink)]">
                ROYAL LOUNGE
              </span>
            </Link>
          )}

          {/* Desktop Search Bar (Only in Menu Mode) */}
          <div className="hidden lg:flex w-full px-8 min-w-0">
            {mode === "menu" && <SearchMenu onSelect={() => {}} />}
          </div>

          <div className="flex items-center justify-end gap-5">
            {/* Theme switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-[5px] border border-border text-[var(--hdr-ink)] hover:bg-gold/10 hover:border-gold transition-colors duration-200"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                // Moon icon
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                </svg>
              ) : (
                // Sun icon
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              )}
            </button>

            {mode === "home" ? (
              <Link to="/menu" className="btn-theme-invert">
                Menu
              </Link>
            ) : (
              mode === "menu" && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="Open menu"
                  aria-expanded={open}
                  className="grid h-11 w-11 place-items-center rounded-[5px] border border-border text-[var(--hdr-ink)] lg:hidden"
                >
                  <span className="sr-only">Open navigation</span>
                  <span aria-hidden className="flex flex-col gap-[5px]">
                    <span className="block h-px w-5 bg-gold" />
                    <span className="block h-px w-5 bg-gold" />
                    <span className="block h-px w-3.5 bg-gold" />
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {open && mode === "menu" && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background/98 backdrop-blur-xl lg:hidden">
          <div className="flex h-[76px] items-center justify-between px-5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="D Royal Lounge Logo" className="h-8 w-auto object-contain shrink-0" />
              <span className="font-display text-[1.15rem] tracking-[0.22em] text-foreground">
                ROYAL LOUNGE
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center rounded-[5px] border border-border text-gold"
            >
              <span aria-hidden className="text-lg leading-none">
                ×
              </span>
            </button>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto justify-start px-7 pt-10 pb-8 gap-8">
            <div className="w-full flex flex-col gap-2">
              <span className="label-track text-[0.65rem] font-semibold text-gold">Search Menu</span>
              <SearchMenu onSelect={() => setOpen(false)} />
            </div>

            <div className="w-full flex flex-col gap-4 mt-2">
              <span className="label-track text-[0.65rem] font-semibold text-gold">Menu Categories</span>
              <nav className="flex flex-col gap-4" aria-label="Mobile categories">
                {NAV.map((item, i) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    data-visible="true"
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="reveal font-display text-[1.85rem] leading-none text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
