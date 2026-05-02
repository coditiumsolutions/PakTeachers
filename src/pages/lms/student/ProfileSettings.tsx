import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../../../context/AuthContext'
import {
  studentService,
  type StudentProfileDTO,
  type UpdateStudentProfilePayload,
} from '../../../lib/studentService'
import { alertAccessDenied, alertGenericError } from '../../../lib/alertService'

const base = Swal.mixin({
  allowOutsideClick: false,
  confirmButtonColor: '#1e1b4b',
  customClass: {
    popup: 'rounded-2xl font-sans',
    confirmButton: 'rounded-lg px-5 py-2.5 text-sm font-semibold',
  },
})

function Field({
  label,
  id,
  value,
  onChange,
  readOnly = false,
  type = 'text',
}: {
  label: string
  id: string
  value: string
  onChange?: (v: string) => void
  readOnly?: boolean
  type?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        readOnly={readOnly}
        disabled={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
          readOnly
            ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
            : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
        }`}
      />
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <div className="mb-1.5 h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-9 w-full animate-pulse rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

export function ProfileSettings() {
  const { user } = useAuth()
  const { sid } = useParams<{ sid?: string }>()

  const studentId = (() => {
    if (user?.role === 'admin' && sid) {
      const p = parseInt(sid, 10)
      return isNaN(p) ? user.id : p
    }
    return user?.id ?? 0
  })()

  const isAdmin = user?.role === 'admin'

  const [profile, setProfile] = useState<StudentProfileDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [togglingStatus, setTogglingStatus] = useState(false)

  // form fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [guardianName, setGuardianName] = useState('')
  const [guardianPhone, setGuardianPhone] = useState('')

  useEffect(() => {
    if (!studentId) return
    studentService
      .getStudentProfile(studentId)
      .then((p) => {
        setProfile(p)
        setFullName(p.fullName ?? '')
        setEmail(p.email ?? '')
        setPhone(p.phone ?? '')
        setGradeLevel(p.gradeLevel ?? '')
        setGuardianName(p.guardianName ?? '')
        setGuardianPhone(p.guardianPhone ?? '')
      })
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status
        if (status === 403) {
          void alertAccessDenied('You are not authorised to view this profile.')
        } else {
          void alertGenericError('Failed to load profile', 'Please try again later.')
        }
      })
      .finally(() => setLoading(false))
  }, [studentId])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!studentId) return
    setSaving(true)

    const payload: UpdateStudentProfilePayload = {
      fullName,
      email: email || null,
      phone: phone || null,
      guardianName: guardianName || null,
      guardianPhone: guardianPhone || null,
      ...(isAdmin ? { gradeLevel: gradeLevel || null } : {}),
    }

    try {
      const { data: updated, warnings } = await studentService.updateStudentProfile(studentId, payload)
      setProfile(updated)

      if (warnings.length > 0 && isAdmin) {
        const list = warnings.map((w) => `<li class="mt-1">• ${w}</li>`).join('')
        await base.fire({
          icon: 'warning',
          title: 'Profile Updated with Warnings',
          html: `<p class="text-sm text-slate-600 mb-3">The profile was saved, but please review:</p><ul class="text-sm text-left text-slate-700">${list}</ul>`,
          confirmButtonText: 'Acknowledged',
        })
      } else {
        await base.fire({
          icon: 'success',
          title: 'Profile Saved',
          text: 'Changes have been saved successfully.',
          confirmButtonText: 'OK',
        })
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status
      if (status === 403) {
        void alertAccessDenied('You do not have permission to edit this profile.')
      } else {
        void alertGenericError('Save Failed', 'Could not save profile changes. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusToggle() {
    if (!profile || !isAdmin) return
    const newStatus = profile.status.toLowerCase() === 'active' ? 'inactive' : 'active'
    const isDeactivating = newStatus === 'inactive'

    const confirm = await base.fire({
      icon: 'question',
      title: isDeactivating ? 'Deactivate Student?' : 'Activate Student?',
      text: isDeactivating
        ? 'This will prevent the student from accessing the platform.'
        : 'This will restore full platform access for the student.',
      showCancelButton: true,
      confirmButtonText: isDeactivating ? 'Deactivate' : 'Activate',
      cancelButtonText: 'Cancel',
    })

    if (!confirm.isConfirmed) return

    setTogglingStatus(true)
    try {
      const { data: updated, warnings } = await studentService.updateStudentStatus(studentId, newStatus)
      setProfile(updated)

      if (isDeactivating && warnings.length > 0) {
        const items = warnings.map((w) => `<li class="mt-1.5">☐ ${w}</li>`).join('')
        await base.fire({
          icon: 'warning',
          title: 'Student Deactivated — Suggested Next Steps',
          html: `<p class="mb-3 text-sm text-slate-600">The student has been deactivated. Please action the following:</p>
                 <ul class="text-left text-sm text-slate-700 list-none space-y-1">${items}</ul>`,
          confirmButtonText: "I'll Handle It",
        })
      } else {
        await base.fire({
          icon: 'success',
          title: isDeactivating ? 'Student Deactivated' : 'Student Activated',
          text: `Status has been changed to ${newStatus}.`,
          confirmButtonText: 'OK',
        })
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status
      if (status === 403) {
        void alertAccessDenied('You do not have permission to change this student\'s status.')
      } else {
        void alertGenericError('Status Change Failed', 'Please try again later.')
      }
    } finally {
      setTogglingStatus(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="lms-fade-up lms-fade-up-1 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Profile & Settings</h1>
          <p className="mt-0.5 text-sm text-slate-500">Manage account details and preferences.</p>
        </div>
        {isAdmin && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Admin View
          </span>
        )}
      </div>

      <div className="lms-fade-up lms-fade-up-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-indigo-900 bg-indigo-950 px-5 py-3">
          <p className="text-sm font-semibold text-white">Account Details</p>
        </div>
        <div className="p-6">
        {loading ? (
          <FormSkeleton />
        ) : (
          <form onSubmit={(e) => void handleSave(e)} className="space-y-5">
            {/* Read-only identity */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Username" id="username" value={profile?.username ?? ''} readOnly />
              <Field
                label="Grade Level"
                id="gradeLevel"
                value={gradeLevel}
                onChange={setGradeLevel}
                readOnly={!isAdmin}
              />
            </div>

            <Field label="Full Name" id="fullName" value={fullName} onChange={setFullName} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" id="email" type="email" value={email} onChange={setEmail} />
              <Field label="Phone" id="phone" type="tel" value={phone} onChange={setPhone} />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Guardian Information
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Guardian Name" id="guardianName" value={guardianName} onChange={setGuardianName} />
                <Field label="Guardian Phone" id="guardianPhone" type="tel" value={guardianPhone} onChange={setGuardianPhone} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>

              {/* Admin-only status toggle */}
              {isAdmin && profile && (
                <button
                  type="button"
                  onClick={() => void handleStatusToggle()}
                  disabled={togglingStatus}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
                    profile.status.toLowerCase() === 'active'
                      ? 'border-red-300 text-red-600 hover:bg-red-50'
                      : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {togglingStatus
                    ? 'Updating…'
                    : profile.status.toLowerCase() === 'active'
                    ? 'Deactivate Student'
                    : 'Activate Student'}
                </button>
              )}
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  )
}
