import { Reveal } from "./Reveal";

const hours = [
  ["Monday", "4:00 PM — 1:00 AM"],
  ["Tuesday", "4:00 PM — 1:00 AM"],
  ["Wednesday", "4:00 PM — 1:00 AM"],
  ["Thursday", "4:00 PM — 1:00 AM"],
  ["Friday", "4:00 PM — 4:00 AM"],
  ["Saturday", "4:00 PM — 4:00 AM"],
  ["Sunday", "2:00 PM — 12:00 AM"],
];

export function Reserve() {
  return (
    <section id="reserve" className="grain relative bg-background scroll-mt-[110px]">
      <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-[7.5rem]">
        {/* LEFT COLUMN: LOCATION INFO & HOURS */}
        <div className="flex flex-col">
          <Reveal delay={0}>
            <p className="kicker">Find Us</p>
            <h2 className="font-display mt-5 text-[2rem] leading-[1.06] text-foreground sm:text-[2.6rem]">
              Coka Junction, Asaba.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="rule-gold mt-6 w-24" />
            <p className="mt-6 text-[0.98rem] leading-relaxed text-muted-foreground">
              Royal Lounge, Coka Junction, Asaba, Delta State, Nigeria.
              <br />
              <a href="tel:+2348000000000" className="link-underline text-gold font-semibold">
                +234 800 000 0000
              </a>
            </p>
          </Reveal>

          {/* Staggered Operating Hours */}
          <div className="mt-9 divide-y divide-border border-y border-border">
            {hours.map(([day, time], idx) => (
              <Reveal key={day} delay={160 + idx * 45}>
                <div className="group flex items-center justify-between gap-4 py-3.5 px-1.5 transition-all duration-200 hover:bg-surface/50 hover:px-3 rounded-sm">
                  <dt className="label-track text-[0.7rem] font-semibold text-muted-foreground group-hover:text-gold transition-colors">
                    {day}
                  </dt>
                  <dd className="price text-[0.85rem] font-semibold group-hover:scale-105 transition-transform origin-right">
                    {time}
                  </dd>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE MAP FRAME WITH ANIMATED BADGE */}
        <Reveal delay={200} className="flex flex-col h-full">
          <div className="relative group h-full min-h-[350px] lg:min-h-[450px]">
            {/* Ambient hover glow behind map */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#C9A24B]/30 via-transparent to-[#8B1E1E]/20 rounded-xl blur-lg opacity-40 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none" />

            <div className="relative overflow-hidden rounded-[8px] border border-border h-full min-h-[350px] lg:min-h-[450px] shadow-lg transition-all duration-500 group-hover:border-[#C9A24B]/60">
              {/* Floating Location Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#0E0D0C]/85 backdrop-blur-md border border-[#C9A24B]/40 shadow-xl text-[0.7rem] font-bold tracking-widest text-[#F4EDE4] uppercase animate-float-gentle">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A24B] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C9A24B]" />
                </span>
                <span>Coka Asaba • Open Today</span>
              </div>

              {/* Get Directions Button Overlay */}
              <a
                href="https://maps.google.com/?q=Coka+Junction%2C+Asaba%2C+Delta+State"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#C9A24B] text-[#0E0D0C] font-bold text-[0.72rem] tracking-wider uppercase shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white"
              >
                <span>Get Directions</span>
                <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2.2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>

              {/* Interactive Map Iframe */}
              <iframe
                title="Map showing Royal Lounge in Coka, Asaba, Delta State"
                src="https://maps.google.com/maps?q=Coka%20Junction%2C%20Asaba%2C%20Delta&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="h-full min-h-[350px] w-full border-0 transition-opacity duration-300"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
