import { Link } from 'react-router-dom'

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
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">What we offer</h2>
          <p className="mt-3 text-slate-600">
            Everything your child needs to learn — Quran, academics, and beyond — through live interactive classes with expert Pakistani teachers.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
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
