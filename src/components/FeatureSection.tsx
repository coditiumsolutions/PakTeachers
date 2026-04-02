const cards = [
  {
    title: 'Feature one',
    description:
      'Short placeholder description. Replace with your value proposition or service summary.',
    cta: 'Learn more',
  },
  {
    title: 'Feature two',
    description: 'Another card with dummy text. Grid collapses to one column on small screens.',
    cta: 'Get started',
  },
  {
    title: 'Feature three',
    description: 'Third column for desktop; stacks cleanly on mobile with consistent spacing.',
    cta: 'View details',
  },
] as const

export function FeatureSection() {
  return (
    <section id="services" className="scroll-mt-[var(--nav-stack-height)] border-t border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">What we offer</h2>
          <p className="mt-3 text-slate-600">
            Responsive three-column layout using Tailwind grid. Swap copy and actions as needed.
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
              <button
                type="button"
                className="mt-6 inline-flex w-fit items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {card.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
