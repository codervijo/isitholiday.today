# PRD — isitholiday.today

Programmatic-SEO site answering *"Is today a holiday in [location]?"* — modeled on calcengine.site's playbook (golden-page schema, JSON-LD coverage, OG image build pipeline, content clusters), adapted for yes/no holiday answers.

> **Key insight (mirrors calcengine):** This is not a product. It is a **search-engine surface-area generator.** Volume × structure × internal linking = SEO growth.

*(2026-11-23: v2.G Holiday closure pages inserted; the old v2.G–v2.L are now v2.H–v2.M.)*

*(2026-10-05: v2.F Date correctness and v2.G Answer-engine pages inserted; the old v2.F–v2.J are now v2.H–v2.L.)*

*(Renumbered 2026-09-25 from `Phase 1–9` / `4-A` / `4.12` to the canonical two-level `vN.X` scheme. Old IDs survive as lineage markers on the rows that replaced them. Commits and `docs/Prompts.md` entries before this date use the old IDs.)*

---

## 1. Problem

People need a fast, correct yes/no answer to *"is today a holiday in [country / state]?"* — for public, bank, and school holidays — without digging through government calendars.

## 2. Users

<Who's the target user? What do they care about? Roughly how many
exist? What's their willingness to pay / engage?>

## 3. Goals & non-goals

**Goals:**
- High-frequency query engine: success = coverage (many pages) × accuracy (correct daily answer) × speed (fast load).
- Prefer simplicity over flexibility, speed over completeness, shipping over perfection.
- Prioritize SEO over design.

**Non-goals:**
- ❌ Overbuilt UI
- ❌ Blocking on perfection
- ❌ Accounts, login, or backend before v5.C is complete
- ❌ Payments / SaaS — not a product

## 4. Versions

Two-level versioning convention (canonical: `sites/portfolio/AI_AGENTS.md`):

- `vN` = major capability tier; SemVer-MAJOR semantics.
- `vN.X` = phase letter within a tier; `vN.A` is always kickoff / decisions lock.

| Version | Theme | Acceptance |
|---|---|---|
| v1 | MVP | India + USA answer widget, 9 pSEO pages, builds clean in docker |
| v2 | Indexability | Google crawls and indexes every page: static HTML, clean canonicals, no orphans, golden-page content, legal pages, structured data |
| v3 | Coverage | US institution closure coverage (banks, USPS, federal, NYSE, state DMV/courts), then 50+ pSEO pages across countries, holiday types, date intents, and content clusters |
| v4 | Data freshness | Holiday data externalized to per-country JSON with verified freshness markers and ingestion pipelines |
| v5 | Polish & promotion | UX / a11y polish, analytics, backlink campaigns |

## 5. Phases

| Phase | Theme | Features | Status |
|---|---|---|---|
| **v1.A** | Kickoff / decisions lock | Stack locked: Vite 6 + React 18 + TS + Tailwind 3 + shadcn/ui + pnpm; Astro+MUI abandoned | ✅ |
| **v1.B** | MVP build | Scaffold, pure holiday calc, seed data, calculator widget, routes, 9 pages, `Seo`, internal links | ✅ |
| **v2.A** | Kickoff / decisions lock | Index-repair diagnosis + fix list planned into phases (`c5ef243`, 2026-09-15) | ✅ |
| **v2.B** | Static pre-rendering | `vite-react-ssg` build-time HTML (`452bbf6`) | ✅ |
| **v2.C** | Crawl surface | `sitemap.xml` generator + sitemap-aware `robots.txt` (`e476b83`) | ✅ |
| **v2.D** | Trailing-slash URLs | Canonicals / sitemap / internal links / JSON-LD slashed (`e18f8ec`) | ✅ |
| **v2.E** | Crawl plumbing fixes | Internal-link starvation, `meta robots`, JSON-LD URL = canonical, real 404 | ✅ |
| **v2.F** | Date correctness | Per-scope timezone "today", build-time clock shared by SSR + hydration, scheduled rebuild Worker, HTML cache headers (`f270838`, live 2026-10-05) | ✅ |
| **v2.G** | Holiday closure pages | One page per remaining 2026 US holiday (Christmas Eve, Christmas, New Year's Eve, New Year's Day): federal / Federal Reserve / Post Office / mail status, sourced | ✅ built 2026-11-23 |
| **v2.H** | Answer-engine pages | 7 US "today" intents: what holiday is today, tomorrow, next holiday, federal, post office, mail, banks | ✅ built 2026-11-23 |
| **v2.I** | Index repair ops | IndexNow ping, sitemap resubmit, per-URL indexing requests (operator-run) | planned |
| **v2.J** | Golden-page content | `SeoPage` schema extension + backfill all 9 pages; `/holiday-checker/` fate | planned |
| **v2.K** | Legal + E-E-A-T | Privacy, Terms, About, footer links | planned |
| **v2.L** | Structured data | WebSite/SearchAction, Organization, WebApplication, Breadcrumb, FAQPage, Event; `/all-locations` | planned |
| **v2.M** | Repo & docs hygiene | Deploy-config contradiction, placeholders, `lamill.toml`, growth log, `.env.example` | planned |
| **v3.A** | Kickoff / decisions lock | Lock institution × holiday matrix, slug patterns, one source per institution, intent → URL map (no cannibalization); country order | ✅ 2026-11-25 (ran before v2.I) |
| **v3.B** | Tomorrow variants + retitles | banks-open-tomorrow, mail-tomorrow (tomorrow-bank-holiday intent); `/usa/bank-holiday/` takes "is today a bank holiday"; retitle `/post-office-open-today/` to absorb "postal holiday" | ✅ built 2026-11-25 |
| **v3.C** | Institution × holiday pages | Each US federal holiday × banks / USPS / federal offices / stock market (NYSE); v2.G page pattern; low-KD first (e.g. Veterans Day) | ✅ built 2026-11-25 |
| **v3.D** | Annual calendars + downloads | 2027 US federal holiday calendar page; ICS + PDF downloads | ✅ built 2026-11-25 |
| **v3.E** | Religious holiday checker | "What religious holiday is today" — after a source is locked in v3.A | ✅ built 2026-11-26 |
| **v3.F** | State institutions | DMV, state courts, state offices for CA / TX / NY first; per-state official sources | ✅ built 2026-11-26 (TX/NY gaps open) |
| **v3.G** | UK + Canada | 6 country/region pages via official feeds | planned |
| **v3.H** | OG images | Satori + resvg build pipeline, `/og/{slug}.png` | planned |
| **v3.I** | First content cluster | `/india/upcoming-holidays`, `/india/holiday-calendar-2026` | planned |
| **v3.J** | More countries | Australia, Germany, France, Japan | planned |
| **v3.K** | Holiday-type pages | bank / school pages per country and state | planned |
| **v3.L** | Date-intent pages | day-of-week, next-holiday, this-month, tomorrow slugs | planned |
| **v4.A** | Kickoff / decisions lock | Lock JSON schema + ingestion cadence | planned |
| **v4.B** | Data layer split | `holidays.ts` → per-country JSON | planned |
| **v4.C** | Freshness markers | git-derived code freshness + manual data-verified date | planned |
| **v4.D** | Ingestion pipelines | Scheduled/manual fetches from official sources | planned |
| **v5.A** | Kickoff / decisions lock | Lock analytics + promotion plan | planned |
| **v5.B** | UX & accessibility | Dark mode, mobile audit, ARIA, keyboard, reduced motion, loading states | planned |
| **v5.C** | Analytics & promotion | GA4, Search Console, backlinks, launch posts, UTM | planned |

## 6. Open questions

- *(append-only log; mark answered with date but never delete)*
- **2026-10-05 — v2.H:** does `/` itself become the "what holiday is today" page, or does `/what-holiday-is-today/` stay a separate route? Two pages for one intent would compete with each other.
- **2026-10-05 — v2.H:** homepage checker default country. It is India today, but the target keywords are US.
- **Answered 2026-11-23:** `/` *is* the "what holiday is today" page (no separate route); homepage checker defaults to the US.

---

## 7. Phase detail

### v1.B — MVP build

| Feature | Status | File(s) |
|---|---|---|
| Vite 6 + React 18 + TS + Tailwind 3 + shadcn/ui scaffold *(renumbered 2026-09-25; was 1.1)* | ✅ | root configs |
| Pure `getTodayHoliday()` calc with 5 Vitest tests *(renumbered 2026-09-25; was 1.2)* | ✅ | `src/lib/holiday.ts`, `src/lib/holiday.test.ts` |
| Holiday seed data — India + USA, 30 entries *(renumbered 2026-09-25; was 1.3)* | ✅ | `src/lib/holidays.ts` |
| `Calculator.tsx` widget — country/state/type selectors, ✅/❌ answer, next-holiday line *(renumbered 2026-09-25; was 1.4)* | ✅ | `src/components/Calculator.tsx` |
| Routes: `/`, `/holiday-checker`, `/:country`, `/:country/:state`, `*` *(renumbered 2026-09-25; was 1.5)* | ✅ | `src/App.tsx` |
| 9 pSEO `PAGES` entries (India, IN/Kerala, IN/Tamil-Nadu, IN bank, USA, US/CA, US/TX, US/NY, US bank) *(renumbered 2026-09-25; was 1.6)* | ✅ | `src/lib/data.ts` |
| `Seo` component — `<title>`, meta description, per-page canonical, OG, Twitter *(renumbered 2026-09-25; was 1.7 + 4.10)* | ✅ | `src/components/Seo.tsx` |
| Internal links (≥6 per page) *(renumbered 2026-09-25; was 1.8)* | ✅ | `src/components/InternalLinks.tsx` |
| `pnpm install`/`build`/`test` clean inside docker *(renumbered 2026-09-25; was 1.9)* | ✅ | — |

### v2.A — Kickoff / decisions lock

**Diagnosis (GSC 28d + conformance, 2026-09-15):** 299 impressions, 0 clicks, avg position 82.5; 4 of the 10 inspected URLs indexed. Two distinct causes — *plumbing* (redirecting canonicals, orphaned pages) and *thin content* (Soft 404 / crawled-not-indexed). Plumbing is cheap and ships first (v2.D–v2.I); content is the real unlock and takes the most work (v2.J).

**Stack decision (2026-05-01):** calcengine uses Astro SSG; we were a Vite + React SPA, which slowed discovery and weakened link equity inside React-rendered DOM (calcengine's H1 incident: all `/calculators` `<a>` tags lived inside a React island, Googlebot saw zero outbound links). Resolved in v2.B with `vite-react-ssg` instead of an Astro rewrite. Astro migration stays deferred — only revisit if SEO growth stalls and `vite-react-ssg` proves limiting (e.g. needs MD/MDX-driven content).

### v2.B — Static pre-rendering ✅ (2026-05-01)

| Feature | Status | Notes |
|---|---|---|
| `vite-react-ssg` build-time pre-rendering *(renumbered 2026-09-25; was 4-A1)* | ✅ (`452bbf6`) | 11 static HTMLs in `dist/`; `dirStyle: 'nested'`; `<Head>` from vite-react-ssg handles SSR head extraction |

### v2.C — Crawl surface ✅

| Feature | Status | Source of pattern |
|---|---|---|
| XML sitemap generator (build-time + dev middleware, all `PAGES[].slug`) *(renumbered 2026-09-25; was 4.1)* | ✅ (`e476b83`) | `calcengine/src/seo/generateSitemap.ts` |
| `robots.txt` references sitemap URL *(renumbered 2026-09-25; was 4.2)* | ✅ | `public/robots.txt` |

### v2.D — Trailing-slash URLs ✅ (2026-09-15)

| Feature | Status | Notes |
|---|---|---|
| Trailing-slash URL normalisation (canonical / sitemap / internal links / JSON-LD) *(renumbered 2026-09-25; was 4-A2)* | ✅ (`e18f8ec`) | CF Pages 308-redirects `/<path>` → `/<path>/`; GSC reported `/usa` + `/india/bank-holiday` as "Page with redirect". `withTrailingSlash()` in `src/lib/utils.ts`; SEO test fails on any unslashed internal href |

### v2.E — Crawl plumbing fixes

Small, mechanical, same sitting. Unblocks crawling of the 4 starved pages.

| Feature | Effort | Status | Source |
|---|---|---|---|
| **Internal-link starvation fix** — `InternalLinks` slices `PAGES` to the first 6, so `/usa/new-york/` + `/usa/bank-holiday/` receive **0** inbound internal links and `/usa/texas/` only 6 (measured in `dist/`, 2026-09-15). All four orphan-ish pages are GSC "Discovered — not indexed". Link each page to its siblings + parent instead of a fixed prefix slice *(renumbered 2026-09-25; was 4.12)* | S | ✅ 2026-10-05 — every page (incl. `/`) links to all 9 others + `/holiday-checker/` as static `<a href>`; switch to sibling/parent once v3 grows the set | measured, not inherited |
| `<meta name="robots">` — `index,follow` site-wide via `Seo.tsx`; `noindex` on `NotFound` *(renumbered 2026-09-25; was 4.13)* | XS | ✅ 2026-11-23 — plus `dist/404.html` prerendered so CF Pages returns a real 404 (unknown URLs were 200 + homepage, a soft-404 source) | conformance CHECK_075 |
| JSON-LD URL must equal the page's own canonical — homepage `WebApplication` currently declares `url: /holiday-checker/` *(renumbered 2026-09-25; was 4.14)* | XS | ✅ 2026-11-23 | conformance CHECK_092 |

### v2.F — Date correctness

**Root cause (2026-10-05):** "today" is evaluated by `vite-react-ssg` at *build* time, so the
static HTML Googlebot fetches is frozen at the last push. Three compounding faults:
(1) no scheduled rebuild — Cloudflare Pages only builds on push; (2) `todayIso()` used the
UTC date, wrong for both India (IST, +5:30) and the US evening; (3) hydration recomputed
from the visitor's clock during the first render, so client and server HTML could disagree.
Mirrors montereybayevents.com v1.Q's daily-rebuild fix.

| Feature | Status | File(s) |
|---|---|---|
| Per-scope timezone: India → `Asia/Kolkata`; USA → `America/New_York`; CA/TX/NY → state zone | ✅ | `src/lib/today.ts`, `src/lib/holiday.ts` |
| Build timestamp `__BUILD_TIME__` drives the SSR + first client render (no hydration mismatch); a post-mount effect advances to the live clock | ✅ | `vite.config.ts`, `src/lib/today.ts`, `src/components/Calculator.tsx`, `src/components/Layout.tsx` |
| Visible "as of" line naming the date + timezone the answer is computed for | ✅ | `src/components/Calculator.tsx` |
| `public/_headers` — HTML `max-age=0, must-revalidate`; `/assets/*` immutable | ✅ | `public/_headers` |
| Scheduled rebuild Worker — cron-only, fires a Pages deploy hook just after midnight IST, ET and PT | ✅ uploaded 2026-10-05 via CF API (`isitholiday-daily-rebuild`) | `workers/daily-rebuild/` |
| Deploy hook `daily-rebuild` → `main` created; bound as `DEPLOY_HOOK` secret; workers.dev disabled | ✅ | CF API |

### v2.G — Holiday closure pages

**Why (2026-11-23):** US Google Ads volume (DataForSEO via treg, Dec 2025) shows holiday-specific closure queries spike hard in their own month: "is christmas eve a federal holiday" 246K, "are banks open on christmas eve" 135K, "are banks open on new years eve" 135K, "is the post office open on christmas eve" 110K, "are banks open on new years day" 49.5K. Date-only queries ("is december 26 a holiday") peak at 8.1K and were rejected as thin. Thanksgiving / Black Friday (peak Nov) judged too late to rank in 2026.

Evergreen slugs (no year) so each page accumulates authority across years; content is dated and updated per cycle.

| Feature | Status | File(s) |
|---|---|---|
| Closure data: per holiday, status for federal offices, Federal Reserve, Post Offices, mail delivery — every row cites OPM / Federal Reserve K.8 / USPS | ✅ | `src/lib/closures.ts` |
| Page template: H1 + direct answer, status table, explainer, FAQ (FAQPage JSON-LD = visible text), sources, "last checked" date | ✅ | `src/pages/ClosurePageRoute.tsx` |
| 4 routes: `/christmas-eve/`, `/christmas/`, `/new-years-eve/`, `/new-years-day/`; linked from every page; in sitemap | ✅ | `src/App.tsx`, `src/components/InternalLinks.tsx` |
| Cross-check test: closure statuses agree with `HOLIDAYS` (federal + Fed rows) | ✅ | `src/lib/closures.test.ts` |
| Operator: re-check for a Dec 24 / Dec 31 executive order around Dec 18 and update `closures.ts` | ❌ | Federal Register |
| Next cycle: roll pages to 2027 dates; add Thanksgiving / Black Friday pages before Nov 2027 | ❌ | — |

### v2.H — Answer-engine pages

**Built 2026-11-23.** `/` is the "what holiday is today" page (US answer block, checker defaults to USA); 6 routes `/is-tomorrow-a-holiday/`, `/next-holiday/`, `/federal-holiday-today/`, `/post-office-open-today/`, `/mail-today/`, `/banks-open-today/`. Logic: `src/lib/usAnswers.ts` (pure, US Eastern date); copy: `src/lib/answerPages.ts`. USPS postal holidays from about.usps.com/newsroom/events/ (remaining 2026 + all 2027); weekend rules from the USPS "No mail delivery?" FAQ (regular delivery Mon–Sat) and a 2025 USPS release (retail usually closed Sundays). No weekend claims for banks or federal offices — no source. Note: "what holiday is today" searchers often want fun national days; this page answers only official calendars.

Low-difficulty, high-volume US "today" intents. Keyword data comes from Ahrefs and was supplied by the operator on 2026-10-05:

| Intent | Volume / KD | Proposed route |
|---|---|---|
| what holiday is today | 201K / 0 | `/what-holiday-is-today/` |
| is tomorrow a holiday | 33K / 0 | `/is-tomorrow-a-holiday/` |
| next holiday | 31K / 0 | `/next-holiday/` |
| is today a federal holiday | 27K / 12 | `/federal-holiday-today/` |
| is the post office open today | 24K / 3 | `/post-office-open-today/` |
| is there mail today | 17K / 5 | `/mail-today/` |
| are banks closed today | 14K / 9 | `/banks-open-today/` |

**Do not target** `is today a holiday` (166K / KD 82) directly; let authority for it build over time. The existing `/usa/california/` (1K / KD 7) and `/usa/texas/` (500 / KD 2) pages already serve those intents.

| Feature | Effort | Status | Notes |
|---|---|---|---|
| Shared US schedule data — federal (OPM), Federal Reserve, USPS observed holidays — each block source-cited | M | ✅ | Extends `src/lib/holidays.ts`; 2026 + 2027 federal/Fed already present. USPS dates need their own source |
| Shared answer block — today's status + date, next applicable holiday + days away, recent/next holidays, full upcoming table | M | ✅ | Reuses `getTodayHoliday` / `getUpcomingHolidays` / `useNow`; prerendered and refreshed by v2.F rebuilds |
| 7 routes, each with its own intent-specific explainer (definitions, what's open and closed, exceptions) | L | ✅ | Not thin pages: the dynamic answer and static explanatory content must work together |
| Mail/USPS precision — distinguish retail counters, regular delivery, Priority Mail Express, federal holidays, Sundays | — | ✅ | Say "USPS observes…"; never claim a local branch is open, because the site has no branch data |
| Bank precision — Federal Reserve schedule vs. individual banks, which can vary | — | ✅ | |
| JSON-LD that matches the visible answer, plus sitemap entries and links from `/` and every page | S | ✅ | Ties into v2.L structured data |

**Overlap:** the US date-intent items in v3.L are superseded by this phase. The India variants stay in v3.L.

### v2.I — Index repair ops

Operator-run, not code. These are the one-shot pushes that tell Google the
v2.D fix landed; without them the corrected URLs wait on an organic recrawl.
Run **after** a deploy carrying v2.D + v2.E is live.

| Action | How | Why now |
|---|---|---|
| Ping IndexNow for all 11 sitemap URLs *(renumbered 2026-09-25; was 4.30)* | `cd ~/work/projects/sites/portfolio && uv run portfolio project fix isitholiday.today` | conformance CHECK_154 — 11 URLs never submitted; key already live at `public/82cd3fc…txt` |
| Resubmit `sitemap.xml` in Search Console *(renumbered 2026-09-25; was 4.31)* | [Sitemaps](https://search.google.com/search-console/sitemaps?resource_id=sc-domain:isitholiday.today) | last fetched 11 weeks before 2026-09-15 |
| Request indexing for the non-indexed URLs *(renumbered 2026-09-25; was 4.32)* | [URL inspection](https://search.google.com/search-console/inspect?resource_id=sc-domain:isitholiday.today) — `/usa/bank-holiday/`, `/usa/new-york/`, `/usa/california/`, `/india/kerala/`, `/india/tamil-nadu/`, `/holiday-checker/` | `/usa/california/` is `url_is_unknown_to_google`; the rest are "Discovered — not indexed" |

**Verification (not before ~2 GSC reporting windows):** re-run
`uv run portfolio project check isitholiday.today` and expect CHECK_161
(canonical-resolves-200), CHECK_154 (indexnow-submitted) and CHECK_155
(index-regression on `/india/bank-holiday`) to clear. Index coverage moves on
Google's schedule, not ours — do not treat a green local build as proof.

### v2.J — Golden-page content

The Soft-404 / thin-content fix. Blocks the Breadcrumb + FAQPage rows in v2.L. **Every holiday fact needs an official source cited in the commit — no invented dates.**

calcengine's "golden page" rule: every page must match `openai-cost-calculator` exactly. Define ours, then enforce.

**Golden-page checklist (per location/type page):**

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

**`SeoPage` schema extension** *(renumbered 2026-09-25; was 3-A)* — extend `src/lib/data.ts`:

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

| Feature | Effort | Status | Source |
|---|---|---|---|
| `/india/` soft-404 slice (GSC 2026-10-05): `intro` + `sources` fields (optional), India intro from DoPT/RBI source notes, unique 154-char description, server-rendered "Upcoming holidays" table + source links on all 9 pages | M | ✅ 2026-10-05 | GSC coverage |
| Decide `/holiday-checker/` fate — GSC "Crawled — currently not indexed". Either lift it past the golden-page bar or drop it from the sitemap *(renumbered 2026-09-25; was 4.15)* | S | ❌ | GSC coverage, 2026-09-15 |

### v2.K — Legal + E-E-A-T

calcengine's "Critical" SEO issues that cost them: missing legal + missing about page.

| Page | Path | Required content |
|---|---|---|
| Privacy Policy *(renumbered 2026-09-25; was 4.20)* | `/privacy` | GDPR/CCPA compliance, cookie disclosure, contact email |
| Terms of Service *(renumbered 2026-09-25; was 4.21)* | `/terms` | Standard ToS, no warranty, disputes |
| About *(renumbered 2026-09-25; was 4.22)* | `/about` | Author/operator name, methodology, data sources |
| Footer with all links *(renumbered 2026-09-25; was 4.23)* | `Layout.tsx` footer | Privacy, Terms, About, key country pages, GitHub |

### v2.L — Structured data

Breadcrumb + FAQPage land for free once v2.J backfills.

| Feature | Effort | Status | Source of pattern |
|---|---|---|---|
| JSON-LD: `WebSite` + `SearchAction` on `/` *(renumbered 2026-09-25; was 4.3)* | S | ❌ | `calcengine/src/seo/jsonLd.ts` |
| JSON-LD: `Organization` (with `logo`, `sameAs`) *(renumbered 2026-09-25; was 4.4)* | S | ❌ | calcengine PRD C2 |
| JSON-LD: `WebApplication` site-wide *(renumbered 2026-09-25; was 4.5)* | S | ❌ | calcengine |
| JSON-LD: `BreadcrumbList` on detail pages *(renumbered 2026-09-25; was 4.6)* | M | ❌ | calcengine — required pattern |
| JSON-LD: `FAQPage` per location page *(renumbered 2026-09-25; was 4.7)* | M | ❌ (blocked on v2.J `faq` field) | calcengine — required when FAQ exists |
| JSON-LD: `Event` per holiday (date, location, name) *(renumbered 2026-09-25; was 4.8)* | M | ❌ | unique to us — schema.org/Event |
| Static fallback `<ul>` of all pages on `/all-locations` (Googlebot-friendly) *(renumbered 2026-09-25; was 4.11)* | S | ❌ | calcengine H1 fix — must render outside React island |

### v2.M — Repo & docs hygiene

Not SEO work; cleanup that keeps the docs honest for the next session. None of
it blocks traffic — do it while waiting on GSC windows.

| Item | Notes |
|---|---|
| Resolve the deploy-config contradiction in `AI_AGENTS.md` *(renumbered 2026-09-25; was 9.1)* | "Deployment" says *no `wrangler.toml`, CF auto-detects*; "Deployment info" + `docs/CLAUDE.md` both say `wrangler.jsonc`. No wrangler file exists in the repo — confirm which is true and delete the loser |
| Fill or delete the 7 placeholder sections in `AI_AGENTS.md` *(renumbered 2026-09-25; was 9.2)* | Summary / Audience / ICP / Goals / Tech stack / Content strategy / Conventions — all "(to be filled in)", uncommitted as of 2026-09-15 |
| Fill `docs/CLAUDE.md` — Project blurb + Deferred decisions *(renumbered 2026-09-25; was 9.3)* | still bootstrap template text |
| Fill the `[content]` block in `lamill.toml` *(renumbered 2026-09-25; was 9.4)* | `site_type`, `primary_keyword`, `secondary_keywords`, `icp`, `tone` all empty; rankmill consumes these |
| `docs/growth.md` — overdue review + new entry *(renumbered 2026-09-25; was 9.5)* | 2026-05-09 entry was due for review 2026-06-06; add a v2.D entry with a baseline (299 impressions / 0 clicks / pos 82.5, GSC 28d as of 2026-09-15) and a review date |
| Commit or delete `.env.example` *(renumbered 2026-09-25; was 9.6)* | untracked, template-only; the site has no env vars |

**Known checker false positives** (do not "fix" these — they are portfolio-tool
gaps, recorded so future sessions stop chasing them): CHECK_010 (tests live in
`src/test/`, not `tests/`), CHECK_063/064 (sitemap is generated in
`vite.config.ts` `onFinished`, not `public/`), CHECK_050/CHECK_143 (deploy
target *is* declared — `lamill.toml [deploy]`).

### v3.A — Kickoff / decisions lock ✅ (2026-11-25)

Added 2026-11-25 from an operator brief: expand into a US holiday + institutional closure checker. Placed at the head of v3; the prior v3 phases follow as v3.G–v3.L.

Keyword targets (operator-supplied Ahrefs data, US monthly SV / KD, 2026-11-25; not re-verified here):

| Keyword | SV | KD | Existing / planned URL |
|---|---|---|---|
| is christmas eve a federal holiday | 16K | 5 | v2.G Christmas Eve page ✅ |
| is today a bank holiday | 16K | 7 | `/usa/bank-holiday/` (owner, v3.A) |
| are banks open tomorrow | 11K | 6 | v3.B |
| is veterans day a bank holiday | 7.9K | 13 | v3.C |
| what religious holiday is today | 3.3K | 4 | v3.E |
| is tomorrow a bank holiday | 1.9K | 13 | v3.B (same page as "are banks open tomorrow") |
| is today a postal holiday | 1.6K | 9 | `/post-office-open-today/` (v3.B retitle) |
| is there mail tomorrow | 1.5K | 8 | v3.B |
| 2027 federal holiday calendar | 700 | 9 | v3.D |

Decisions (all locked 2026-11-25):

| Decision | Status |
|---|---|
| Intent → URL map: one URL per search intent; new pages only where no existing page answers it | ✅ 2026-11-25 (table below) |
| Slug patterns for institution × holiday (per-holiday hub vs one page per institution) | ✅ 2026-11-25 — one page per holiday (v2.G pattern), see owners table |
| Stock market source (NYSE holiday schedule) | ✅ 2026-11-25 — NYSE (sources table) |
| Religious holiday source + which faiths | ✅ 2026-11-25 — Jewish, Catholic, Islamic, Orthodox; Hindu = labeled gap |
| State DMV / court / office sources for CA, TX, NY | ✅ 2026-11-25 partial — locked where an official page exists; gaps listed below |
| PDF generation approach (build-time file vs print stylesheet) | ✅ 2026-11-25 — real PDF file generated at build time (one new build dependency) |
| Audit of existing 21 URLs against the intent map before any new page | ✅ 2026-11-25 — two overlaps found, resolved below |

**Sources (locked 2026-11-25).** Every page fact must come from one of these. Pages were loaded on 2026-11-25 unless noted.

| Scope | Source | Coverage | Notes |
|---|---|---|---|
| Federal | OPM — opm.gov/policy-data-oversight/pay-leave/federal-holidays/ | 2026, 2027 | Sat → preceding Fri (5 U.S.C. 6103(b)); Sun → following Mon (EO 11582) |
| Stock market | NYSE — nyse.com/markets/hours-calendars | 2026–2028 | Full closes + 1 p.m. early closes. 2027: Good Friday Mar 26 closed; Jun 18 + Dec 24 observed closures; no Christmas Eve early close. Sat Jan 1 2028: no observed day |
| Bond market | SIFMA — sifma.org/resources/general/holiday-schedule/ | 2026; 2027 only Jan 1 | Optional, not required for v3; differs from NYSE (Columbus, Veterans Day closed). Re-check 2027 before use |
| CA state offices | CalHR — calhr.ca.gov/employees/pages/state-holidays/ | rules, no dates | Includes Mar 31 + day after Thanksgiving. Sat holiday → holiday credit, no observed weekday; Sun → Mon |
| CA courts | courts.ca.gov/holidays.htm | 2026, 2027 | **Re-check "Farmworkers Day Apr 9, 2027" before use** |
| CA DMV | dmv.ca.gov …/holidays/ | 2026; 2027 only Jan 1 | |
| TX state offices | Texas SAO — hr.sao.texas.gov/Holidays/ (Holidays2026.pdf, Holidays2027.pdf) | through Aug 2027 (fiscal year) | "All agencies closed" vs "skeleton crew" vs "optional" statuses. Do NOT use lrl.texas.gov (wrong 2026 Good Friday) |
| NY state offices | NY Civil Service — cs.ny.gov/attendance_leave/{2026,2027}_legal_holidays.cfm | 2026, 2027 | Sat holidays are "pass days" — no observed weekday |
| Jewish | Hebcal API — hebcal.com | any year | JSON/ICS, CC BY 4.0 (credit required); fetch at build/ingest time, not per visitor |
| Catholic | USCCB liturgical calendar PDFs — usccb.org/resources/2027cal.pdf | 2026–2028 | Holy days of obligation; regional exceptions (Ascension by province, Hawaii) |
| Islamic | Fiqh Council of North America — fiqhcouncil.org/calendar/ | 2026, 2027 | Calculated, not sighted — must state local mosques may differ by a day |
| Orthodox | ACROD movable feasts (GOARCH partnership) — acrod.org/prayercorner/movablefeasts/ | 2026, 2027 | goarch.org itself returned 403 |

**Source gaps (no page ships content for these until filled):** Texas DPS driver license offices, Texas courts, NY courts (nycourts.gov 403), NY DMV (no statewide page), Nasdaq (unreachable; NYSE suffices), Texas Sep–Dec 2027 (FY2028 schedule not published), Hindu (no authoritative US publisher), any government interfaith calendar (none found).

**Intent → URL owners (locked 2026-11-25).** Audit of the 21 live URLs found two overlaps: `/usa/bank-holiday/` and `/banks-open-today/` both targeted "is today a bank holiday"; `/`, `/usa/` and `/federal-holiday-today/` all partly answered "is today a holiday in the US". One owner per intent; other pages link to the owner instead of competing:

| Intent | Owner |
|---|---|
| what holiday is today / holidays today | `/` |
| is today a holiday in the US / USA | `/usa/` |
| is today a federal holiday | `/federal-holiday-today/` |
| is today a bank holiday (US) | `/usa/bank-holiday/` |
| are banks open / closed today | `/banks-open-today/` |
| is the post office open today / is today a postal holiday | `/post-office-open-today/` |
| is there mail today | `/mail-today/` |
| is tomorrow a holiday | `/is-tomorrow-a-holiday/` |
| next holiday | `/next-holiday/` |
| [holiday] + banks / post office / mail / federal | one page per holiday (v2.G pattern, e.g. `/christmas-eve/`) |

Cross-cutting requirements for every v3.B–v3.F page: authoritative source cited per fact, US time zones + observed-date rules per institution, regional exceptions shown, internal links, WebPage + FAQPage JSON-LD, no thin pages. GSC tracking of indexing / impressions / rankings / clicks per phase (v2.I ops, v5.C).

**Deferred (2026-11-25):** school closures. Closures are set per district; no authoritative national or state source exists. Revisit when a source is found.

### v3.B — Tomorrow variants + retitles ✅ (built 2026-11-25)

| Item | Status |
|---|---|
| `/banks-open-tomorrow/` — Federal Reserve schedule for tomorrow (covers "is tomorrow a bank holiday") | ✅ |
| `/mail-tomorrow/` — USPS delivery tomorrow | ✅ |
| `/usa/bank-holiday/` targets "is today a bank holiday"; `/banks-open-today/` keeps "are banks open / closed today" and drops bank-holiday wording from title/H1 | ✅ |
| Retitle `/post-office-open-today/` to target "is today a postal holiday" | ✅ |

**Built.** `computeAnswer` gains `banks-tomorrow` and `mail-tomorrow` (shared `bankAnswer` / `mailAnswer` helpers; tomorrow = US Eastern today + 1). `/usa/bank-holiday/` got a full description and a 3-paragraph intro from the Federal Reserve schedule. No new sources. Sitemap: 23 URLs.

### v3.C — Institution × holiday pages ✅ (built 2026-11-25)

| Item | Status |
|---|---|
| One page per US federal holiday covering banks, USPS, federal offices, NYSE (v2.G pattern), observed-date aware | ✅ 9 pages |
| Order by KD: Veterans Day first | ✅ all 9 shipped together (generated, no per-page copy) |
| NYSE status column in existing v2.G pages | ✅ row added to all 4 |
| Add 2028 OPM / Federal Reserve / USPS dates when published (operator, during 2027) | ❌ |

**Built.** Routes `/mlk-day/`, `/presidents-day/`, `/memorial-day/`, `/juneteenth/`, `/fourth-of-july/`, `/labor-day/`, `/columbus-day/`, `/veterans-day/`, `/thanksgiving/`; Christmas and New Year's Day stay on their v2.G pages. `src/lib/holidayPages.ts` (pure) finds each holiday's next occurrence from the build date and reads every status from the sourced calendars: OPM + Federal Reserve (`HOLIDAYS`), USPS (`POSTAL_HOLIDAYS`), NYSE (`src/lib/nyse.ts`, 2026–2028 closures + 1 p.m. early closes, read 2026-11-25). Pages roll to the next year on the scheduled rebuild after the last related date (e.g. Thanksgiving after the Friday early close). Weekend cells are "—" unless a source lists the day. When a calendar has no data for the year shown, its row says "Not in this site's data yet": from Jan 19, 2027 each page rolls to 2028 one by one, and only NYSE 2028 is in the data, so 2028 OPM / Fed / USPS dates need adding during 2027.

### v3.D — Annual calendars + downloads ✅ (built 2026-11-25)

| Item | Status |
|---|---|
| `/2027-federal-holiday-calendar/` — federal + Fed + USPS + NYSE columns | ✅ |
| ICS download generated at build time | ✅ `/2027-federal-holiday-calendar.ics` (12 all-day events) |
| PDF download | ✅ `/2027-federal-holiday-calendar.pdf` (pdf-lib, one landscape page) |

**Built.** `src/lib/calendar.ts` (pure) lists every 2027 date on any sourced calendar (OPM, Federal Reserve, USPS, NYSE closures + early closes) with each institution's status from `holidayPages.cell()`, so the page, ICS and PDF can't disagree. ICS = one all-day event per weekday federal offices close (RFC 5545 folding/escaping, CRLF); `/*.ics` served as `text/calendar` via `public/_headers`. PDF via `pdf-lib` (new devDependency, Helvetica, WinAnsi-only text). Both files are written in `vite.config.ts` `onFinished`; `tsconfig.node.json` now includes `src/lib/*.ts` because the config imports them. Downloads are not in the sitemap. Holiday names link to their v3.C / v2.G pages. Next year: bump `CALENDAR_YEAR` once 2028 OPM / Fed / USPS dates are in the data (the slug changes with it; the 2027 page then needs a redirect or keep-alive decision).

### v3.E — Religious holiday checker ✅ (built 2026-11-26)

| Item | Status |
|---|---|
| "What religious holiday is today" page, data + source per v3.A | ✅ `/religious-holiday-today/` |
| Add 2028 observances (Hebcal, USCCB 2028cal.pdf, FCNA, ACROD) before Dec 2027 | ❌ |

**Built.** `src/lib/religious.ts` holds 42 observances (Nov 2026 – Dec 2027), each read 2026-11-26 from its source: Hebcal API (Diaspora, major holidays; CC BY 4.0, credited on the page), USCCB 2027 liturgical calendar PDF (Advent 2026 – Dec 2027; Holydays of Obligation and regional rules: Ascension Thursday only in 5 provinces, Hawaii, All Saints 2027 abrogated), FCNA calculated calendar (month starts; Ashura and Eid al-Adha counted from them, Eid al-Adha marked "expected" because FCNA defers to Saudi Arafah), ACROD movable feasts (Orthodox; fixed feasts not on that page, so not included). Page shows today's observances (US Eastern; "day N of M" for multi-day), Jewish/Islamic observances beginning at sundown tonight, the next 12, per-faith source notes, and a data-derived FAQ (Easter 2027, Ramadan 2027, Yom Kippur 2027, Hanukkah 2026). Hindu, Buddhist, Sikh stated as not covered.

### v3.F — State institutions ✅ (built 2026-11-26)

| Item | Status |
|---|---|
| DMV, state courts, state offices for CA / TX / NY, per-state official sources | ✅ where a source exists (see below) |
| Fill gaps: Texas DPS driver license offices, Texas courts, NY courts, NY DMV | ❌ no official statewide source found |
| Roll forward: CA DMV 2027 list (only Jan 1 published), Texas FY2028 (Sep 2027+), 2028 for all | ❌ operator, when published |
| Expand to more states as sources are confirmed | ❌ |

**Built.** Placement: a section on the existing `/usa/california/`, `/usa/texas/`, `/usa/new-york/` pages (the owners of state intent) rather than new URLs, so a state with one source doesn't get thin standalone pages. `src/lib/stateInstitutions.ts` holds each institution's dates, read 2026-11-26: CalHR rules applied to Nov 2026 – Dec 2027 (excluded employees; Saturday = holiday credit, Sunday → Monday), California courts 2026–2027, California DMV (through Jan 1, 2027; "DMV offices are closed on weekends"), Texas SAO FY2027 PDF (through Aug 31, 2027; closed / skeleton crew / optional statuses, Gov Code 662.004 quoted), NY Civil Service 2026 + 2027 (pass days, floating holidays for some units). Section shows each institution's status today (US Eastern), the next 10 closures, coverage dates, and the gap institutions as "no official statewide holiday schedule found". California courts publish Farmworkers Day 2027 as Fri Apr 9 while CalHR's rule is Mar 31 — both shown as published. Retrying the gap sources with a browser user-agent was blocked by the session's permission check; not retried.

### v3.G — UK + Canada

Mirror calcengine's "ship many pages" approach. Each new entry in `src/lib/data.ts` + matching seed rows in `src/lib/holidays.ts` = one new indexable page with zero code changes. **Target: 50+ pSEO pages by end of v3.**

| Slug | Country | Type | Priority | Notes |
|---|---|---|---|---|
| `uk` *(renumbered 2026-09-25; was 2.1)* | United Kingdom | public | High | Bank Holidays Act schedule; differs across England/Scotland/NI |
| `uk/scotland` *(renumbered 2026-09-25; was 2.2)* | UK | public | Med | Distinct holidays (St Andrew's Day, 2nd Jan) |
| `uk/northern-ireland` *(renumbered 2026-09-25; was 2.3)* | UK | public | Med | St Patrick's Day, Battle of the Boyne |
| `canada` *(renumbered 2026-09-25; was 2.4)* | Canada | public | High | Federal stat holidays |
| `canada/ontario` *(renumbered 2026-09-25; was 2.5)* | Canada | public | Med | Family Day, Civic Holiday |
| `canada/quebec` *(renumbered 2026-09-25; was 2.6)* | Canada | public | Med | National Holiday (St-Jean-Baptiste) |

### v3.H — OG images

| Feature | Effort | Status | Source of pattern |
|---|---|---|---|
| OG image build pipeline (Satori + `@resvg/resvg-js`) — `/og/{slug}.png` *(renumbered 2026-09-25; was 4.9)* | M | ❌ | `calcengine/src/og/` |

### v3.I — First content cluster

calcengine generates a 3-page cluster per calculator: main + how-to + formula. Adapted for holidays — each cluster page reuses the same data (`HOLIDAYS`) but emphasizes a different intent. First cluster: `/india/upcoming-holidays`, `/india/holiday-calendar-2026`.

| Cluster page | Route | Target keywords |
|---|---|---|
| Main: yes/no answer *(renumbered 2026-09-25; was 5.1)* | `/india`, `/usa/california` | "is today a holiday in [loc]" |
| List: upcoming holidays *(renumbered 2026-09-25; was 5.2)* | `/india/upcoming-holidays`, `/usa/california/upcoming-holidays` | "[loc] holidays 2026", "next holiday in [loc]" |
| Calendar: full year view *(renumbered 2026-09-25; was 5.3)* | `/india/holiday-calendar-2026` | "[loc] holiday calendar 2026" |
| History: past holidays this year *(renumbered 2026-09-25; was 5.4)* | `/india/holidays-so-far-2026` | "[loc] holidays so far 2026" |

### v3.J — More countries

| Slug | Country | Type | Priority | Notes |
|---|---|---|---|---|
| `australia` *(renumbered 2026-09-25; was 2.7)* | Australia | public | High | Federal + state-specific |
| `australia/new-south-wales` *(renumbered 2026-09-25; was 2.8)* | AU | public | Med | Bank Holiday, Labour Day variants |
| `australia/victoria` *(renumbered 2026-09-25; was 2.9)* | AU | public | Med | Melbourne Cup Day |
| `germany` *(renumbered 2026-09-25; was 2.10)* | Germany | public | Med | Federal holidays + state variants (Bavaria etc.) |
| `france` *(renumbered 2026-09-25; was 2.11)* | France | public | Med | 11 jours fériés |
| `japan` *(renumbered 2026-09-25; was 2.12)* | Japan | public | Med | 16 national holidays |

### v3.K — Holiday-type pages

| Slug pattern | Example | Type | Notes |
|---|---|---|---|
| `{country}/bank-holiday` *(renumbered 2026-09-25; was 2.20)* | `india/bank-holiday`, `usa/bank-holiday`, `uk/bank-holiday` | bank | Already done for IN/US — extend |
| `{country}/school-holiday` *(renumbered 2026-09-25; was 2.21)* | `india/school-holiday`, `usa/school-holiday` | school | Term-break dates per country. **US deferred 2026-11-25** (see v3.A) |
| `{country}/{state}/bank-holiday` *(renumbered 2026-09-25; was 2.22)* | `usa/california/bank-holiday` | bank | State-level variants where relevant |

### v3.L — Date-intent pages

| Slug | Search intent |
|---|---|
| `is-monday-a-holiday` *(renumbered 2026-09-25; was 2.30)* | Day-of-week queries |
| `is-friday-a-holiday` *(renumbered 2026-09-25; was 2.31)* | Day-of-week queries |
| `next-public-holiday-india` *(renumbered 2026-09-25; was 2.32)* | "next holiday" queries |
| `holidays-this-month-usa` *(renumbered 2026-09-25; was 2.33)* | Monthly calendar intent |
| `is-tomorrow-a-holiday-india` *(renumbered 2026-09-25; was 2.34)* | Forward-looking variant |

### v4.B — Data layer split

calcengine's lesson: **don't hardcode data inside .tsx files** — extract to versioned JSON. We're currently OK (one `holidays.ts` file), but as we scale we should split.

| File | Contents | `lastVerified` |
|---|---|---|
| `src/data/holidays/india.json` *(renumbered 2026-09-25; was 6.1)* | All India national + state holidays | yes |
| `src/data/holidays/usa.json` *(renumbered 2026-09-25; was 6.2)* | Federal + state holidays | yes |
| `src/data/holidays/uk.json` *(renumbered 2026-09-25; was 6.3)* | Bank Holidays Act schedule | yes |
| `src/data/holidays/{country}.json` *(renumbered 2026-09-25; was 6.4)* | one file per country | yes |
| `src/lib/holidays.ts` *(renumbered 2026-09-25; was 6.5)* | thin barrel that imports + types the JSON | — |

### v4.C — Freshness markers

Mirrors calcengine's freshness phase.

| Signal | Source | Where shown |
|---|---|---|
| **Code freshness** "Last updated from git at" *(renumbered 2026-09-25; was 6.10)* | `git log -1 --format=%ai` on `data.ts`/`holidays.ts` at build time | Footer of each page + `dateModified` JSON-LD |
| **Data freshness** "Data verified" *(renumbered 2026-09-25; was 6.11)* | manual `meta.dataUpdated` per `SeoPage` | Inline below calculator |

### v4.D — Ingestion pipelines

Same pattern as calcengine's "OpenAI pricing scraper" — highest churn first.

| Source | Method | Why |
|---|---|---|
| India → `data.gov.in` "Holidays" dataset *(renumbered 2026-09-25; was 6.20)* | scheduled CI scrape | 28 states, evolves yearly |
| USA → OPM federal holiday schedule *(renumbered 2026-09-25; was 6.21)* | yearly manual update | federal only changes ~once/decade |
| UK → `gov.uk/bank-holidays.json` (official JSON API) *(renumbered 2026-09-25; was 6.22)* | scheduled CI fetch | official feed exists |
| Canada → `canada.ca` statutory holidays *(renumbered 2026-09-25; was 6.23)* | yearly manual update | — |
| Australia → `data.gov.au` holiday API *(renumbered 2026-09-25; was 6.24)* | scheduled CI fetch | official feed exists |

### v5.B — UX & accessibility

| Feature | Effort | Source pattern |
|---|---|---|
| Dark mode (`localStorage` + cross-island sync) *(renumbered 2026-09-25; was 7.1)* | M | calcengine `DarkModeToggle.tsx` + `ThemeContext.tsx` |
| Mobile-first audit (current scaffold uses `container` only) *(renumbered 2026-09-25; was 7.2)* | S | shadcn defaults |
| ARIA labels on all interactive elements *(renumbered 2026-09-25; was 7.3)* | S | calcengine standard |
| Keyboard navigation through Select widgets *(renumbered 2026-09-25; was 7.4)* | S | Radix handles by default |
| Reduced-motion support *(renumbered 2026-09-25; was 7.5)* | XS | tailwindcss-animate respects it |
| Loading states / suspense fallbacks (post-SSG) *(renumbered 2026-09-25; was 7.6)* | S | — |

### v5.C — Analytics & promotion

| Feature | Notes |
|---|---|
| GA4 page-view tracking *(renumbered 2026-09-25; was 8.1)* | mirror `calcengine/src/analytics/ga.ts` |
| Search Console verification *(renumbered 2026-09-25; was 8.2)* | manual |
| Backlink campaign — Reddit (`r/personalfinance`, `r/India`, `r/AskAnAmerican`) *(renumbered 2026-09-25; was 8.3)* | calcengine playbook |
| Dev.to / HN: "I built a free 'is today a holiday' API" angle *(renumbered 2026-09-25; was 8.4)* | "built a free tool" framing |
| UTM tagging for inbound campaigns *(renumbered 2026-09-25; was 8.5)* | — |

---

## 8. Definition of Done — per pSEO page

A location/type page is **complete** when:
- Static HTML emitted at build time (v2.B) — Googlebot sees full content
- Golden-page schema fields all populated (v2.J)
- ≥3 internal links rendered outside React island
- JSON-LD: WebPage + BreadcrumbList + FAQPage + relevant Event entries (v2.L)
- OG image present at `/og/{slug}.png` (v3.H)
- Listed in `sitemap.xml`
- `lastUpdated` + `dataUpdated` markers visible
- Cloudflare deploy green; no console errors

## 9. Out of scope / don't touch

- `genai/holiday-hub/` — Lovable reference scaffold, gitignored
- The parent `sites/` `Makefile` and `dev_container.sh`
- Backend / accounts / payments — not a product
