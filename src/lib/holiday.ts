import { HOLIDAYS, type Holiday, type HolidayType } from "./holidays";

export interface HolidayQuery {
  country: string;
  state?: string | null;
  type?: HolidayType | null;
  /** ISO date (YYYY-MM-DD). Defaults to today in UTC. */
  today?: string;
}

export interface HolidayResult {
  isHoliday: boolean;
  holidayName: string | null;
  type: HolidayType | null;
  date: string;
  nextHoliday: Holiday | null;
}

const todayIso = (): string => new Date().toISOString().slice(0, 10);

const matchesScope = (h: Holiday, q: HolidayQuery): boolean => {
  if (h.country !== q.country) return false;
  if (q.state && h.state && h.state !== q.state) return false;
  if (q.state && !h.state) return true; // national-level applies in state
  if (!q.state && h.state) return false; // querying country-level skips state-only entries
  if (q.type && h.type !== q.type) return false;
  return true;
};

/**
 * Pure: given a country/state/type and a date, returns whether it's a holiday
 * and the next upcoming holiday in scope.
 */
export function getTodayHoliday(query: HolidayQuery): HolidayResult {
  const date = query.today ?? todayIso();
  const inScope = HOLIDAYS.filter((h) => matchesScope(h, query));

  const todayMatch = inScope.find((h) => h.date === date) ?? null;

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
