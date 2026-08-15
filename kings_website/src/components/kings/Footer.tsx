import { menu } from "@/data/menu";
import logoImg from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="grain relative border-t border-border bg-[oklch(0.135_0.004_60)]">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="D Royal Lounge Logo" className="h-16 w-auto object-contain shrink-0" />
              <span className="font-display text-[1.05rem] tracking-[0.22em] text-foreground">
                ROYAL LOUNGE
              </span>
            </div>
            <p className="mt-5 max-w-[18rem] text-[0.9rem] leading-relaxed text-muted-foreground">
              Bar, kitchen, shisha and photo experiences. Asaba&rsquo;s late room.
            </p>
          </div>

          <div>
            <h3 className="label-track text-[0.65rem] font-semibold text-gold">Menu</h3>
            <ul className="mt-5 grid gap-2.5">
              {menu.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="link-underline text-[0.9rem] text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label-track text-[0.65rem] font-semibold text-gold">Contact</h3>
            <ul className="mt-5 grid gap-2.5 text-[0.9rem] text-muted-foreground">
              <li>Coka Junction, Asaba, Delta State</li>
              <li>
                <a href="tel:+2348000000000" className="link-underline hover:text-foreground">
                  +234 800 000 0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@royalloungeasaba.com"
                  className="link-underline hover:text-foreground"
                >
                  hello@royalloungeasaba.com
                </a>
              </li>
              <li className="flex gap-4 pt-2">
                {["Instagram", "WhatsApp", "X"].map((s) => (
                  <a
                    key={s}
                    href="#reserve"
                    className="link-underline label-track text-[0.65rem] font-semibold text-gold"
                  >
                    {s}
                  </a>
                ))}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="label-track text-[0.65rem] font-semibold text-gold">Hours</h3>
            <ul className="mt-5 grid gap-2.5 text-[0.9rem] text-muted-foreground">
              <li>Mon — Thu · 4PM — 1AM</li>
              <li>Fri — Sat · 4PM — 4AM</li>
              <li>Sunday · 2PM — 12AM</li>
            </ul>
          </div>
        </div>

        <div className="rule-gold mt-14" />
        <div className="mt-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[0.78rem] text-muted-foreground">
            © {new Date().getFullYear()} Royal Lounge, Asaba. Menu prices subject to change.
          </p>
          <img src={logoImg} alt="" className="h-10 w-auto object-contain opacity-70" />
        </div>
      </div>
    </footer>
  );
}
