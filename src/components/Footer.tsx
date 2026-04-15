const columns = [
  {
    title: 'Company',
    links: ['About', 'Careers', 'Press'],
  },
  {
    title: 'Support',
    links: ['Help center', 'Terms', 'Privacy'],
  },
  {
    title: 'Social',
    links: ['Twitter', 'LinkedIn', 'GitHub'],
  },
] as const

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-(--nav-stack-height) border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="text-lg font-semibold text-white">Brand</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Minimal footer with placeholder columns. Hook links to real routes when ready.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold uppercase tracking-wide text-white">{col.title}</p>
              <ul className="mt-4 space-y-2">
                {col.links.map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 transition hover:text-white"
                      onClick={(e) => e.preventDefault()}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Brand. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">Built with React & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
