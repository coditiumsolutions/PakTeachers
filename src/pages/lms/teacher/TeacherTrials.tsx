import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { teacherService, type TrialClassTeacherViewDTO } from '../../../lib/teacherService'
import { alertAccessDenied, alertGenericError } from '../../../lib/alertService'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso))
}

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  completed:  'bg-emerald-100 text-emerald-700',
  cancelled:  'bg-red-100 text-red-600',
  scheduled:  'bg-blue-100 text-blue-700',
}

function statusStyle(s: string) {
  return STATUS_STYLES[s.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-t border-slate-100">
          <td className="px-4 py-3"><div className="h-4 w-32 animate-pulse rounded bg-slate-200" /></td>
          <td className="px-4 py-3"><div className="h-4 w-24 animate-pulse rounded bg-slate-100" /></td>
          <td className="px-4 py-3"><div className="h-4 w-36 animate-pulse rounded bg-slate-100" /></td>
          <td className="px-4 py-3"><div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" /></td>
          <td className="px-4 py-3"><div className="h-5 w-10 animate-pulse rounded-full bg-slate-100" /></td>
        </tr>
      ))}
    </>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TeacherTrials() {
  const { user } = useAuth()
  const { tid } = useParams<{ tid?: string }>()

  const teacherId = (() => {
    if (user?.role === 'admin' && tid) {
      const p = parseInt(tid, 10)
      return isNaN(p) ? user.id : p
    }
    return user?.id ?? 0
  })()

  const [trials, setTrials] = useState<TrialClassTeacherViewDTO[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teacherId) return
    teacherService
      .getTrialClasses(teacherId)
      .then(setTrials)
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status
        if (status === 403) {
          void alertAccessDenied('You are not authorised to view these trial classes.')
        } else {
          void alertGenericError('Failed to load trial classes', 'Please try again later.')
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
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Trial Classes</h1>
        <p className="mt-1 text-slate-500">All trial requests assigned to you. Student details are shown for coordination purposes.</p>
      </div>

      <div className="lms-fade-up lms-fade-up-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Scheduled</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : !trials?.length ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    No trial classes found.
                  </td>
                </tr>
              ) : (
                trials.map((t) => (
                  <tr key={t.trialId} className="border-t border-slate-100 transition hover:bg-slate-50">
                    {/* Student name — displayed clearly for coordination; no extra PII is stored in this DTO */}
                    <td className="px-4 py-3 font-medium text-slate-900">{t.studentName}</td>
                    <td className="px-4 py-3 text-slate-600">{t.subject}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(t.scheduledAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {t.converted ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Yes</span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">No</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback panel — only shown when there's data with feedback */}
      {!loading && trials?.some((t) => t.feedback) && (
        <div className="lms-fade-up lms-fade-up-3 mt-6">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Session Feedback</h2>
          <div className="space-y-3">
            {trials.filter((t) => t.feedback).map((t) => (
              <div key={t.trialId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-slate-700">{t.studentName} — {t.subject}</p>
                <p className="mt-1 text-sm text-slate-500 italic">"{t.feedback}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
