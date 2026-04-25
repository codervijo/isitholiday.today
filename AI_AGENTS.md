# AI Agent Context — isitholiday.today

## What this project is
A programmatic-SEO site that answers one high-frequency query: *"Is today a holiday in [location]?"* — across countries, states, and holiday types (public / bank / school). Static-first, deployed to Cloudflare Pages. Goal: traffic capture via many pSEO pages, not SaaS.

## Stack — locked in
- Vite **^6.3.5** (Cloudflare Pages Wrangler refuses Vite < 6 — non-negotiable)
- React 18 + TypeScript
- `@vitejs/plugin-react-swc` ^3.11
- Tailwind 3 + shadcn/ui (Radix primitives) + lucide-react
- React Router 6
- TanStack Query 5
- react-helmet-async (head tags)
- pnpm 9 (no npm, no bun — `bun.lock`/`bun.lockb`/`package-lock.json` are gitignored)
- Vitest 3 (pure-function tests, node env)

**Do NOT use:** Astro+MUI (SSR `createTheme` crashes on CJS/ESM interop — abandoned, do not retry); `lovable-tagger` (pins Vite 5); Tailwind 4 (shadcn templates target Tailwind 3).

## Project structure
- `src/main.tsx` — `BrowserRouter` + `QueryClientProvider` + `HelmetProvider`
- `src/App.tsx` — `<Routes>`: `/`, `/holiday-checker`, `/:country`, `/:country/:state`, `*`
- `src/index.css` — Tailwind base/components/utilities + shadcn CSS variables
- `src/components/Calculator.tsx` — single source-of-truth holiday-answer widget (props for prefill)
- `src/components/Layout.tsx`, `Seo.tsx`, `NavLink.tsx`, `InternalLinks.tsx` — shared shells
- `src/components/ui/` — shadcn primitives (`button`, `card`, `input`, `label`, `select`)
- `src/lib/holiday.ts` — pure `getTodayHoliday()` calc; no UI
- `src/lib/holidays.ts` — typed holiday seed data (India + USA)
- `src/lib/data.ts` — `PAGES: SeoPage[]` (slug, title, h1, description, directAnswer, prefill). Add new pSEO pages here — no code changes
- `src/lib/utils.ts` — `cn()` helper
- `src/pages/` — `Index`, `CalculatorPage`, `SeoPageRoute`, `NotFound`
- `src/test/setup.ts` + `src/lib/holiday.test.ts`
- `public/` — robots.txt, favicon.svg
- `genai/` — Lovable reference scaffold; **gitignored**, kept on disk for reference only

## How to run
```bash
pnpm install   # update node_modules + lockfile
pnpm dev       # vite dev server on :8080
pnpm build     # production build → dist/
pnpm preview   # serve dist/ locally
pnpm test      # vitest run-once
```

The parent `sites/` Makefile + docker workflow applies (run `make buildsh` first, then `make test proj=isitholiday.today`).

## Key conventions
- All holiday math lives in `src/lib/holiday.ts` as a pure function. Calculator.tsx is a thin UI shell — never inline math in components.
- pSEO pages are data-driven via `src/lib/data.ts` + `src/pages/SeoPageRoute.tsx`. To add a page, append an entry — do not create a new route file.
- shadcn-style: `src/components/ui/` uses `class-variance-authority` + `tailwind-merge`. Primitives may use `@radix-ui/*` (Select, Label).
- Path alias `@/` maps to `src/`.
- Each rendered page must include: `<title>`, meta description, canonical, OG tags, H1, direct-answer paragraph, the calculator, and ≥3 internal links to siblings.

## Cloudflare Pages — known traps
1. **Submodule clone failure.** Cloudflare clones with `--recurse-submodules`. If any subdir has its own `.git` and is registered as gitlink (mode 160000) in this repo's index without a matching `.gitmodules`, the clone hard-fails: `"error occurred while updating repository submodules"`. Fix: gitignore the dir AND `git rm --cached <path>`. Verify with `git ls-tree -r HEAD | awk '$2 == "commit"'` (must be empty).
2. **Vite version floor.** Wrangler refuses Vite < 6. Stay on `vite ^6.x`.
3. **Frozen lockfile.** CI runs `pnpm install --frozen-lockfile`. Whenever `package.json` changes, regenerate `pnpm-lock.yaml` locally and commit it in the same change.
4. **Stale src/ from prior scaffolds.** If you swap stacks, fully clean root-owned leftovers (`node_modules`, `pnpm-lock.yaml`, `.astro`, stray `src/env.d.ts`).

## Out of scope / don't touch
- `genai/` — Lovable reference scaffold, gitignored. Don't modify or delete.
- The parent `sites/` Makefile and `dev_container.sh` — shared across all sibling projects.

## Status
- **Stack settled:** Vite 6 + React 18 + TypeScript + Tailwind 3 + shadcn/ui + pnpm.
- **Earlier dead end (do not retry):** Astro + MUI (CJS/ESM interop crash).
- **Next step:** seed more holidays into `src/lib/holidays.ts`, append more `PAGES` entries in `src/lib/data.ts`, wire Cloudflare Pages deploy.

## Goal — guiding principle
This is NOT a product. It's a high-frequency query engine. Success = coverage (many pages) × accuracy (correct daily answer) × speed (fast load). Prefer simplicity over flexibility, speed over completeness, shipping over perfection.
