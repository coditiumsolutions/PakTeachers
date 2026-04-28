# PakTeachers - Project Context

## Project Overview

**PakTeachers** is a virtual schooling platform connecting Pakistani students with certified, experienced teachers for live online classes. The website is a multi-page React app (not a single-page landing) covering academic schooling (Grades 1–12), Quran teaching, trial classes using an LMS.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 8 (uses OXC transformer — **ASCII-only in JSX strings**) |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` in `src/index.css`, `@tailwindcss/vite` plugin — no `tailwind.config.js`) |
| Routing | React Router v7 |
| Linting | ESLint 9.x with TypeScript ESLint |

> **Critical**: Vite 8's OXC transformer rejects Unicode smart/curly quotes in JSX. Always use ASCII straight quotes. Use `\uXXXX` escapes for special characters (emoji, stars, etc.) in string literals.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint across all TS/TSX files
npm run preview   # Preview the production build locally
```

No test suite is configured yet.

## Project Structure

```
pakteachers/
├── public/
│   └── logo01.png          # Brand logo (served from root)
├── src/
│   ├── assets/             # hero.png, react.svg, vite.svg (NOT the logo)
│   ├── components/
│   │   ├── PrimaryNavbar.tsx    # White top bar: logo + contact info
│   │   ├── SecondaryNavbar.tsx  # Indigo-950 bar: route links
│   │   ├── Footer.tsx           # Full footer with links & contact
│   │   ├── HeroSlider.tsx       # Auto-advancing image carousel
│   │   └── FeatureSection.tsx   # 3-card "What we offer" grid
│   ├── layouts/
│   │   └── MainLayout.tsx       # PrimaryNavbar + SecondaryNavbar + <Outlet> + Footer
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── SchoolPage.tsx
│   │   ├── CoursesPage.tsx
│   │   ├── TrialPage.tsx
│   │   ├── LMSPage.tsx
│   │   ├── SoftwareSupportPage.tsx
│   │   └── PlaceholderPage.tsx
│   ├── App.tsx              # BrowserRouter + Routes
│   ├── index.css            # Global styles + --nav-stack-height CSS var
│   └── main.tsx             # Entry point
├── index.html
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
└── eslint.config.js
```

## Architecture

### Layout & Navigation

`MainLayout` (`src/layouts/MainLayout.tsx`) wraps all routes via React Router `<Outlet>`. It stacks two fixed navbars:

- **PrimaryNavbar** (white, `h-24` mobile / `h-28` sm+): Brand logo (left) + contact info (right, hidden on mobile). **No anchor links — those were removed.**
- **SecondaryNavbar** (indigo-950, `min-h-14`, fixed below primary at `top-24` / `sm:top-28`): Route links using React Router `<Link>` with active-state highlighting.

CSS custom property `--nav-stack-height` in `src/index.css` tracks combined height:
- Mobile: `calc(6rem + 3.5rem + 2px)`
- `sm+`: `calc(7rem + 3.5rem + 2px)`

**Update this variable whenever either navbar height changes.**

Tailwind v4 canonical syntax for scroll offset: `scroll-mt-(--nav-stack-height)` (not `scroll-mt-[var(...)]`).

### Routing

| Path | Component |
|------|-----------|
| `/` | `HomePage` |
| `/school` | `SchoolPage` |
| `/courses` | `CoursesPage` |
| `/trial` | `TrialPage` |
| `/lms/*` | `LMSPage` |
| `/software-support` | `SoftwareSupportPage` |
| `/apply` | `PlaceholderPage` |
| `/find-tutor` | `PlaceholderPage` |

### SecondaryNavbar Links (in order)

Home, School, Courses, Trial Classes, Software Support, LMS, Apply, Find Tutor

### PrimaryNavbar

- **Left**: Logo (`/logo01.png`) as `<a href="/">` (not a React Router Link)
- **Right**: Contact info block (`hidden sm:flex flex-col items-end gap-1.5 text-sm`)
  - Phone: `+92 123 456 7890` (`tel:+921234567890`) with phone SVG icon
  - Email: `info@pakteachers.com` (`mailto:info@pakteachers.com`) with envelope SVG icon
  - Icons use `text-indigo-950`, `strokeWidth={1.75}`, Heroicons-style paths

### HomePage Structure

`src/pages/HomePage.tsx` composes:
1. `<HeroSlider />` — full-width image carousel, 6s auto-advance, prev/next buttons, dot indicators, `aria-live`
2. Stats bar (indigo-950) — 4 stats: 10,000+ Students, 100+ Teachers, 4.9★ Rating, 50+ Courses
3. `<FeatureSection />` — 3-column "What we offer" cards (Quran Teaching, Academic Schooling, Trial Classes)
4. `#about` section — About PakTeachers with 4 feature tiles
5. `#how-it-works` section — 4-step numbered process
6. CTA banner (indigo-950) — "Ready to start learning?" with links to `/trial` and `/courses`

### CoursesPage

12 courses defined in a `courses` array. Category filter (All / Quran / Academic). Grid of course cards with pricing, features, ratings. "Why Choose Us" benefits section. Enrolment form at bottom.

### Footer

Four-column layout:
- Col 1 (lg:col-span-1): Logo + tagline + contact info (email, phone, address, hours)
- Col 2: Quick Links (School, Courses, Trial Classes, Software Support, LMS)
- Col 3: Support links (Help Center, FAQ, Contact Us, Privacy Policy, Terms)
- Col 4: Social (Facebook, Twitter, Instagram, YouTube)
- Bottom bar: copyright + "Built with React & Tailwind CSS"

## Business Information

- **Location**: Lahore, Pakistan
- **Phone**: +92 123 456 7890
- **Email**: info@pakteachers.com
- **Hours**: Mon – Sat: 9 AM – 6 PM
- **Offerings**: Quran (Nazira, Tajweed, Hifz, Tafseer), Academic (Grades 1–12, all major subjects)
- **Delivery**: Live via Zoom / Google Meet, small class sizes, LMS dashboard for progress tracking
- **Trial class**: from Rs. 400, no commitment

## TypeScript Configuration

- Strict mode enabled
- `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`: all true
- Target: ES2023, Module: ESNext, JSX: react-jsx, ModuleResolution: bundler, noEmit: true

## CSS / Tailwind Notes

- Tailwind v4: no config file, just `@import "tailwindcss"` — utility classes are auto-detected
- Color palette used: `slate-*`, `indigo-950`, `indigo-800/900`, `emerald-*`, `green-*`
- `scroll-mt-(--nav-stack-height)` for sections that need scroll-offset (Tailwind v4 canonical shorthand)
- `pt-[var(--nav-stack-height)]` on `<main>` to push content below fixed navbars
