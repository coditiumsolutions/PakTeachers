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

  .subject-pill {
    display: inline-flex;
    align-items: center;
    padding: 6px 16px;
    border-radius: 9999px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    color: #334155;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
    cursor: default;
  }
  .subject-pill:hover {
    background: #eef2ff;
    border-color: #a5b4fc;
    color: #4338ca;
  }

  .trial-input {
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
  .trial-input::placeholder { color: #64748b; }
  .trial-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }

  .step-connector {
    display: none;
  }
  @media (min-width: 768px) {
    .step-connector {
      display: flex;
      align-items: center;
      padding-top: 1.5rem;
      color: #cbd5e1;
      font-size: 1.25rem;
    }
  }

  .included-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem 1.5rem;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .included-card:hover {
    box-shadow: 0 8px 24px rgba(99,102,241,0.08);
    border-color: #c7d2fe;
  }

  .testimonial-card {
    background: rgba(67, 56, 202, 0.25);
    border: 1px solid #4338ca;
    border-radius: 1rem;
    padding: 1.5rem;
  }
`

function scrollToBookTrial() {
  document.getElementById('book-trial')?.scrollIntoView({ behavior: 'smooth' })
}

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu',
  'Islamiyat', 'Pakistan Studies', 'Computer Science', 'Accounting',
  'Economics', 'History', 'Geography', 'Art & Design',
] as const

const includedItems = [
  {
    icon: '🎥',
    title: 'Live 1-on-1 Session',
    desc: '45 minutes of dedicated teaching with a qualified, vetted teacher on our LMS platform.',
  },
  {
    icon: '🖥️',
    title: 'Full LMS Access',
    desc: 'Explore our learning platform and course materials during the trial at no extra cost.',
  },
  {
    icon: '📋',
    title: 'Personalized Feedback',
    desc: 'Receive a written assessment and tailored improvement plan after the class.',
  },
] as const

const steps = [
  { n: '01', title: 'Choose Your Subject', desc: 'Pick from our 50+ available subjects across all grade levels.' },
  { n: '02', title: 'Select a Time Slot', desc: 'Choose a morning, afternoon, or evening slot that fits your schedule.' },
  { n: '03', title: 'Meet Your Teacher', desc: 'Join the live class via our LMS platform — no downloads needed.' },
  { n: '04', title: 'Decide to Enroll', desc: 'Loved it? Sign up for full access and start your learning journey.' },
] as const

const testimonials = [
  { quote: 'The trial class gave us complete confidence before enrolling. The teacher was fantastic.', name: 'Ayesha K.', role: 'Parent' },
  { quote: "My son loved his trial Physics class. He's now enrolled full-time and his grades have improved.", name: 'Tariq M.', role: 'Parent' },
  { quote: 'Booking was easy and the class quality exceeded our expectations. Highly recommend.', name: 'Fatima R.', role: 'Parent' },
] as const

export function TrialPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-indigo-900 bg-indigo-950 py-16 sm:py-20">
        <div className="pg-dot-grid pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -right-40 top-0 h-80 w-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">

            {/* Copy */}
            <div className="flex-1">
              <span className="pg-fade pg-fade-1 inline-block rounded-full bg-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-100">
                🎫 Free Trial Classes
              </span>
              <h1 className="pg-fade pg-fade-2 mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Experience Learning<br className="hidden sm:block" />
                <span className="text-indigo-300">First-Hand</span>
              </h1>
              <p className="pg-fade pg-fade-3 mt-4 max-w-xl text-base text-indigo-200 sm:text-lg">
                Book a free 45-minute trial class with one of our expert teachers. No commitment required.
              </p>
              <div className="pg-fade pg-fade-4 mt-6 flex flex-wrap gap-2">
                {['✓ Free to Book', '👨‍🏫 Expert Teachers', '📋 Personalized Feedback', '🎯 No Commitment'].map((label) => (
                  <span key={label} className="rounded-full bg-indigo-800 px-3 py-1 text-sm text-indigo-100">{label}</span>
                ))}
              </div>
              <div className="pg-fade pg-fade-5 mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={scrollToBookTrial}
                  className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-950 transition hover:bg-slate-100"
                >
                  Book Your Free Trial
                </button>
                <Link
                  to="/courses"
                  className="rounded-lg border border-indigo-500 px-5 py-2.5 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-900"
                >
                  Browse Courses
                </Link>
              </div>
            </div>

            {/* Trial summary card */}
            <div className="pg-fade pg-fade-5 w-full max-w-xs shrink-0 overflow-hidden rounded-2xl border border-indigo-700 bg-indigo-900 shadow-2xl lg:w-72">
              <div className="flex items-center justify-between border-b border-indigo-700 px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Your Free Trial</span>
                <span className="rounded-full bg-emerald-900/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">✓ Free</span>
              </div>
              <div className="space-y-3 px-5 py-4">
                {[
                  { icon: '⏱', text: '45-Minute Session' },
                  { icon: '📋', text: 'Written Feedback Included' },
                  { icon: '🔒', text: 'No Credit Card Required' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-800 text-sm">{icon}</span>
                    <span className="text-sm font-medium text-indigo-100">{text}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-indigo-700 px-5 py-3">
                <span className="text-xs text-indigo-300">Slots fill up fast — book today</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">The Process</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">How a Trial Class Works</h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
            {steps.map((step, i) => (
              <div key={step.n} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+2rem)] top-5 hidden h-px w-[calc(100%-2rem)] bg-slate-200 md:block" />
                )}
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 text-xs font-bold text-white ring-4 ring-white">
                  {step.n}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">What You Get</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">What You Get in a Trial Class</h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {includedItems.map(({ icon, title, desc }) => (
              <div key={title} className="included-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                  {icon}
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subject Areas ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Coverage</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">Available for All Subjects</h2>
            <p className="mt-3 text-sm text-slate-500">Trial classes are available across every subject we offer.</p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {subjects.map((s) => (
              <span key={s} className="subject-pill">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking Form ── */}
      <section
        id="book-trial"
        className="scroll-mt-(--nav-stack-height) bg-slate-900 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Book Now</p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Book Your Free Trial Class</h2>
            <p className="mt-3 text-sm text-slate-400">
              Fill in your details and we'll confirm your slot within 24 hours.
            </p>
          </div>

          <form
            className="mt-10 space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Student Name</label>
                <input type="text" placeholder="Full name" className="trial-input" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Parent / Guardian Name</label>
                <input type="text" placeholder="Full name" className="trial-input" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Email Address</label>
                <input type="email" placeholder="you@example.com" className="trial-input" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Phone Number</label>
                <input type="tel" placeholder="+92 300 0000000" className="trial-input" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Subject</label>
                <select className="trial-input">
                  <option value="">Select a subject</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Class / Grade Level</label>
                <select className="trial-input">
                  <option value="">Select grade level</option>
                  <option>Grade 1–5</option>
                  <option>Grade 6–8</option>
                  <option>Grade 9–10 (Matric)</option>
                  <option>Grade 11–12 (FSc/ICS/FA)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Preferred Time Slot</label>
                <select className="trial-input">
                  <option value="">Select a time slot</option>
                  <option>Morning 9AM–12PM</option>
                  <option>Afternoon 12PM–3PM</option>
                  <option>Evening 3PM–6PM</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Additional Notes <span className="text-slate-600">(optional)</span></label>
                <textarea
                  rows={4}
                  placeholder="Any specific topics, concerns, or questions for the teacher…"
                  className="trial-input resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-indigo-700 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-600 active:scale-[0.99]"
            >
              Confirm My Free Trial
            </button>
          </form>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-indigo-950 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Reviews</p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">What Parents Say</h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {testimonials.map(({ quote, name, role }) => (
              <div key={name} className="testimonial-card">
                <p className="mb-4 text-3xl font-serif leading-none text-indigo-500">"</p>
                <p className="text-sm italic leading-relaxed text-indigo-100">{quote}</p>
                <div className="mt-4 border-t border-indigo-800 pt-4">
                  <p className="text-xs font-semibold text-white">{name}</p>
                  <p className="text-xs text-indigo-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
