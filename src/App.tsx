import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { PlaceholderPage } from './pages/PlaceholderPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/school" element={<PlaceholderPage title="School" />} />
          <Route path="/courses" element={<PlaceholderPage title="Courses" />} />
          <Route path="/trial" element={<PlaceholderPage title="Trial Classes" />} />
          <Route path="/lms/*" element={<PlaceholderPage title="LMS" />} />
          <Route path="/apply" element={<PlaceholderPage title="Apply" />} />
          <Route path="/find-tutor" element={<PlaceholderPage title="Find Tutor" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
