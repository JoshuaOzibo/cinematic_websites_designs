import { useEffect, useState } from "react";
import { Crown } from "./Crown";
import { useScrollSpy } from "./useScrollSpy";

const NAV = [
  { id: "bar", label: "Bar" },
  { id: "kitchen", label: "Kitchen" },
  { id: "wine", label: "Wine & Champagne" },
  { id: "shisha", label: "Shisha" },
  { id: "cocktails", label: "Cocktails" },
  { id: "photo-shoot", label: "Photo Shoot" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(
    NAV.map((n) => n.id),
    220,
  );

  useEffect(() => {
    // While the hero's aperture is pinned it owns this decision: the header
    // has to turn dark when the photo does, and the pin moved that moment away
    // from any fixed scroll depth. The threshold is the fallback for the
    // widths and motion preferences where the pin never runs.
    const onScroll = () => {
      const heroDark = document.documentElement.dataset["heroDark"];
      setScrolled(
        heroDark === "true" ||
          (heroDark === undefined && window.scrollY > window.innerHeight * 0.7),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          scrolled ? "kl-header--dark" : "kl-header--cream"
        }`}
      >
        <div className="mx-auto grid h-full max-w-[1280px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-8 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
          <a href="#top" className="flex min-w-0 items-center gap-3">
            <Crown className="h-4 w-6 shrink-0 text-gold" />
            <span className="font-display truncate text-[1.15rem] leading-none tracking-[0.22em] text-[var(--hdr-ink)]">
              KINGS LOUNGE
            </span>
          </a>

          <nav className="hidden justify-end gap-8 lg:flex" aria-label="Menu sections">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-active={active === item.id}
                className="link-underline label-track text-[0.7rem] font-semibold text-[var(--hdr-ink-muted)] transition-colors duration-200 hover:text-[var(--hdr-ink)] data-[active=true]:text-[var(--hdr-ink)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <a href="#reserve" className="btn-ghost-gold hidden lg:inline-flex">
              Reserve a Table
            </a>
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
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-background/98 backdrop-blur-xl lg:hidden">
          <div className="flex h-[76px] items-center justify-between px-5">
            <span className="font-display text-[1.15rem] tracking-[0.22em] text-foreground">
              KINGS LOUNGE
            </span>
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
          <nav className="flex flex-1 flex-col justify-center gap-6 px-7" aria-label="Mobile menu">
            {NAV.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                data-visible="true"
                style={{ animationDelay: `${i * 60}ms` }}
                className="reveal font-display text-[2.1rem] leading-none text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="px-7 pb-10">
            <a
              href="#reserve"
              onClick={() => setOpen(false)}
              className="btn-gold w-full"
            >
              Reserve a Table
            </a>
          </div>
        </div>
      )}
    </>
  );
}
