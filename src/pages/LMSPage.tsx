import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

/* ─── Scoped animations only (no fonts, no color overrides) ──────────────── */
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

  .lms-progress-fill {
    height: 100%;
    border-radius: 9999px;
    background: #4f46e5;
    transition: width 1.1s cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* slide-right hover on course rows */
  .lms-course-row {
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .lms-course-row:hover {
    transform: translateX(3px);
    border-color: #c7d2fe !important;
    box-shadow: 0 2px 12px rgba(79,70,229,0.08);
  }

  /* subtle dot-grid on hero */
  .lms-hero-grid {
    background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  /* stat card left accent */
  .lms-stat-card::before {
    content: '';
    position: absolute;
    left: 0; top: 16px; bottom: 16px;
    width: 3px;
    border-radius: 0 2px 2px 0;
    background: #4f46e5;
  }

  /* light sweep on admin panel cards */
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

  /* tab active indicator underline */
  .lms-user-tab {
    position: relative;
    transition: color 0.2s, background 0.2s, border-color 0.2s;
  }
  .lms-user-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 50%; transform: translateX(-50%);
    width: 32px; height: 2px;
    border-radius: 2px;
    background: #4f46e5;
  }
`

/* ─── Animated counter ───────────────────────────────────────────────────── */
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
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  )
}

/* ─── Animated progress bar ─────────────────────────────────────────────── */
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

/* ─── Student Dashboard ──────────────────────────────────────────────────── */
function StudentDashboard() {
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

/* ─── Teacher Dashboard ──────────────────────────────────────────────────── */
function TeacherDashboard() {
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

/* ─── Admin Dashboard ────────────────────────────────────────────────────── */
function AdminDashboard() {
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

/* ─── Main LMS Page ──────────────────────────────────────────────────────── */
type UserType = 'student' | 'teacher' | 'admin'

const userTabs: { id: UserType; icon: string; label: string }[] = [
  { id: 'student', icon: '👨‍🎓', label: 'Student' },
  { id: 'teacher', icon: '👨‍🏫', label: 'Teacher' },
  { id: 'admin', icon: '🔐', label: 'Admin' },
]

export function LMSPage() {
  const [userType, setUserType] = useState<UserType | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && userType) {
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('Please fill in all fields to continue.')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
    setUserType(null)
  }

  return (
    <>
      <style>{ANIM_STYLES}</style>

      {isLoggedIn && userType ? (
        /* ── Logged-in view ── */
        <>
          {/* Top bar */}
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold tracking-wide text-indigo-700">PTLMS</span>
                <nav className="flex gap-1">
                  {[
                    { to: '/lms', label: 'Dashboard' },
                    { to: '/lms/courses', label: 'Courses' },
                    { to: '/lms/profile', label: 'Profile' },
                  ].map(({ to, label }) => (
                    <Link
                      key={label}
                      to={to}
                      className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-slate-400 sm:block">
                  {userType.charAt(0).toUpperCase() + userType.slice(1)} Session
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard content on white/slate-50 */}
          <div className="bg-slate-50 min-h-screen">
            {userType === 'student' && <StudentDashboard />}
            {userType === 'teacher' && <TeacherDashboard />}
            {userType === 'admin' && <AdminDashboard />}
          </div>
        </>
      ) : (
        /* ── Guest / login view ── */
        <>
          {/* ── Hero ── */}
          <section className="relative overflow-hidden border-b border-indigo-900 bg-indigo-950 py-16 sm:py-20">
            <div className="lms-hero-grid pointer-events-none absolute inset-0" />
            {/* soft radial glow */}
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
                  {/* Window chrome */}
                  <div className="flex items-center gap-1.5 border-b border-indigo-700 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-indigo-400">ptlms · dashboard</span>
                  </div>
                  <div className="flex divide-x divide-indigo-700">
                    {/* Sidebar */}
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
                    {/* Content */}
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
                            <div
                              className="h-full rounded-full bg-indigo-300"
                              style={{ width: `${pct}%` }}
                            />
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
                <p className="mt-2 text-sm text-slate-500">Select your role, then enter your credentials.</p>
              </div>

              {/* User type tabs */}
              <div className="mb-6 flex gap-3">
                {userTabs.map(({ id, icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setUserType(id)}
                    className={`lms-user-tab flex flex-1 flex-col items-center gap-1.5 rounded-xl border py-4 text-sm font-medium transition ${
                      userType === id
                        ? 'active border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    <span className="text-2xl leading-none">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>

              {/* Login form */}
              {userType ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-lg">
                      {userTabs.find((t) => t.id === userType)?.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {userType.charAt(0).toUpperCase() + userType.slice(1)} Login
                      </p>
                      <p className="text-xs text-slate-500">Enter your portal credentials</p>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label htmlFor="lms-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Email Address
                      </label>
                      <input
                        id="lms-email"
                        type="email"
                        required
                        placeholder="you@school.edu.pk"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                      className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
                    >
                      Sign In
                    </button>
                  </form>

                  <div className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500 space-y-1">
                    <p>📧 Credentials are issued by the administration.</p>
                    <p>📞 Call +92 123 4567890 for login support.</p>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-center text-sm text-slate-400">
                  Select a role above to continue.
                </p>
              )}
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
      )}
    </>
  )
}
