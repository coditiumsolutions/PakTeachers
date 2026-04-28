import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ANIM_STYLES = `
  @keyframes lmsFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lms-fade-up { animation: lmsFadeUp 0.55s ease both; }
  .lms-fade-up-1 { animation-delay: 0.05s; }
  .lms-fade-up-2 { animation-delay: 0.13s; }
  .lms-fade-up-3 { animation-delay: 0.21s; }
  .lms-fade-up-4 { animation-delay: 0.29s; }
  .lms-fade-up-5 { animation-delay: 0.37s; }

  .lms-hero-grid {
    background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  .lms-panel-card {
    transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .lms-panel-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(79,70,229,0.04) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .lms-panel-card:hover::after { opacity: 1; }
  .lms-panel-card:hover {
    border-color: #c7d2fe !important;
    box-shadow: 0 4px 16px rgba(79,70,229,0.10);
    transform: translateY(-2px);
  }
`

export function LMSPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login(username, password)
      // navigate() is called inside login() — nothing else needed here
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style>{ANIM_STYLES}</style>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-indigo-900 bg-indigo-950 py-16 sm:py-20">
        <div className="lms-hero-grid pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            {/* Left copy */}
            <div className="flex-1">
              <span className="lms-fade-up lms-fade-up-1 inline-block rounded-full bg-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-100">
                🖥️ Digital Learning Platform
              </span>
              <h1 className="lms-fade-up lms-fade-up-2 mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Learning Management<br className="hidden sm:block" /> System
              </h1>
              <p className="lms-fade-up lms-fade-up-3 mt-4 max-w-xl text-base text-indigo-200 sm:text-lg">
                Access your courses, track progress, submit assignments, and manage your learning journey — all in one place.
              </p>
              <div className="lms-fade-up lms-fade-up-4 mt-6 flex flex-wrap gap-2">
                {['📚 Course Materials', '📝 Assignments', '📊 Progress Tracking', '💬 Communication'].map((label) => (
                  <span key={label} className="rounded-full bg-indigo-800 px-3 py-1 text-sm text-indigo-100">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — dashboard preview widget */}
            <div className="lms-fade-up lms-fade-up-5 w-full max-w-sm shrink-0 overflow-hidden rounded-2xl border border-indigo-700 bg-indigo-900 shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-indigo-700 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-indigo-400">ptlms · dashboard</span>
              </div>
              <div className="flex divide-x divide-indigo-700">
                <div className="w-28 shrink-0 space-y-0.5 p-3 text-xs">
                  {[
                    ['📊', 'Dashboard', true],
                    ['📚', 'Courses', false],
                    ['📝', 'Assignments', false],
                    ['🏆', 'Grades', false],
                  ].map(([icon, label, active]) => (
                    <div
                      key={label as string}
                      className={`flex items-center gap-1.5 rounded px-2 py-1.5 ${
                        active ? 'bg-indigo-700 text-white' : 'text-indigo-300'
                      }`}
                    >
                      {icon} {label}
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-3">
                  <p className="text-xs font-semibold text-white">Welcome back!</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[['5', 'Courses'], ['24', 'Lessons'], ['87%', 'Score']].map(([val, label]) => (
                      <div key={label} className="rounded bg-indigo-800 p-2 text-center">
                        <div className="text-sm font-bold text-white">{val}</div>
                        <div className="text-xs text-indigo-400">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded bg-indigo-800 px-3 py-2 text-xs text-indigo-200">
                    📬 New assignment posted
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {[65, 40, 80].map((pct, i) => (
                      <div key={i} className="h-1.5 overflow-hidden rounded-full bg-indigo-700">
                        <div className="h-full rounded-full bg-indigo-300" style={{ width: `${pct}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Login section ── */}
      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Sign in to PTLMS</h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-lg">
                🖥️
              </div>
              <div>
                <p className="font-semibold text-slate-900">Portal Login</p>
                <p className="text-xs text-slate-500">Access is role-based — you'll be redirected automatically</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="lms-username" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Username
                </label>
                <input
                  id="lms-username"
                  type="text"
                  required
                  placeholder="your.username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label htmlFor="lms-password" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="lms-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="mt-5 space-y-1 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
              <p>📧 Credentials are issued by the administration.</p>
              <p>📞 Call +92 123 4567890 for login support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">LMS Features</h2>
            <p className="mt-3 text-slate-600">
              Everything you need for effective online learning and teaching.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '📚', title: 'Course Materials', desc: 'Access lecture notes, videos, and resources anytime, anywhere.' },
              { icon: '📝', title: 'Quizzes & Assignments', desc: 'Submit work and take assessments entirely online.' },
              { icon: '📊', title: 'Progress Tracking', desc: 'Monitor your learning journey and performance in real time.' },
              { icon: '💬', title: 'Communication', desc: 'Connect with teachers and classmates with ease.' },
            ].map(({ icon, title, desc }, i) => (
              <article
                key={title}
                className="lms-panel-card rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                  {icon}
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
