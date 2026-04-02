import { Link } from 'react-router-dom'

type Props = {
  title: string
}

export function PlaceholderPage({ title }: Props) {
  return (
    <section className="border-t border-slate-200 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-4 text-slate-600">This page is a placeholder. Add your content here.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-lg bg-indigo-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-900"
        >
          Back to home
        </Link>
      </div>
    </section>
  )
}
