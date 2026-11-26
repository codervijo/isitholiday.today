# CLAUDE.md — isitholiday.today

Per-project orientation for Claude. Read this first when picking up
work on this site. Index of conventions, deferred decisions, and
non-features that aren't obvious from the code or git history.

## Project

Programmatic-SEO site answering "is today a holiday?" — US federal, Federal
Reserve, USPS, NYSE, state offices/courts/DMV (CA, TX, NY), religious
observances, and India's Central Government, state and RBI holidays — for US
adults about to go to a bank, post office or office. Vite 6 + React 18 + TS,
prerendered with vite-react-ssg, pnpm, deployed to Cloudflare Pages; every
holiday fact is hand-entered from an official source and cited.

## Commands

```bash
# Build + test: docker only (never host pnpm/node). --ignore-workspace
# because sites/pnpm-workspace.yaml has no packages: field.
docker run --rm -v ~/work/projects/sites:/usr/src/app sites1 bash -c \
  'cd /usr/src/app/isitholiday.today && pnpm --ignore-workspace build \
   && pnpm --ignore-workspace test && pnpm --ignore-workspace test:seo'

# Build / dev (forwards to the parent Makefile)
make deps           # install deps via the central builder
make dev            # local dev server
make build          # production build → dist/

# Test (per-stack — adjust as needed)
make test           # if a test suite is wired in

# Deploy
git push            # Cloudflare Pages auto-builds on push to main
```

## Conventions

  - Build path: this project's `Makefile` → `../Makefile` (parent
    workspace) → `~/work/projects/builder/` (central builder).
  - Stack: pnpm-only. No `package-lock.json` / `bun.lockb` / `yarn.lock`.
  - Deploy: Cloudflare Pages Git integration (no wrangler file in the
    repo). No `_redirects` SPA fallback; unknown URLs are served
    `dist/404.html` with a real 404 status.

## Heading hygiene

**Before adding any section, subsection, or heading to a Markdown
file, output the file's current heading outline first:**

```bash
grep -nE '^#+ ' path/to/file.md
```

Then confirm — in the chat — that the planned new heading's:

1. **Depth** (`#`, `##`, `###`, …) is the intended depth, not
   accidentally one level too shallow.
2. **Label** doesn't collide with existing headings — no duplicate
   `## 1. <title>`, no `### N.X` subsection labels that look like
   `vN.X` phase identifiers.

Only after that confirmation, write.

Applies especially to long-lived docs: `docs/prd.md`, `AI_AGENTS.md`,
`docs/architecture.md`, `docs/CLAUDE.md`.

**Why:** structural drift is invisible in any single editing session
— it only becomes obvious in the aggregate, by which time the doc is
hard to fix. The pre-edit outline ritual catches collisions and depth
mistakes at the point of writing, not at quarterly cleanup time.

## Deferred decisions

Things deliberately *not* shipped. Append entries with rationale so
future Claude sessions don't re-propose them.

- **US school closures** (2026-11-25) — set per district; no authoritative
  national or state source. Deferred until one exists (`docs/prd.md` v3.A).
- **Manual per-URL "Request indexing" in GSC** (2026-11-26) — operator won't
  do it; don't suggest it. IndexNow + sitemap resubmit only.
- **WebSite `SearchAction`** (2026-11-26) — the site has no search.
- **`Event` JSON-LD per holiday** (2026-11-26) — public holidays aren't events
  under Google's Event guidelines.
- **Organization `sameAs`** (2026-11-26) — no social profiles exist.
- **Personal name on /about/** (2026-11-26) — brand only, operator decision.
- **Hindu / Buddhist / Sikh calendars** (2026-11-26) — no authoritative US
  publisher found; the religious page says so.
- **Texas DPS, Texas courts, NY courts, NY DMV schedules** (2026-11-26) — no
  official statewide source found; shown as gaps, never filled in.
- **`/canada/quebec/`** (2026-11-26) — CNESST and LégisQuébec refuse automated reads; no readable official source. Don't bypass their bot protection.
- **`<changefreq>` in the sitemap** (2026-11-26) — Google ignores it; lastmod
  carries the signal (`src/lib/lastmod.ts`).
