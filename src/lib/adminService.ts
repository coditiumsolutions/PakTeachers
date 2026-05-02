import api, { type ApiResponse } from './api'

// ── DTOs ───────────────────────────────────────────────────────────────────────

export interface AdminProfileDTO {
  id: number
  username: string
  fullName: string
  email: string | null
  phone: string | null
  role: string
  status: string
  createdAt: string
}

export interface CreateAdminPayload {
  username: string
  fullName: string
  email?: string | null
  phone?: string | null
  role: 'super_admin' | 'support'
}

export interface CreateAdminResponseDTO {
  id: number
  username: string
  fullName: string
  role: string
  temporaryPassword: string
}

export interface UpdateAdminPayload {
  fullName?: string
  email?: string | null
  phone?: string | null
}

export interface UpdateAdminStatusPayload {
  status: 'active' | 'inactive'
  reason: string
}

export interface AdminListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  role?: string
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export interface ResetPasswordResponseDTO {
  temporaryPassword: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data: res } = await promise
  if (!res.success || res.data == null) throw new Error(res.message ?? 'Request failed')
  return res.data
}

async function unwrapWithWarnings<T>(
  promise: Promise<{ data: ApiResponse<T> }>
): Promise<{ data: T; warnings: string[] }> {
  const { data: res } = await promise
  if (!res.success || res.data == null) throw new Error(res.message ?? 'Request failed')
  return { data: res.data, warnings: res.warnings ?? [] }
}

// ── Service ───────────────────────────────────────────────────────────────────

export const adminService = {
  // Admin Management
  getAdmins: (params?: AdminListParams) =>
    unwrap(api.get<ApiResponse<PagedResult<AdminProfileDTO>>>('/api/admins', { params })),

  getAdminById: (id: number) =>
    unwrap(api.get<ApiResponse<AdminProfileDTO>>(`/api/admins/${id}`)),

  createAdmin: (data: CreateAdminPayload) =>
    unwrap(api.post<ApiResponse<CreateAdminResponseDTO>>('/api/admins', data)),

  updateAdmin: (id: number, data: UpdateAdminPayload) =>
    unwrap(api.put<ApiResponse<AdminProfileDTO>>(`/api/admins/${id}`, data)),

  updateAdminStatus: (id: number, data: UpdateAdminStatusPayload) =>
    unwrapWithWarnings(api.patch<ApiResponse<AdminProfileDTO>>(`/api/admins/${id}/status`, data)),

  // Support Tools
  resetTeacherPassword: (adminId: number, teacherId: number) =>
    unwrap(api.post<ApiResponse<ResetPasswordResponseDTO>>(`/api/admins/${adminId}/reset-teacher-password/${teacherId}`)),

  resetStudentPassword: (adminId: number, studentId: number) =>
    unwrap(api.post<ApiResponse<ResetPasswordResponseDTO>>(`/api/admins/${adminId}/reset-student-password/${studentId}`)),
}
