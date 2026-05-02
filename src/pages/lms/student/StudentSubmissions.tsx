import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { studentService, type StudentSubmissionDTO } from '../../../lib/studentService'
import { alertAccessDenied, alertGenericError } from '../../../lib/alertService'
import { formatDate } from '../../../lib/formatters'

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-t border-slate-100">
          <td className="px-4 py-3"><div className="h-4 w-36 animate-pulse rounded bg-slate-200" /></td>
          <td className="px-4 py-3"><div className="h-4 w-28 animate-pulse rounded bg-slate-100" /></td>
          <td className="px-4 py-3"><div className="h-4 w-24 animate-pulse rounded bg-slate-100" /></td>
          <td className="px-4 py-3"><div className="h-4 w-14 animate-pulse rounded bg-slate-100" /></td>
          <td className="px-4 py-3"><div className="h-5 w-12 animate-pulse rounded-full bg-slate-100" /></td>
        </tr>
      ))}
    </>
  )
}

export function StudentSubmissions() {
  const { user } = useAuth()
  const { sid } = useParams<{ sid?: string }>()

  const studentId = (() => {
    if (user?.role === 'admin' && sid) {
      const p = parseInt(sid, 10)
      return isNaN(p) ? user.id : p
    }
    return user?.id ?? 0
  })()

  const [submissions, setSubmissions] = useState<StudentSubmissionDTO[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!studentId) return
    studentService
      .getStudentSubmissions(studentId)
      .then(setSubmissions)
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status
        if (status === 403) {
          void alertAccessDenied('You are not authorised to view these results.')
        } else {
          void alertGenericError('Failed to load results', 'Please try again later.')
        }
      })
      .finally(() => setLoading(false))
  }, [studentId])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="lms-fade-up lms-fade-up-1 mb-8">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          Student Portal
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">My Results</h1>
        <p className="mt-1 text-slate-500">Assignments, scores, and teacher feedback.</p>
      </div>

      <div className="lms-fade-up lms-fade-up-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Assignment</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : !submissions?.length ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr key={s.submissionId} className="border-t border-slate-100 transition hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{s.assignmentTitle}</td>
                    <td className="px-4 py-3 text-slate-600">{s.courseTitle}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(s.submittedAt)}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {s.score !== null && s.maxScore !== null
                        ? `${s.score} / ${s.maxScore}`
                        : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {s.passed === null ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                          Pending
                        </span>
                      ) : s.passed ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          Passed
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback panel */}
      {!loading && submissions?.some((s) => s.feedback) && (
        <div className="lms-fade-up lms-fade-up-3 mt-6">
          <h2 className="mb-3 text-base font-semibold text-slate-900">Teacher Feedback</h2>
          <div className="space-y-3">
            {submissions.filter((s) => s.feedback).map((s) => (
              <div key={s.submissionId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-slate-700">{s.assignmentTitle} — {s.courseTitle}</p>
                <p className="mt-1 text-sm italic text-slate-500">"{s.feedback}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
