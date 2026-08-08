import storyImage from "@/assets/story.jpg";
import { Reveal } from "./Reveal";
import { Crown } from "./Crown";

export function Story() {
  return (
    <section id="story" className="bg-cream text-cream-foreground">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-20 lg:py-[7.5rem] lg:pr-0">
        <Reveal className="max-w-[36rem]">
          <p className="kicker flex items-center gap-3 text-[oklch(0.52_0.09_75)]">
            <Crown className="h-3.5 w-5" />
            The House
          </p>
          <h2 className="font-display mt-6 text-[2.1rem] leading-[1.08] sm:text-[2.6rem]">
            Asaba&rsquo;s lounge for people who stay late.
          </h2>
          <p className="mt-6 text-[1.02rem] leading-relaxed text-[oklch(0.38_0.01_60)]">
            Kings Lounge is a bar, a kitchen, a shisha room and a photo studio under one roof.
            We pour rare bottles with ceremony, grill till late, and keep the coals fresh for as
            long as the table wants them.
          </p>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-[oklch(0.38_0.01_60)]">
            Come for one drink. Stay for the room.
          </p>
          <div className="mt-9 flex flex-wrap gap-x-10 gap-y-5">
            {[
              { value: "11", label: "Menu categories" },
              { value: "Till 4AM", label: "Fri — Sat" },
              { value: "₦500 – ₦600k", label: "Every price point" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-[1.5rem] leading-none">{stat.value}</p>
                <p className="label-track mt-2 text-[0.65rem] font-semibold text-[oklch(0.52_0.02_60)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </Reveal>

        <Reveal delay={140} className="lg:-mr-8">
          <img
            src={storyImage}
            alt="Signature cocktail on a marble table in the velvet interior of Kings Lounge, Asaba"
            loading="lazy"
            width={1200}
            height={1408}
            className="h-[22rem] w-full rounded-[8px] object-cover shadow-[var(--shadow-lift)] sm:h-[30rem] lg:h-[34rem] lg:rounded-r-none"
          />
        </Reveal>
      </div>
    </section>
  );
}
