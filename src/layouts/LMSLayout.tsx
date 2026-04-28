import { Link, Outlet, useNavigate } from 'react-router-dom'

const ANIM_STYLES = `
  @keyframes lmsFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lms-fade-up { animation: lmsFadeUp 0.55s ease both; }
  .lms-fade-up-1 { animation-delay: 0.05s; }
  .lms-fade-up-2 { animation-delay: 0.13s; }
  .lms-fade-up-3 { animation-delay: 0.21s; }
  .lms-fade-up-4 { animation-delay: 0.29s; }
  .lms-fade-up-5 { animation-delay: 0.37s; }

  .lms-progress-fill {
    height: 100%;
    border-radius: 9999px;
    background: #4f46e5;
    transition: width 1.1s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .lms-course-row {
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .lms-course-row:hover {
    transform: translateX(3px);
    border-color: #c7d2fe !important;
    box-shadow: 0 2px 12px rgba(79,70,229,0.08);
  }

  .lms-stat-card::before {
    content: '';
    position: absolute;
    left: 0; top: 16px; bottom: 16px;
    width: 3px;
    border-radius: 0 2px 2px 0;
    background: #4f46e5;
  }

  .lms-panel-card {
    transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .lms-panel-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(79,70,229,0.04) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .lms-panel-card:hover::after { opacity: 1; }
  .lms-panel-card:hover {
    border-color: #c7d2fe !important;
    box-shadow: 0 4px 16px rgba(79,70,229,0.10);
    transform: translateY(-2px);
  }
`

export function LMSLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/lms')
  }

  return (
    <>
      <style>{ANIM_STYLES}</style>

      {/* LMS top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/lms" className="text-sm font-bold tracking-wide text-indigo-700">
              PTLMS
            </Link>
            <nav className="flex gap-1">
              {[
                { to: '/student-dashboard', label: 'Dashboard' },
                { to: '/lms/courses', label: 'Courses' },
                { to: '/lms/profile', label: 'Profile' },
              ].map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="min-h-screen bg-slate-50">
        <Outlet />
      </div>
    </>
  )
}
