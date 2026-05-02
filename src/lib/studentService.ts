import api, { type ApiResponse } from './api'

// ── DTOs ───────────────────────────────────────────────────────────────────────

export interface StudentProfileDTO {
  id: number
  username: string
  fullName: string
  email: string | null
  phone: string | null
  gradeLevel: string | null
  guardianName: string | null
  guardianPhone: string | null
  status: string
  createdAt: string
}

export interface UpdateStudentProfilePayload {
  fullName?: string
  email?: string | null
  phone?: string | null
  gradeLevel?: string | null
  guardianName?: string | null
  guardianPhone?: string | null
}

export interface StudentEnrollmentDTO {
  enrollmentId: number
  courseId: number
  courseTitle: string
  gradeLevel: string | null
  status: string
  enrolledAt: string
  completedAt: string | null
}

export interface LessonProgressDTO {
  lessonId: number
  lessonTitle: string
  status: string
  completedAt: string | null
}

export interface CourseProgressDTO {
  courseId: number
  courseTitle: string
  completionPercent: number
  lessons: LessonProgressDTO[]
}

export interface StudentSubmissionDTO {
  submissionId: number
  assignmentTitle: string
  courseTitle: string
  submittedAt: string
  score: number | null
  maxScore: number | null
  passed: boolean | null
  feedback: string | null
}

export interface StudentPaymentDTO {
  paymentId: number
  courseTitle: string
  amountPkr: number
  status: string
  paidAt: string | null
  method: string | null
}

export interface UpcomingStudentSessionDTO {
  sessionId: number
  courseTitle: string
  lessonTitle: string
  scheduledAt: string
  meetingLink: string | null
}

export interface RecentGradeDTO {
  assignmentTitle: string
  courseTitle: string
  score: number | null
  maxScore: number | null
  passed: boolean | null
}

export interface StudentDashboardDTO {
  activeEnrollmentCount: number
  overallCompletionPercent: number
  pendingPaymentCount: number
  upcomingSession: UpcomingStudentSessionDTO | null
  recentGrades: RecentGradeDTO[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data: res } = await promise
  if (!res.success || res.data == null) throw new Error(res.message ?? 'Request failed')
  return res.data
}

// unwrapWithWarnings returns data + warnings so callers can surface them
async function unwrapWithWarnings<T>(
  promise: Promise<{ data: ApiResponse<T> }>
): Promise<{ data: T; warnings: string[] }> {
  const { data: res } = await promise
  if (!res.success || res.data == null) throw new Error(res.message ?? 'Request failed')
  return { data: res.data, warnings: res.warnings ?? [] }
}

// ── Service ───────────────────────────────────────────────────────────────────

export const studentService = {
  getStudentDashboard: (id: number) =>
    unwrap(api.get<ApiResponse<StudentDashboardDTO>>(`/api/students/${id}/dashboard`)),

  getStudentProfile: (id: number) =>
    unwrap(api.get<ApiResponse<StudentProfileDTO>>(`/api/students/${id}`)),

  updateStudentProfile: (id: number, payload: UpdateStudentProfilePayload) =>
    unwrapWithWarnings(api.put<ApiResponse<StudentProfileDTO>>(`/api/students/${id}`, payload)),

  updateStudentStatus: (id: number, status: string) =>
    unwrapWithWarnings(api.patch<ApiResponse<StudentProfileDTO>>(`/api/students/${id}/status`, { status })),

  getStudentEnrollments: (id: number) =>
    unwrap(api.get<ApiResponse<StudentEnrollmentDTO[]>>(`/api/students/${id}/enrollments`)),

  getStudentProgress: (id: number) =>
    unwrap(api.get<ApiResponse<CourseProgressDTO[]>>(`/api/students/${id}/progress`)),

  getStudentSubmissions: (id: number) =>
    unwrap(api.get<ApiResponse<StudentSubmissionDTO[]>>(`/api/students/${id}/submissions`)),

  getStudentPayments: (id: number) =>
    unwrap(api.get<ApiResponse<StudentPaymentDTO[]>>(`/api/students/${id}/payments`)),
}
