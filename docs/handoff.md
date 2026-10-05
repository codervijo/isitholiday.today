# Handoff — isitholiday.today

Read this first next session, after `AI_AGENTS.md`. It records where work stopped and what is
waiting. Overwrite it at the end of each session; it does not keep history (`docs/prd.md` and
`git log` do).

**Last session:** 2026-10-05. **`main` = `origin/main` = `10afef5`**, deployed and smoke-tested live.

## What shipped this session

| Commit | Repo | What |
|---|---|---|
| `f270838` | isitholiday.today | **v2.F** date correctness: "today" per scope timezone (`src/lib/today.ts`), `__BUILD_TIME__` shared by SSR + first client render, `public/_headers`, rebuild Worker source. **v2.E** row 1: every page links to every other page. **v2.I** slice: `/india/` intro + sources, upcoming-holidays table on all location pages. (The commit subject says "v2.H"; the PRD later renumbered that phase to v2.I.) |
| `10afef5` | isitholiday.today | **v2.G** planned (US answer-engine pages); `AI_AGENTS.md` placeholders filled from operator answers |
| `a034670` | portfolio | **v36.D / BUG-093**: GSC snapshot merge-on-save; `project seo` Blockers built from the same coverage the table shows |

Outside git: Cloudflare Worker **`isitholiday-daily-rebuild`** (uploaded via the CF API) fires the Pages deploy
hook `daily-rebuild` → `main` at 18:35, 05:05 and 08:05 UTC.

## Verify first next session

1. **Did the rebuild Worker fire?** Builds after 2026-10-06 05:05 UTC should be hook-triggered, not push-triggered:
   ```bash
   set -a; . ~/work/projects/sites/portfolio/portfolio.env; set +a
   curl -s -H "Authorization: Bearer $CF_API_TOKEN" \
     "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/pages/projects/isitholiday-today/deployments?per_page=5" \
     | jq -r '.result[] | "\(.created_on) \(.deployment_trigger.type) \(.latest_stage.status)"'
   ```
   Expect `deploy_hook` rows at about those times. If there are none, check the Worker's logs in the
   [CF dashboard](https://dash.cloudflare.com/?to=/:account/workers/services/view/isitholiday-daily-rebuild/production/logs).
2. **Live date matches the zone:** `curl -s https://isitholiday.today/india/ | grep -o 'Answer for <!-- -->[^<]*'`

## Operator actions waiting (not code)

- **Request recrawl** for `/india/` (GSC soft-404) and the "Discovered — not indexed" URLs listed in PRD **v2.H**:
  [URL inspection](https://search.google.com/search-console/inspect?resource_id=sc-domain:isitholiday.today).
- **Optional: rotate the deploy hook.** Its ID was printed in the 2026-10-05 session transcript. Worst case is
  someone triggering rebuilds. Steps are in `workers/daily-rebuild/src/index.js` ("TO ROTATE THE HOOK").

## Queue (per `docs/prd.md` § 5)

1. **v2.E rest** (XS each): `<meta name="robots">` site-wide + `noindex` on NotFound; homepage `WebApplication`
   JSON-LD `url` must equal the canonical (currently `/holiday-checker/`).
2. **v2.G answer-engine pages.** Two open questions are logged in PRD § 6, and the operator must answer them before build:
   whether `/` *is* the "what holiday is today" page, and whether the homepage default country should change from India to the US.
   USPS observed-holiday data needs an official source before any mail page ships.
3. **v2.H** index repair ops (operator-run), then **v2.I** golden-page content for the other 8 pages.

## Known problems not yet fixed

- **India bank data has 1 entry** (1 Apr annual closing). `/india/bank-holiday/` answers "No" on gazetted
  holidays and shows no upcoming table. It needs RBI holiday-matrix data, which varies by state.
- **Homepage FAQ claims UK, Canada and Australia coverage**, which doesn't exist (`src/pages/Index.tsx` `FAQS`).
- **Deploy-config contradiction** in `AI_AGENTS.md` ("no `wrangler.toml`" vs "`wrangler.jsonc`"); no wrangler
  file exists at the repo root. Tracked in PRD v2.L.
- `docs/CLAUDE.md` is still template text; `docs/growth.md` review is overdue (both v2.L).
- `.env.example` is untracked and template-only; the operator hasn't decided whether to delete or commit it.
- Portfolio: 4 other `v16c_inspections` readers still read latest-only (portfolio `architecture.md` § Tracked refactors).

## Gotchas learned

- Cloudflare Pages/Workers API calls need the **fleet token in `portfolio/portfolio.env`**. The
  `~/.config/portfolio/cloudflare/token` token is zone-only.
- Pages project name is `isitholiday-today` (hyphen), account `CF_ACCOUNT_ID` from the same env file.
- Build/test only via `docker run --rm -v /home/vijo/work/projects/sites:/usr/src/app sites1 bash -c 'cd /usr/src/app/isitholiday.today && pnpm build && pnpm test && pnpm test:seo'`.
- Never call `new Date()` in render code; use `useNow()` / `BUILD_TIME` (`src/lib/today.ts`).
- Portfolio full suite has 1 failure that predates this session (`tests/checks/test_check_143_deploy_drift.py::test_fail_when_declared_vercel_but_actual_is_wordpress`).
