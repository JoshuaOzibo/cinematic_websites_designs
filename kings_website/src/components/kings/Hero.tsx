import heroImage from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section id="top" className="grain relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Bartender pouring an amber whisky under gold rim lighting at Kings Lounge, Asaba"
          width={1920}
          height={1280}
          className="ken-burns h-full w-full object-cover object-[62%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(14,13,12,0.35)_0%,rgba(14,13,12,0.45)_45%,rgba(14,13,12,0.92)_100%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1280px] px-5 pt-28 pb-24 sm:px-8">
        <div className="max-w-[46rem]">
          <p
            data-visible="true"
            className="reveal kicker flex items-center gap-3"
            style={{ animationDelay: "60ms" }}
          >
            <span className="inline-block h-px w-8 bg-gold" aria-hidden />
            Asaba, Delta State
          </p>
          <h1
            data-visible="true"
            style={{ animationDelay: "160ms" }}
            className="reveal font-display mt-6 text-[2.35rem] leading-[1.03] text-foreground sm:text-[3.4rem] lg:text-[4.4rem]"
          >
            Where the night
            <br />
            feels like royalty.
          </h1>
          <p
            data-visible="true"
            style={{ animationDelay: "270ms" }}
            className="reveal mt-6 max-w-[34rem] text-[1.0rem] leading-relaxed text-muted-foreground"
          >
            A bar, a kitchen and a shisha lounge built for long evenings — rare pours, slow
            smoke, and a room lit for the camera.
          </p>
          <div
            data-visible="true"
            style={{ animationDelay: "380ms" }}
            className="reveal mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <a href="#reserve" className="btn-gold pulse-once w-full sm:w-auto">
              Reserve a Table
            </a>
            <a href="#menu" className="btn-ghost-gold w-full sm:w-auto">
              View the Menu
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
        <span className="kicker text-[0.6rem]">Scroll</span>
        <span className="block h-12 w-px bg-[linear-gradient(to_bottom,var(--primary),transparent)]" />
      </div>
    </section>
  );
}
