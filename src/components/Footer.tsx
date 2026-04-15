import { Link } from 'react-router-dom'

const quickLinks = [
  { to: '/school', label: 'School' },
  { to: '/courses', label: 'Courses' },
  { to: '/trial', label: 'Trial Classes' },
  { to: '/software-support', label: 'Software Support' },
  { to: '/lms', label: 'LMS' },
] as const

const supportLinks = [
  { href: '#help', label: 'Help Center' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact Us' },
  { href: '#privacy', label: 'Privacy Policy' },
  { href: '#terms', label: 'Terms of Service' },
] as const

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-(--nav-stack-height) border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo01.png" alt="PakTeachers" className="h-10 w-auto object-contain" />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Empowering students across Pakistan with quality online education. Join our growing community of learners today.
            </p>
            <div className="mt-4 space-y-1 text-sm text-slate-400">
              <p>📧 info@pakteachers.com</p>
              <p>📞 +92 123 4567890</p>
              <p>📍 Lahore, Pakistan</p>
              <p>🕐 Mon – Sat: 9 AM – 6 PM</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white">Quick Links</p>
            <ul className="mt-4 space-y-2">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-400 transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white">Support</p>
            <ul className="mt-4 space-y-2">
              {supportLinks.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-sm text-slate-400 transition hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white">Follow Us</p>
            <ul className="mt-4 space-y-2">
              {(['Facebook', 'Twitter', 'Instagram', 'YouTube'] as const).map((platform) => (
                <li key={platform}>
                  <a href="#" className="text-sm text-slate-400 transition hover:text-white">
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} PakTeachers. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">Built with React & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
