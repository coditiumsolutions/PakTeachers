import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { teacherService, type TeacherCourseSummaryDTO } from '../../../lib/teacherService'
import { alertAccessDenied, alertGenericError } from '../../../lib/alertService'

const STATUS_STYLES: Record<string, string> = {
  active:    'bg-emerald-100 text-emerald-700',
  inactive:  'bg-slate-100 text-slate-600',
  draft:     'bg-amber-100 text-amber-700',
  archived:  'bg-red-100 text-red-600',
}

function statusStyle(s: string) {
  return STATUS_STYLES[s.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
}

function CourseSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
      <div className="flex items-start justify-between">
        <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
      <div className="flex gap-4 pt-1">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  )
}

export function TeacherCourses() {
  const { user } = useAuth()
  const { tid } = useParams<{ tid?: string }>()

  const teacherId = (() => {
    if (user?.role === 'admin' && tid) {
      const p = parseInt(tid, 10)
      return isNaN(p) ? user.id : p
    }
    return user?.id ?? 0
  })()

  const [courses, setCourses] = useState<TeacherCourseSummaryDTO[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!teacherId) return
    teacherService
      .getCourses(teacherId)
      .then(setCourses)
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status
        if (status === 403) {
          void alertAccessDenied('You are not authorised to view these courses.')
        } else {
          void alertGenericError('Failed to load courses', 'Please try again later.')
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
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">My Courses</h1>
        <p className="mt-1 text-slate-500">All courses assigned to you with enrolment and module counts.</p>
      </div>

      {loading ? (
        <div className="lms-fade-up lms-fade-up-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CourseSkeleton key={i} />)}
        </div>
      ) : !courses?.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-400">
          No courses found.
        </div>
      ) : (
        <div className="lms-fade-up lms-fade-up-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <div
              key={c.courseId}
              className="lms-panel-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900 leading-tight">{c.title}</h3>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle(c.status)}`}>
                  {c.status}
                </span>
              </div>

              {c.gradeLevel && (
                <p className="mt-1.5 text-sm text-slate-500">{c.gradeLevel}</p>
              )}

              <div className="mt-4 flex items-center gap-5 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="text-base">👥</span>
                  {c.enrolledStudentCount} student{c.enrolledStudentCount !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-base">📦</span>
                  {c.moduleCount} module{c.moduleCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
