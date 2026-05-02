import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../../../context/AuthContext'
import {
  adminService,
  type AdminProfileDTO,
  type CreateAdminPayload,
} from '../../../lib/adminService'
import { alertAccessDenied, alertGenericError } from '../../../lib/alertService'
import { formatDate } from '../../../lib/formatters'

const base = Swal.mixin({
  allowOutsideClick: false,
  confirmButtonColor: '#1e1b4b',
  customClass: {
    popup: 'rounded-2xl font-sans',
    confirmButton: 'rounded-lg px-5 py-2.5 text-sm font-semibold',
    cancelButton: 'rounded-lg px-5 py-2.5 text-sm font-semibold',
  },
})

const STATUS_STYLES: Record<string, string> = {
  active:   'bg-emerald-100 text-emerald-700',
  inactive: 'bg-red-100 text-red-600',
}
const ROLE_STYLES: Record<string, string> = {
  super_admin: 'bg-indigo-100 text-indigo-700',
  support:     'bg-slate-100 text-slate-600',
}

function statusStyle(s: string) {
  return STATUS_STYLES[s.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
}
function roleStyle(r: string) {
  return ROLE_STYLES[r.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-40 animate-pulse rounded bg-slate-100 flex-1" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

// Credential card shown after admin creation or password reset
export async function showCredentialCard(
  username: string,
  tempPassword: string,
  isStudentReset = false
) {
  const escapedPw = tempPassword.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const escapedUser = username.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const guardianNote = isStudentReset
    ? `<div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-xs text-amber-800">
        <strong>Guardian Relay Note:</strong> Please provide this temporary password to the student's guardian or parent — not directly to the student.
       </div>`
    : ''

  await Swal.fire({
    allowOutsideClick: false,
    allowEscapeKey: false,
    title: '<span class="text-base font-bold text-slate-900">Credential Card</span>',
    html: `
      <div class="text-left space-y-3 font-sans">
        <p class="text-sm text-slate-600">Share these credentials securely. <strong class="text-red-600">This password will never be shown again.</strong></p>
        <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 space-y-2">
          <div class="flex items-center justify-between gap-3">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Username</span>
            <span class="font-mono text-sm font-semibold text-slate-900">${escapedUser}</span>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</span>
            <span id="swal-pw" class="font-mono text-sm font-bold text-indigo-700">${escapedPw}</span>
          </div>
        </div>
        <button
          id="swal-copy-btn"
          class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          type="button"
        >
          Copy to Clipboard
        </button>
        ${guardianNote}
      </div>
    `,
    confirmButtonText: 'I Have Saved This (3)',
    confirmButtonColor: '#1e1b4b',
    customClass: {
      popup: 'rounded-2xl font-sans',
      confirmButton: 'rounded-lg px-5 py-2.5 text-sm font-semibold',
    },
    didOpen: () => {
      // Disable confirm for 3 s so the admin actually reads the credentials
      const confirmBtn = Swal.getConfirmButton()
      if (confirmBtn) confirmBtn.disabled = true
      let remaining = 3
      const interval = setInterval(() => {
        remaining -= 1
        if (remaining <= 0) {
          clearInterval(interval)
          if (confirmBtn) {
            confirmBtn.disabled = false
            confirmBtn.textContent = 'I Have Saved This'
          }
        } else if (confirmBtn) {
          confirmBtn.textContent = `I Have Saved This (${remaining})`
        }
      }, 1000)

      document.getElementById('swal-copy-btn')?.addEventListener('click', () => {
        void navigator.clipboard.writeText(tempPassword).then(() => {
          const btn = document.getElementById('swal-copy-btn')
          if (btn) {
            btn.textContent = 'Copied!'
            btn.classList.add('bg-emerald-50', 'border-emerald-300', 'text-emerald-700')
            setTimeout(() => {
              btn.textContent = 'Copy to Clipboard'
              btn.classList.remove('bg-emerald-50', 'border-emerald-300', 'text-emerald-700')
            }, 2000)
          }
        })
      })
    },
  })
}

// Add Admin modal
async function showAddAdminModal(): Promise<CreateAdminPayload | null> {
  const { value: formValues } = await Swal.fire({
    allowOutsideClick: false,
    title: '<span class="text-base font-bold text-slate-900">Add New Admin</span>',
    html: `
      <div class="text-left space-y-3 font-sans">
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-700">Full Name <span class="text-red-500">*</span></label>
          <input id="swal-fullName" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Enter full name" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-700">Username <span class="text-red-500">*</span></label>
          <input id="swal-username" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Enter username" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-700">Email</label>
          <input id="swal-email" type="email" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Email address" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-slate-700">Role <span class="text-red-500">*</span></label>
          <select id="swal-role" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            <option value="support">Support</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>
    `,
    confirmButtonText: 'Create Admin',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#1e1b4b',
    customClass: {
      popup: 'rounded-2xl font-sans',
      confirmButton: 'rounded-lg px-5 py-2.5 text-sm font-semibold',
      cancelButton: 'rounded-lg px-5 py-2.5 text-sm font-semibold border border-slate-300 text-slate-700 bg-white',
    },
    preConfirm: () => {
      const fullName = (document.getElementById('swal-fullName') as HTMLInputElement)?.value.trim()
      const username = (document.getElementById('swal-username') as HTMLInputElement)?.value.trim()
      const email = (document.getElementById('swal-email') as HTMLInputElement)?.value.trim()
      const role = (document.getElementById('swal-role') as HTMLSelectElement)?.value

      if (!fullName || !username || !role) {
        Swal.showValidationMessage('Full Name, Username, and Role are required.')
        return null
      }

      return { fullName, username, email: email || null, role } as CreateAdminPayload
    },
  })

  return formValues ?? null
}

export function ManageAdmins() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const guardFired = useRef(false)

  // All state and callbacks declared unconditionally — hooks must not follow a conditional return.
  const [admins, setAdmins] = useState<AdminProfileDTO[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const isAuthorised = user?.role === 'admin' && user?.adminRole !== 'support'

  // Guard: redirect first, alert second — matches ProtectedRoute pattern so the
  // user lands on the destination page before the modal opens (not stuck on a blank page).
  useEffect(() => {
    if (!user || guardFired.current) return
    if (!isAuthorised) {
      guardFired.current = true
      navigate('/admin-dashboard', { replace: true })
      void alertAccessDenied('User Management is restricted to Super Admins.')
    }
  }, [user, isAuthorised, navigate])

  function handleSearchChange(v: string) {
    setSearch(v)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(v)
      setPage(1)
    }, 350)
  }

  const fetchAdmins = useCallback(() => {
    setLoading(true)
    adminService
      .getAdmins({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        role: roleFilter || undefined,
      })
      .then((res) => {
        setAdmins(res.items)
        setTotalCount(res.totalCount)
      })
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } }).response?.status
        // 403 is handled globally by AuthContext via pt:forbidden — don't double-alert
        if (status !== 403) {
          void alertGenericError('Failed to load admins', 'Please try again later.')
        }
      })
      .finally(() => setLoading(false))
  }, [page, debouncedSearch, statusFilter, roleFilter])

  // Only fetch when authorised — prevents a spurious 403 for support admins.
  useEffect(() => {
    if (isAuthorised) fetchAdmins()
  }, [isAuthorised, fetchAdmins])

  // Wait for auth hydration before making any access decision.
  if (authLoading) return null
  // Guard effect handles the redirect; return null briefly while it fires.
  if (!user || !isAuthorised) return null

  async function handleCreate() {
    const payload = await showAddAdminModal()
    if (!payload) return

    setCreating(true)
    try {
      const created = await adminService.createAdmin(payload)
      await showCredentialCard(created.username, created.temporaryPassword)
      fetchAdmins()
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status
      if (status === 409) {
        void base.fire({ icon: 'error', title: 'Username Taken', text: 'This username is already in use. Please choose another.', confirmButtonText: 'OK' })
      } else {
        void alertGenericError('Creation Failed', 'Could not create admin. Please try again.')
      }
    } finally {
      setCreating(false)
    }
  }

  async function handleStatusToggle(admin: AdminProfileDTO) {
    const isDeactivating = admin.status.toLowerCase() === 'active'
    const newStatus = isDeactivating ? 'inactive' : 'active'

    const { value: reason } = await Swal.fire({
      allowOutsideClick: false,
      title: `<span class="text-base font-bold text-slate-900">${isDeactivating ? 'Deactivate' : 'Activate'} Admin?</span>`,
      html: `
        <div class="text-left font-sans space-y-3">
          <p class="text-sm text-slate-600">${isDeactivating ? 'This will prevent the admin from accessing the system.' : 'This will restore system access for the admin.'}</p>
          <div>
            <label class="mb-1 block text-xs font-semibold text-slate-700">Reason <span class="text-red-500">*</span></label>
            <textarea id="swal-reason" rows="3" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" placeholder="Provide a reason for this action..."></textarea>
          </div>
        </div>
      `,
      confirmButtonText: isDeactivating ? 'Deactivate' : 'Activate',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonColor: isDeactivating ? '#dc2626' : '#1e1b4b',
      customClass: {
        popup: 'rounded-2xl font-sans',
        confirmButton: 'rounded-lg px-5 py-2.5 text-sm font-semibold',
        cancelButton: 'rounded-lg px-5 py-2.5 text-sm font-semibold border border-slate-300 text-slate-700 bg-white',
      },
      preConfirm: () => {
        const val = (document.getElementById('swal-reason') as HTMLTextAreaElement)?.value.trim()
        if (!val) {
          Swal.showValidationMessage('Please provide a reason.')
          return null
        }
        return val
      },
    })

    if (!reason) return

    try {
      const { data: updated } = await adminService.updateAdminStatus(admin.id, { status: newStatus, reason })
      setAdmins((prev) => prev.map((a) => (a.id === admin.id ? updated : a)))
      void base.fire({
        icon: 'success',
        title: isDeactivating ? 'Admin Deactivated' : 'Admin Activated',
        text: `Status changed to ${newStatus}.`,
        confirmButtonText: 'OK',
      })
    } catch (err: unknown) {
      const res = (err as { response?: { status?: number; data?: { message?: string } } }).response
      if (res?.status === 403) {
        void base.fire({ icon: 'error', title: 'Not Allowed', text: res.data?.message ?? 'You cannot deactivate your own account.', confirmButtonText: 'OK' })
      } else if (res?.status === 409) {
        void base.fire({ icon: 'error', title: 'Cannot Deactivate', text: res.data?.message ?? 'At least one Super Admin must remain active.', confirmButtonText: 'OK' })
      } else {
        void alertGenericError('Status Change Failed', 'Please try again later.')
      }
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="lms-fade-up lms-fade-up-1 mb-8">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          Admin View
        </span>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">User Management</h1>
        <p className="mt-1 text-slate-500">Manage admin accounts and permissions.</p>
      </div>

      {/* Toolbar */}
      <div className="lms-fade-up lms-fade-up-2 mb-5 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name or username…"
          className="flex-1 min-w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
        >
          <option value="">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="support">Support</option>
        </select>
        <button
          type="button"
          onClick={() => void handleCreate()}
          disabled={creating}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {creating ? 'Creating…' : '+ Add Admin'}
        </button>
      </div>

      {/* Table */}
      <div className="lms-fade-up lms-fade-up-3">
        {loading ? (
          <TableSkeleton />
        ) : !admins.length ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-400">
            No admins found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Username</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Created</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((a) => (
                  <tr key={a.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{a.fullName}</td>
                    <td className="px-5 py-3.5 text-slate-500">{a.username}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleStyle(a.role)}`}>
                        {a.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyle(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{formatDate(a.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/manage-admins/${a.id}/profile`)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleStatusToggle(a)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                            a.status.toLowerCase() === 'active'
                              ? 'border-red-300 text-red-600 hover:bg-red-50'
                              : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {a.status.toLowerCase() === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>{totalCount} admin{totalCount !== 1 ? 's' : ''} total</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
