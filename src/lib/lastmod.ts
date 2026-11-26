/**
 * Sitemap <lastmod> + JSON-LD dateModified: when each page's main content last
 * changed — not when the site was last built. The site rebuilds 3×/day, so a
 * build-time stamp on every URL would claim daily changes that didn't happen,
 * and Google ignores lastmod that is consistently wrong.
 *
 * Two kinds of page:
 *  - "daily": the main content is today's answer, which changes at local
 *    midnight in the page's own timezone. lastmod = that midnight (full W3C
 *    timestamp with offset), identical across the day's rebuilds.
 *  - "content": copy + sourced data. lastmod = the date that content was last
 *    revised (REVISED below), or a later data-driven rollover (holiday pages
 *    switching to next year's dates).
 *
 * Cloudflare builds from a single-commit fetch, so git history isn't available
 * at build time; REVISED is kept honest by src/lib/lastmod.git.test.ts, which
 * fails locally when a group's files changed after its REVISED date.
 */
import { ANSWER_PAGES } from "./answerPages";
import { CALENDAR_SLUG } from "./calendar";
import { CLOSURE_PAGES } from "./closures";
import { PAGES } from "./data";
import { HOLIDAY_DEFS, holidayContentSince } from "./holidayPages";
import { RELIGIOUS_SLUG } from "./religious";
import { scopeTimeZone, todayIn } from "./today";

/** Last revision date of each content group's copy/data. Bump when you change it. */
export const REVISED = {
  closures: "2026-11-26",
  holidayPages: "2026-11-26",
  calendar: "2026-11-26",
  legal: "2026-11-26",
  allLocations: "2026-11-26",
} as const;

export type Group = keyof typeof REVISED;

/** Files whose changes count as a revision of each group (checked by the git test). */
export const GROUP_FILES: Record<Group, string[]> = {
  closures: ["src/lib/closures.ts", "src/pages/ClosurePageRoute.tsx"],
  holidayPages: ["src/lib/holidayPages.ts", "src/lib/nyse.ts", "src/pages/HolidayPageRoute.tsx"],
  calendar: ["src/lib/calendar.ts", "src/lib/calendarPdf.ts", "src/pages/CalendarPageRoute.tsx"],
  legal: ["src/pages/PrivacyPage.tsx", "src/pages/TermsPage.tsx", "src/pages/AboutPage.tsx"],
  allLocations: ["src/pages/AllLocationsPage.tsx"],
};

/** Timezone offset of `tz` at `instant`, as "+05:30" / "-05:00". */
function offsetAt(tz: string, instant: number): string {
  const name =
    new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" })
      .formatToParts(new Date(instant))
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = name.match(/GMT([+-]\d{2}):?(\d{2})?/);
  return m ? `${m[1]}:${m[2] ?? "00"}` : "+00:00";
}

/** Local midnight of `now`'s date in `tz`, e.g. "2026-11-26T00:00:00-05:00". */
export function localMidnight(tz: string, now: Date): string {
  const day = todayIn(tz, now);
  const utcMidnight = Date.parse(`${day}T00:00:00Z`);
  // Offset at (approximately) local midnight; refine once for DST edges.
  let off = offsetAt(tz, utcMidnight);
  const sign = off.startsWith("-") ? -1 : 1;
  const [h, m] = off.slice(1).split(":").map(Number);
  off = offsetAt(tz, utcMidnight - sign * (h * 60 + m) * 60_000);
  return `${day}T00:00:00${off}`;
}

export type Lastmod = { kind: "daily" | "content"; value: string };

const max = (...d: string[]) => d.sort().at(-1)!;

/**
 * lastmod for a site path ("/", "/usa/texas/", …). Throws for an unclassified
 * path so a new page can't silently get a wrong date.
 */
export function lastmodFor(path: string, now: Date): Lastmod {
  const slug = path.replace(/^\/|\/$/g, "");
  const daily = (tz: string): Lastmod => ({ kind: "daily", value: localMidnight(tz, now) });
  const content = (d: string): Lastmod => ({ kind: "content", value: d });
  const us = "America/New_York";

  if (slug === "" || slug === "holiday-checker" || slug === RELIGIOUS_SLUG) return daily(us);
  if (ANSWER_PAGES.some((p) => p.slug === slug)) return daily(us);
  const page = PAGES.find((p) => p.slug === slug);
  if (page) return daily(scopeTimeZone(page.prefill.country, page.prefill.state ?? null));
  if (CLOSURE_PAGES.some((p) => p.slug === slug)) return content(REVISED.closures);
  const def = HOLIDAY_DEFS.find((d) => d.slug === slug);
  if (def) return content(max(REVISED.holidayPages, holidayContentSince(def, todayIn(us, now))));
  if (slug === CALENDAR_SLUG) return content(REVISED.calendar);
  if (slug === "privacy" || slug === "terms" || slug === "about") return content(REVISED.legal);
  if (slug === "all-locations") return content(REVISED.allLocations);
  throw new Error(`lastmodFor: unclassified path ${path} — add it to src/lib/lastmod.ts`);
}
