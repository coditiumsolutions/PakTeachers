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

- **PrimaryNavbar** (white, `h-24`/`sm:h-28`) — brand logo + anchor links (`#home`, `#about`, `#services`, `#contact`) with a hamburger menu on mobile
- **SecondaryNavbar** (indigo-950, `min-h-14`) — route links using React Router `<Link>`, with active-state highlighting

Because both navbars are `position: fixed`, a CSS custom property `--nav-stack-height` is defined in [src/index.css](src/index.css) to track the combined height (`6rem + 3.5rem + 2px` on mobile, `7rem + 3.5rem + 2px` on `sm+`). Every section that needs scroll offset uses `scroll-mt-[var(--nav-stack-height)]`. The main content area is padded with `pt-[var(--nav-stack-height)]`. **Update this variable if either navbar height changes.**

### Routing

All routes are nested under `MainLayout` in [src/App.tsx](src/App.tsx). Non-implemented routes render `<PlaceholderPage title="...">`. Current routes:

| Path | Component |
|------|-----------|
| `/` | `HomePage` |
| `/school`, `/courses`, `/trial`, `/lms/*`, `/apply`, `/find-tutor` | `PlaceholderPage` |

### HomePage Structure

[src/pages/HomePage.tsx](src/pages/HomePage.tsx) composes:
1. `HeroSlider` — full-width image carousel with auto-advance (6 s), prev/next buttons, dot indicators, and `aria-live` for accessibility. Slides are defined as a `const` array at the top of [src/components/HeroSlider.tsx](src/components/HeroSlider.tsx).
2. `FeatureSection` — 3-column card grid (collapses to 1 on mobile). Cards are a `const` array at the top of the file.
3. Placeholder `<section>` blocks for `#about`, `#products`, `#blog`, `#login` anchor targets.

### Logo

The logo is served from `/logo01.png` (public directory). The `src/assets/` folder contains `hero.png`, `react.svg`, and `vite.svg` but the logo itself lives in `public/`.

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
