import { Link } from 'react-router-dom'

const STYLES = `
  @keyframes hpFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hp-fade { animation: hpFadeUp 0.5s ease both; }
  .hp-fade-1 { animation-delay: 0.05s; }
  .hp-fade-2 { animation-delay: 0.13s; }
  .hp-fade-3 { animation-delay: 0.21s; }
`

const cards = [
  {
    title: 'Quran Teaching',
    description:
      'One-on-one and group sessions for Nazira, Tajweed, Hifz, and Tafseer — taught by qualified Qaris with structured lesson plans and parent progress reports.',
    cta: 'Browse Quran courses',
    to: '/courses',
  },
  {
    title: 'Academic Schooling',
    description:
      'Live classes for Grades 1–12 covering Mathematics, Sciences, English, Urdu, Computer Science, and more — aligned with Pakistani curriculum boards.',
    cta: 'View school classes',
    to: '/school',
  },
  {
    title: 'Trial Classes',
    description:
      'Not sure yet? Book a single one-time trial session for any subject from Rs. 400. No subscription, no commitment — just great teaching.',
    cta: 'Book a trial',
    to: '/trial',
  },
] as const

export function FeatureSection() {
  return (
    <section id="services" className="scroll-mt-(--nav-stack-height) border-t border-slate-200 bg-white py-16 sm:py-20">
      <style>{STYLES}</style>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Our Services</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">What we offer</h2>
          <p className="mt-3 text-slate-600">
            Everything your child needs to learn — Quran, academics, and beyond — through live interactive classes with expert Pakistani teachers.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <article
              key={card.title}
              className={`hp-fade hp-fade-${i + 1} flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md`}
            >
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{card.description}</p>
              <Link
                to={card.to}
                className="mt-6 inline-flex w-fit items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {card.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
