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

function ProgressBar({ value }: { value: number }) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      ob.disconnect()
      setTimeout(() => setWidth(value), 80)
    })
    if (ref.current) ob.observe(ref.current)
    return () => ob.disconnect()
  }, [value])
  return (
    <div ref={ref} className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="lms-progress-fill" style={{ width: `${width}%` }} />
    </div>
  )
}

const courses = [
  { abbr: 'MTH', title: 'Mathematics — Algebra', sub: 'Grade 9 · Mr. Khalid', progress: 65 },
  { abbr: 'PHY', title: 'Physics — Mechanics', sub: 'Grade 10 · Ms. Nadia', progress: 40 },
  { abbr: 'ENG', title: 'English Literature', sub: 'Grade 11 · Mr. Tariq', progress: 80 },
]

const stats = [
  { icon: '📚', val: 5, suffix: '', label: 'Enrolled Courses' },
  { icon: '✅', val: 24, suffix: '', label: 'Lessons Completed' },
  { icon: '📝', val: 8, suffix: '', label: 'Quizzes Taken' },
  { icon: '🏆', val: 87, suffix: '%', label: 'Average Score' },
]

export function StudentDashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="lms-fade-up lms-fade-up-1 mb-8">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          Student Portal
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          Welcome back, Ahmed
        </h1>
        <p className="mt-1 text-slate-500">Track your learning progress and upcoming sessions.</p>
      </div>

      {/* Stats */}
      <div className="lms-fade-up lms-fade-up-2 mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ icon, val, suffix, label }) => (
          <div
            key={label}
            className="lms-stat-card relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="text-2xl">{icon}</div>
            <div className="mt-3 text-2xl font-bold text-indigo-700">
              <Counter target={val} suffix={suffix} />
            </div>
            <div className="mt-1 text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <div className="lms-fade-up lms-fade-up-3 mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">My Courses</h2>
        <div className="space-y-3">
          {courses.map(({ abbr, title, sub, progress }) => (
            <div
              key={title}
              className="lms-course-row flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                {abbr}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{title}</p>
                <p className="text-xs text-slate-500">{sub}</p>
                <ProgressBar value={progress} />
                <p className="mt-1 text-xs text-indigo-600">{progress}% complete</p>
              </div>
              <Link
                to="/lms/course"
                className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
              >
                Continue →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming & Quizzes */}
      <div className="lms-fade-up lms-fade-up-4 grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-900">📅 Upcoming Lessons</h3>
          <ul className="space-y-3">
            {[
              { time: 'Mon · 10:00 AM', title: 'Algebra — Quadratic Eq.' },
              { time: 'Tue · 2:00 PM', title: "Physics — Newton's Laws" },
              { time: 'Wed · 11:00 AM', title: 'English — Shakespeare' },
            ].map(({ time, title }) => (
              <li key={title} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                  {time}
                </span>
                <span className="text-right text-sm text-slate-700">{title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-900">📝 Pending Quizzes</h3>
          <ul className="space-y-3">
            {[
              { due: 'Due Jan 20', title: 'Mathematics — Chapter 5' },
              { due: 'Due Jan 22', title: 'Physics — Motion Quiz' },
            ].map(({ due, title }) => (
              <li key={title} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                  {due}
                </span>
                <span className="text-right text-sm text-slate-700">{title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
