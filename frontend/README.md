# Rich Friend — Frontend

Marketing site + client auth for a luxury personal-shopping concierge. Bilingual
(English / Arabic with full RTL), quiet-luxury editorial design.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Structure

```
src/
  app/
    (site)/           Marketing pages (landing, about, how-it-works) + shared Header/Footer
    (auth)/           Sign-in / sign-up (split-panel chrome)
    api/auth/         Auth Route Handlers (register / login / logout / me)
    layout.tsx        Root: fonts + Language/Auth providers
    globals.css       Design tokens (@theme) + utilities
  components/
    layout/           Header, Footer
    sections/         Landing views: Hero, Editorial, StylingSuite, Trust
    ui/               Reusable: CtaBand, LangToggle, Sparkles, ScrollSnap
  lib/
    dictionary.ts     EN/AR copy (single source of truth)
    LanguageContext   Language + dir handling
    AuthContext       Client auth state
    api.ts            API seam — swap to a real backend via NEXT_PUBLIC_API_URL
    server/           Mock in-memory user store + session cookie config
```

## Backend

Auth currently runs against an **in-memory mock** (`src/lib/server/mockStore.ts`),
non-persistent by design. It sits behind `src/lib/api.ts`; set `NEXT_PUBLIC_API_URL`
to point the frontend at a real backend (e.g. the Django/DRF service in the root
README) with no UI changes.
