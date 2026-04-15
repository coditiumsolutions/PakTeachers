export function SoftwareSupportPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-indigo-950 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-100">
                💻 Technical Assistance
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Software Support
              </h1>
              <p className="mt-4 max-w-xl text-base text-indigo-200 sm:text-lg">
                Get help with software installation, troubleshooting, and technical guidance for all your learning platforms.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                {[['🔧', 'Setup Help', 'Installation & Config'], ['🐛', 'Troubleshooting', 'Bug Fixes'], ['📖', 'Guides', 'Tutorials & Docs']].map(([icon, title, desc]) => (
                  <div key={title} className="flex items-center gap-3 rounded-lg bg-indigo-900 px-4 py-3">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-xs text-indigo-300">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status cards */}
            <div className="flex w-full max-w-xs shrink-0 flex-col gap-3">
              {[['📹', 'Zoom', 'Online'], ['🎥', 'Google Meet', 'Online'], ['🖥️', 'LMS Portal', 'Online']].map(([icon, name, status]) => (
                <div key={name} className="flex items-center gap-4 rounded-xl border border-indigo-700 bg-indigo-900 px-4 py-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="flex-1 text-sm font-medium text-white">{name}</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                    <span className="h-2 w-2 rounded-full bg-green-400" /> {status}
                  </span>
                </div>
              ))}
              <div className="mt-2 text-center text-xs text-indigo-300">⚡ Quick Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming soon */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <div className="text-6xl">🛠️</div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl">Coming Soon</h2>
          <p className="mt-4 text-slate-600">
            We are working on bringing you comprehensive software support resources including guides, video tutorials, and a live chat support system.
          </p>
          <p className="mt-6 text-sm text-slate-500">
            In the meantime, contact us directly:
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p>📧 info@pakteachers.com</p>
            <p>📞 +92 123 4567890</p>
            <p>🕐 Mon – Sat: 9 AM – 6 PM</p>
          </div>
        </div>
      </section>
    </>
  )
}
