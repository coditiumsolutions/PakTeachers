import { useState } from 'react'

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
  { id: 5, title: 'Mathematics - Complete Course', instructor: 'Mr. Ahmed Khan', category: 'academic', price: 3000, originalPrice: 4000, duration: '12 Weeks', level: 'Grades 6-10', students: 234, rating: 4.7, image: '📐', features: ['Algebra & Geometry', 'Problem-solving techniques', 'Practice worksheets', 'Weekly tests'], isPopular: true },
  { id: 6, title: 'Physics - Mechanics & Beyond', instructor: 'Mr. Hassan Raza', category: 'academic', price: 3500, duration: '10 Weeks', level: 'Grades 9-12', students: 187, rating: 4.8, image: '⚛️', features: ['Conceptual understanding', 'Numerical problem solving', 'Lab demonstrations', 'Exam preparation'] },
  { id: 7, title: 'Chemistry - Organic & Inorganic', instructor: 'Dr. Ayesha Malik', category: 'academic', price: 3500, duration: '10 Weeks', level: 'Grades 9-12', students: 156, rating: 4.6, image: '🧪', features: ['Chemical reactions', 'Periodic table mastery', 'Practical experiments', 'Formula techniques'] },
  { id: 8, title: 'English Literature & Composition', instructor: 'Ms. Fatima Ali', category: 'academic', price: 2800, duration: '8 Weeks', level: 'Grades 6-12', students: 203, rating: 4.7, image: '📝', features: ['Classic literature', 'Essay writing', 'Grammar mastery', 'Creative writing'] },
  { id: 9, title: 'Computer Science - Python', instructor: 'Mr. Usman Tariq', category: 'academic', price: 4500, originalPrice: 6000, duration: '16 Weeks', level: 'Beginner to Advanced', students: 312, rating: 4.9, image: '💻', features: ['Python fundamentals', 'Project-based learning', 'Real-world applications', 'Portfolio building'], isPopular: true },
  { id: 10, title: 'Biology - Human Anatomy', instructor: 'Dr. Zara Ahmed', category: 'academic', price: 3200, duration: '10 Weeks', level: 'Grades 9-12', students: 145, rating: 4.8, image: '🧬', features: ['Body systems', 'Cell biology', 'Genetics basics', 'Medical terminology'] },
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

export function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'quran' | 'academic'>('all')

  const filtered = selectedCategory === 'all' ? courses : courses.filter((c) => c.category === selectedCategory)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-indigo-950 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span className="inline-block rounded-full bg-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-100">
            📚 100+ Courses Available
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">Our Courses</h1>
          <p className="mt-4 max-w-2xl text-base text-indigo-200 sm:text-lg">
            Choose from our wide range of Quran teaching and academic courses designed to help you excel.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[['📖', 'Quran Teaching'], ['📐', 'Mathematics'], ['🔬', 'Sciences'], ['💻', 'Computer Science'], ['📝', 'Languages']].map(([icon, label]) => (
              <span key={label} className="rounded-full bg-indigo-800 px-3 py-1 text-sm text-indigo-100">
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="sticky top-(--nav-stack-height) z-30 border-b border-slate-200 bg-white py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === id
                    ? 'bg-indigo-950 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses grid */}
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
                  className={`relative flex flex-col rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                    course.isPopular ? 'border-indigo-300' : 'border-slate-200'
                  }`}
                >
                  {course.isPopular && (
                    <div className="absolute -top-3 left-4 rounded-full bg-indigo-950 px-3 py-0.5 text-xs font-semibold text-white">
                      ⭐ Popular
                    </div>
                  )}
                  {discount !== null && (
                    <div className="absolute -top-3 right-4 rounded-full bg-green-600 px-3 py-0.5 text-xs font-semibold text-white">
                      Save {discount}%
                    </div>
                  )}

                  <div className={`flex items-center justify-between rounded-t-2xl px-5 pt-6 pb-4 ${course.isQuran ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                    <span className="text-4xl">{course.image}</span>
                    <div className="text-right">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${course.isQuran ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                        {course.isQuran ? 'Quran Teaching' : 'Academic'}
                      </span>
                      <p className="mt-1 text-xs text-slate-500">{course.level}</p>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-5 pb-5">
                    <h3 className="mt-3 text-base font-semibold text-slate-900">{course.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">👨‍🏫 {course.instructor}</p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>⏱️ {course.duration}</span>
                      <span>👥 {course.students}</span>
                      <span>⭐ {course.rating}</span>
                    </div>

                    <ul className="mt-4 flex-1 space-y-1">
                      {course.features.map((f) => (
                        <li key={f} className="flex items-start gap-1.5 text-sm text-slate-600">
                          <span className="mt-px font-bold text-indigo-600">✓</span> {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex items-baseline gap-2">
                      {course.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">{formatPrice(course.originalPrice)}</span>
                      )}
                      <span className="text-lg font-bold text-slate-900">{formatPrice(course.price)}</span>
                      <span className="text-xs text-slate-500">/ course</span>
                    </div>

                    <button type="button" className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                      Register Now
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-b border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Why Choose Our Courses?</h2>
            <p className="mt-3 text-slate-600">Quality education with flexible learning options.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon, title, desc }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="text-3xl">{icon}</div>
                <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Start Your Learning Journey Today</h2>
          <p className="mt-3 text-slate-600">
            Enroll in any course and get instant access to all learning materials. Secure your spot with our easy registration process.
          </p>
          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Your Name" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              <input type="email" placeholder="Email Address" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="tel" placeholder="Phone Number" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              <select className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="">Select a Course</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Register Now
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">💬 Need help? Contact us at +92 123 4567890 or info@pakteachers.com</p>
        </div>
      </section>
    </>
  )
}
