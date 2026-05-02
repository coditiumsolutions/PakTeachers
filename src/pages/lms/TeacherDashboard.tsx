import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { teacherService, type TeacherDashboardDTO } from '../../lib/teacherService'
import { alertAccessDenied, alertGenericError } from '../../lib/alertService'

// ── Date helper ───────────────────────────────────────────────────────────────

function formatScheduled(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(d)
  if (isToday) return `Today at ${time}`
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(d)
}

// ── Counter animation ─────────────────────────────────────────────────────────

function Counter({ target }: { target: number }) {
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
  return <span ref={ref}>{val.toLocaleString()}</span>
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-6 w-6 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-8 w-16 animate-pulse rounded bg-slate-200" />
      <div className="mt-1 h-4 w-24 animate-pulse rounded bg-slate-100" />
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TeacherDashboard() {
  const { user } = useAuth()
  // Admin can pass ?tid=42 to view any teacher's dashboard
  const { tid } = useParams<{ tid?: string }>()

  const teacherId = (() => {
    if (user?.role === 'admin' && tid) {
      const parsed = parseInt(tid, 10)
      return isNaN(parsed) ? user.id : parsed
    }
    return user?.id ?? 0
  })()

  const isAdminView = user?.role === 'admin' && tid !== undefined

  const [dashboard, setDashboard] = useState<TeacherDashboardDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teacherId) return
    setLoading(true)
    teacherService
      .getDashboardSummary(teacherId)
      .then(setDashboard)
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status
        if (status === 403) {
          void alertAccessDenied('You are not authorised to view this teacher\'s dashboard.')
        } else {
          void alertGenericError('Failed to load dashboard', 'Please try again later.')
        }
      })
      .finally(() => setLoading(false))
  }, [teacherId])

  const stats = dashboard
    ? [
        { icon: '📚', val: dashboard.activeCoursesCount, label: 'Active Courses', link: isAdminView ? `/admin/teacher/${teacherId}/courses` : '/teacher-dashboard/courses' },
        { icon: '👥', val: dashboard.totalStudentsCount, label: 'Total Students', link: null },
        { icon: '🧪', val: dashboard.pendingTrialsCount, label: 'Pending Trials', link: isAdminView ? `/admin/teacher/${teacherId}/trials` : '/teacher-dashboard/trials' },
        { icon: '✅', val: dashboard.completedSessionsThisMonth, label: 'Sessions This Month', link: isAdminView ? `/admin/teacher/${teacherId}/schedule` : '/teacher-dashboard/schedule' },
      ]
    : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="lms-fade-up lms-fade-up-1 mb-8">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          {isAdminView ? `Viewing Teacher #${teacherId}` : 'Teacher Portal'}
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Instructor Dashboard</h1>
        <p className="mt-1 text-slate-500">Manage your classes and track student performance.</p>
      </div>

      {/* Quick-stat cards */}
      <div className="lms-fade-up lms-fade-up-2 mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loading || !stats
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map(({ icon, val, label, link }) => (
              <div key={label} className="lms-stat-card relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-2xl">{icon}</div>
                <div className="mt-3 text-2xl font-bold text-indigo-700">
                  <Counter target={val} />
                </div>
                <div className="mt-1 text-sm text-slate-500">{label}</div>
                {link && (
                  <Link to={link} className="mt-3 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                    View all →
                  </Link>
                )}
              </div>
            ))}
      </div>

      {/* Upcoming sessions widget */}
      <div className="lms-fade-up lms-fade-up-3 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Sessions</h2>
          <Link
            to={isAdminView ? `/admin/teacher/${teacherId}/schedule` : '/teacher-dashboard/schedule'}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="h-11 w-11 animate-pulse rounded-lg bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : dashboard?.upcomingSessions.length ? (
          <div className="space-y-3">
            {dashboard.upcomingSessions.slice(0, 3).map((s) => (
              <div key={s.sessionId} className="lms-course-row flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-lg">
                  🗓
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{s.courseTitle}</p>
                  <p className="mt-0.5 truncate text-sm text-slate-500">{s.lessonTitle}</p>
                </div>
                <span className="shrink-0 text-sm font-medium text-indigo-600">
                  {formatScheduled(s.scheduledAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
            No upcoming sessions scheduled.
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="lms-fade-up lms-fade-up-4 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'My Courses', desc: 'View and manage your active courses', icon: '📚', to: isAdminView ? `/admin/teacher/${teacherId}/courses` : '/teacher-dashboard/courses' },
          { label: 'My Schedule', desc: 'Live sessions, status and meeting links', icon: '📅', to: isAdminView ? `/admin/teacher/${teacherId}/schedule` : '/teacher-dashboard/schedule' },
          { label: 'Trial Classes', desc: 'Pending and completed trial requests', icon: '🧪', to: isAdminView ? `/admin/teacher/${teacherId}/trials` : '/teacher-dashboard/trials' },
        ].map(({ label, desc, icon, to }) => (
          <Link
            key={label}
            to={to}
            className="lms-panel-card flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="text-2xl">{icon}</span>
            <p className="font-semibold text-slate-900">{label}</p>
            <p className="text-sm text-slate-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
