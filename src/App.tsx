import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { SchoolPage } from './pages/SchoolPage'
import { CoursesPage } from './pages/CoursesPage'
import { TrialPage } from './pages/TrialPage'
import { SoftwareSupportPage } from './pages/SoftwareSupportPage'
import { LMSPage } from './pages/LMSPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/school" element={<SchoolPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/trial" element={<TrialPage />} />
          <Route path="/software-support" element={<SoftwareSupportPage />} />
          <Route path="/lms/*" element={<LMSPage />} />
          <Route path="/apply" element={<PlaceholderPage title="Apply" />} />
          <Route path="/find-tutor" element={<PlaceholderPage title="Find Tutor" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
