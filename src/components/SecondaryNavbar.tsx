import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/school', label: 'School' },
  { to: '/courses', label: 'Courses' },
  { to: '/trial', label: 'Trial Classes' },
  { to: '/lms', label: 'LMS' },
  { to: '/apply', label: 'Apply' },
  { to: '/find-tutor', label: 'Find Tutor' },
] as const

export function SecondaryNavbar() {
  const { pathname } = useLocation()

  return (
    <div className="fixed left-0 right-0 top-24 z-40 border-b border-indigo-900 bg-indigo-950 shadow-md sm:top-28">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center gap-4 overflow-x-auto px-4 py-2.5 sm:px-6">
        <nav
          className="flex min-w-0 flex-1 flex-nowrap items-center gap-x-1 sm:gap-x-2"
          aria-label="Secondary"
        >
          {links.map(({ to, label }) => {
            const isActive = to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`)
            return (
              <Link
                key={to}
                to={to}
                className={`shrink-0 rounded-md px-2.5 py-2 text-base font-medium transition sm:px-3 sm:text-lg ${
                  isActive
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-100 hover:bg-indigo-900 hover:text-white'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
