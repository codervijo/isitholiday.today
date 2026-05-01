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

## How to build / install / test — docker only
**Do not run `pnpm` (or `npm`/`node`) from the host.** The build environment lives in the parent `sites/` Docker image (`sites1:latest`, built from `../Dockerfile`, Volta-managed Node 18.17.1 + pnpm). The host may have a different Node/pnpm — keep them out of this project.

The parent `sites/` directory mounts at `/usr/src/app` inside the container. The interactive entrypoint is `make buildsh` (from `../`), which runs `dev_container.sh` and drops you into a shell. For agent / scripted use, run one-off commands non-interactively against the same image and mount:

```bash
# from the host, but executing inside the sites1 container:
docker run --rm -v /home/vijo/work/projects/sites:/usr/src/app sites1 \
  bash -c 'cd /usr/src/app/isitholiday.today && pnpm install && pnpm build && pnpm test'
```

Inside the container, the parent Makefile targets are also available (they require `IS_DOCKER=yes`, which is true via `/.dockerenv`):
- `make test proj=isitholiday.today` — `pnpm install` → `pnpm build` → `pnpm test`
- `make run proj=isitholiday.today` — `pnpm install` → `pnpm dev` (port 8080)

Project-local scripts (run with `pnpm <script>` inside the container):
- `dev` — vite dev server on :8080
- `build` — `tsc -b && vite build` → `dist/`
- `preview` — serve `dist/` locally
- `test` — `vitest run` (run-once)

If the `sites1` image is missing, build it first with `make buildsh` from `../` (interactive — needs a real terminal) or `docker build -t sites1 ..` from this repo's parent.

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

## Prompt history — `docs/Prompts.md`
After a feature ships successfully (commit lands, build green, acceptance criteria met), append the prompt that drove it to `docs/Prompts.md`. Format: `## YYYY-MM-DD — <short title>` followed by the prompt text and a brief `**Outcome:**` line. Capture only the prompts behind real features, scaffolds, or reusable templates — not every chat, not exploratory questions, not bug-fix back-and-forth. The goal is a durable record of the prompts that produced shipped work.

## Out of scope / don't touch
- `genai/` — Lovable reference scaffold, gitignored. Don't modify or delete.
- The parent `sites/` Makefile and `dev_container.sh` — shared across all sibling projects.

## Status
- **Stack settled:** Vite 6 + React 18 + TypeScript + Tailwind 3 + shadcn/ui + pnpm.
- **Earlier dead end (do not retry):** Astro + MUI (CJS/ESM interop crash).
- **Next step:** seed more holidays into `src/lib/holidays.ts`, append more `PAGES` entries in `src/lib/data.ts`, wire Cloudflare Pages deploy.

## Goal — guiding principle
This is NOT a product. It's a high-frequency query engine. Success = coverage (many pages) × accuracy (correct daily answer) × speed (fast load). Prefer simplicity over flexibility, speed over completeness, shipping over perfection.
