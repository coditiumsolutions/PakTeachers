import { useState } from 'react'
import { Link } from 'react-router-dom'

interface TrialClass {
  id: number
  title: string
  instructor: string
  subject: string
  platform: 'Zoom' | 'Google Meet'
  schedule: string
  duration: string
  price: number
  seatsAvailable: number
  image: string
  description: string
}

const trialClasses: TrialClass[] = [
  { id: 1, title: 'Introduction to Algebra', instructor: 'Mr. Ahmed Khan', subject: 'Mathematics', platform: 'Zoom', schedule: 'Mon, Jan 15 - 10:00 AM', duration: '45 minutes', price: 500, seatsAvailable: 15, image: '📐', description: 'Master the basics of algebraic expressions and equations in this interactive session.' },
  { id: 2, title: "Shakespeare's Macbeth", instructor: 'Ms. Fatima Ali', subject: 'English', platform: 'Google Meet', schedule: 'Tue, Jan 16 - 2:00 PM', duration: '60 minutes', price: 600, seatsAvailable: 12, image: '📚', description: "Explore the themes and characters of Shakespeare's tragic masterpiece." },
  { id: 3, title: "Newton's Laws of Motion", instructor: 'Mr. Hassan Raza', subject: 'Physics', platform: 'Zoom', schedule: 'Wed, Jan 17 - 3:00 PM', duration: '45 minutes', price: 500, seatsAvailable: 18, image: '⚛️', description: 'Understand the fundamental laws that govern motion in our universe.' },
  { id: 4, title: 'Organic Chemistry Basics', instructor: 'Dr. Ayesha Malik', subject: 'Chemistry', platform: 'Google Meet', schedule: 'Thu, Jan 18 - 11:00 AM', duration: '60 minutes', price: 600, seatsAvailable: 10, image: '🧪', description: 'Introduction to carbon compounds and their fascinating reactions.' },
  { id: 5, title: 'Python Programming 101', instructor: 'Mr. Usman Tariq', subject: 'Computer Science', platform: 'Zoom', schedule: 'Sat, Jan 20 - 1:00 PM', duration: '90 minutes', price: 800, seatsAvailable: 20, image: '💻', description: 'Write your first Python program and learn programming fundamentals.' },
  { id: 6, title: 'Human Circulatory System', instructor: 'Dr. Zara Ahmed', subject: 'Biology', platform: 'Google Meet', schedule: 'Sun, Jan 21 - 4:00 PM', duration: '45 minutes', price: 500, seatsAvailable: 14, image: '🧬', description: 'Journey through the heart and blood vessels of the human body.' },
  { id: 7, title: 'Quran Recitation Basics', instructor: 'Qari Muhammad Ibrahim', subject: 'Quran', platform: 'Zoom', schedule: 'Mon, Jan 15 - 5:00 PM', duration: '30 minutes', price: 400, seatsAvailable: 8, image: '📖', description: 'Learn proper Arabic pronunciation and basic Tajweed rules.' },
  { id: 8, title: 'Urdu Poetry Analysis', instructor: 'Ms. Khadija Siddiqui', subject: 'Urdu', platform: 'Google Meet', schedule: 'Fri, Jan 19 - 6:00 PM', duration: '60 minutes', price: 500, seatsAvailable: 16, image: '📕', description: 'Appreciate the beauty of classical Urdu poetry and its meanings.' },
]

const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Quran', 'Urdu'] as const

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`
}

export function TrialPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  const filtered = selectedSubject === 'all'
    ? trialClasses
    : trialClasses.filter((c) => c.subject === selectedSubject)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-indigo-950 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-100">
                🎫 Try Before You Commit
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">Trial Classes</h1>
              <p className="mt-4 max-w-xl text-base text-indigo-200 sm:text-lg">
                Experience our teaching quality with one-time access to live classes. Pay per class, no subscription required.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                {[['💰', 'Affordable', 'From Rs. 400/class'], ['⏱️', 'Flexible', '30–90 min sessions'], ['🎯', 'No Commitment', 'One-time access']].map(([icon, title, desc]) => (
                  <div key={title} className="flex items-center gap-3 rounded-lg bg-indigo-900 px-4 py-3">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-xs text-indigo-300">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket card */}
            <div className="w-full max-w-xs shrink-0 overflow-hidden rounded-2xl border border-indigo-700 bg-indigo-900 shadow-xl">
              <div className="bg-indigo-800 px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Trial Pass</span>
                  <span className="text-xl font-bold text-white">Rs. 500</span>
                </div>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📐</span>
                  <span className="font-medium text-white">Mathematics</span>
                </div>
                <div className="flex gap-4 text-sm text-indigo-300">
                  <span>📅 Jan 15</span>
                  <span>🕐 10:00 AM</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-200">
                  <span>📹</span> Zoom Live Class
                </div>
              </div>
              <div className="border-t border-indigo-700 px-5 py-3">
                <span className="text-xs text-green-400">✓ Valid for one session</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {[['🎯', 'Register Per Class', 'Pay only for the classes you want to attend. No subscription required.'], ['🎫', 'One-Time Access', 'Single session access to experience our live interactive teaching.'], ['📹', 'Live via Zoom/Meet', 'Join classes through your preferred platform — Zoom or Google Meet.']].map(([icon, title, desc]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm text-center">
                <div className="text-3xl">{icon}</div>
                <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Subject filter + class cards */}
      <section className="border-b border-slate-200 bg-slate-50 py-12" id="classes">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Available Trial Classes</h2>
            <p className="mt-3 text-slate-600">Select a class and register to attend live.</p>
          </div>

          {/* Filter */}
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${selectedSubject === 'all' ? 'bg-indigo-950 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
            >
              All Subjects
            </button>
            {subjects.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSubject(s)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${selectedSubject === s ? 'bg-indigo-950 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cls) => (
              <article key={cls.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{cls.image}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cls.platform === 'Zoom' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {cls.platform === 'Zoom' ? '📹' : '🎥'} {cls.platform}
                  </span>
                </div>
                <span className="mt-3 w-fit rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                  {cls.subject}
                </span>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{cls.title}</h3>
                <p className="text-sm text-slate-500">👨‍🏫 {cls.instructor}</p>
                <p className="mt-2 flex-1 text-sm text-slate-600">{cls.description}</p>
                <div className="mt-3 space-y-1 text-sm text-slate-500">
                  <p>📅 {cls.schedule}</p>
                  <p>⏱️ {cls.duration}</p>
                  <p>👥 {cls.seatsAvailable} seats left</p>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900">{formatPrice(cls.price)}</span>
                  <span className="text-xs text-slate-500">one-time access</span>
                </div>
                <button type="button" className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Register for Class
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How to Join a Trial Class</h2>
            <p className="mt-3 text-slate-600">Simple 3-step process to attend your first class.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[['1', 'Choose a Class', 'Browse available trial classes and select one that interests you'], ['2', 'Register & Pay', 'Complete the quick registration and secure payment process'], ['3', 'Join Live', 'Receive Zoom/Meet link and join the class at scheduled time']].map(([n, title, desc]) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-950 text-lg font-bold text-white">{n}</div>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-950 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to Experience Quality Teaching?</h2>
          <p className="mt-4 text-indigo-200">
            Book your trial class today and see the PakTeachers difference. Affordable one-time access with no commitment required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/courses" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-slate-100">
              Browse Full Courses
            </Link>
            <a href="#classes" className="rounded-lg border border-indigo-400 px-6 py-3 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-900">
              View All Classes
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
