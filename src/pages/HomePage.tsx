import { Link } from 'react-router-dom'
import { HeroSlider } from '../components/HeroSlider'
import { FeatureSection } from '../components/FeatureSection'

const STYLES = `
  @keyframes hpFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hp-fade { animation: hpFadeUp 0.5s ease both; }
  .hp-fade-1 { animation-delay: 0.05s; }
  .hp-fade-2 { animation-delay: 0.13s; }
  .hp-fade-3 { animation-delay: 0.21s; }
  .hp-fade-4 { animation-delay: 0.30s; }
`

const stats = [
  { value: '10,000+', label: 'Students Enrolled' },
  { value: '100+', label: 'Qualified Teachers' },
  { value: '4.9\u2605', label: 'Average Rating' },
  { value: '50+', label: 'Courses Available' },
]

export function HomePage() {
  return (
    <>
      <style>{STYLES}</style>
      <HeroSlider />

      {/* Stats bar */}
      <div className="border-b border-slate-200 bg-indigo-950">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-indigo-800 px-4 sm:px-6 lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="py-6 text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">{value}</p>
              <p className="mt-1 text-sm text-indigo-300">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <FeatureSection />

      {/* About */}
      <section id="about" className="scroll-mt-(--nav-stack-height) border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">About Us</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">About PakTeachers</h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                PakTeachers is a Lahore-based virtual schooling platform connecting Pakistani students with certified, experienced teachers for live online classes. We cover the full school curriculum — from primary to higher secondary — as well as dedicated Quran teaching programmes.
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Every class is conducted live via Zoom or Google Meet, keeping small class sizes so teachers can give every student the attention they deserve. All sessions are tracked through our Learning Management System so parents always know how their child is progressing.
              </p>
              <Link to="/school" className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                Explore our classes
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['\uD83C\uDF93', 'Grades 1\u201312', 'Full curriculum from primary to higher secondary'],
                ['\uD83D\uDCD6', 'Quran Teaching', 'Nazira, Tajweed, Hifz & Tafseer'],
                ['\uD83D\uDCF9', 'Live on Zoom & Meet', 'Interactive sessions, not recorded lectures'],
                ['\uD83D\uDCCA', 'LMS Dashboard', 'Track progress, assignments & grades online'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-2xl">{icon}</div>
                  <h3 className="mt-2 text-sm font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-(--nav-stack-height) border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">The Process</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">How it works</h2>
            <p className="mt-3 text-slate-600">Getting started takes less than 5 minutes.</p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['1', 'Browse & choose', "Pick a course or school level that fits your child's needs."],
              ['2', 'Book a trial', 'Attend a single paid trial class from as low as Rs. 400.'],
              ['3', 'Register & pay', 'Enrol and get instant access to your LMS dashboard.'],
              ['4', 'Join live class', 'Your teacher sends the Zoom/Meet link — learning starts!'],
            ].map(([n, title, desc], i) => (
              <div key={n} className={`hp-fade hp-fade-${i + 1} flex flex-col items-center text-center`}>
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

      {/* CTA banner */}
      <section className="border-t border-slate-200 bg-indigo-950 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to start learning?</h2>
          <p className="mt-4 text-indigo-200">
            Join thousands of Pakistani students already learning with PakTeachers. Book a trial class today — no long-term commitment required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/trial" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-slate-100">
              Book a trial class
            </Link>
            <Link to="/courses" className="rounded-lg border border-indigo-400 px-6 py-3 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-900">
              Browse all courses
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
