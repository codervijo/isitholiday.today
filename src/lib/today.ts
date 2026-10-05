/**
 * "Today" for a holiday scope.
 *
 * The site is prerendered static, so whatever date the build computes is what
 * crawlers see until the next build. Two rules keep that honest:
 *
 * 1. Today is a calendar date IN THE SCOPE'S TIMEZONE, never the UTC date —
 *    India is 5:30 ahead of UTC and the US evening is already "tomorrow" in UTC.
 * 2. The server render and the first client render both use BUILD_TIME, so
 *    hydration never contradicts the static HTML. Components advance to the
 *    live clock in a post-mount effect (see useNow). The daily rebuild Worker
 *    (workers/daily-rebuild/) keeps BUILD_TIME at most a day old.
 */
import { useEffect, useState } from "react";

declare const __BUILD_TIME__: string;

/** ISO instant the bundle was built. Falls back to "now" outside Vite (tests). */
export const BUILD_TIME: Date =
  typeof __BUILD_TIME__ !== "undefined" ? new Date(__BUILD_TIME__) : new Date();

const COUNTRY_TZ: Record<string, string> = {
  india: "Asia/Kolkata",
  usa: "America/New_York",
};

const STATE_TZ: Record<string, string> = {
  "usa/california": "America/Los_Angeles",
  "usa/texas": "America/Chicago",
  "usa/new-york": "America/New_York",
};

export function scopeTimeZone(country: string, state?: string | null): string {
  return (state && STATE_TZ[`${country}/${state}`]) ?? COUNTRY_TZ[country] ?? "UTC";
}

/** YYYY-MM-DD for `now` as observed in `timeZone`. */
export function todayIn(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * BUILD_TIME during SSR and the hydration render, then the live clock once
 * mounted. Re-checks every minute so a tab left open past midnight rolls over.
 */
export function useNow(): Date {
  const [now, setNow] = useState<Date>(BUILD_TIME);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}
