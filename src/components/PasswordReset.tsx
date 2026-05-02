import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { adminService } from '../lib/adminService'
import { showCredentialCard } from '../pages/lms/admin/ManageAdmins'
import { alertGenericError } from '../lib/alertService'

interface Props {
  targetId: number
  targetName: string
  type: 'teacher' | 'student'
}

export function PasswordReset({ targetId, targetName, type }: Props) {
  const { user } = useAuth()
  const [resetting, setResetting] = useState(false)

  async function handleReset() {
    if (!user?.id) return
    setResetting(true)
    try {
      const res =
        type === 'teacher'
          ? await adminService.resetTeacherPassword(user.id, targetId)
          : await adminService.resetStudentPassword(user.id, targetId)

      await showCredentialCard(targetName, res.temporaryPassword, type === 'student')
    } catch (err: unknown) {
      void alertGenericError('Reset Failed', 'Could not reset the password. Please try again.')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-slate-900">Password Reset</h2>
      <p className="mb-4 text-sm text-slate-500">
        Generate a new temporary password for this {type}. They will be required to change it on next login.
      </p>
      <button
        type="button"
        onClick={() => void handleReset()}
        disabled={resetting}
        className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
      >
        {resetting ? 'Resetting…' : `Reset ${type === 'teacher' ? 'Teacher' : 'Student'} Password`}
      </button>
    </div>
  )
}
