import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../../../context/AuthContext'
import { adminService, type AdminProfileDTO } from '../../../lib/adminService'
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
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i}>
          <div className="mb-1.5 h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-9 w-full animate-pulse rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

export function AdminProfileSettings() {
  const { user } = useAuth()
  const { aid } = useParams<{ aid?: string }>()

  // Determine which admin profile to show/edit
  const targetId = (() => {
    if (aid) {
      const p = parseInt(aid, 10)
      return isNaN(p) ? (user?.id ?? 0) : p
    }
    return user?.id ?? 0
  })()

  // Get the raw role from the AuthContext user (support vs super_admin)
  // AuthContext normalizes both to 'admin', so we need the raw role from the profile
  const [profile, setProfile] = useState<AdminProfileDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // A support admin can only edit their own profile
  const isSupportViewingOther = profile?.role === 'support' && targetId !== user?.id

  useEffect(() => {
    if (!targetId) return
    adminService
      .getAdminById(targetId)
      .then((p) => {
        setProfile(p)
        setFullName(p.fullName ?? '')
        setEmail(p.email ?? '')
        setPhone(p.phone ?? '')
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
  }, [targetId])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!targetId || isSupportViewingOther) return
    setSaving(true)

    try {
      const updated = await adminService.updateAdmin(targetId, {
        fullName,
        email: email || null,
        phone: phone || null,
      })
      setProfile(updated)
      await base.fire({
        icon: 'success',
        title: 'Profile Saved',
        text: 'Changes have been saved successfully.',
        confirmButtonText: 'OK',
      })
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

  const isReadOnly = isSupportViewingOther

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="lms-fade-up lms-fade-up-1 mb-8">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          Admin View
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">My Account</h1>
        <p className="mt-1 text-slate-500">Manage your admin profile.</p>
      </div>

      <div className="lms-fade-up lms-fade-up-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <FormSkeleton />
        ) : (
          <form onSubmit={(e) => void handleSave(e)} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Username" id="username" value={profile?.username ?? ''} readOnly />
              <Field label="Role" id="role" value={profile?.role?.replace('_', ' ') ?? ''} readOnly />
            </div>

            <Field
              label="Full Name"
              id="fullName"
              value={fullName}
              onChange={isReadOnly ? undefined : setFullName}
              readOnly={isReadOnly}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={isReadOnly ? undefined : setEmail}
                readOnly={isReadOnly}
              />
              <Field
                label="Phone"
                id="phone"
                type="tel"
                value={phone}
                onChange={isReadOnly ? undefined : setPhone}
                readOnly={isReadOnly}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status" id="status" value={profile?.status ?? ''} readOnly />
            </div>

            {!isReadOnly && (
              <div className="border-t border-slate-100 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            )}

            {isReadOnly && (
              <p className="text-xs text-slate-400">
                Support admins can only edit their own profile.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
