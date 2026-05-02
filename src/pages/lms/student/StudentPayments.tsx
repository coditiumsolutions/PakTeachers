import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { studentService, type StudentPaymentDTO } from '../../../lib/studentService'
import { alertAccessDenied, alertGenericError } from '../../../lib/alertService'
import { formatPKR, formatDate } from '../../../lib/formatters'

const STATUS_STYLES: Record<string, string> = {
  paid:    'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  failed:  'bg-red-100 text-red-600',
  refunded:'bg-blue-100 text-blue-700',
}

function statusStyle(s: string) {
  return STATUS_STYLES[s.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
}

function RowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="space-y-2 flex-1">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
        <div className="h-5 w-14 animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
  )
}

export function StudentPayments() {
  const { user } = useAuth()
  const { sid } = useParams<{ sid?: string }>()

  const studentId = (() => {
    if (user?.role === 'admin' && sid) {
      const p = parseInt(sid, 10)
      return isNaN(p) ? user.id : p
    }
    return user?.id ?? 0
  })()

  const [payments, setPayments] = useState<StudentPaymentDTO[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!studentId) return
    studentService
      .getStudentPayments(studentId)
      .then(setPayments)
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status
        if (status === 403) {
          void alertAccessDenied('You are not authorised to view payment records.')
        } else {
          void alertGenericError('Failed to load payments', 'Please try again later.')
        }
      })
      .finally(() => setLoading(false))
  }, [studentId])

  const total = payments
    ?.filter((p) => p.status.toLowerCase() === 'paid')
    .reduce((sum, p) => sum + p.amountPkr, 0) ?? 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="lms-fade-up lms-fade-up-1 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Billing</h1>
          <p className="mt-0.5 text-sm text-slate-500">Your complete payment history.</p>
        </div>
        {!loading && payments?.length ? (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <span className="text-xs text-slate-500">Total paid</span>
            <span className="text-sm font-bold text-indigo-700">{formatPKR(total)}</span>
          </div>
        ) : null}
      </div>

      <div className="lms-fade-up lms-fade-up-2 space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
          : !payments?.length
          ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-400">
              No payment records found.
            </div>
          )
          : payments.map((p) => (
            <div key={p.paymentId} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
              <div>
                <p className="font-medium text-slate-900">{p.courseTitle}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {p.paidAt ? formatDate(p.paidAt) : 'Not yet paid'}
                  {p.method ? ` · ${p.method}` : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-semibold text-slate-800">{formatPKR(p.amountPkr)}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle(p.status)}`}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
