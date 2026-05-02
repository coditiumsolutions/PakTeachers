import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { studentService, type StudentDashboardDTO } from '../../lib/studentService'
import { alertAccessDenied, alertGenericError } from '../../lib/alertService'
import { formatScheduled } from '../../lib/formatters'

// ── Counter animation ─────────────────────────────────────────────────────────

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

// ── Skeletons ─────────────────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="lms-stat-card relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-6 w-6 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-7 w-20 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-28 animate-pulse rounded bg-slate-100" />
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function StudentDashboard() {
  const { user } = useAuth()
  const { sid } = useParams<{ sid?: string }>()

  const studentId = (() => {
    if (user?.role === 'admin' && sid) {
      const p = parseInt(sid, 10)
      return isNaN(p) ? user.id : p
    }
    return user?.id ?? 0
  })()

  const [dashboard, setDashboard] = useState<StudentDashboardDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!studentId) return
    studentService
      .getStudentDashboard(studentId)
      .then(setDashboard)
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status
        if (status === 403) {
          void alertAccessDenied('You are not authorised to view this dashboard.')
        } else {
          void alertGenericError('Failed to load dashboard', 'Please try again later.')
        }
      })
      .finally(() => setLoading(false))
  }, [studentId])

  const statsData = dashboard
    ? [
        { icon: '📚', val: dashboard.activeEnrollmentCount, suffix: '', label: 'Active Enrollments' },
        { icon: '📈', val: Math.round(dashboard.overallCompletionPercent), suffix: '%', label: 'Overall Completion' },
        { icon: '💳', val: dashboard.pendingPaymentCount, suffix: '', label: 'Pending Payments' },
      ]
    : []

  const session = dashboard?.upcomingSession ?? null
  const grades = dashboard?.recentGrades ?? []

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="lms-fade-up lms-fade-up-1 mb-6">
        <h1 className="text-xl font-bold text-slate-900">
          Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">Here's an overview of your learning activity.</p>
      </div>

      {/* Stats ribbon */}
      <div className="lms-fade-up lms-fade-up-2 mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
          : statsData.map(({ icon, val, suffix, label }) => (
              <div key={label} className="lms-stat-card relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xl">{icon}</div>
                <div className="mt-2 text-3xl font-bold text-indigo-700">
                  <Counter target={val} suffix={suffix} />
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
              </div>
            ))}
      </div>

      <div className="lms-fade-up lms-fade-up-3 grid gap-4 lg:grid-cols-2">
        {/* Upcoming session */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-indigo-900 bg-indigo-950 px-4 py-3">
            <h2 className="text-sm font-semibold text-white">Upcoming Session</h2>
          </div>
          <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
              <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-100" />
            </div>
          ) : !session ? (
            <p className="text-sm text-slate-400">No upcoming sessions scheduled.</p>
          ) : (
            <div>
              <p className="font-medium text-slate-900">{session.courseTitle}</p>
              <p className="mt-0.5 text-sm text-slate-500">{session.lessonTitle}</p>
              <p className="mt-1 text-xs font-medium text-indigo-600">{formatScheduled(session.scheduledAt)}</p>
              <div className="mt-4">
                {session.meetingLink ? (
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Join Class
                  </a>
                ) : (
                  <p className="text-xs italic text-slate-400">
                    Link becomes available 30 min before class
                  </p>
                )}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Recent grades */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-indigo-900 bg-indigo-950 px-4 py-3">
            <h2 className="text-sm font-semibold text-white">Recent Grades</h2>
          </div>
          <div className="p-5">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                  <div className="h-5 w-12 animate-pulse rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          ) : !grades.length ? (
            <p className="text-sm text-slate-400">No grades recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {grades.slice(0, 3).map((g, i) => (
                <li key={i} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{g.assignmentTitle}</p>
                    <p className="truncate text-xs text-slate-400">{g.courseTitle}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {g.score !== null && g.maxScore !== null && (
                      <span className="text-xs font-semibold text-slate-700">
                        {g.score}/{g.maxScore}
                      </span>
                    )}
                    {g.passed !== null && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        g.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {g.passed ? 'Pass' : 'Fail'}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}
