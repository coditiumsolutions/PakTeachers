import { useState } from 'react'
import { Link } from 'react-router-dom'

type UserType = 'student' | 'teacher' | 'admin'

const userTypes: { id: UserType; icon: string; label: string }[] = [
  { id: 'student', icon: '👨‍🎓', label: 'Student' },
  { id: 'teacher', icon: '👨‍🏫', label: 'Teacher' },
  { id: 'admin', icon: '👤', label: 'Admin' },
]

const lmsFeatures = [
  { icon: '📚', title: 'Course Materials', desc: 'Access lecture notes, videos, and resources anytime' },
  { icon: '📝', title: 'Quizzes & Assignments', desc: 'Submit work and take assessments online' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Monitor your learning journey and performance' },
  { icon: '💬', title: 'Communication', desc: 'Connect with teachers and classmates easily' },
]

// ── Sub-dashboards ───────────────────────────────────────────────────────────

function StudentDashboard() {
  const courses = [
    { icon: '📐', title: 'Mathematics - Algebra', progress: 65 },
    { icon: '🔬', title: 'Physics - Mechanics', progress: 40 },
    { icon: '📖', title: 'English Literature', progress: 80 },
  ]
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">👨‍🎓 Student Dashboard</h1>
        <p className="mt-1 text-slate-600">Welcome back! Track your learning progress.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[['📚', '5', 'Enrolled Courses'], ['✅', '24', 'Lessons Completed'], ['📝', '8', 'Quizzes Taken'], ['🏆', '87%', 'Average Score']].map(([icon, val, label]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-2xl">{icon}</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{val}</div>
              <div className="text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">📚 My Courses</h2>
        <div className="mt-4 space-y-3">
          {courses.map(({ icon, title, progress }) => (
            <div key={title} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-3xl">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900">{title}</p>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{progress}% Complete</p>
              </div>
              <Link to="/lms/course" className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                Continue
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">📅 Upcoming Lessons</h3>
            <ul className="mt-4 space-y-3">
              {[['Mon, 10 AM', 'Algebra - Quadratic Equations'], ['Tue, 2 PM', "Physics - Newton's Laws"], ['Wed, 11 AM', 'English - Shakespeare']].map(([time, title]) => (
                <li key={title} className="flex items-center justify-between gap-4 text-sm">
                  <span className="shrink-0 text-xs font-medium text-indigo-700">{time}</span>
                  <span className="text-slate-700">{title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">📝 Pending Quizzes</h3>
            <ul className="mt-4 space-y-3">
              {[['Due: Jan 20', 'Mathematics - Chapter 5'], ['Due: Jan 22', 'Physics - Motion Quiz']].map(([due, title]) => (
                <li key={title} className="flex items-center justify-between gap-4 text-sm">
                  <span className="shrink-0 text-xs font-medium text-red-600">{due}</span>
                  <span className="text-slate-700">{title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function TeacherDashboard() {
  const courses = [
    { icon: '📐', title: 'Mathematics - Grade 9', students: 42 },
    { icon: '📐', title: 'Mathematics - Grade 10', students: 38 },
    { icon: '🔬', title: 'Physics - Grade 11', students: 35 },
    { icon: '🔬', title: 'Physics - Grade 12', students: 41 },
  ]
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">👨‍🏫 Teacher Dashboard</h1>
        <p className="mt-1 text-slate-600">Manage your classes and track student performance.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[['👥', '156', 'Total Students'], ['📚', '4', 'Active Courses'], ['📝', '12', 'Lessons This Week'], ['⭐', '4.8', 'Average Rating']].map(([icon, val, label]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-2xl">{icon}</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{val}</div>
              <div className="text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">📚 My Courses</h2>
        <div className="mt-4 space-y-3">
          {courses.map(({ icon, title, students }) => (
            <div key={title} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="text-3xl">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900">{title}</p>
                <p className="text-sm text-slate-500">{students} students enrolled</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link to="/lms/manage" className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">Manage</Link>
                <Link to="/lms/performance" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Performance</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AdminDashboard() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">👤 Admin Dashboard</h1>
        <p className="mt-1 text-slate-600">Manage users, courses, and platform settings.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[['👥', '1,250', 'Total Students'], ['👨‍🏫', '48', 'Active Teachers'], ['📚', '85', 'Total Courses'], ['📈', '94%', 'Satisfaction Rate']].map(([icon, val, label]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-2xl">{icon}</div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{val}</div>
              <div className="text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[['👥 User Management', 'Manage students, teachers, and admin accounts'], ['📚 Course Management', 'Create, edit, and archive courses and content'], ['📊 Reports & Analytics', 'View platform-wide performance and engagement data']].map(([title, desc]) => (
            <article key={title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
              <button type="button" className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                Open
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export function LMSPage() {
  const [userType, setUserType] = useState<UserType | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password && userType) {
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('Please fill in all fields')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail('')
    setPassword('')
    setUserType(null)
  }

  if (isLoggedIn && userType) {
    return (
      <>
        {/* Logged-in top bar */}
        <div className="border-b border-slate-200 bg-white py-3">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
            <nav className="flex gap-4 text-sm">
              <Link to="/lms" className="font-medium text-indigo-700">Dashboard</Link>
              <Link to="/lms/courses" className="text-slate-600 hover:text-slate-900">Courses</Link>
              <Link to="/lms/profile" className="text-slate-600 hover:text-slate-900">Profile</Link>
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>

        {userType === 'student' && <StudentDashboard />}
        {userType === 'teacher' && <TeacherDashboard />}
        {userType === 'admin' && <AdminDashboard />}
      </>
    )
  }

  // ── Login screen ───────────────────────────────────────────────────────────
  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-indigo-950 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-100">
                🖥️ Digital Learning Platform
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Learning Management System
              </h1>
              <p className="mt-4 max-w-xl text-base text-indigo-200 sm:text-lg">
                Access your courses, track progress, submit assignments, and manage your learning journey all in one place.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[['📚', 'Course Materials'], ['📝', 'Assignments'], ['📊', 'Progress Tracking'], ['💬', 'Communication']].map(([icon, label]) => (
                  <div key={label} className="rounded-lg bg-indigo-900 px-3 py-2 text-center text-xs text-indigo-100">
                    <div className="text-xl">{icon}</div>
                    <div className="mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="w-full max-w-sm shrink-0 overflow-hidden rounded-2xl border border-indigo-700 bg-indigo-900 shadow-xl">
              <div className="flex gap-1.5 border-b border-indigo-700 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>
              <div className="flex divide-x divide-indigo-700">
                <div className="w-28 shrink-0 space-y-1 p-3 text-xs">
                  {[['📊', 'Dashboard', true], ['📚', 'Courses', false], ['📝', 'Assignments', false], ['🏆', 'Grades', false]].map(([icon, label, active]) => (
                    <div key={label as string} className={`flex items-center gap-1.5 rounded px-2 py-1.5 ${active ? 'bg-indigo-700 text-white' : 'text-indigo-300'}`}>
                      {icon} {label}
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-3">
                  <p className="text-xs font-semibold text-white">Welcome back!</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[['5', 'Courses'], ['24', 'Lessons'], ['87%', 'Avg']].map(([val, label]) => (
                      <div key={label} className="rounded bg-indigo-800 p-2 text-center">
                        <div className="text-sm font-bold text-white">{val}</div>
                        <div className="text-xs text-indigo-400">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded bg-indigo-800 px-3 py-2 text-xs text-indigo-200">
                    📬 New assignment posted!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login section */}
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-md px-4 sm:px-6">
          {/* User type selector */}
          <div className="grid grid-cols-3 gap-3">
            {userTypes.map(({ id, icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setUserType(id)}
                className={`flex flex-col items-center gap-1 rounded-xl border py-4 text-sm font-medium transition ${
                  userType === id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {userType ? (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">
                {userType === 'student' ? 'Student' : userType === 'teacher' ? 'Teacher' : 'Admin'} Login
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter your credentials to access the {userType} portal.
              </p>
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="lms-email" className="block text-sm font-medium text-slate-700">Email Address</label>
                  <input
                    id="lms-email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="lms-password" className="block text-sm font-medium text-slate-700">Password</label>
                  <input
                    id="lms-password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Login
                </button>
              </form>
              <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-500 space-y-1">
                <p>📧 Login credentials are issued by the administration.</p>
                <p>📞 Contact support at +92 123 4567890 for assistance.</p>
              </div>
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-slate-500">Please select your user type to continue.</p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">LMS Features</h2>
            <p className="mt-3 text-slate-600">Everything you need for effective online learning and teaching.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {lmsFeatures.map(({ icon, title, desc }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="text-3xl">{icon}</div>
                <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
