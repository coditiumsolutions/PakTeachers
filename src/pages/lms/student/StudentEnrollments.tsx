import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { studentService, type StudentEnrollmentDTO } from '../../../lib/studentService'
import { alertAccessDenied, alertGenericError } from '../../../lib/alertService'
import { formatRelativeDate } from '../../../lib/formatters'

const STATUS_STYLES: Record<string, string> = {
  active:    'bg-emerald-100 text-emerald-700',
  completed: 'bg-blue-100 text-blue-700',
  dropped:   'bg-red-100 text-red-600',
}

function statusStyle(s: string) {
  return STATUS_STYLES[s.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-11 w-11 animate-pulse rounded-lg bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
    </div>
  )
}

export function StudentEnrollments() {
  const { user } = useAuth()
  const { sid } = useParams<{ sid?: string }>()

  const studentId = (() => {
    if (user?.role === 'admin' && sid) {
      const p = parseInt(sid, 10)
      return isNaN(p) ? user.id : p
    }
    return user?.id ?? 0
  })()

  const [enrollments, setEnrollments] = useState<StudentEnrollmentDTO[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!studentId) return
    studentService
      .getStudentEnrollments(studentId)
      .then(setEnrollments)
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status
        if (status === 403) {
          void alertAccessDenied('You are not authorised to view these enrollments.')
        } else {
          void alertGenericError('Failed to load enrollments', 'Please try again later.')
        }
      })
      .finally(() => setLoading(false))
  }, [studentId])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="lms-fade-up lms-fade-up-1 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Courses</h1>
          <p className="mt-0.5 text-sm text-slate-500">Your full enrollment history across all courses.</p>
        </div>
        {!loading && enrollments && (
          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            {enrollments.length} enrollment{enrollments.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="lms-fade-up lms-fade-up-2 space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
          : !enrollments?.length
          ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-400">
              No enrollments found.
            </div>
          )
          : enrollments.map((e) => (
            <div key={e.enrollmentId} className="lms-course-row flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-950 text-sm">
                📚
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{e.courseTitle}</p>
                {e.gradeLevel && (
                  <p className="mt-0.5 text-xs text-slate-500">{e.gradeLevel}</p>
                )}
                <p className="mt-0.5 text-xs text-slate-400">
                  Enrolled {formatRelativeDate(e.enrolledAt)}
                  {e.completedAt && ` · Completed ${formatRelativeDate(e.completedAt)}`}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle(e.status)}`}>
                {e.status}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
