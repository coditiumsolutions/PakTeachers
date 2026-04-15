export function PrimaryNavbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-4 sm:h-28 sm:px-6">
        <a href="/" className="flex shrink-0 items-center gap-2 py-2" aria-label="Home">
          <img
            src="/logo01.png"
            alt=""
            className="h-14 w-auto max-h-22 object-contain object-left sm:h-19 md:h-21"
          />
        </a>

        <div className="hidden flex-col items-end gap-1.5 text-sm sm:flex">
          <a
            href="tel:+921234567890"
            className="flex items-center gap-2 font-medium text-slate-700 transition hover:text-indigo-950"
          >
            <svg className="h-4 w-4 shrink-0 text-indigo-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            +92 123 456 7890
          </a>
          <a
            href="mailto:info@pakteachers.com"
            className="flex items-center gap-2 text-slate-500 transition hover:text-indigo-950"
          >
            <svg className="h-4 w-4 shrink-0 text-indigo-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            info@pakteachers.com
          </a>
        </div>
      </div>
    </header>
  )
}
