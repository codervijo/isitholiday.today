import { HOLIDAYS, type Holiday, type HolidayType } from "./holidays";
import { scopeTimeZone, todayIn } from "./today";

export interface HolidayQuery {
  country: string;
  state?: string | null;
  type?: HolidayType | null;
  /** ISO date (YYYY-MM-DD). Wins over `now` when given. */
  today?: string;
  /** Instant to evaluate; today is its date in the scope's timezone. Defaults to the live clock. */
  now?: Date;
}

export interface HolidayResult {
  isHoliday: boolean;
  holidayName: string | null;
  type: HolidayType | null;
  date: string;
  nextHoliday: Holiday | null;
}

const matchesScope = (h: Holiday, q: HolidayQuery): boolean => {
  if (h.country !== q.country) return false;
  if (q.type && h.type !== q.type) return false;
  if (q.state && h.state && h.state !== q.state) return false;
  if (!q.state && h.state) return false; // querying country-level skips state-only entries
  return true; // national-level applies in state
};

/** Holidays in scope on or after today, soonest first. */
export function getUpcomingHolidays(query: HolidayQuery, limit = 12): Holiday[] {
  const date = query.today ?? todayIn(scopeTimeZone(query.country, query.state), query.now);
  return HOLIDAYS.filter((h) => matchesScope(h, query) && h.date >= date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

/**
 * Pure: given a country/state/type and a date, returns whether it's a holiday
 * and the next upcoming holiday in scope.
 */
export function getTodayHoliday(query: HolidayQuery): HolidayResult {
  const date = query.today ?? todayIn(scopeTimeZone(query.country, query.state), query.now);
  const inScope = HOLIDAYS.filter((h) => matchesScope(h, query));

  // State-specific observances win over a national holiday on the same day.
  const todayMatch =
    inScope.find((h) => h.date === date && h.state !== null) ??
    inScope.find((h) => h.date === date) ??
    null;

  const upcoming = inScope
    .filter((h) => h.date > date)
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextHoliday = upcoming[0] ?? null;

  return {
    isHoliday: todayMatch !== null,
    holidayName: todayMatch?.name ?? null,
    type: todayMatch?.type ?? null,
    date,
    nextHoliday,
  };
}
