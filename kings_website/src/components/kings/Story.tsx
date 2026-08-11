import houseArchImage from "@/assets/the_house_lounge_arch.png";
import { Reveal } from "./Reveal";
import { Crown } from "./Crown";

export function Story() {
  return (
    <section id="story" className="relative bg-[#F7F4EE] dark:bg-[#0E0D0C] text-[#1F1C18] dark:text-[#F4EDE4] py-16 sm:py-24 px-5 sm:px-8 lg:px-12 overflow-hidden transition-colors duration-300">
      {/* Hairline subtle top divider */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] h-[1px] bg-gradient-to-r from-transparent via-[#C9A24B]/30 to-transparent"
      />

      <div className="mx-auto max-w-[1320px] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
        {/* LEFT COLUMN — EDITORIAL TYPOGRAPHY & STATS */}
        <Reveal className="flex flex-col">
          {/* Kicker */}
          <div className="flex items-center gap-3 text-[0.75rem] font-bold tracking-[0.22em] uppercase text-[#6E675E] dark:text-[#9A9185]">
            <span className="text-[#8B1E1E] dark:text-[#E24A4A] font-display text-[0.95rem]">01</span>
            <span className="text-[#C9A24B]/60">|</span>
            <span>THE HOUSE</span>
          </div>

          {/* Main Headline */}
          <h2 className="font-display mt-6 text-[2.8rem] sm:text-[3.6rem] lg:text-[4.2rem] leading-[1.04] tracking-tight text-[#1A1815] dark:text-[#F4EDE4]">
            Where the night <br />
            feels like <br />
            <span className="italic font-normal text-[#8B1E1E] dark:text-[#E24A4A]">royalty.</span>
          </h2>

          {/* Crown Divider Line */}
          <div className="my-8 flex items-center gap-4 max-w-[34rem]">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#C9A24B]/60 via-[#C9A24B]/30 to-transparent" />
            <Crown className="h-3.5 w-4 text-[#C9A24B]" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-[#C9A24B]/60 via-[#C9A24B]/30 to-transparent" />
          </div>

          {/* Body Copy */}
          <div className="space-y-4 max-w-[36rem] text-[0.98rem] sm:text-[1.05rem] leading-relaxed text-[#4A453E] dark:text-[#B9AFA2]">
            <p>
              D Kings Lounge brings the evening together under one roof — a refined bar, intimate shisha room, kitchen and space made for the camera.
            </p>
            <p>
              Slow pours. Late plates. Fresh coals. Good company. Stay for one drink, or stay until the room goes quiet.
            </p>
          </div>

          {/* 3 Stat Columns */}
          <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-6 pt-6 border-t border-[#E2D9CC] dark:border-white/10 max-w-[38rem]">
            {/* Stat 1 */}
            <div className="flex flex-col pr-2 sm:pr-4">
              <div className="flex items-center gap-1.5 text-[#C9A24B] mb-2">
                <Crown className="h-4 w-4" />
              </div>
              <span className="font-display text-[2.2rem] sm:text-[2.8rem] leading-none font-medium text-[#8B1E1E] dark:text-[#E24A4A]">
                02
              </span>
              <div className="mt-3 flex flex-col text-[0.62rem] sm:text-[0.68rem] font-bold tracking-[0.16em] uppercase text-[#6E675E] dark:text-[#9A9185]">
                <span>MENU</span>
                <span>CATEGORIES</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col px-2 sm:px-4 border-l border-[#E2D9CC] dark:border-white/10">
              <div className="flex items-center gap-1.5 text-[#6E675E] dark:text-[#9A9185] mb-2">
                <svg className="h-4 w-4 stroke-[#8B1E1E] dark:stroke-[#E24A4A]" fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 15" />
                </svg>
              </div>
              <span className="font-display text-[2.2rem] sm:text-[2.8rem] leading-none font-medium text-[#8B1E1E] dark:text-[#E24A4A]">
                4AM
              </span>
              <div className="mt-3 flex flex-col text-[0.62rem] sm:text-[0.68rem] font-bold tracking-[0.16em] uppercase text-[#6E675E] dark:text-[#9A9185]">
                <span>FRI – SAT</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col pl-2 sm:pl-4 border-l border-[#E2D9CC] dark:border-white/10">
              <div className="flex items-center gap-1.5 text-[#6E675E] dark:text-[#9A9185] mb-2">
                <svg className="h-4 w-4 stroke-[#8B1E1E] dark:stroke-[#E24A4A]" fill="none" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path d="M8 2h8v3H8zM9 5v3L6 12v9a1 1 0 001 1h10a1 1 0 001-1v-9l-3-4V5" />
                </svg>
              </div>
              <span className="font-display text-[1.6rem] sm:text-[2.2rem] leading-none font-medium text-[#8B1E1E] dark:text-[#E24A4A] whitespace-nowrap">
                ₦500 – ₦1M
              </span>
              <div className="mt-3 flex flex-col text-[0.62rem] sm:text-[0.68rem] font-bold tracking-[0.16em] uppercase text-[#6E675E] dark:text-[#9A9185]">
                <span>PRICE RANGE</span>
              </div>
            </div>
          </div>

          {/* Sub-Footer Location Bar */}
          <div className="mt-12 pt-6 border-t border-[#E2D9CC] dark:border-white/10 flex items-center gap-3 text-[0.7rem] sm:text-[0.75rem] font-bold tracking-[0.24em] uppercase text-[#7E776D] dark:text-[#9A9185]">
            <span>THE LOUNGE</span>
            <span className="text-[#C9A24B]">•</span>
            <span>OGWASHI, DELTA STATE</span>
          </div>
        </Reveal>

        {/* RIGHT COLUMN — ARCH FRAME WITH PHOTO & OVERLAY BANNER */}
        <Reveal delay={160} className="w-full flex justify-center lg:justify-end">
          {/* Hairline double outer arch frame border */}
          <div className="relative p-2.5 sm:p-3.5 rounded-t-[200px] sm:rounded-t-[260px] border border-[#C9A24B]/40 bg-[#F7F4EE] dark:bg-[#14110F] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] w-full max-w-[540px] transition-colors duration-300">
            {/* Inner Arch Container */}
            <div className="relative rounded-t-[190px] sm:rounded-t-[250px] overflow-hidden aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5.1] w-full bg-[#12100E]">
              <img
                src={houseArchImage}
                alt="D Kings Lounge Ogwashi velvet interior and crystal whiskey rocks glass"
                loading="lazy"
                width={1000}
                height={1250}
                className="w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-[1.03]"
              />

              {/* Subtle top inner shadow */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

              {/* Bottom Dark Overlay Banner with Infinite Marquee */}
              <div className="absolute bottom-0 inset-x-0 bg-[#0D0B0A]/90 backdrop-blur-md py-3.5 border-t border-white/10 text-white overflow-hidden pointer-events-auto">
                <div className="animate-marquee-banner flex items-center whitespace-nowrap">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 px-6 shrink-0">
                      <span className="h-3.5 w-[2px] bg-[#C9A24B]" />
                      <span className="text-[0.68rem] sm:text-[0.75rem] font-bold tracking-[0.22em] uppercase text-[#EBE3D5]">
                        GOOD DRINKS. GREAT VIBES. LASTING NIGHTS.
                      </span>
                      <Crown className="h-3.5 w-3.5 text-[#C9A24B] shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
