# PRD — isitholiday.today

## Phase 1 — Project Setup
- [ ] Astro + pnpm scaffolded; `pnpm install` works
- [ ] `pnpm dev` runs locally
- [ ] `pnpm build` produces `dist/`
- [ ] Cloudflare Pages deploy wired up

## Phase 2 — Core Logic & Data
- [ ] `src/lib/holidays.json` seeded (India + USA, 20–30 entries)
- [ ] `src/lib/pages.json` defines initial slugs
- [ ] `getTodayHoliday({ country, state, type })` implemented in `src/lib/holiday.js`
- [ ] Date comparison correct across timezones

## Phase 3 — Pages
- [ ] Homepage with country detection
- [ ] Dynamic route `src/pages/[...slug].astro` parses `country/state/type`
- [ ] Above-the-fold renders: H1, ✅/❌ answer, visible date
- [ ] Below-the-fold renders: type, next holiday, internal links

## Phase 4 — SEO
- [ ] Unique `<title>` and meta description per page
- [ ] H1 carries the keyword
- [ ] Minimal JS, fast load
- [ ] sitemap.xml + robots.txt

## Phase 5 — Coverage Expansion
- [ ] Add UK, Canada, Australia
- [ ] Add more states per country
- [ ] Add `bank` and `school` holiday types

## Out of scope (do not build yet)
- Daily auto-update via API
- City-level pages
- Calendar views
- Email alerts
- Accounts / backend
