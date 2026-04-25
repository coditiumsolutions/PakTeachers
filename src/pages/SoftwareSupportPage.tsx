import { useState } from 'react'
import { Link } from 'react-router-dom'

const STYLES = `
  @keyframes pgFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pg-fade { animation: pgFadeUp 0.55s ease both; }
  .pg-fade-1 { animation-delay: 0.05s; }
  .pg-fade-2 { animation-delay: 0.15s; }
  .pg-fade-3 { animation-delay: 0.25s; }
  .pg-fade-4 { animation-delay: 0.35s; }
  .pg-fade-5 { animation-delay: 0.38s; }

  .pg-dot-grid {
    background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  @keyframes ssPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  .ss-live-dot { animation: ssPulse 1.8s ease-in-out infinite; }

  .ss-input {
    width: 100%;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 0.5rem;
    padding: 12px 16px;
    color: #fff;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
  }
  .ss-input::placeholder { color: #64748b; }
  .ss-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }

  .accordion-item {
    border-bottom: 1px solid #e2e8f0;
  }
  .accordion-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    gap: 12px;
  }
  .accordion-trigger:hover .accordion-q {
    color: #4338ca;
  }
  .accordion-q {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
    transition: color 0.15s ease;
  }
  .accordion-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #e0e7ff;
    color: #4338ca;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease;
  }
  .accordion-trigger:hover .accordion-icon {
    background: #c7d2fe;
  }
  .accordion-answer {
    font-size: 0.8125rem;
    color: #64748b;
    line-height: 1.6;
    padding-bottom: 14px;
  }

  .req-check {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.8125rem;
    color: #475569;
    padding: 4px 0;
  }
  .req-check::before {
    content: '✓';
    color: #4338ca;
    font-weight: 700;
    font-size: 0.75rem;
    margin-top: 1px;
    flex-shrink: 0;
  }

  .contact-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 9999px;
    background: #1e293b;
    border: 1px solid #334155;
    font-size: 0.8125rem;
    color: #94a3b8;
  }
`

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const setupSteps = [
  {
    n: '01',
    title: 'Download',
    desc: 'Download the PakTeachers LMS app or access via browser at lms.pakteachers.com',
  },
  {
    n: '02',
    title: 'Login',
    desc: 'Use your student credentials sent to your registered email address to sign in.',
  },
  {
    n: '03',
    title: 'Join Class',
    desc: 'Navigate to your scheduled class and click "Join" at the scheduled time.',
  },
] as const

type FaqItem = { q: string; a: string }
type FaqCategory = { heading: string; items: FaqItem[] }

const faqCategories: FaqCategory[] = [
  {
    heading: 'Getting Started',
    items: [
      { q: 'How do I create my student account?', a: 'After enrolling, you will receive a welcome email with a link to set up your account. Follow the link, set a password, and you\'re ready to go.' },
      { q: 'What are the system requirements for the LMS?', a: 'You need a modern browser (Chrome, Firefox, or Edge), a stable internet connection of at least 3 Mbps, and a device with a camera and microphone.' },
      { q: 'How do I reset my password?', a: 'Visit the LMS login page and click "Forgot Password". Enter your registered email and follow the reset link sent to your inbox.' },
    ],
  },
  {
    heading: 'Joining Classes',
    items: [
      { q: 'How do I join a live class?', a: 'Log in to the LMS, go to "My Classes", and click the "Join" button next to your scheduled session. The button activates 5 minutes before class starts.' },
      { q: 'What do I do if I can\'t hear the teacher?', a: 'Check your speaker/headphone volume, ensure the browser has permission to use audio, and try refreshing the page. If the issue persists, contact support.' },
      { q: 'Can I access class recordings after the session?', a: 'Yes. Recorded sessions are available in the LMS under "My Classes → Past Sessions" within 2 hours of the class ending.' },
    ],
  },
  {
    heading: 'Technical Issues',
    items: [
      { q: 'My video/camera isn\'t working — what should I do?', a: 'Go to your browser settings and confirm camera permissions are granted for the LMS site. Also check that no other app is using the camera simultaneously.' },
      { q: 'The LMS is running slowly on my computer', a: 'Close unused browser tabs and applications. Clear your browser cache, and try using Chrome or Edge for the best performance.' },
      { q: 'I\'m getting an error when trying to log in', a: 'Double-check your email and password. If you\'ve forgotten your password, use the "Forgot Password" link. For persistent errors, contact our support team.' },
    ],
  },
  {
    heading: 'Billing & Account',
    items: [
      { q: 'How do I update my payment information?', a: 'Log in to your account, go to Settings → Billing, and update your payment method. Changes take effect on your next billing cycle.' },
      { q: 'Where can I find my invoices?', a: 'All invoices are available under Settings → Billing → Invoice History. You can download PDF copies for your records.' },
      { q: 'How do I cancel or pause my subscription?', a: 'Go to Settings → Subscription and select "Pause" or "Cancel". Paused accounts retain access until the end of the current billing period.' },
    ],
  },
]

function AccordionItem({ q, a }: FaqItem) {
  const [open, setOpen] = useState(false)
  return (
    <div className="accordion-item">
      <button
        type="button"
        className="accordion-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="accordion-q">{q}</span>
        <span className="accordion-icon">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="accordion-answer">{a}</p>}
    </div>
  )
}

export function SoftwareSupportPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-indigo-900 bg-indigo-950 py-16 sm:py-20">
        <div className="pg-dot-grid pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">

            {/* Copy */}
            <div className="flex-1">
              <span className="pg-fade pg-fade-1 inline-block rounded-full bg-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-100">
                💻 Technical Assistance
              </span>
              <h1 className="pg-fade pg-fade-2 mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Software &amp; Technical<br className="hidden sm:block" />
                <span className="text-indigo-300">Support</span>
              </h1>
              <p className="pg-fade pg-fade-3 mt-4 max-w-xl text-base text-indigo-200 sm:text-lg">
                Everything you need to get set up, stay connected, and learn without interruptions.
              </p>
              <div className="pg-fade pg-fade-4 mt-6 flex flex-wrap gap-2">
                {['🔧 Setup Guides', '🐛 Troubleshooting', '📖 Help Articles', '⚡ Quick Response'].map((label) => (
                  <span key={label} className="rounded-full bg-indigo-800 px-3 py-1 text-sm text-indigo-100">{label}</span>
                ))}
              </div>
              <div className="pg-fade pg-fade-5 mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollTo('help-articles')}
                  className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-950 transition hover:bg-slate-100"
                >
                  Browse Help Articles
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('contact-form')}
                  className="rounded-lg border border-indigo-500 px-5 py-2.5 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-900"
                >
                  Contact Support
                </button>
              </div>
            </div>

            {/* System status card */}
            <div className="pg-fade pg-fade-5 w-full max-w-xs shrink-0 overflow-hidden rounded-2xl border border-indigo-700 bg-indigo-900 shadow-2xl lg:w-72">
              <div className="border-b border-indigo-700 px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">System Status</span>
              </div>
              <div className="space-y-3 px-5 py-4">
                {[
                  { icon: '🖥️', label: 'LMS Portal' },
                  { icon: '📹', label: 'Zoom Classes' },
                  { icon: '🎥', label: 'Google Meet' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-800 text-sm">{icon}</span>
                    <span className="flex-1 text-sm font-medium text-white">{label}</span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <span className="ss-live-dot h-2 w-2 rounded-full bg-emerald-400" />
                      Online
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-indigo-700 px-5 py-3">
                <span className="text-xs text-indigo-300">⚡ Support available Mon–Sat 9AM–6PM</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Quick Setup Steps ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Setup Guide</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Get Started in Minutes</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {setupSteps.map(({ n, title, desc }) => (
              <div key={n} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <span className="text-4xl font-bold text-indigo-100">{n}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Help Articles / FAQ ── */}
      <section
        id="help-articles"
        className="scroll-mt-(--nav-stack-height) bg-slate-50 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">FAQ</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Common Questions &amp; Guides</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {faqCategories.map(({ heading, items }) => (
              <div key={heading} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-600">{heading}</p>
                {items.map((item) => (
                  <AccordionItem key={item.q} {...item} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── System Requirements ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Compatibility</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Minimum System Requirements</h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Desktop */}
            <div className="rounded-2xl border border-slate-200 p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <span className="text-3xl">💻</span>
                <div>
                  <p className="font-semibold text-slate-900">Desktop / Laptop</p>
                  <p className="text-xs text-slate-500">Windows & macOS</p>
                </div>
              </div>
              <div className="space-y-1">
                {['Windows 10+ or macOS 10.15+', 'Chrome, Firefox, or Edge (latest)', '4 GB RAM minimum', 'Stable internet — 5 Mbps+', 'Webcam & microphone'].map((r) => (
                  <p key={r} className="req-check">{r}</p>
                ))}
              </div>
            </div>

            {/* Mobile */}
            <div className="rounded-2xl border border-slate-200 p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <span className="text-3xl">📱</span>
                <div>
                  <p className="font-semibold text-slate-900">Mobile / Tablet</p>
                  <p className="text-xs text-slate-500">Android & iOS</p>
                </div>
              </div>
              <div className="space-y-1">
                {['Android 8+ or iOS 13+', 'Chrome or Safari (latest)', '2 GB RAM minimum', 'Stable internet — 3 Mbps+', 'Front-facing camera & microphone'].map((r) => (
                  <p key={r} className="req-check">{r}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Support Form ── */}
      <section
        id="contact-form"
        className="scroll-mt-(--nav-stack-height) bg-slate-900 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Support</p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Still Need Help?</h2>
            <p className="mt-3 text-sm text-slate-400">
              Our technical support team is available Mon–Sat, 9 AM – 6 PM PKT.
            </p>
          </div>

          <form className="mt-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Full Name</label>
                <input type="text" placeholder="Your full name" className="ss-input" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Email Address</label>
                <input type="email" placeholder="you@example.com" className="ss-input" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Issue Category</label>
                <select className="ss-input">
                  <option value="">Select a category</option>
                  <option>Account Access</option>
                  <option>LMS Technical Issue</option>
                  <option>Class Connection Problem</option>
                  <option>Billing &amp; Payment</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Describe Your Issue</label>
                <textarea
                  rows={5}
                  placeholder="Please describe the issue in as much detail as possible…"
                  className="ss-input resize-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-700 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-600 active:scale-[0.99]"
            >
              Send Support Request
            </button>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="contact-pill">✉ info@pakteachers.com</span>
            <span className="contact-pill">☎ +92 123 4567890</span>
            <span className="contact-pill">◷ Mon–Sat 9AM–6PM</span>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-indigo-950 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to Start Learning?</h2>
          <p className="mt-4 text-sm text-indigo-300">
            Explore our courses or book a free trial class today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/courses"
              className="rounded-lg bg-white px-7 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-slate-100"
            >
              View Courses
            </Link>
            <Link
              to="/trial"
              className="rounded-lg border border-indigo-600 px-7 py-3 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-900"
            >
              Book Free Trial
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
