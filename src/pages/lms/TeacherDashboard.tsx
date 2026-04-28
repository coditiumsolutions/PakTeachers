import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

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

const courses = [
  { abbr: 'MTH', title: 'Mathematics — Grade 9', students: 42 },
  { abbr: 'MTH', title: 'Mathematics — Grade 10', students: 38 },
  { abbr: 'PHY', title: 'Physics — Grade 11', students: 35 },
  { abbr: 'PHY', title: 'Physics — Grade 12', students: 41 },
]

const stats = [
  { icon: '👥', val: 156, suffix: '', label: 'Total Students' },
  { icon: '📚', val: 4, suffix: '', label: 'Active Courses' },
  { icon: '📋', val: 12, suffix: '', label: 'Lessons This Week' },
  { icon: '⭐', val: 48, suffix: '/5', label: 'Avg Rating' },
]

export function TeacherDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="lms-fade-up lms-fade-up-1 mb-8">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          Teacher Portal
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Instructor Dashboard</h1>
        <p className="mt-1 text-slate-500">Manage your classes and track student performance.</p>
      </div>

      <div className="lms-fade-up lms-fade-up-2 mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
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

      <div className="lms-fade-up lms-fade-up-3">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">My Courses</h2>
        <div className="space-y-3">
          {courses.map(({ abbr, title, students }) => (
            <div key={title} className="lms-course-row flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                {abbr}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{students} students enrolled</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  to="/lms/manage"
                  className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                >
                  Manage
                </Link>
                <Link
                  to="/lms/performance"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Performance
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
