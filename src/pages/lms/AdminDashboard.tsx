import { useState, useEffect, useRef } from 'react'

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        ob.disconnect()
        let start: number | null = null
        const dur = 1100
        const tick = (ts: number) => {
          if (!start) start = ts
          const p = Math.min((ts - start) / dur, 1)
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.3 }
    )
    if (ref.current) ob.observe(ref.current)
    return () => ob.disconnect()
  }, [target])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const stats = [
  { icon: '👥', val: 1250, suffix: '', label: 'Total Students' },
  { icon: '👨‍🏫', val: 48, suffix: '', label: 'Active Teachers' },
  { icon: '📚', val: 85, suffix: '', label: 'Total Courses' },
  { icon: '📈', val: 94, suffix: '%', label: 'Satisfaction Rate' },
]

const panels = [
  {
    icon: '👥',
    title: 'User Management',
    desc: 'Manage student, teacher, and administrator accounts across the platform.',
  },
  {
    icon: '📚',
    title: 'Course Management',
    desc: 'Create, edit, and archive courses, curriculum, and course content.',
  },
  {
    icon: '📊',
    title: 'Reports & Analytics',
    desc: 'View platform-wide performance data and student engagement metrics.',
  },
]

export function AdminDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="lms-fade-up lms-fade-up-1 mb-8">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          Admin Portal
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">System Control</h1>
        <p className="mt-1 text-slate-500">Manage users, courses, and platform-wide settings.</p>
      </div>

      <div className="lms-fade-up lms-fade-up-2 mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ icon, val, suffix, label }) => (
          <div key={label} className="lms-stat-card relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl">{icon}</div>
            <div className="mt-3 text-2xl font-bold text-indigo-700">
              <Counter target={val} suffix={suffix} />
            </div>
            <div className="mt-1 text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="lms-fade-up lms-fade-up-3 grid gap-5 sm:grid-cols-3">
        {panels.map(({ icon, title, desc }) => (
          <article key={title} className="lms-panel-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
              {icon}
            </div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
            <button
              type="button"
              className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
            >
              Open Module
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
