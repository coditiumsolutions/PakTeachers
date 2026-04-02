# PakTeachers - Project Context

## Project Overview

**PakTeachers** is an online schooling website built with **React 19**, **TypeScript**, and **Vite**. It serves as a landing page for an educational platform offering various learning programs including general schooling, courses, Quran teaching, trial classes, and a Learning Management System (LMS).

### Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 19.2.4 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 8.0.1 |
| Styling | Custom CSS (CSS Variables) |
| Linting | ESLint 9.x with TypeScript ESLint |

### Project Structure

```
pakteachers/
├── public/
│   ├── favicon.svg      # Site favicon
│   └── icons.svg        # SVG icon sprites
├── src/
│   ├── assets/          # Static assets (images, etc.)
│   ├── App.tsx          # Main application component
│   ├── App.css          # Component-specific styles
│   ├── index.css        # Global styles
│   └── main.tsx         # Application entry point
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tsconfig.app.json    # App-specific TS config
├── tsconfig.node.json   # Node-specific TS config
├── vite.config.ts       # Vite configuration
└── eslint.config.js     # ESLint configuration
```

## Building and Running

### Prerequisites

- Node.js (latest LTS recommended)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

### Production Build

Build for production:

```bash
npm run build
```

This runs TypeScript compilation followed by Vite build.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint:

```bash
npm run lint
```

## Development Conventions

### TypeScript Configuration

- **Strict mode enabled** - All strict type-checking options are on
- **Target**: ES2023
- **Module**: ESNext
- **JSX**: react-jsx
- **Module Resolution**: bundler
- **No emit**: true (Vite handles bundling)

Key compiler options:
- `noUnusedLocals`: true
- `noUnusedParameters`: true
- `noFallthroughCasesInSwitch`: true
- `noUncheckedSideEffectImports`: true

### ESLint Configuration

The project uses a flat ESLint config with:
- `@eslint/js` - Recommended JS rules
- `typescript-eslint` - TypeScript-specific rules
- `eslint-plugin-react-hooks` - React Hooks linting
- `eslint-plugin-react-refresh` - Vite-specific React refresh rules

### CSS Styling

- **Custom CSS with CSS Variables** - Not using any CSS framework
- **CSS Variables** defined in `:root` for theming:
  - `--primary`: #059669 (Emerald green)
  - `--primary-dark`: #047857
  - `--primary-light`: #10b981
  - `--secondary`: #f59e0b (Amber)
  - `--secondary-dark`: #d97706
- **Responsive design** with breakpoints at 1024px and 768px
- **Edge-to-edge sections** with internal padding (40px default)

### Code Style

- **Functional components** with React Hooks
- **TypeScript** for type safety
- **Semantic HTML** with proper ARIA attributes
- **Mobile-first responsive design**
- **Section-based page structure** with anchor navigation

## Application Features

### Landing Page Sections

1. **Header** - Fixed navigation with logo and links (School, Courses, Quran Teaching, Trial Classes, LMS)
2. **Hero** - Main banner with stats (10,000+ Students, 500+ Teachers, 100+ Courses)
3. **Features** - 4-card grid highlighting key benefits
4. **About** - School description with image placeholder
5. **Courses** - 4-course grid (Mathematics, Science, English Literature, Computer Science)
6. **Quran Teaching** - Feature list with enrollment CTA
7. **Trial Classes CTA** - Full-width call-to-action section
8. **LMS** - Learning Management System overview
9. **Footer** - Links, contact info, and copyright

### Navigation

- Smooth scroll behavior enabled via CSS
- Anchor-based navigation (#school, #courses, #quran, #trial, #lms)
- Mobile hamburger menu for responsive design

## Notes

- This is a **landing page prototype** - backend integration and dynamic content loading are not implemented
- Placeholder emoji icons are used for visual elements
- Lorem ipsum text is used for content placeholders
- The project is configured for Vite's development server and does not include server-side rendering (SSR)
