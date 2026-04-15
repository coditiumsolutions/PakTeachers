import { useCallback, useEffect, useState } from 'react'

const slides = [
  {
    id: 1,
    title: 'Build faster with modern tools',
    subtitle: 'Placeholder headline for your hero slide.',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 2,
    title: 'Clean, minimal interfaces',
    subtitle: 'Another slide with dummy copy and imagery.',
    image:
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 3,
    title: 'Responsive by default',
    subtitle: 'Carousel auto-advances; use arrows to navigate manually.',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
  },
] as const

const AUTO_MS = 6000

export function HeroSlider() {
  const [index, setIndex] = useState(0)
  const count = slides.length

  const go = useCallback((dir: -1 | 1) => {
    setIndex((i) => (i + dir + count) % count)
  }, [count])

  useEffect(() => {
    const t = window.setInterval(() => go(1), AUTO_MS)
    return () => window.clearInterval(t)
  }, [go])

  const active = slides[index]

  return (
    <section
      id="home"
      className="relative w-full scroll-mt-(--nav-stack-height) overflow-hidden bg-slate-900"
    >
      <div className="relative aspect-16/10 min-h-70 max-h-140 w-full md:aspect-21/9 md:min-h-90">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? 'z-10 opacity-100' : 'z-0 opacity-0'
            }`}
            aria-hidden={i !== index}
          >
            <img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end px-4 pb-12 pt-24 sm:px-6 md:px-8 lg:mx-auto lg:max-w-6xl lg:px-6">
              <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-3 max-w-xl text-base text-slate-200 sm:text-lg">{slide.subtitle}</p>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-slate-900 shadow-lg backdrop-blur transition hover:bg-white md:left-6"
          aria-label="Previous slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-slate-900 shadow-lg backdrop-blur transition hover:bg-white md:right-6"
          aria-label="Next slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        Slide {index + 1} of {count}: {active.title}
      </span>
    </section>
  )
}
