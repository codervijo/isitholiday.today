# Growth Log — isitholiday.today

> **What this file is for:** an honest, append-only log of growth experiments
> on this site — what was tried, what was measured, what happened. The data
> source is GSC; this file narrates *why*. Future-you (or future-Claude)
> reads this when deciding what to try next, both on this site and on
> related sister sites.

## How to use this (workflow — re-read this when you forget)

**Add an entry whenever you do something growth-relevant.** That includes:
shipping new content, structural SEO changes (sitemap, schema, redirects,
internal linking), tech changes that affect crawl/indexing, marketing
pushes, backlink campaigns. *Not* every code commit — just things you'd
want to point at when GSC numbers move (or fail to).

**Each entry is a hypothesis you can be wrong about.** Commit to a
measurable KPI and an observation window before acting — otherwise "did
this work?" is just a feeling.

### Lifecycle of one entry

1. **Day of action** — append a new dated H2 with `Status: active`, the
   hypothesis, the KPI you'll watch, current baseline numbers, what you
   did, and the date to review (default: today + 28 days, matching GSC's
   reporting window).
2. **Review day** — pull current GSC numbers, compute delta vs baseline.
   Fill in **Result** and **Learning**. Set **Status** to `shipped` (worked,
   keep going), `failed` (didn't pay off, abandon), or extend the review
   another window if results are ambiguous.
3. **Never rewrite older entries.** Wrong hypotheses are the most valuable
   data — they tell you what NOT to repeat on the next site. Append, don't
   edit.

### Where to get the numbers

```bash
cd ~/work/projects/sites/portfolio && make run ARGS="gsc sync"
```

Then read the row for `isitholiday.today`. Or pull from
https://search.google.com/search-console directly.

### Format

```
## YYYY-MM-DD — <one-line hypothesis or action>
- **Status:** active | testing | shipped | failed | abandoned
- **KPI:** <what GSC metric / query / page>
- **Baseline:** <numbers at start>
- **Action:** <what was done; 1-2 lines>
- **Result:** <numbers after window; "TBD — review YYYY-MM-DD" until then>
- **Learning:** <why it worked / didn't; what to try next; "TBD" until reviewed>
```

---

## 2026-05-09 — site scaffolded; growth log started
- **Status:** active
- **KPI:** any GSC traffic — clicks, impressions, indexed-page count
- **Baseline:** 0 clicks / 0 impressions (just deployed)
- **Action:** project scaffolded via `portfolio new bootstrap`; first deploy
  pending. After deploy: verify in GSC as `sc-domain:isitholiday.today` and submit
  the sitemap.
- **Result:** reviewed 2026-11-26 (late). GSC 2026-05-10 → 2026-06-06: 56
  impressions / 0 clicks / avg position 66.6.
- **Learning:** the site got indexed and seen, but client-rendered pages
  ranked nowhere useful; this led to the v2 indexability tier.

## 2026-09-15 — v2.B–v2.E: static HTML, sitemap, trailing slashes, crawl plumbing (logged 2026-11-26)
- **Status:** failed
- **KPI:** GSC impressions / clicks / position (28d), indexed URLs
- **Baseline:** 299 impressions / 0 clicks / position 82.5, GSC 28d as of
  2026-09-15 (as recorded in `docs/prd.md`; re-pulled 2026-11-26 the same
  window 2026-08-19 → 2026-09-15 reads 368 / 0 / 82.5)
- **Action:** prerendered HTML, sitemap + robots, trailing-slash canonicals,
  meta robots, real 404.
- **Result:** 2026-09-16 → 2026-10-13: 264 impressions / 0 clicks / position
  80.0. No gain.
- **Learning:** fixing crawlability alone didn't move traffic on a
  low-authority site with thin pages; content and targeted, low-difficulty
  intents are the lever (→ v2.G/v2.H/v3).

## 2026-11-26 — US answer, closure and per-holiday pages + golden content + structured data
- **Status:** active
- **KPI:** indexed URLs (URL Inspection), 28d impressions / clicks / position,
  impressions on the v3.A target queries (is today a bank holiday, are banks
  open tomorrow, is veterans day a bank holiday, is there mail tomorrow, what
  religious holiday is today, 2027 federal holiday calendar)
- **Baseline:** 3 of 34 sitemap URLs indexed (2026-11-26); GSC 2026-10-26 →
  2026-11-22: 218 impressions / 0 clicks / position 63.9; nearly all
  impressions on `/`.
- **Action:** v2.G closure pages, v2.H answer pages, v3.B–v3.F (tomorrow
  pages, 9 per-holiday pages, 2027 calendar + PDF/ICS, religious page, state
  institutions), v2.J golden content, v2.K legal pages, v2.L structured data,
  accurate lastmod; IndexNow + sitemap resubmitted after each deploy.
- **Result:** TBD — review 2026-12-24
- **Learning:** TBD
