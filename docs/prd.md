# PRD — isitholiday.today

Programmatic-SEO site answering *"Is today a holiday in [location]?"* — modeled on calcengine.site's playbook (golden-page schema, JSON-LD coverage, OG image build pipeline, content clusters), adapted for yes/no holiday answers.

> **Key insight (mirrors calcengine):** This is not a product. It is a **search-engine surface-area generator.** Volume × structure × internal linking = SEO growth.

---

## ⚠️ Stack-level SEO gap — addressed (2026-05-01)

calcengine uses **Astro SSG**. We were on **Vite + React SPA** (one HTML shell + JS bundle), which let Googlebot in but slowed discovery and weakened link equity inside React-rendered DOM (calcengine's H1 incident: "all `/calculators` `<a>` tags lived inside a React island, Googlebot saw zero outbound links").

**Resolution:** Phase 4-A1 shipped `vite-react-ssg` (commit `452bbf6`). Every route in `PAGES` plus `/` and `/holiday-checker` now emits real static HTML at build time, with rendered H1, helmet-managed `<title>`, page-specific canonical, and meta description in the static markup. We did **not** migrate to Astro — kept in the current stack to avoid a rewrite. Migration remains a future option if growth stalls.

---

## Phase 1 — MVP (current state, 2026-04-25)

| # | Feature | Status | File(s) |
|---|---|---|---|
| 1.1 | Vite 6 + React 18 + TS + Tailwind 3 + shadcn/ui scaffold | ✅ done | root configs |
| 1.2 | Pure `getTodayHoliday()` calc with 5 Vitest tests | ✅ done | `src/lib/holiday.ts`, `src/lib/holiday.test.ts` |
| 1.3 | Holiday seed data — India + USA, 30 entries | ✅ done | `src/lib/holidays.ts` |
| 1.4 | `Calculator.tsx` widget — country/state/type selectors, ✅/❌ answer, next-holiday line | ✅ done | `src/components/Calculator.tsx` |
| 1.5 | Routes: `/`, `/holiday-checker`, `/:country`, `/:country/:state`, `*` | ✅ done | `src/App.tsx` |
| 1.6 | 9 pSEO `PAGES` entries (India, IN/Kerala, IN/Tamil-Nadu, IN bank, USA, US/CA, US/TX, US/NY, US bank) | ✅ done | `src/lib/data.ts` |
| 1.7 | `Seo` component — `<title>`, meta description, canonical, OG, Twitter | ✅ done | `src/components/Seo.tsx` |
| 1.8 | Internal links (≥6 per page) | ✅ done | `src/components/InternalLinks.tsx` |
| 1.9 | `pnpm install`/`build`/`test` clean inside docker | ✅ done | — |

---

## Phase 2 — pSEO Coverage Expansion

Mirror calcengine's "ship many pages" approach. Each new entry in `src/lib/data.ts` + matching seed rows in `src/lib/holidays.ts` = one new indexable page with zero code changes.

### 2-A. Country expansion

| # | Slug | Country | Type | Priority | Notes |
|---|---|---|---|---|---|
| 2.1 | `uk` | United Kingdom | public | High | Bank Holidays Act schedule; differs across England/Scotland/NI |
| 2.2 | `uk/scotland` | UK | public | Med | Distinct holidays (St Andrew's Day, 2nd Jan) |
| 2.3 | `uk/northern-ireland` | UK | public | Med | St Patrick's Day, Battle of the Boyne |
| 2.4 | `canada` | Canada | public | High | Federal stat holidays |
| 2.5 | `canada/ontario` | Canada | public | Med | Family Day, Civic Holiday |
| 2.6 | `canada/quebec` | Canada | public | Med | National Holiday (St-Jean-Baptiste) |
| 2.7 | `australia` | Australia | public | High | Federal + state-specific |
| 2.8 | `australia/new-south-wales` | AU | public | Med | Bank Holiday, Labour Day variants |
| 2.9 | `australia/victoria` | AU | public | Med | Melbourne Cup Day |
| 2.10 | `germany` | Germany | public | Med | Federal holidays + state variants (Bavaria etc.) |
| 2.11 | `france` | France | public | Med | 11 jours fériés |
| 2.12 | `japan` | Japan | public | Med | 16 national holidays |

### 2-B. Type expansion (per country)

| # | Slug pattern | Example | Type | Notes |
|---|---|---|---|---|
| 2.20 | `{country}/bank-holiday` | `india/bank-holiday`, `usa/bank-holiday`, `uk/bank-holiday` | bank | Already done for IN/US — extend |
| 2.21 | `{country}/school-holiday` | `india/school-holiday`, `usa/school-holiday` | school | Term-break dates per country |
| 2.22 | `{country}/{state}/bank-holiday` | `usa/california/bank-holiday` | bank | State-level variants where relevant |

### 2-C. Date-specific high-intent slugs

| # | Slug | Search intent |
|---|---|---|
| 2.30 | `is-monday-a-holiday` | Day-of-week queries |
| 2.31 | `is-friday-a-holiday` | Day-of-week queries |
| 2.32 | `next-public-holiday-india` | "next holiday" queries |
| 2.33 | `holidays-this-month-usa` | Monthly calendar intent |
| 2.34 | `is-tomorrow-a-holiday-india` | Forward-looking variant |

**Target: 50+ pSEO pages by end of Phase 2.** Each = one entry in `data.ts`, no route code.

---

## Phase 3 — Page Quality Lift (Golden Page Standard)

calcengine's "golden page" rule: every page must match `openai-cost-calculator` exactly. Define ours, then enforce.

### Golden-page checklist (per location/type page)

| Element | Requirement | Currently |
|---|---|---|
| H1 + tagline | 1–2 sentence tagline above the calculator | tagline missing |
| Calculator UI | Above the fold, immediately below H1 | ✅ |
| `lastUpdated` | "Data verified: [Month YYYY]" — freshness signal | ❌ missing |
| `intro` | 2–4 paragraphs of SEO prose **below** calculator, primary keyword in first sentence | ❌ missing |
| `howItWorks` | "How [country] holiday observances work" — 4–6 numbered steps | ❌ missing |
| `holidayCalendar` | Sortable table of all upcoming holidays in scope (replaces "formula" + "examples") | ❌ missing |
| `tips` | 4–6 actionable bullets (e.g. "Plan PTO around long weekends in 2026") | ❌ missing |
| `faq` | Exactly 5 `{question, answer}`, 40–80 words each | ❌ missing |
| Related cards | ≥3 `relatedSlugs` | ✅ (via InternalLinks) |
| Breadcrumbs | Home › Country › State (with JSON-LD) | ❌ missing |

### 3-A. Schema upgrade — `SeoPage` interface

Extend `src/lib/data.ts`:

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | `string` | yes | (existing) |
| `title` | `string` | yes | (existing) |
| `h1` | `string` | yes | (existing) |
| `description` | `string` | yes | 150–160 chars (currently shorter — fix) |
| `keywords` | `string[]` | yes | 6–8 long-tail variants, primary first |
| `tagline` | `string` | yes | NEW — 1–2 sentences above calculator |
| `directAnswer` | `string` | yes | (existing — keep) |
| `intro` | `string` | yes | NEW — 2–4 paragraphs of below-fold prose |
| `howItWorks` | `string[]` | yes | NEW — numbered steps array |
| `tips` | `string[]` | yes | NEW — 4–6 bullets |
| `faq` | `{ question, answer }[]` | yes | NEW — exactly 5 entries |
| `lastUpdated` | `string` | yes | NEW — "April 2026" |
| `dataUpdated` | `string` | yes | NEW — ISO date when holiday data verified |
| `prefill` | `{ country, state?, type? }` | yes | (existing) |
| `relatedSlugs` | `string[]` | yes | NEW — explicit (currently auto-derived) |

**Migration path:** add fields as optional first, backfill across all 9 entries, then make required.

---

## Phase 4 — SEO Infrastructure

### 4-A. Static pre-rendering — ✅ done (2026-05-01)

| # | Feature | Status | Notes |
|---|---|---|---|
| 4-A1 | `vite-react-ssg` build-time pre-rendering | ✅ done (`452bbf6`) | 11 static HTMLs in `dist/`; `dirStyle: 'nested'`; `<Head>` from vite-react-ssg handles SSR head extraction |

Astro migration deferred — only revisit if SEO growth stalls and `vite-react-ssg` proves limiting (e.g. needs MD/MDX-driven content).

### 4-B. SEO surface features

| # | Feature | Effort | Status | Source of pattern |
|---|---|---|---|---|
| 4.1 | XML sitemap generator (build-time + dev middleware, all `PAGES[].slug`) | S | ✅ done (`e476b83`) | `calcengine/src/seo/generateSitemap.ts` |
| 4.2 | `robots.txt` references sitemap URL | — | ✅ done | `public/robots.txt` |
| 4.3 | JSON-LD: `WebSite` + `SearchAction` on `/` | S | ❌ | `calcengine/src/seo/jsonLd.ts` |
| 4.4 | JSON-LD: `Organization` (with `logo`, `sameAs`) | S | ❌ | calcengine PRD C2 |
| 4.5 | JSON-LD: `WebApplication` site-wide | S | ❌ | calcengine |
| 4.6 | JSON-LD: `BreadcrumbList` on detail pages | M | ❌ | calcengine — required pattern |
| 4.7 | JSON-LD: `FAQPage` per location page | M | ❌ (blocked on Phase 3-A `faq` field) | calcengine — required when FAQ exists |
| 4.8 | JSON-LD: `Event` per holiday (date, location, name) | M | ❌ | unique to us — schema.org/Event |
| 4.9 | OG image build pipeline (Satori + `@resvg/resvg-js`) — `/og/{slug}.png` | M | ❌ | `calcengine/src/og/` |
| 4.10 | Per-page canonical URLs | — | ✅ done | `Seo.tsx` |
| 4.11 | Static fallback `<ul>` of all pages on `/all-locations` (Googlebot-friendly) | S | ❌ | calcengine H1 fix — must render outside React island |

### 4-C. Legal + E-E-A-T pages

calcengine's "Critical" SEO issues that cost them: missing legal + missing about page.

| # | Page | Path | Required content |
|---|---|---|---|
| 4.20 | Privacy Policy | `/privacy` | GDPR/CCPA compliance, cookie disclosure, contact email |
| 4.21 | Terms of Service | `/terms` | Standard ToS, no warranty, disputes |
| 4.22 | About | `/about` | Author/operator name, methodology, data sources |
| 4.23 | Footer with all links | `Layout.tsx` footer | Privacy, Terms, About, key country pages, GitHub |

---

## Phase 5 — Content Cluster Per Page (Three-Page Pattern)

calcengine generates a 3-page cluster per calculator: main + how-to + formula. Adapted for holidays:

| # | Cluster page | Route | Target keywords |
|---|---|---|---|
| 5.1 | Main: yes/no answer | `/india`, `/usa/california` | "is today a holiday in [loc]" |
| 5.2 | List: upcoming holidays | `/india/upcoming-holidays`, `/usa/california/upcoming-holidays` | "[loc] holidays 2026", "next holiday in [loc]" |
| 5.3 | Calendar: full year view | `/india/holiday-calendar-2026` | "[loc] holiday calendar 2026" |
| 5.4 | History: past holidays this year | `/india/holidays-so-far-2026` | "[loc] holidays so far 2026" |

Each cluster page reuses the same data (`HOLIDAYS`) but emphasizes a different intent.

---

## Phase 6 — Data Externalization & Freshness

calcengine's Phase 3 lesson: **don't hardcode data inside .tsx files** — extract to versioned JSON. We're currently OK (one `holidays.ts` file), but as we scale we should split.

### 6-A. Data layer split

| # | File | Contents | `lastVerified` |
|---|---|---|---|
| 6.1 | `src/data/holidays/india.json` | All India national + state holidays | yes |
| 6.2 | `src/data/holidays/usa.json` | Federal + state holidays | yes |
| 6.3 | `src/data/holidays/uk.json` | Bank Holidays Act schedule | yes |
| 6.4 | `src/data/holidays/{country}.json` | one file per country | yes |
| 6.5 | `src/lib/holidays.ts` | thin barrel that imports + types the JSON | — |

### 6-B. Freshness markers (mirrors calcengine Phase 2)

| # | Signal | Source | Where shown |
|---|---|---|---|
| 6.10 | **Code freshness** "Last updated from git at" | `git log -1 --format=%ai` on `data.ts`/`holidays.ts` at build time | Footer of each page + `dateModified` JSON-LD |
| 6.11 | **Data freshness** "Data verified" | manual `meta.dataUpdated` per `SeoPage` | Inline below calculator |

### 6-C. Ingestion pipelines (priority order)

| # | Source | Method | Why |
|---|---|---|---|
| 6.20 | India → `data.gov.in` "Holidays" dataset | scheduled CI scrape | 28 states, evolves yearly |
| 6.21 | USA → OPM federal holiday schedule | yearly manual update | federal only changes ~once/decade |
| 6.22 | UK → `gov.uk/bank-holidays.json` (official JSON API) | scheduled CI fetch | official feed exists |
| 6.23 | Canada → `canada.ca` statutory holidays | yearly manual update | — |
| 6.24 | Australia → `data.gov.au` holiday API | scheduled CI fetch | official feed exists |

Same pattern as calcengine's "OpenAI pricing scraper" — highest churn first.

---

## Phase 7 — UX & Accessibility Polish

| # | Feature | Effort | Source pattern |
|---|---|---|---|
| 7.1 | Dark mode (`localStorage` + cross-island sync) | M | calcengine `DarkModeToggle.tsx` + `ThemeContext.tsx` |
| 7.2 | Mobile-first audit (current scaffold uses `container` only) | S | shadcn defaults |
| 7.3 | ARIA labels on all interactive elements | S | calcengine standard |
| 7.4 | Keyboard navigation through Select widgets | S | Radix handles by default |
| 7.5 | Reduced-motion support | XS | tailwindcss-animate respects it |
| 7.6 | Loading states / suspense fallbacks (post-SSG) | S | — |

---

## Phase 8 — Analytics & Promotion

| # | Feature | Notes |
|---|---|---|
| 8.1 | GA4 page-view tracking | mirror `calcengine/src/analytics/ga.ts` |
| 8.2 | Search Console verification | manual |
| 8.3 | Backlink campaign — Reddit (`r/personalfinance`, `r/India`, `r/AskAnAmerican`) | calcengine playbook |
| 8.4 | Dev.to / HN: "I built a free 'is today a holiday' API" angle | "built a free tool" framing |
| 8.5 | UTM tagging for inbound campaigns | — |

---

## Constraints (mirror calcengine)

- ❌ Do **NOT** overbuild UI
- ❌ Do **NOT** block on perfection
- ❌ Do **NOT** add accounts, login, or backend before Phase 8 complete
- ✅ Ship fast, iterate later
- ✅ Prioritize SEO over design

## Definition of Done — per pSEO page

A location/type page is **complete** when:
- Static HTML emitted at build time (Phase 4-A) — Googlebot sees full content
- Golden-page schema fields all populated (Phase 3-A)
- ≥3 internal links rendered outside React island
- JSON-LD: WebPage + BreadcrumbList + FAQPage + relevant Event entries
- OG image present at `/og/{slug}.png`
- Listed in `sitemap.xml`
- `lastUpdated` + `dataUpdated` markers visible
- Cloudflare deploy green; no console errors

---

## Out of scope / don't touch

- `genai/holiday-hub/` — Lovable reference scaffold, gitignored
- The parent `sites/` `Makefile` and `dev_container.sh`
- Backend / accounts / payments — not a product

---

## Priority order (next 30 days)

✅ **Already live on `https://isitholiday.today` (auto-deploy from `main`):**
- Phase 4-A1 — `vite-react-ssg` static pre-rendering (`452bbf6`)
- Phase 4-B 4.1 — sitemap.xml at build + dev middleware (`e476b83`)
- All 11 static HTML pages indexable; deploy verified post-push.

**Remaining queue:**

1. **Phase 3-A** — extend `SeoPage` schema with `tagline`, `intro`, `howItWorks`, `tips`, `faq`, `lastUpdated`, `keywords`; backfill all 9 pages. Blocks 4.6/4.7.
2. **Phase 4-C** — privacy / terms / about pages + footer (1 day)
3. **Phase 4-B (4.3, 4.6, 4.7)** — WebSite/SearchAction + Breadcrumb + FAQPage JSON-LD (4.6/4.7 land for free once 3-A backfills)
4. **Phase 2-A** — add UK + Canada (8 more pages, quick wins via official JSON feeds)
5. **Phase 4-B 4.9** — OG image build pipeline
6. **Phase 5** — first content cluster (`/india/upcoming-holidays`, `/india/holiday-calendar-2026`)
7. **Phase 6-A** — split holidays.ts into per-country JSON

**Minor follow-up (not blocking):** trailing-slash canonical mismatch on nested routes — see `AI_AGENTS.md` "Known issues" section.

Everything beyond #8 is post-MVP scaling.
