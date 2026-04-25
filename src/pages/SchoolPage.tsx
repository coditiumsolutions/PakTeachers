import { Link } from 'react-router-dom'

const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .s-fade-up { animation: fadeUp 0.55s ease both; }
  .s-fade-up-1 { animation-delay: 0.05s; }
  .s-fade-up-2 { animation-delay: 0.13s; }
  .s-fade-up-3 { animation-delay: 0.21s; }
  .s-fade-up-4 { animation-delay: 0.30s; }
  .s-fade-up-5 { animation-delay: 0.38s; }

  .s-card-lift {
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }
  .s-card-lift:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.09);
    border-color: #c7d2fe !important;
  }

  /* dot-grid hero overlay */
  .s-dot-grid {
    background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  /* step connector */
  .s-step { position: relative; }
  .s-step:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 23px;
    left: calc(50% + 28px);
    width: calc(100% - 56px);
    height: 2px;
    background: linear-gradient(90deg, #e0e7ff, #c7d2fe);
  }

  /* platform top strip */
  .s-strip-zoom  { background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%); }
  .s-strip-meet  { background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%); }

  /* live pulse */
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .s-live-dot { animation: pulse 1.8s ease-in-out infinite; }

  /* level accent bars */
  .s-level-primary    { border-top: 3px solid #6366f1; }
  .s-level-middle     { border-top: 3px solid #4f46e5; }
  .s-level-secondary  { border-top: 3px solid #3730a3; }
  .s-level-higher     { border-top: 3px solid #1e1b4b; }
`

interface LiveClass {
  id: number
  title: string
  teacher: string
  platform: 'Zoom' | 'Google Meet'
  schedule: string
  students: number
  image: string
}

interface ClassLevel {
  name: string
  grades: string
  ageRange: string
  subjects: string[]
}

const liveClasses: LiveClass[] = [
  { id: 1, title: 'Mathematics - Algebra Fundamentals', teacher: 'Mr. Ahmed Khan', platform: 'Zoom', schedule: 'Mon, Wed, Fri · 10:00 AM', students: 24, image: '📐' },
  { id: 2, title: 'English Literature - Shakespeare', teacher: 'Ms. Fatima Ali', platform: 'Google Meet', schedule: 'Tue, Thu · 2:00 PM', students: 18, image: '📚' },
  { id: 3, title: 'Physics - Mechanics & Motion', teacher: 'Mr. Hassan Raza', platform: 'Zoom', schedule: 'Mon, Wed · 3:00 PM', students: 20, image: '⚛️' },
  { id: 4, title: 'Chemistry - Organic Compounds', teacher: 'Dr. Ayesha Malik', platform: 'Google Meet', schedule: 'Tue, Thu · 11:00 AM', students: 16, image: '🧪' },
  { id: 5, title: 'Computer Science - Python Programming', teacher: 'Mr. Usman Tariq', platform: 'Zoom', schedule: 'Sat, Sun · 1:00 PM', students: 30, image: '💻' },
  { id: 6, title: 'Biology - Human Anatomy', teacher: 'Dr. Zara Ahmed', platform: 'Google Meet', schedule: 'Mon, Wed · 4:00 PM', students: 22, image: '🧬' },
]

const classLevels: ClassLevel[] = [
  { name: 'Primary', grades: 'Grades 1–5', ageRange: 'Ages 5–10', subjects: ['Mathematics', 'English', 'Science', 'Urdu', 'Islamic Studies'] },
  { name: 'Middle', grades: 'Grades 6–8', ageRange: 'Ages 11–13', subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science'] },
  { name: 'Secondary', grades: 'Grades 9–10', ageRange: 'Ages 14–16', subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Accounting'] },
  { name: 'Higher Secondary', grades: 'Grades 11–12', ageRange: 'Ages 16–18', subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Business Studies'] },
]

const steps = [
  { n: 1, icon: '📝', title: 'Register', desc: 'Fill out the registration form and choose your preferred classes' },
  { n: 2, icon: '💳', title: 'Payment', desc: 'Complete the secure payment process for your selected courses' },
  { n: 3, icon: '🖥️', title: 'Access LMS', desc: 'Get instant access to our Learning Management System' },
  { n: 4, icon: '🎓', title: 'Start Learning', desc: 'Join live classes and start your educational journey' },
]

const levelAccent: Record<string, string> = {
  Primary: 's-level-primary',
  Middle: 's-level-middle',
  Secondary: 's-level-secondary',
  'Higher Secondary': 's-level-higher',
}

const levelIcon: Record<string, string> = {
  Primary: '🌱',
  Middle: '📖',
  Secondary: '🔬',
  'Higher Secondary': '🎓',
}

function scrollToRegister() {
  document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })
}

export function SchoolPage() {
  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-indigo-900 bg-indigo-950 py-16 sm:py-20">
        <div className="s-dot-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">

            {/* Copy */}
            <div className="flex-1">
              <span className="s-fade-up s-fade-up-1 inline-block rounded-full bg-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-100">
                🎓 Live Interactive Classes
              </span>
              <h1 className="s-fade-up s-fade-up-2 mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Online Schooling<br className="hidden sm:block" />
                <span className="text-indigo-300">from Home</span>
              </h1>
              <p className="s-fade-up s-fade-up-3 mt-4 max-w-xl text-base text-indigo-200 sm:text-lg">
                Experience quality education from the comfort of your home with live interactive classes conducted via Zoom and Google Meet.
              </p>
              <div className="s-fade-up s-fade-up-4 mt-6 flex flex-wrap gap-2">
                {['📹 Live Classes', '👨‍🏫 Expert Teachers', '📊 Progress Tracking', '🏆 Certified Courses'].map((label) => (
                  <span key={label} className="rounded-full bg-indigo-800 px-3 py-1 text-sm text-indigo-100">{label}</span>
                ))}
              </div>
              <div className="s-fade-up s-fade-up-5 mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={scrollToRegister} className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-950 transition hover:bg-slate-100">
                  Register Now
                </button>
                <Link to="/trial" className="rounded-lg border border-indigo-500 px-5 py-2.5 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-900">
                  Try a Free Class
                </Link>
              </div>
            </div>

            {/* Live status widget */}
            <div className="s-fade-up s-fade-up-5 w-full max-w-xs shrink-0 overflow-hidden rounded-2xl border border-indigo-700 bg-indigo-900 shadow-2xl lg:w-72">
              <div className="flex items-center justify-between border-b border-indigo-700 px-4 py-3">
                <span className="text-xs font-semibold text-indigo-200">Live Now</span>
                <span className="flex items-center gap-1.5 text-xs text-indigo-300">
                  <span className="s-live-dot inline-block h-2 w-2 rounded-full bg-green-400" />
                  3 Active Sessions
                </span>
              </div>
              <div className="divide-y divide-indigo-800">
                {[
                  { emoji: '📐', name: 'Mathematics – Algebra', teacher: 'Mr. Ahmed Khan', status: '● Live Now', statusColor: 'text-green-400' },
                  { emoji: '⚛️', name: 'Physics – Mechanics', teacher: 'Mr. Hassan Raza', status: '● Starting in 10 min', statusColor: 'text-yellow-400' },
                  { emoji: '📚', name: 'English Literature', teacher: 'Ms. Fatima Ali', status: '● 2:00 PM', statusColor: 'text-indigo-300' },
                ].map(({ emoji, name, teacher, status, statusColor }) => (
                  <div key={name} className="flex items-center gap-3 px-4 py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-800 text-lg">{emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{name}</p>
                      <p className="truncate text-xs text-indigo-400">{teacher}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-medium ${statusColor}`}>{status}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-indigo-700 px-4 py-3 text-xs text-indigo-300">
                <span>⭐ 4.9 Rating</span>
                <span>👥 10,000+ Students</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platforms ── */}
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Live Interactive Classes</h2>
            <p className="mt-3 text-slate-600">Real-time sessions with experienced teachers — all you need is a device and an internet connection.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { icon: '📹', name: 'Zoom Classes', desc: 'Interactive video sessions with screen sharing, breakout rooms, and hands-on whiteboard tools.', badge: 'bg-blue-100 text-blue-700', badgeLabel: 'Zoom' },
              { icon: '🎥', name: 'Google Meet', desc: 'Seamless integration with Google Classroom, collaborative documents, and easy access links.', badge: 'bg-green-100 text-green-700', badgeLabel: 'Google Meet' },
            ].map(({ icon, name, desc, badge, badgeLabel }) => (
              <article key={name} className="s-card-lift flex gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-3xl">{icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge}`}>{badgeLabel}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Classes Grid ── */}
      <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Current Classes</h2>
            <p className="mt-3 text-slate-600">Browse our active live sessions and join the one that fits your schedule.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {liveClasses.map((cls) => (
              <article key={cls.id} className="s-card-lift flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Coloured top strip */}
                <div className={`flex items-center justify-between px-5 py-4 ${cls.platform === 'Zoom' ? 's-strip-zoom' : 's-strip-meet'}`}>
                  <span className="text-4xl">{cls.image}</span>
                  <div className="text-right">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cls.platform === 'Zoom' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
                      {cls.platform === 'Zoom' ? '📹' : '🎥'} {cls.platform}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <h3 className="text-base font-semibold leading-snug text-slate-900">{cls.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500">👨‍🏫 {cls.teacher}</p>

                  <div className="mt-3 space-y-1.5 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                      <span className="text-indigo-500">📅</span> {cls.schedule}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-indigo-500">👥</span> {cls.students} students enrolled
                    </p>
                  </div>

                  <div className="mt-auto pt-5">
                    <button
                      type="button"
                      onClick={scrollToRegister}
                      className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Join Class
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Class Levels ── */}
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Class Levels</h2>
            <p className="mt-3 text-slate-600">A comprehensive curriculum designed for every stage of your child's education.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {classLevels.map((level) => (
              <article
                key={level.name}
                className={`s-card-lift rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${levelAccent[level.name]}`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-2xl">{levelIcon[level.name]}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{level.name}</h3>
                    <p className="text-xs text-slate-500">{level.grades}</p>
                  </div>
                </div>
                <p className="mb-3 text-xs font-medium text-indigo-600">🎯 {level.ageRange}</p>
                <ul className="space-y-1.5">
                  {level.subjects.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="font-bold text-indigo-600">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How It Works</h2>
            <p className="mt-3 text-slate-600">Getting started with online schooling is simple — just four easy steps.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ n, icon, title, desc }) => (
              <div key={n} className="s-step flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-950 text-lg font-bold text-white shadow-md">
                    {n}
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm shadow-sm border border-slate-100">
                    {icon}
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration CTA ── */}
      <section id="register" className="scroll-mt-(--nav-stack-height) bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm sm:flex">
            {/* Left indigo trust panel */}
            <div className="flex flex-col justify-center bg-indigo-950 px-8 py-10 sm:w-72 sm:shrink-0">
              <h3 className="text-lg font-bold text-white">Join Thousands of Students</h3>
              <p className="mt-2 text-sm text-indigo-300">Enroll today and get full access to live classes, recordings, and our LMS.</p>
              <div className="mt-8 space-y-5">
                {[
                  { val: '10,000+', label: 'Students Enrolled' },
                  { val: '100+', label: 'Expert Teachers' },
                  { val: '4.9★', label: 'Average Rating' },
                  { val: '50+', label: 'Active Classes' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div className="text-xl font-bold text-white">{val}</div>
                    <div className="text-xs text-indigo-300">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right form */}
            <div className="flex-1 px-8 py-10">
              <h2 className="text-xl font-bold text-slate-900">Ready to Start Learning?</h2>
              <p className="mt-1 text-sm text-slate-500">Limited seats per class — secure yours today.</p>
              <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="text" placeholder="Student Name" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  <input type="email" placeholder="Email Address" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="tel" placeholder="Phone Number" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  <select className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <option value="">Select Class Level</option>
                    <option value="primary">Primary (Grades 1–5)</option>
                    <option value="middle">Middle (Grades 6–8)</option>
                    <option value="secondary">Secondary (Grades 9–10)</option>
                    <option value="higher">Higher Secondary (Grades 11–12)</option>
                  </select>
                </div>
                <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]">
                  Register Now
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-slate-400">📞 Or call us at +92 123 4567890 for assistance</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
