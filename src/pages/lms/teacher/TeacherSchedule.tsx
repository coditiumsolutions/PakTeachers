import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { teacherService, type LiveSessionTeacherViewDTO } from '../../../lib/teacherService'
import { alertAccessDenied, alertGenericError } from '../../../lib/alertService'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso))
}

const STATUS_STYLES: Record<string, string> = {
  scheduled:  'bg-blue-100 text-blue-700',
  live:       'bg-emerald-100 text-emerald-700',
  completed:  'bg-slate-100 text-slate-600',
  cancelled:  'bg-red-100 text-red-600',
}

function statusStyle(s: string) {
  return STATUS_STYLES[s.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-11 w-11 animate-pulse rounded-lg bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100 shrink-0" />
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TeacherSchedule() {
  const { user } = useAuth()
  const { tid } = useParams<{ tid?: string }>()

  const teacherId = (() => {
    if (user?.role === 'admin' && tid) {
      const p = parseInt(tid, 10)
      return isNaN(p) ? user.id : p
    }
    return user?.id ?? 0
  })()

  const [sessions, setSessions] = useState<LiveSessionTeacherViewDTO[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teacherId) return
    teacherService
      .getLiveSessions(teacherId)
      .then(setSessions)
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status
        if (status === 403) {
          void alertAccessDenied('You are not authorised to view this schedule.')
        } else {
          void alertGenericError('Failed to load schedule', 'Please try again later.')
        }
      })
      .finally(() => setLoading(false))
  }, [teacherId])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="lms-fade-up lms-fade-up-1 mb-8">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          Teacher Portal
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">My Schedule</h1>
        <p className="mt-1 text-slate-500">All live sessions — past, present, and upcoming.</p>
      </div>

      <div className="lms-fade-up lms-fade-up-2 space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
          : !sessions?.length
          ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-400">
              No live sessions found.
            </div>
          )
          : sessions.map((s) => (
            <div key={s.sessionId} className="lms-course-row flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-lg">
                📹
              </div>

              {/* Titles */}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{s.courseTitle}</p>
                <p className="mt-0.5 truncate text-sm text-slate-500">{s.lessonTitle}</p>
                <p className="mt-0.5 text-xs text-slate-400">{formatDate(s.scheduledAt)}</p>
              </div>

              {/* Status badge */}
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle(s.status)}`}>
                {s.status}
              </span>

              {/* Meeting link — conditionally rendered with tooltip fallback */}
              {s.meetingLink ? (
                <a
                  href={s.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                >
                  Join Meeting
                </a>
              ) : (
                <div className="group relative shrink-0">
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-400"
                  >
                    Join Meeting
                  </button>
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-max max-w-[200px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-md group-hover:block">
                    Link available 30 min before start
                    <div className="absolute right-3 top-full h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
