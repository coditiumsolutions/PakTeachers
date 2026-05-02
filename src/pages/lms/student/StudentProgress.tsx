import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { studentService, type CourseProgressDTO } from '../../../lib/studentService'
import { alertAccessDenied, alertGenericError } from '../../../lib/alertService'

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
    <div ref={ref} className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="lms-progress-fill" style={{ width: `${width}%` }} />
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
      <div className="h-2 w-full animate-pulse rounded-full bg-slate-100" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-slate-100" />
        ))}
      </div>
    </div>
  )
}

export function StudentProgress() {
  const { user } = useAuth()
  const { sid } = useParams<{ sid?: string }>()

  const studentId = (() => {
    if (user?.role === 'admin' && sid) {
      const p = parseInt(sid, 10)
      return isNaN(p) ? user.id : p
    }
    return user?.id ?? 0
  })()

  const [progress, setProgress] = useState<CourseProgressDTO[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!studentId) return
    studentService
      .getStudentProgress(studentId)
      .then(setProgress)
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status
        if (status === 403) {
          void alertAccessDenied('You are not authorised to view this progress data.')
        } else {
          void alertGenericError('Failed to load progress', 'Please try again later.')
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
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">My Progress</h1>
        <p className="mt-1 text-slate-500">Lesson-by-lesson completion across all your courses.</p>
      </div>

      {loading ? (
        <div className="lms-fade-up lms-fade-up-2 space-y-5">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !progress?.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-400">
          No progress data found.
        </div>
      ) : (
        <div className="lms-fade-up lms-fade-up-2 space-y-5">
          {progress.map((c) => (
            <div key={c.courseId} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-slate-900">{c.courseTitle}</h3>
                <span className="shrink-0 text-sm font-semibold text-indigo-600">
                  {Math.round(c.completionPercent)}%
                </span>
              </div>
              <div className="mt-3">
                <ProgressBar value={c.completionPercent} />
              </div>

              {c.lessons.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {c.lessons.map((l) => (
                    <li key={l.lessonId} className="flex items-center gap-3 text-sm">
                      <span className={`shrink-0 text-base ${l.status === 'completed' ? 'text-emerald-500' : 'text-slate-300'}`}>
                        {l.status === 'completed' ? '✓' : '○'}
                      </span>
                      <span className={l.status === 'completed' ? 'text-slate-700' : 'text-slate-400'}>
                        {l.lessonTitle}
                      </span>
                      {l.status === 'completed' && (
                        <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          Done
                        </span>
                      )}
                      {l.status !== 'completed' && (
                        <span className="ml-auto shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 capitalize">
                          {l.status}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
