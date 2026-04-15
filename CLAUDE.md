# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint across all TS/TSX files
npm run preview   # Preview the production build locally
```

No test suite is configured yet.

## Tech Stack

- **React 19** + **TypeScript 5.9** via **Vite 8**
- **Tailwind CSS v4** (imported as `@import "tailwindcss"` in [src/index.css](src/index.css); integrated via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed)
- **React Router v7** for client-side routing

## Architecture

### Layout & Navigation

The app uses a single layout wrapper ([src/layouts/MainLayout.tsx](src/layouts/MainLayout.tsx)) rendered by React Router's `<Outlet>`. It stacks two fixed navbars at the top:

- **PrimaryNavbar** (white, `h-24`/`sm:h-28`) — brand logo (left) + contact info block: phone and email with SVG icons (right, hidden on mobile via `hidden sm:flex`). No anchor links, no hamburger menu.
- **SecondaryNavbar** (indigo-950, `min-h-14`, fixed at `top-24`/`sm:top-28`) — route links using React Router `<Link>`, with active-state highlighting

Because both navbars are `position: fixed`, a CSS custom property `--nav-stack-height` is defined in [src/index.css](src/index.css) to track the combined height (`6rem + 3.5rem + 2px` on mobile, `7rem + 3.5rem + 2px` on `sm+`). Every section that needs scroll offset uses `scroll-mt-(--nav-stack-height)` (Tailwind v4 canonical shorthand — not `scroll-mt-[var(...)]`). The main content area is padded with `pt-[var(--nav-stack-height)]`. **Update this variable if either navbar height changes.**

### Routing

All routes are nested under `MainLayout` in [src/App.tsx](src/App.tsx). Current routes:

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

### HomePage Structure

[src/pages/HomePage.tsx](src/pages/HomePage.tsx) composes:
1. `HeroSlider` — full-width image carousel with auto-advance (6 s), prev/next buttons, dot indicators, and `aria-live` for accessibility. Slides are defined as a `const` array at the top of [src/components/HeroSlider.tsx](src/components/HeroSlider.tsx).
2. Stats bar — 4 stats (10,000+ Students, 100+ Teachers, 4.9★ Rating, 50+ Courses) on indigo-950 background.
3. `FeatureSection` — 3-column card grid (collapses to 1 on mobile). Cards are a `const` array at the top of the file.
4. `#about` section — About PakTeachers copy with a 2×2 feature tile grid.
5. `#how-it-works` section — 4-step numbered process.
6. CTA banner — "Ready to start learning?" with links to `/trial` and `/courses`.

### Logo

The logo is served from `/logo01.png` (public directory). The `src/assets/` folder contains `hero.png`, `react.svg`, and `vite.svg` but the logo itself lives in `public/`.