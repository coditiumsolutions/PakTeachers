import { useState } from 'react'

const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .c-fade-up { animation: fadeUp 0.55s ease both; }
  .c-fade-up-1 { animation-delay: 0.05s; }
  .c-fade-up-2 { animation-delay: 0.13s; }
  .c-fade-up-3 { animation-delay: 0.21s; }
  .c-fade-up-4 { animation-delay: 0.30s; }
  .c-fade-up-5 { animation-delay: 0.38s; }

  .c-card-lift {
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }
  .c-card-lift:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.10);
    border-color: #c7d2fe !important;
  }

  .c-dot-grid {
    background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  /* benefit card hover */
  .c-benefit-card {
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }
  .c-benefit-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.07);
    border-color: #c7d2fe !important;
  }
`

interface Course {
  id: number
  title: string
  instructor: string
  category: 'quran' | 'academic'
  price: number
  originalPrice?: number
  duration: string
  level: string
  students: number
  rating: number
  image: string
  features: string[]
  isPopular?: boolean
  isQuran?: boolean
}

const courses: Course[] = [
  { id: 1, title: 'Quran Recitation (Nazira)', instructor: 'Qari Muhammad Ibrahim', category: 'quran', price: 2500, duration: '8 Weeks', level: 'Beginner', students: 156, rating: 4.9, image: '📖', features: ['Basic Arabic pronunciation', 'Tajweed fundamentals', 'Daily practice sessions', 'One-on-one feedback'], isPopular: true, isQuran: true },
  { id: 2, title: 'Tajweed Mastery Course', instructor: 'Qari Ahmed Hassan', category: 'quran', price: 3500, originalPrice: 4500, duration: '12 Weeks', level: 'Intermediate', students: 98, rating: 5.0, image: '📿', features: ['Advanced Tajweed rules', 'Practical application', 'Recording analysis', 'Certificate included'], isQuran: true },
  { id: 3, title: 'Hifz Program (Memorization)', instructor: 'Qari Abdul Rahman', category: 'quran', price: 5000, duration: 'Ongoing', level: 'All Levels', students: 72, rating: 4.8, image: '⭐', features: ['Structured memorization plan', 'Daily revision sessions', 'Progress tracking', 'Parent reports'], isPopular: true, isQuran: true },
  { id: 4, title: 'Quran Translation & Tafseer', instructor: 'Mufti Tariq Mahmood', category: 'quran', price: 4000, duration: '16 Weeks', level: 'Advanced', students: 64, rating: 4.9, image: '📚', features: ['Verse-by-verse explanation', 'Historical context', 'Practical application', 'Discussion sessions'], isQuran: true },
  { id: 5, title: 'Mathematics - Complete Course', instructor: 'Mr. Ahmed Khan', category: 'academic', price: 3000, originalPrice: 4000, duration: '12 Weeks', level: 'Grades 6–10', students: 234, rating: 4.7, image: '📐', features: ['Algebra & Geometry', 'Problem-solving techniques', 'Practice worksheets', 'Weekly tests'], isPopular: true },
  { id: 6, title: 'Physics - Mechanics & Beyond', instructor: 'Mr. Hassan Raza', category: 'academic', price: 3500, duration: '10 Weeks', level: 'Grades 9–12', students: 187, rating: 4.8, image: '⚛️', features: ['Conceptual understanding', 'Numerical problem solving', 'Lab demonstrations', 'Exam preparation'] },
  { id: 7, title: 'Chemistry - Organic & Inorganic', instructor: 'Dr. Ayesha Malik', category: 'academic', price: 3500, duration: '10 Weeks', level: 'Grades 9–12', students: 156, rating: 4.6, image: '🧪', features: ['Chemical reactions', 'Periodic table mastery', 'Practical experiments', 'Formula techniques'] },
  { id: 8, title: 'English Literature & Composition', instructor: 'Ms. Fatima Ali', category: 'academic', price: 2800, duration: '8 Weeks', level: 'Grades 6–12', students: 203, rating: 4.7, image: '📝', features: ['Classic literature', 'Essay writing', 'Grammar mastery', 'Creative writing'] },
  { id: 9, title: 'Computer Science - Python', instructor: 'Mr. Usman Tariq', category: 'academic', price: 4500, originalPrice: 6000, duration: '16 Weeks', level: 'Beginner to Advanced', students: 312, rating: 4.9, image: '💻', features: ['Python fundamentals', 'Project-based learning', 'Real-world applications', 'Portfolio building'], isPopular: true },
  { id: 10, title: 'Biology - Human Anatomy', instructor: 'Dr. Zara Ahmed', category: 'academic', price: 3200, duration: '10 Weeks', level: 'Grades 9–12', students: 145, rating: 4.8, image: '🧬', features: ['Body systems', 'Cell biology', 'Genetics basics', 'Medical terminology'] },
  { id: 11, title: 'Urdu Language & Literature', instructor: 'Ms. Khadija Siddiqui', category: 'academic', price: 2500, duration: '8 Weeks', level: 'All Levels', students: 178, rating: 4.6, image: '📕', features: ['Urdu grammar', 'Poetry analysis', 'Essay writing', 'Comprehension skills'] },
  { id: 12, title: 'Islamic Studies', instructor: 'Mufti Abdullah', category: 'academic', price: 2000, duration: '8 Weeks', level: 'All Levels', students: 267, rating: 4.9, image: '🕌', features: ['Seerah of Prophet', 'Islamic history', 'Fiqh basics', 'Daily duas'] },
]

const categories = [
  { id: 'all', label: 'All Courses', icon: '📚' },
  { id: 'quran', label: 'Quran Teaching', icon: '📖' },
  { id: 'academic', label: 'Academic Courses', icon: '🎓' },
] as const

const benefits = [
  { icon: '🎯', title: 'Personalized Attention', desc: 'Small class sizes ensure each student gets individual focus from instructors' },
  { icon: '📅', title: 'Flexible Schedule', desc: 'Choose from multiple time slots that fit your busy lifestyle' },
  { icon: '🏆', title: 'Certified Instructors', desc: 'Learn from qualified teachers with proven track records' },
  { icon: '💻', title: 'Modern Platform', desc: 'Access classes via Zoom or Google Meet with recorded sessions' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Regular assessments and detailed progress reports for parents' },
  { icon: '💰', title: 'Affordable Pricing', desc: 'Quality education at competitive prices with payment plans' },
]

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString()}`
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i} className="text-amber-400 text-sm">★</span>
        if (i === full && hasHalf) return <span key={i} className="text-amber-300 text-sm">★</span>
        return <span key={i} className="text-slate-300 text-sm">★</span>
      })}
      <span className="ml-1 text-xs text-slate-500">{rating}</span>
    </span>
  )
}

function scrollToRegister() {
  document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })
}

export function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'quran' | 'academic'>('all')

  const filtered = selectedCategory === 'all' ? courses : courses.filter((c) => c.category === selectedCategory)

  const counts = {
    all: courses.length,
    quran: courses.filter((c) => c.category === 'quran').length,
    academic: courses.filter((c) => c.category === 'academic').length,
  }

  return (
    <>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-indigo-900 bg-indigo-950 py-16 sm:py-20">
        <div className="c-dot-grid pointer-events-none absolute inset-0" />
        <div
          className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">

            {/* Copy */}
            <div className="flex-1">
              <span className="c-fade-up c-fade-up-1 inline-block rounded-full bg-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-100">
                📚 {counts.all}+ Courses Available
              </span>
              <h1 className="c-fade-up c-fade-up-2 mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Our Courses
              </h1>
              <p className="c-fade-up c-fade-up-3 mt-4 max-w-xl text-base text-indigo-200 sm:text-lg">
                Choose from our wide range of Quran teaching and academic courses — designed to help every student excel.
              </p>
              <div className="c-fade-up c-fade-up-4 mt-6 flex flex-wrap gap-2">
                {['📖 Quran Teaching', '📐 Mathematics', '🔬 Sciences', '💻 Computer Science', '📝 Languages'].map((label) => (
                  <span key={label} className="rounded-full bg-indigo-800 px-3 py-1 text-sm text-indigo-100">{label}</span>
                ))}
              </div>
            </div>

            {/* Stats card */}
            <div className="c-fade-up c-fade-up-5 w-full max-w-xs shrink-0 overflow-hidden rounded-2xl border border-indigo-700 bg-indigo-900 shadow-2xl lg:w-72">
              <div className="border-b border-indigo-700 px-5 py-4">
                <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Platform at a Glance</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-indigo-700">
                {[
                  { val: '50+', label: 'Courses' },
                  { val: '10K+', label: 'Students' },
                  { val: '4.9★', label: 'Avg Rating' },
                  { val: '100+', label: 'Teachers' },
                ].map(({ val, label }) => (
                  <div key={label} className="flex flex-col items-center justify-center py-5">
                    <span className="text-2xl font-bold text-white">{val}</span>
                    <span className="mt-1 text-xs text-indigo-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky category filter ── */}
      <section className="sticky top-(--nav-stack-height) z-30 border-b border-slate-200 bg-white py-3 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === id
                    ? 'bg-indigo-950 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                <span>{icon}</span>
                {label}
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  selectedCategory === id ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-100 text-slate-500'
                }`}>
                  {counts[id]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Courses grid ── */}
      <section className="border-b border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => {
              const discount = course.originalPrice
                ? Math.round((1 - course.price / course.originalPrice) * 100)
                : null
              return (
                <article
                  key={course.id}
                  className={`c-card-lift relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm ${
                    course.isPopular ? 'border-indigo-300' : 'border-slate-200'
                  }`}
                >
                  {/* Popular badge */}
                  {course.isPopular && (
                    <div className="absolute left-4 top-4 z-10 rounded-full bg-indigo-950 px-3 py-0.5 text-xs font-semibold text-white shadow">
                      ⭐ Popular
                    </div>
                  )}
                  {/* Discount badge */}
                  {discount !== null && (
                    <div className="absolute right-4 top-4 z-10 rounded-full bg-green-600 px-3 py-0.5 text-xs font-semibold text-white shadow">
                      Save {discount}%
                    </div>
                  )}

                  {/* Header strip */}
                  <div className={`flex items-end justify-between px-5 pt-8 pb-4 ${course.isQuran ? 'bg-emerald-50' : 'bg-indigo-50'}`}>
                    <span className="text-5xl leading-none">{course.image}</span>
                    <div className="text-right">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${course.isQuran ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {course.isQuran ? 'Quran' : 'Academic'}
                      </span>
                      <p className="mt-1 text-xs text-slate-500">{course.level}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                    <h3 className="text-base font-semibold leading-snug text-slate-900">{course.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">👨‍🏫 {course.instructor}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      <StarRating rating={course.rating} />
                      <span className="text-xs text-slate-400">⏱️ {course.duration}</span>
                      <span className="text-xs text-slate-400">👥 {course.students.toLocaleString()}</span>
                    </div>

                    <ul className="mt-4 flex-1 space-y-1.5">
                      {course.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="mt-px font-bold text-indigo-600 shrink-0">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <div className="mt-5 flex items-baseline gap-2 border-t border-slate-100 pt-4">
                      {course.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">{formatPrice(course.originalPrice)}</span>
                      )}
                      <span className="text-lg font-bold text-slate-900">{formatPrice(course.price)}</span>
                      <span className="text-xs text-slate-400">/ course</span>
                    </div>

                    <button
                      type="button"
                      onClick={scrollToRegister}
                      className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
                    >
                      Register Now
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Why choose us ── */}
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Why Choose Our Courses?</h2>
            <p className="mt-3 text-slate-600">Quality education with flexible learning options tailored to your needs.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon, title, desc }) => (
              <article key={title} className="c-benefit-card rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl border border-indigo-100">
                  {icon}
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Registration ── */}
      <section id="register" className="scroll-mt-(--nav-stack-height) bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:flex">
            {/* Left indigo panel */}
            <div className="flex flex-col justify-center bg-indigo-950 px-8 py-10 sm:w-72 sm:shrink-0">
              <h3 className="text-lg font-bold text-white">Start Your Learning Journey</h3>
              <p className="mt-2 text-sm text-indigo-300">Enroll in any course and get instant access to all learning materials.</p>
              <div className="mt-8 space-y-5">
                {[
                  { val: '10,000+', label: 'Students Enrolled' },
                  { val: '50+', label: 'Courses Available' },
                  { val: '4.9★', label: 'Average Rating' },
                  { val: 'Instant', label: 'Access on Enroll' },
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
              <h2 className="text-xl font-bold text-slate-900">Enroll Today</h2>
              <p className="mt-1 text-sm text-slate-500">Complete the form below and we'll be in touch within 24 hours.</p>
              <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="text" placeholder="Your Name" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  <input type="email" placeholder="Email Address" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="tel" placeholder="Phone Number" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  <select className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <option value="">Select a Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
                >
                  Register Now
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-slate-400">
                💬 Questions? Call +92 123 4567890 or email info@pakteachers.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
