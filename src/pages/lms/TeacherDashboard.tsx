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
        const dur = 900
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

// ── Skeletons ─────────────────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 h-3 w-20 animate-pulse rounded bg-slate-200" />
      <div className="h-7 w-12 animate-pulse rounded bg-slate-200" />
    </div>
  )
}

function SessionSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <div className="h-8 w-8 animate-pulse rounded bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="h-3 w-20 animate-pulse rounded bg-slate-100 shrink-0" />
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TeacherDashboard() {
  const { user } = useAuth()
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

  const courseLink  = isAdminView ? `/admin/teacher/${teacherId}/courses`  : '/teacher-dashboard/courses'
  const schedLink   = isAdminView ? `/admin/teacher/${teacherId}/schedule` : '/teacher-dashboard/schedule'
  const trialsLink  = isAdminView ? `/admin/teacher/${teacherId}/trials`   : '/teacher-dashboard/trials'

  const stats = dashboard
    ? [
        { label: 'Active Courses',      val: dashboard.activeCoursesCount,          link: courseLink },
        { label: 'Total Students',       val: dashboard.totalStudentsCount,          link: null },
        { label: 'Pending Trials',       val: dashboard.pendingTrialsCount,          link: trialsLink },
        { label: 'Sessions This Month',  val: dashboard.completedSessionsThisMonth,  link: schedLink },
      ]
    : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

      {/* ── Page header row ──────────────────────────────────────────────────── */}
      <div className="lms-fade-up lms-fade-up-1 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {isAdminView ? `Teacher #${teacherId} — Dashboard` : 'Instructor Dashboard'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isAdminView ? 'Admin view — read only.' : 'Your classes, schedule and trial requests at a glance.'}
          </p>
        </div>
        {isAdminView && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Admin View
          </span>
        )}
      </div>

      {/* ── Stat strip ───────────────────────────────────────────────────────── */}
      <div className="lms-fade-up lms-fade-up-2 mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {loading || !stats
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map(({ label, val, link }) => (
              <div key={label} className="lms-stat-card relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
                <p className="text-3xl font-bold text-indigo-700">
                  <Counter target={val} />
                </p>
                {link && (
                  <Link to={link} className="mt-2 inline-block text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">
                    View →
                  </Link>
                )}
              </div>
            ))}
      </div>

      {/* ── Two-column layout: sessions + quick nav ───────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Upcoming sessions — takes 2/3 */}
        <div className="lms-fade-up lms-fade-up-3 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-indigo-950 px-4 py-3">
              <h2 className="text-sm font-semibold text-white">Upcoming Sessions</h2>
              <Link to={schedLink} className="text-xs font-semibold text-indigo-300 hover:text-white transition-colors">
                View all →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="space-y-0 divide-y divide-slate-100">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="px-4 py-3"><SessionSkeleton /></div>
                  ))}
                </div>
              ) : dashboard?.upcomingSessions.length ? (
                dashboard.upcomingSessions.slice(0, 5).map((s) => (
                  <div key={s.sessionId} className="lms-course-row flex items-center gap-3 px-4 py-3 hover:bg-indigo-50/40">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-indigo-100 text-sm">
                      🗓
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 leading-tight">{s.courseTitle}</p>
                      <p className="truncate text-xs text-slate-500">{s.lessonTitle}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      {formatScheduled(s.scheduledAt)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-10 text-center text-sm text-slate-400">
                  No upcoming sessions scheduled.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick nav — takes 1/3 */}
        <div className="lms-fade-up lms-fade-up-4 flex flex-col gap-3">
          {[
            {
              label: 'My Courses',
              desc: 'Enrolment & module counts',
              icon: '📚',
              to: courseLink,
              count: dashboard?.activeCoursesCount,
            },
            {
              label: 'My Schedule',
              desc: 'Sessions & meeting links',
              icon: '📅',
              to: schedLink,
              count: null,
            },
            {
              label: 'Trial Classes',
              desc: 'Pending & completed trials',
              icon: '🧪',
              to: trialsLink,
              count: dashboard?.pendingTrialsCount,
            },
          ].map(({ label, desc, icon, to, count }) => (
            <Link
              key={label}
              to={to}
              className="lms-panel-card flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm hover:border-indigo-300"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-950 text-base">
                {icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 leading-tight">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              {count != null && !loading && (
                <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                  {count}
                </span>
              )}
              <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
