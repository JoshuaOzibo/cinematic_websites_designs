import archImage from "@/assets/hero.jpg";
import bottleImage from "@/assets/kings-bottle.webp";

const LETTERS = ["K", "I", "N", "G", "S"];

export function Hero() {
  return (
    <section
      id="top"
      className="hero-light relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div aria-hidden className="hero-glow" />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 pt-32 pb-24 sm:px-10 lg:px-16">
        {/* MEMORABLE leads on the left and LOUNGE answers bottom-right, as in
            the reference; the locality kicker takes the spare right slot. */}
        <div className="flex items-end justify-between gap-6">
          <p
            aria-hidden="true"
            data-visible="true"
            className="reveal hero-cap"
            style={{ animationDelay: "140ms" }}
          >
            Memorable
          </p>

          <p
            data-visible="true"
            className="reveal kicker hidden items-center gap-2 sm:flex"
            style={{ animationDelay: "60ms" }}
          >
            <span aria-hidden className="inline-block h-px w-6 shrink-0 bg-[var(--hero-gold-ink)]" />
            Asaba, Delta State
          </p>
        </div>

        {/* Arch photo, wordmark and bottle share one positioning context so the
            letters can straddle the panel and the bottle can bleed past both. */}
        <div className="hero-stage mt-8 sm:mt-4">
          <h1 className="hero-word" aria-label="Kings Lounge">
            <span aria-hidden="true" className="hero-word__letters">
              {LETTERS.map((letter, i) => (
                <span
                  key={letter}
                  data-visible="true"
                  className="reveal hero-word__letter"
                  style={{ animationDelay: `${300 + i * 70}ms` }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </h1>
        </div>

        <p
          aria-hidden="true"
          data-visible="true"
          className="reveal hero-cap mt-4 block text-right sm:mt-2"
          style={{ animationDelay: "400ms" }}
        >
          Lounge
        </p>

        <div className="mt-12 flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p
            data-visible="true"
            className="reveal max-w-[26rem] text-[clamp(0.9rem,1.1vw,1rem)] leading-[1.72] tracking-[0.005em] text-[var(--hero-ink-muted)]"
            style={{ animationDelay: "940ms" }}
          >
            A bar, a kitchen and a shisha lounge built for long evenings — rare pours, slow
            smoke, and a room lit for the camera.
          </p>
        </div>
      </div>

      {/* arch and bottle are siblings of the content div so they position
          relative to the section (100svh), not the stage inner height.
          This lets us pin their tops flush to the navbar bottom. */}
      <figure
        data-visible="true"
        className="arch-open hero-arch m-0"
        style={{ animationDelay: "220ms" }}
      >
        <img
          src={archImage}
          alt="A bartender pouring whisky from a cut-glass decanter at Kings Lounge, Asaba"
          width={1920}
          height={1280}
          loading="eager"
          fetchPriority="high"
        />
      </figure>

      <img
        src={bottleImage}
        alt=""
        aria-hidden="true"
        width={284}
        height={943}
        data-visible="true"
        className="rise hero-bottle"
        style={{ animationDelay: "640ms" }}
        draggable={false}
      />

      <div aria-hidden className="hero-grain" />
    </section>
  );
}
