import { useState } from 'react'
import { Link } from 'react-router-dom'

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
  { id: 1, title: 'Mathematics - Algebra Fundamentals', teacher: 'Mr. Ahmed Khan', platform: 'Zoom', schedule: 'Mon, Wed, Fri - 10:00 AM', students: 24, image: '📐' },
  { id: 2, title: 'English Literature - Shakespeare', teacher: 'Ms. Fatima Ali', platform: 'Google Meet', schedule: 'Tue, Thu - 2:00 PM', students: 18, image: '📚' },
  { id: 3, title: 'Physics - Mechanics & Motion', teacher: 'Mr. Hassan Raza', platform: 'Zoom', schedule: 'Mon, Wed - 3:00 PM', students: 20, image: '⚛️' },
  { id: 4, title: 'Chemistry - Organic Compounds', teacher: 'Dr. Ayesha Malik', platform: 'Google Meet', schedule: 'Tue, Thu - 11:00 AM', students: 16, image: '🧪' },
  { id: 5, title: 'Computer Science - Python Programming', teacher: 'Mr. Usman Tariq', platform: 'Zoom', schedule: 'Sat, Sun - 1:00 PM', students: 30, image: '💻' },
  { id: 6, title: 'Biology - Human Anatomy', teacher: 'Dr. Zara Ahmed', platform: 'Google Meet', schedule: 'Mon, Wed - 4:00 PM', students: 22, image: '🧬' },
]

const classLevels: ClassLevel[] = [
  { name: 'Primary', grades: 'Grades 1-5', ageRange: 'Ages 5-10', subjects: ['Mathematics', 'English', 'Science', 'Urdu', 'Islamic Studies'] },
  { name: 'Middle', grades: 'Grades 6-8', ageRange: 'Ages 11-13', subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science'] },
  { name: 'Secondary', grades: 'Grades 9-10', ageRange: 'Ages 14-16', subjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Accounting'] },
  { name: 'Higher Secondary', grades: 'Grades 11-12', ageRange: 'Ages 16-18', subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Economics', 'Business Studies'] },
]

const steps = [
  { n: 1, title: 'Register', desc: 'Fill out the registration form and choose your preferred classes' },
  { n: 2, title: 'Payment', desc: 'Complete the secure payment process for your selected courses' },
  { n: 3, title: 'Access LMS', desc: 'Get instant access to our Learning Management System' },
  { n: 4, title: 'Start Learning', desc: 'Join live classes and start your educational journey' },
]

export function SchoolPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all')

  const filteredLevels = selectedLevel === 'all'
    ? classLevels
    : classLevels.filter((l) => l.name === selectedLevel)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-indigo-950 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-100">
                🎓 Live Interactive Classes
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Online Schooling
              </h1>
              <p className="mt-4 max-w-xl text-base text-indigo-200 sm:text-lg">
                Experience quality education from the comfort of your home with our live interactive classes conducted via Zoom and Google Meet.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                {[['📹', 'Live Classes'], ['👨‍🏫', 'Expert Teachers'], ['📊', 'Progress Tracking']].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-2 rounded-lg bg-indigo-900 px-3 py-2 text-sm font-medium text-indigo-100">
                    <span>{icon}</span><span>{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/apply" className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-950 transition hover:bg-slate-100">
                  Register Now
                </Link>
                <Link to="/trial" className="rounded-lg border border-indigo-400 px-5 py-2.5 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-900">
                  Try a Free Class
                </Link>
              </div>
            </div>

            {/* Visual card */}
            <div className="w-full max-w-sm shrink-0 rounded-2xl border border-indigo-800 bg-indigo-900 p-5 lg:w-72">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="mt-4 space-y-3">
                {[['📐', 'Mathematics Live', '● Live Now', 'text-green-400'], ['🔬', 'Science Lab', '● Starting Soon', 'text-yellow-400'], ['📚', 'English Literature', '● 2:00 PM', 'text-slate-300']].map(([icon, name, status, color]) => (
                  <div key={name} className="flex items-center gap-3 rounded-lg bg-indigo-800 px-3 py-2.5">
                    <span className="text-xl">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-white">{name}</p>
                      <p className={`text-xs ${color}`}>{status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between text-xs text-indigo-300">
                <span>⭐ 4.9 Rating</span>
                <span>👥 10K+ Students</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform info */}
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Live Classes</h2>
            <p className="mt-3 text-slate-600">Join real-time interactive sessions with experienced teachers via Zoom or Google Meet.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { icon: '📹', name: 'Zoom Classes', desc: 'Interactive video sessions with screen sharing and breakout rooms' },
              { icon: '🎥', name: 'Google Meet', desc: 'Seamless integration with Google Classroom and collaborative tools' },
            ].map(({ icon, name, desc }) => (
              <article key={name} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="text-3xl">{icon}</div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{name}</h3>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Level filter + classes grid */}
      <section className="border-b border-slate-200 bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            {['all', ...classLevels.map((l) => l.name)].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedLevel === lvl
                    ? 'bg-indigo-950 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {lvl === 'all' ? 'All Levels' : lvl}
              </button>
            ))}
          </div>

          {/* Classes grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {liveClasses.map((cls) => (
              <article key={cls.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{cls.image}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cls.platform === 'Zoom' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {cls.platform === 'Zoom' ? '📹' : '🎥'} {cls.platform}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{cls.title}</h3>
                <p className="mt-1 text-sm text-slate-600">👨‍🏫 {cls.teacher}</p>
                <div className="mt-3 space-y-1 text-sm text-slate-500">
                  <p>📅 {cls.schedule}</p>
                  <p>👥 {cls.students} students enrolled</p>
                </div>
                <button type="button" className="mt-5 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Join Class
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Class levels */}
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Class Levels</h2>
            <p className="mt-3 text-slate-600">Comprehensive curriculum designed for every stage of your child's education.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredLevels.map((level) => (
              <article key={level.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold text-slate-900">{level.name}</h3>
                  <span className="text-xs text-slate-500">{level.grades}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">🎯 {level.ageRange}</p>
                <ul className="mt-3 space-y-1">
                  {level.subjects.map((s) => (
                    <li key={s} className="flex items-center gap-1.5 text-sm text-slate-600">
                      <span className="text-indigo-600 font-bold">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-slate-200 bg-slate-100 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How It Works</h2>
            <p className="mt-3 text-slate-600">Getting started with online schooling is easy.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-950 text-lg font-bold text-white">
                  {n}
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Registration */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Ready to Start Learning?</h2>
          <p className="mt-3 text-slate-600">
            Enroll now and give your child the gift of quality education. Limited seats available for each class to ensure personalized attention.
          </p>
          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Student Name" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              <input type="email" placeholder="Email Address" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="tel" placeholder="Phone Number" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              <select className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="">Select Class Level</option>
                <option value="primary">Primary (Grades 1-5)</option>
                <option value="middle">Middle (Grades 6-8)</option>
                <option value="secondary">Secondary (Grades 9-10)</option>
                <option value="higher">Higher Secondary (Grades 11-12)</option>
              </select>
            </div>
            <button type="submit" className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Register Now
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">📞 Or call us at +92 123 4567890 for assistance</p>
        </div>
      </section>
    </>
  )
}
