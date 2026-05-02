import api, { type ApiResponse } from './api'

// ── DTOs mirroring backend shapes ─────────────────────────────────────────────

export interface UpcomingSessionDTO {
  sessionId: number
  scheduledAt: string
  lessonTitle: string
  courseTitle: string
}

export interface TeacherDashboardDTO {
  activeCoursesCount: number
  totalStudentsCount: number
  pendingTrialsCount: number
  pendingSubmissionsCount: number
  completedSessionsThisMonth: number
  upcomingSessions: UpcomingSessionDTO[]
  lastLogin: string | null
}

export interface TeacherCourseSummaryDTO {
  courseId: number
  title: string
  status: string
  gradeLevel: string | null
  moduleCount: number
  enrolledStudentCount: number
}

export interface LiveSessionTeacherViewDTO {
  sessionId: number
  scheduledAt: string
  lessonTitle: string
  courseTitle: string
  status: string
  meetingLink: string | null
}

export interface TrialClassTeacherViewDTO {
  trialId: number
  studentName: string
  subject: string
  scheduledAt: string
  status: string
  feedback: string | null
  converted: boolean
}

// ── Service ───────────────────────────────────────────────────────────────────

async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data: res } = await promise
  if (!res.success || res.data == null) throw new Error(res.message ?? 'Request failed')
  return res.data
}

export const teacherService = {
  getDashboardSummary: (id: number) =>
    unwrap(api.get<ApiResponse<TeacherDashboardDTO>>(`/api/teachers/${id}/dashboard`)),

  getCourses: (id: number) =>
    unwrap(api.get<ApiResponse<TeacherCourseSummaryDTO[]>>(`/api/teachers/${id}/courses`)),

  getLiveSessions: (id: number) =>
    unwrap(api.get<ApiResponse<LiveSessionTeacherViewDTO[]>>(`/api/teachers/${id}/live-sessions`)),

  getTrialClasses: (id: number) =>
    unwrap(api.get<ApiResponse<TrialClassTeacherViewDTO[]>>(`/api/teachers/${id}/trial-classes`)),
}
