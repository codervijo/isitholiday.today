# Prompt History

<!-- Append new prompts at the bottom, newest last. Format:
## YYYY-MM-DD
> <prompt text>
-->

## 2026-04-25 — Initial AI_AGENTS.md (Astro/JSX/MUI direction, later abandoned)
> isitholiday.today is a programmatic SEO project answering "Is today a holiday in [location]?" Stack: Astro + React JSX + pnpm + minimal CSS / MUI; no backend; deploy to Cloudflare Pages. Pages data-driven from `src/lib/pages.json`; holidays from `src/lib/holidays.json`; core logic `getTodayHoliday()` in `src/lib/holiday.js`; dynamic routing via `src/pages/[...slug].astro`. India + USA first. Mandatory above-the-fold: H1, ✅/❌ answer, visible date. NO backend, NO overengineering, NO complex UI.

**Outcome:** Superseded same day by the locked-stack prompt below — Astro+MUI was already a known dead end (CJS/ESM interop crash with `createTheme` under SSR).

## 2026-04-25 — Locked-stack pSEO calculator scaffold prompt (the one we built against)
> You are a senior full-stack engineer. Build a programmatic-SEO calculator site about {TOPIC} (e.g. "solar panel cost", "heat pump cost", "mortgage payoff"). Domain: {DOMAIN}. Static-first, deployable to Cloudflare Pages.
>
> ## Stack — locked in (these are the only versions known to work end-to-end)
> - Vite ^6.3.5  (Cloudflare Pages Wrangler refuses Vite < 6 — non-negotiable)
> - React 18 + TypeScript
> - @vitejs/plugin-react-swc ^3.11
> - Tailwind 3 + shadcn/ui (Radix primitives) + lucide-react
> - React Router 6
> - TanStack Query 5 (already idiomatic in the shadcn ecosystem)
> - pnpm (delete any bun.lock / bun.lockb / package-lock.json)
> - Vitest 3 for unit tests
>
> Do NOT use: Astro+MUI (SSR createTheme crashes on CJS/ESM interop), lovable-tagger (pins Vite 5, dev-only Lovable artifact, drop it), Tailwind 4 (shadcn templates target Tailwind 3).
>
> ## Project shape
> ```
> /
>   package.json            "packageManager": "pnpm@9.12.0"
>   vite.config.ts          react-swc + path alias "@" → ./src
>   tailwind.config.ts      shadcn defaults
>   tsconfig.json + app/node split
>   index.html
>   /public                 robots.txt, favicon
>   /src
>     main.tsx              BrowserRouter + QueryClientProvider
>     App.tsx               <Routes>
>     index.css             tailwind base/components/utilities
>     /components
>       Calculator.tsx      single source-of-truth calculator (props for prefill)
>       Layout.tsx, Seo.tsx (react-helmet-style head), NavLink.tsx, InternalLinks.tsx
>       /ui                 shadcn primitives (Button, Card, Input, Slider, Select, etc.)
>     /lib
>       {topic}.ts          pure calculation function + types
>       data.ts             pSEO entries: { slug, title, h1, description, directAnswer, ...prefill }
>       utils.ts            cn() helper
>     /pages
>       Index.tsx           landing + calculator + popular slugs
>       CalculatorPage.tsx  /{topic}-calculator dedicated route
>       SeoPageRoute.tsx    reads slug → looks up data.ts → renders Calculator with prefilled props
>       NotFound.tsx
>     /test                 setup.ts + at least one test for the calc fn
> ```
>
> Routes: "/", "/{topic}-calculator", and one dynamic "/:slug" backed by data.ts.
>
> Each page must render: <title>, meta description, canonical, OG tags, H1, a short direct-answer paragraph, the calculator, and ≥3 internal links to siblings.
>
> ## Cloudflare Pages hygiene — avoid the traps that bit voltloop
>
> 1. If a Lovable/scaffold dir was dropped under this repo and has its OWN .git inside it: gitignore the dir AND run `git rm --cached <dir>` to drop the gitlink (mode 160000) from the index. With no .gitmodules, Cloudflare's --recurse-submodules clone will hard-fail at "updating repository submodules". Verify after: `git ls-tree -r HEAD | awk '$2 == "commit"'` must be empty.
> 2. Do not commit with `git add .` blindly while a `git rm --cached` is staged — re-adds resurrect the gitlink. Always `git status` before commit.
> 3. If a docker dev server is locking files as root (e.g. `make check-vite proj=...`), stop it before scaffolding — otherwise rsync/cp into src/ silently no-ops.
> 4. .gitignore must include: node_modules, dist, .vite, bun.lock, bun.lockb, any reference-only scaffold dirs (e.g. `genai/`).
>
> ## Calculator math
>
> Put a pure `calculate{Topic}({...inputs})` function in src/lib/{topic}.ts that returns a result object. Cover it with one Vitest test. The Calculator component is a thin UI shell over this function — never inline math in components.
>
> ## SEO data file (data.ts)
>
> Export `pages: SeoPage[]` with at least 8 entries that each have a unique slug and prefill values for the calculator. SeoPageRoute looks up by slug. Future pages = append to the array, no code changes.
>
> ## Acceptance — must pass before declaring done
>
> - `pnpm install` clean (no peer warnings beyond known-harmless)
> - `pnpm build` produces dist/ with zero errors
> - `pnpm dev` opens, calculator renders, sliders/inputs work, output updates live
> - `pnpm test` green
> - `git ls-tree -r HEAD | awk '$2 == "commit"'` is empty (no stray gitlinks)
> - Commit + show diff; do NOT push without explicit approval
>
> ## Output style
>
> Generate a complete, runnable scaffold — no placeholders, no TODOs, no partial files. Brief commentary only. Match the file tree above exactly.

**Adaptations for isitholiday.today:**
- "Calculator" naming kept, but the widget gives a yes/no holiday answer, not a numeric calculation. Pure function is `getTodayHoliday()` in `src/lib/holiday.ts`.
- Topic-route is `/holiday-checker` (not `/holiday-calculator`, which reads awkwardly for a yes/no app).
- Two dynamic routes (`/:country` and `/:country/:state`) instead of one flat `/:slug`, to support nested location paths like `/india/kerala`.

## 2026-04-25 — New pSEO Holiday Page Definition Prompt

Use this prompt when adding a new entry to `src/lib/data.ts` (a new country, state, or holiday-type page). Modeled on calcengine.site's "New Calculator Definition Prompt", adapted for yes/no holiday answers.

---

Add a new pSEO page entry to `src/lib/data.ts` for **{LOCATION_OR_TYPE}**.

**Slug:** `{country}` or `{country}/{state}` or `{country}/{type}-holiday` — kebab-case
**Primary keyword:** `is today a holiday in {location}` (e.g. `is today a holiday in canada`)
**Secondary keywords:** `{location} holidays 2026`, `{location} bank holidays`, `next holiday in {location}`

### Layout rule — answer first

This is a yes/no answer site, not a blog post. The yes/no result + date must appear **above the fold**, immediately under H1. SEO content lives **below** the calculator.

Page layout:
1. Breadcrumbs (Home › Country › State)
2. H1 + tagline (1–2 sentences) — above fold
3. Calculator widget with prefilled `country/state/type`
4. `lastUpdated` + `dataUpdated` freshness markers
5. `intro` — 2–4 paragraphs of below-fold prose
6. `howItWorks` → Holiday Calendar table → `tips` → `faq` → Related cards

### `SeoPage` fields to populate

- `slug` — kebab-case path. No leading `/`. May contain one `/` for nested routes.
- `title` — 50–60 chars, format: `Is Today a Holiday in {Location}? — isitholiday.today`. Primary keyword in first 6 words.
- `h1` — `Is Today a Holiday in {Location}?` Same as title (or close).
- `description` — **150–160 chars**. Action-oriented, primary keyword in first 11 words, no trailing punctuation. Used for `<meta description>` and OG card.
- `keywords` — 6–8 long-tail variants, lowercase, primary keyword first.
- `tagline` — **1–2 sentences only**, shown above the calculator. State exactly what the page answers. No marketing fluff.
- `directAnswer` — 1–2 sentences combining "what the page answers" + "scope". Renders directly under H1.
- `intro` — 2–4 paragraphs, below the calculator. First sentence must contain the primary keyword. Cover: who observes these holidays, why it matters, what counts as "public"/"bank"/"school" in this country.
- `howItWorks` — array of 4–6 numbered-step strings explaining how holiday observance works in this country (e.g. "1. Federal holidays are gazetted by [body]. 2. State governments add their own. 3. Banks follow [agency]'s schedule…").
- `tips` — 4–6 actionable bullet strings ("Plan PTO around long weekends", "Note that Diwali date varies year-to-year", etc.). Each tip should save the user time or money.
- `faq` — exactly 5 `{ question, answer }` items. Each answer 40–80 words. Questions should match search intent: "Is [X] a public holiday in [country]?", "How many holidays does [country] observe?", "Are banks open on [holiday]?", "What's the next public holiday in [country]?", "Do schools close on [holiday]?"
- `lastUpdated` — `"April 2026"` (month + year string, used in title-suffix and freshness UI).
- `dataUpdated` — ISO date `YYYY-MM-DD` of when the underlying holiday entries in `holidays.ts` were last verified against the official source.
- `prefill` — `{ country, state?, type? }` — drives the Calculator widget defaults.
- `relatedSlugs` — 2–3 slugs of existing pSEO pages in `data.ts`. Prioritize same-country (state pages, type pages), then sibling country.

### Holiday-data check

Before adding the SEO page, verify `src/lib/holidays.ts` (or `src/data/holidays/{country}.json` once Phase 6-A is done) has at least 8 entries for this country/state/type, covering all four quarters of the current year. If not, add them first — citing the official source (gov.in, opm.gov, gov.uk/bank-holidays.json, canada.ca, data.gov.au).

### SEO rules checklist

- [ ] `tagline` is ≤2 sentences and renders above the calculator
- [ ] `intro` is below the calculator, ≥150 words, primary keyword in first sentence
- [ ] `title` 50–60 chars, primary keyword in first 6 words
- [ ] `description` is 150–160 chars
- [ ] `faq` has exactly 5 items with 40–80 word answers
- [ ] `lastUpdated` and `dataUpdated` are both set
- [ ] `relatedSlugs` has 2–3 entries pointing at real `PAGES[].slug` values
- [ ] `holidays.ts` has ≥8 entries covering this scope, sourced from an official URL noted in commit message
- [ ] After build: page appears in `sitemap.xml`, JSON-LD validates, OG image renders at `/og/{slug}.png`

### Output

Append one `SeoPage` literal to the `PAGES` array in `src/lib/data.ts`. No other code changes.

## 2026-05-01 — Phase 4-A1: SPA → static HTML pre-rendering via vite-react-ssg

> Wire `vite-react-ssg` so every route emits real static HTML at build time. Until this ships, Googlebot sees an empty React shell on every route — this is the Phase 4-A1 blocker called out in `docs/prd.md` "Priority order (next 30 days)".
>
> Approach: install `vite-react-ssg`, switch from `BrowserRouter` JSX `<Routes>` to a data-router `routes` array, declare `getStaticPaths` for the two dynamic routes (`/:country` and `/:country/:state`), derived from `PAGES` slugs in `src/lib/data.ts`. Use `<Head>` from `vite-react-ssg` (a React Helmet wrapper with proper SSR head extraction) instead of `<Helmet>` from `react-helmet-async` directly. Set `ssgOptions: { dirStyle: 'nested', script: 'async' }` for Cloudflare-friendly `/path/index.html` output. Keep `dev: vite` (CSR) so local dev stays simple; production build is `tsc -b && vite-react-ssg build`. All install/build/test must run inside the parent `sites1` Docker image — never host pnpm.
>
> Acceptance:
> - `dist/` contains real `.html` files for every `PAGES[]` slug plus `/`, `/holiday-checker`, with rendered H1 and direct-answer text in the static markup.
> - Each page has exactly one helmet-managed `<title>`, a page-specific canonical, and a page-specific meta description.
> - `pnpm test` green.
> - `pnpm dev` still works.

**Outcome:** 11 static HTML files emitted (`/`, `/holiday-checker/`, `/india/`, `/usa/`, plus 7 nested state/type pages). Each carries a unique helmet `<title>`, canonical, and meta description. The `<Head>` wrapper handles SSR head extraction natively — no manual `helmetContext` wiring needed. `dirStyle: 'nested'` places each route at `path/index.html` so Cloudflare Pages serves clean URLs without rewrites.

**Files touched:** `package.json` (build script + dep), `vite.config.ts` (ssgOptions + types reference), `index.html` (drop static title/desc, helmet owns them), `src/main.tsx` (`ViteReactSSG({ routes })`), `src/App.tsx` (routes array with Root that wraps QueryClientProvider + Layout/Outlet), `src/components/Seo.tsx` (`<Head>` instead of `<Helmet>`).

**Gotcha logged:** `tsc` doesn't pick up `vite-react-ssg`'s `declare module 'vite'` augmentation through `defineConfig` alone — add `/// <reference types="vite-react-ssg" />` at the top of `vite.config.ts` or build fails with "ssgOptions does not exist on UserConfigExport".

## 2026-05-01 — Phase 4-B 4.1: build-time sitemap.xml + robots.txt crawl surface

> Now that 4-A1 emits real static HTML, get Google crawling: generate `dist/sitemap.xml` at build time and ship a sitemap-aware `robots.txt`. This is task 4.1 from PRD Phase 4-B, pulled forward ahead of Phase 3-A so Googlebot has something to index while we work on schema depth.
>
> Approach: hook `vite-react-ssg`'s `ssgOptions.onFinished(dir)` callback in `vite.config.ts` to walk `dist/` for `**/index.html`, derive canonical URLs (no trailing slash except `/`, matching what `Seo.tsx` writes for `<link rel="canonical">`), and emit a sitemaps.org-spec XML with `<lastmod>` (build date) + `<changefreq>daily</changefreq>` per entry. Self-correcting — any new `PAGES` entry that ships static HTML lands in the sitemap automatically without further code changes. `public/robots.txt` already pointed at `https://isitholiday.today/sitemap.xml`, so Vite's static-asset copy ships it to `dist/robots.txt` for free.
>
> Acceptance:
> - `dist/sitemap.xml` exists with the sitemaps.org namespace and lists exactly the routes emitted as HTML.
> - `dist/robots.txt` allows all crawlers and references the sitemap URL.
> - Tests in `ssg-output.seo.test.ts` assert both files are well-formed and the URL set matches `[/, /holiday-checker, ...PAGES[].slug]` exactly.

**Outcome:** 11 URLs in `sitemap.xml`, sorted alphabetically, all canonical-form. 4 new SEO tests added (51 total in `pnpm test:seo`). No new dependencies — uses Node's built-in `fs.readdirSync({ recursive: true })` (Node 18.17+).
