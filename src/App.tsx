import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
import { PlaceholderPage } from './pages/PlaceholderPage'

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
