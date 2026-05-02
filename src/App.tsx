import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MainLayout } from './layouts/MainLayout'
import { LMSLayout } from './layouts/LMSLayout'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { SchoolPage } from './pages/SchoolPage'
import { CoursesPage } from './pages/CoursesPage'
import { TrialPage } from './pages/TrialPage'
import { SoftwareSupportPage } from './pages/SoftwareSupportPage'
import { LMSPage } from './pages/LMSPage'
import { StudentDashboard } from './pages/lms/StudentDashboard'
import { TeacherDashboard } from './pages/lms/TeacherDashboard'
import { AdminDashboard } from './pages/lms/AdminDashboard'
import { TeacherCourses } from './pages/lms/teacher/TeacherCourses'
import { TeacherSchedule } from './pages/lms/teacher/TeacherSchedule'
import { TeacherTrials } from './pages/lms/teacher/TeacherTrials'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider must be inside BrowserRouter — it uses useNavigate */}
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* ── Public site (MainLayout: primary + secondary navbars) ── */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/school" element={<SchoolPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/trial" element={<TrialPage />} />
            <Route path="/software-support" element={<SoftwareSupportPage />} />
            <Route path="/lms" element={<LMSPage />} />
            <Route path="/apply" element={<PlaceholderPage title="Apply" />} />
            <Route path="/find-tutor" element={<PlaceholderPage title="Find Tutor" />} />
          </Route>

          {/* ── LMS dashboards (LMSLayout: PTLMS top bar only) ── */}
          <Route element={<LMSLayout />}>
            <Route path="/student-dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />

            {/* Teacher routes — restricted to own ID */}
            <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher-dashboard/courses" element={<ProtectedRoute allowedRole="teacher"><TeacherCourses /></ProtectedRoute>} />
            <Route path="/teacher-dashboard/schedule" element={<ProtectedRoute allowedRole="teacher"><TeacherSchedule /></ProtectedRoute>} />
            <Route path="/teacher-dashboard/trials" element={<ProtectedRoute allowedRole="teacher"><TeacherTrials /></ProtectedRoute>} />

            {/* Admin-view teacher routes — pass teacher ID via :tid */}
            <Route path="/admin/teacher/:tid/view" element={<ProtectedRoute allowedRole="admin"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/admin/teacher/:tid/courses" element={<ProtectedRoute allowedRole="admin"><TeacherCourses /></ProtectedRoute>} />
            <Route path="/admin/teacher/:tid/schedule" element={<ProtectedRoute allowedRole="admin"><TeacherSchedule /></ProtectedRoute>} />
            <Route path="/admin/teacher/:tid/trials" element={<ProtectedRoute allowedRole="admin"><TeacherTrials /></ProtectedRoute>} />

            <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
