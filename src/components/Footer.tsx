import { Link } from 'react-router-dom'

const STYLES = `
  @keyframes ftFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ft-col { animation: ftFadeUp 0.5s ease both; }
  .ft-col-1 { animation-delay: 0.05s; }
  .ft-col-2 { animation-delay: 0.13s; }
  .ft-col-3 { animation-delay: 0.21s; }
  .ft-col-4 { animation-delay: 0.30s; }

  .ft-link {
    position: relative;
    padding-left: 0;
    transition: color 0.18s ease, padding-left 0.18s ease;
  }
  .ft-link::before {
    content: '→';
    position: absolute;
    left: -16px;
    opacity: 0;
    transition: opacity 0.18s ease, left 0.18s ease;
    color: #6366f1;
  }
  .ft-link:hover {
    color: #fff;
    padding-left: 4px;
  }
  .ft-link:hover::before {
    opacity: 1;
    left: -12px;
  }

  .ft-social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 10px;
    background: #1e293b;
    color: #94a3b8;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
    text-decoration: none;
  }
  .ft-social-btn:hover {
    background: #4338ca;
    color: #fff;
    transform: translateY(-2px);
  }

  .ft-contact-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ft-contact-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 8px;
    background: #1e293b;
    font-size: 0.875rem;
  }
`

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

const socials = [
  { label: 'Facebook', icon: 'f', href: '#' },
  { label: 'Twitter', icon: '𝕏', href: '#' },
  { label: 'Instagram', icon: '◈', href: '#' },
  { label: 'YouTube', icon: '▶', href: '#' },
] as const

const contactInfo = [
  { icon: '✉', text: 'info@pakteachers.com' },
  { icon: '☎', text: '+92 123 4567890' },
  { icon: '⊙', text: 'Lahore, Pakistan' },
  { icon: '◷', text: 'Mon – Sat: 9 AM – 6 PM' },
] as const

export function Footer() {
  return (
    <>
      <style>{STYLES}</style>
      <footer
        id="contact"
        className="scroll-mt-(--nav-stack-height) bg-slate-900 text-slate-300"
      >
        {/* Top accent gradient bar */}
        <div
          className="h-0.5 w-full"
          style={{ background: 'linear-gradient(90deg, #4338ca 0%, #1e1b4b 60%, #0f172a 100%)' }}
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          {/* Main grid */}
          <div className="grid divide-y divide-slate-800 py-12 sm:grid-cols-2 sm:divide-y-0 sm:gap-10 lg:grid-cols-4 lg:gap-0">

            {/* ── Brand column ── */}
            <div className="ft-col ft-col-1 pb-10 sm:pb-0 lg:border-r lg:border-slate-800 lg:pr-8">
              <Link to="/" className="inline-flex items-center gap-2">
                <img src="/logo01.png" alt="PakTeachers" className="h-10 w-auto object-contain" />
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Empowering students across Pakistan with quality online education. Join our growing community of learners.
              </p>

              <div className="mt-5 space-y-2.5">
                {contactInfo.map(({ icon, text }) => (
                  <div key={text} className="ft-contact-row">
                    <span className="ft-contact-icon text-indigo-400">{icon}</span>
                    <span className="text-sm text-slate-400">{text}</span>
                  </div>
                ))}
              </div>

              {/* Trust badge */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span className="text-xs font-medium text-slate-300">Trusted by 10,000+ students</span>
              </div>
            </div>

            {/* ── Quick Links ── */}
            <div className="ft-col ft-col-2 py-10 sm:py-0 lg:border-r lg:border-slate-800 lg:px-8">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Quick Links
              </p>
              <ul className="space-y-3 pl-4">
                {quickLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="ft-link text-sm text-slate-400">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Support ── */}
            <div className="ft-col ft-col-3 py-10 sm:py-0 lg:border-r lg:border-slate-800 lg:px-8">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Support
              </p>
              <ul className="space-y-3 pl-4">
                {supportLinks.map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="ft-link text-sm text-slate-400">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Follow Us ── */}
            <div className="ft-col ft-col-4 pt-10 sm:pt-0 lg:pl-8">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Follow Us
              </p>
              <div className="grid grid-cols-2 gap-2">
                {socials.map(({ label, icon, href }) => (
                  <a key={label} href={href} className="ft-social-btn">
                    <span className="text-base leading-none">{icon}</span>
                    <span>{label}</span>
                  </a>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                <p className="text-xs font-semibold text-white">Stay Updated</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">Get announcements and class updates directly.</p>
                <form
                  className="mt-3 flex gap-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="Your email"
                    className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600"
                  >
                    Join
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-800 py-6 sm:flex-row">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} PakTeachers. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Quality education from Pakistan 🇵🇰
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
