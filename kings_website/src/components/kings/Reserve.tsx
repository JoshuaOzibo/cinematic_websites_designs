import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";

const hours = [
  ["Monday — Thursday", "4:00 PM — 1:00 AM"],
  ["Friday — Saturday", "4:00 PM — 4:00 AM"],
  ["Sunday", "2:00 PM — 12:00 AM"],
];

export function Reserve() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    window.setTimeout(() => setStatus("done"), 1100);
  };

  return (
    <section id="reserve" className="grain relative bg-background scroll-mt-[110px]">
      <div className="mx-auto grid max-w-[1280px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-[7.5rem]">
        <Reveal>
          <p className="kicker">Find Us</p>
          <h2 className="font-display mt-5 text-[2rem] leading-[1.06] text-foreground sm:text-[2.6rem]">
            Okpanam Road, Asaba.
          </h2>
          <div className="rule-gold mt-6 w-24" />
          <p className="mt-6 text-[0.98rem] leading-relaxed text-muted-foreground">
            Kings Lounge, Okpanam Road, Asaba, Delta State, Nigeria.
            <br />
            <a href="tel:+2348000000000" className="link-underline text-gold">
              +234 800 000 0000
            </a>
          </p>

          <dl className="mt-9 divide-y divide-border border-y border-border">
            {hours.map(([day, time]) => (
              <div key={day} className="flex items-center justify-between gap-4 py-3.5">
                <dt className="label-track text-[0.7rem] font-semibold text-muted-foreground">
                  {day}
                </dt>
                <dd className="price text-[0.85rem] font-semibold">{time}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 overflow-hidden rounded-[8px] border border-border">
            <iframe
              title="Map showing Kings Lounge in Asaba, Delta State"
              src="https://www.openstreetmap.org/export/embed.html?bbox=6.68%2C6.16%2C6.78%2C6.24&layer=mapnik"
              style={{ filter: "invert(0.92) hue-rotate(180deg) grayscale(0.55) contrast(0.85) brightness(0.9)" }}
              className="h-[16rem] w-full sm:h-[19rem]"
              loading="lazy"
            />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="surface-panel p-6 sm:p-9">
            {status === "done" ? (
              <div className="py-14 text-center">
                <p className="kicker">Reservation Received</p>
                <h3 className="font-display mt-5 text-[1.9rem] leading-tight text-foreground">
                  We&rsquo;ll see you soon.
                </h3>
                <p className="mt-4 text-[0.95rem] text-muted-foreground">
                  Our host will call to confirm your table within the hour.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="btn-ghost-gold mt-8"
                >
                  Book Another Table
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5">
                <div>
                  <p className="kicker">Reservations</p>
                  <h3 className="font-display mt-4 text-[1.75rem] leading-tight text-foreground">
                    Hold a table
                  </h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="label-track text-[0.65rem] font-semibold text-muted-foreground">
                      Name
                    </span>
                    <input required name="name" className="field" placeholder="Full name" />
                  </label>
                  <label className="grid gap-2">
                    <span className="label-track text-[0.65rem] font-semibold text-muted-foreground">
                      Phone
                    </span>
                    <input
                      required
                      name="phone"
                      type="tel"
                      className="field"
                      placeholder="+234"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="label-track text-[0.65rem] font-semibold text-muted-foreground">
                      Date
                    </span>
                    <input required name="date" type="date" className="field" />
                  </label>
                  <label className="grid gap-2">
                    <span className="label-track text-[0.65rem] font-semibold text-muted-foreground">
                      Party Size
                    </span>
                    <input
                      required
                      name="party"
                      type="number"
                      min={1}
                      defaultValue={2}
                      className="field"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="label-track text-[0.65rem] font-semibold text-muted-foreground">
                    Notes
                  </span>
                  <textarea
                    name="notes"
                    rows={4}
                    className="field py-3"
                    placeholder="Booth preference, shisha, celebration…"
                  />
                </label>

                <button type="submit" disabled={status === "loading"} className="btn-gold mt-2">
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-foreground" />
                      Sending
                    </span>
                  ) : (
                    "Request Reservation"
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
