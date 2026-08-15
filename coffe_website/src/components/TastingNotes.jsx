import Reveal from './Reveal'
import { ARTICLES } from '../data/site'

export default function TastingNotes() {
  return (
    <section id="notes" className="bg-cream py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[0.82rem] font-semibold tracking-[0.22em] text-rust uppercase">
              Tasting Notes
            </p>
            <h2
              className="font-display mt-4 text-espresso"
              style={{ fontSize: 'clamp(2.1rem, 5vw, 4rem)', lineHeight: 0.95, letterSpacing: '-0.025em' }}
            >
              From the roastery journal
            </h2>
          </div>
          <a
            href="#notes"
            className="link-underline text-[0.95rem] font-medium text-mid transition-colors hover:text-espresso"
          >
            All entries
          </a>
        </Reveal>

        <div className="mt-14 flex flex-col gap-5">
          {ARTICLES.map((article, i) => (
            <Reveal as="article" key={article.id} delay={i * 110}>
              <div className="group grid gap-5 border-l-4 border-clay py-6 pl-6 transition-colors duration-500 hover:bg-espresso/[0.035] md:grid-cols-[minmax(0,0.28fr)_minmax(0,1fr)_auto] md:items-center md:gap-10 md:pl-8">
                <div>
                  <p className="text-[0.8rem] font-semibold tracking-[0.18em] text-rust uppercase">
                    {article.category}
                  </p>
                  <p className="mt-2 text-[0.9rem] text-mid">{article.date}</p>
                </div>

                <div>
                  <h3
                    className="font-display text-espresso"
                    style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.2rem)', lineHeight: 1.02, letterSpacing: '-0.02em' }}
                  >
                    {article.title}
                  </h3>
                  <p className="mt-3 max-w-[46rem] text-[0.99rem] leading-relaxed text-mid">
                    {article.excerpt}
                  </p>
                </div>

                <a
                  href="#notes"
                  className="inline-flex items-center gap-2 text-[0.95rem] font-medium whitespace-nowrap text-espresso"
                >
                  Read more
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    &rarr;
                  </span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
