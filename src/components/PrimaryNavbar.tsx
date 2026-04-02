import { useState } from 'react'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
] as const

export function PrimaryNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-4 sm:h-28 sm:px-6">
        <a href="#home" className="flex shrink-0 items-center gap-2 py-2" aria-label="Home">
          <img
            src="/logo01.png"
            alt=""
            className="h-14 w-auto max-h-[5.5rem] object-contain object-left sm:h-[4.75rem] md:h-[5.25rem]"
          />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-expanded={open}
          aria-controls="primary-mobile-menu"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="primary-mobile-menu"
        className={`border-t border-slate-200 bg-white md:hidden ${open ? 'block' : 'hidden'}`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6" aria-label="Primary mobile">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
