import shishaImage from "@/assets/shisha.jpg";
import photoImage from "@/assets/photoshoot.jpg";
import { Reveal } from "./Reveal";

const experiences = [
  {
    image: shishaImage,
    alt: "Brass shisha pipe with glowing coals and drifting smoke at Kings Lounge, Asaba",
    kicker: "The Smoke Room",
    title: "Shisha, kept alive all night",
    copy: "Hand-packed bowls, fresh coals brought to the table, and blends mixed to your taste. Booths available for groups of six and up.",
  },
  {
    image: photoImage,
    alt: "Warmly lit photo shoot corner with softbox lighting inside Kings Lounge, Asaba",
    kicker: "The Frame",
    title: "A room lit for the camera",
    copy: "Our lounge doubles as a studio — practical gold lighting, velvet sets and a photographer on call. Birthdays, brand shoots, full buyouts.",
  },
];

export function Experiences() {
  return (
    <section
      id="experiences"
      className="grain relative"
      style={{ backgroundColor: "var(--burgundy)" }}
    >
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:py-[7.5rem]">
        <Reveal className="max-w-[36rem]">
          <p className="kicker text-[oklch(0.82_0.09_82)]">Signature Experiences</p>
          <h2 className="font-display mt-5 text-[2rem] leading-[1.06] text-foreground sm:text-[2.6rem]">
            More than a menu line.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {experiences.map((exp, i) => (
            <Reveal key={exp.title} delay={i * 120} as="article">
              <div className="group relative h-full overflow-hidden rounded-[8px] border border-[oklch(0.943_0.014_78_/_0.16)]">
                <img
                  src={exp.image}
                  alt={exp.alt}
                  loading="lazy"
                  width={1200}
                  height={912}
                  className="h-[26rem] w-full object-cover transition-transform duration-[400ms] ease-in-out group-hover:scale-105 sm:h-[30rem]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,13,12,0.94)_5%,rgba(14,13,12,0.45)_50%,transparent_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                  <p className="kicker">{exp.kicker}</p>
                  <h3 className="font-display mt-3 text-[1.65rem] leading-tight text-foreground sm:text-[2rem]">
                    {exp.title}
                  </h3>
                  <p className="mt-3 max-w-[26rem] text-[0.92rem] leading-relaxed text-muted-foreground">
                    {exp.copy}
                  </p>
                  <a href="#reserve" className="btn-ghost-gold mt-7">
                    Book This Experience
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
