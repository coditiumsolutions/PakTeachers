import { HeroSlider } from '../components/HeroSlider'
import { FeatureSection } from '../components/FeatureSection'

export function HomePage() {
  return (
    <>
      <HeroSlider />
      <FeatureSection />
      <section id="about" className="scroll-mt-[var(--nav-stack-height)] border-t border-slate-200 bg-slate-100 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">About</h2>
          <p className="mt-4 max-w-3xl text-slate-600">
            Placeholder section so primary nav anchors (About, Contact) have a target. Replace with your story,
            team, or mission.
          </p>
        </div>
      </section>
      <section id="products" className="scroll-mt-[var(--nav-stack-height)] py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm text-slate-500">
            Secondary nav “Products” scrolls here. Add catalog or listings when needed.
          </p>
        </div>
      </section>
      <section id="blog" className="scroll-mt-[var(--nav-stack-height)] border-t border-slate-200 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm text-slate-500">Anchor for Blog — link to posts or a listing page.</p>
        </div>
      </section>
      <section id="login" className="scroll-mt-[var(--nav-stack-height)] border-t border-slate-200 bg-slate-50 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm text-slate-500">Anchor for Login — replace with auth UI or route.</p>
        </div>
      </section>
    </>
  )
}
