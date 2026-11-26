/**
 * v3.F — state offices, courts and DMV closures for California, Texas and New
 * York. Every date below was read on 2026-11-26 from the source on its
 * institution; `through` is the last date that source covers. Institutions with
 * no official statewide schedule are listed in GAPS and the page says so —
 * this site never fills them in.
 */
import type { Source } from "./data";

export type StateKey = "california" | "texas" | "new-york";

/**
 * closed     office / court closed (source says closed, or a holiday all employees get)
 * skeleton   Texas: state holiday, agencies stay open with a skeleton crew
 * optional   Texas: optional holiday for state employees
 * floating   New York: floating holiday for certain bargaining units only
 * weekend    the holiday falls on a weekend; the source names no weekday off
 */
export type DayStatus = "closed" | "skeleton" | "optional" | "floating" | "weekend";

export interface StateDay {
  date: string;
  name: string;
  status: DayStatus;
  note?: string;
}

export interface StateInstitution {
  id: string;
  label: string;
  source: Source;
  /** Last date the source covers. */
  through: string;
  /** What the source says about weekends, if anything. */
  weekend?: string;
  /** Wording for "closed" days in this source's own terms. */
  closedText: string;
  note?: string;
  days: StateDay[];
}

const CALHR: Source = { label: "CalHR state holidays", url: "https://www.calhr.ca.gov/employees/pages/state-holidays/" };
const CA_COURTS: Source = { label: "California courts holiday schedule", url: "https://www.courts.ca.gov/holidays.htm" };
const CA_DMV: Source = {
  label: "California DMV holidays",
  url: "https://www.dmv.ca.gov/portal/about-the-california-department-of-motor-vehicles/holidays/",
};
const TX_SAO: Source = {
  label: "Texas State Auditor's Office FY2027 holiday schedule",
  url: "https://hr.sao.texas.gov/Documents/Holidays/Holidays2027.pdf",
};
const NY_CS: Source = {
  // 2026 dates: cs.ny.gov/attendance_leave/2026_legal_holidays.cfm (same format).
  label: "NY Department of Civil Service 2026 and 2027 legal holidays",
  url: "https://www.cs.ny.gov/attendance_leave/2027_legal_holidays.cfm",
};

export const STATE_INSTITUTIONS: Record<StateKey, StateInstitution[]> = {
  california: [
    {
      id: "ca-state",
      label: "State offices (state employee holidays)",
      source: CALHR,
      through: "2027-12-31",
      closedText: "State holiday",
      // CalHR publishes rules, not dates: the list below applies them.
      note: "CalHR lists holidays as rules (e.g. \"3rd Monday in January\") for excluded employees; these dates apply those rules. Represented employees follow their bargaining unit's agreement. When a holiday falls on a Saturday, employees receive holiday credit; on a Sunday, it is observed the following Monday.",
      days: [
        { date: "2026-11-11", name: "Veterans Day", status: "closed" },
        { date: "2026-11-26", name: "Thanksgiving", status: "closed" },
        { date: "2026-11-27", name: "Day after Thanksgiving", status: "closed" },
        { date: "2026-12-25", name: "Christmas Day", status: "closed" },
        { date: "2027-01-01", name: "New Year's Day", status: "closed" },
        { date: "2027-01-18", name: "Martin Luther King Jr. Day", status: "closed" },
        { date: "2027-02-15", name: "Presidents' Day", status: "closed" },
        { date: "2027-03-31", name: "Farmworkers Day (March 31)", status: "closed" },
        { date: "2027-05-31", name: "Memorial Day", status: "closed" },
        { date: "2027-07-04", name: "Independence Day", status: "weekend", note: "Sunday; observed Monday, July 5" },
        { date: "2027-07-05", name: "Independence Day (observed)", status: "closed" },
        { date: "2027-09-06", name: "Labor Day", status: "closed" },
        { date: "2027-11-11", name: "Veterans Day", status: "closed" },
        { date: "2027-11-25", name: "Thanksgiving", status: "closed" },
        { date: "2027-11-26", name: "Day after Thanksgiving", status: "closed" },
        { date: "2027-12-25", name: "Christmas Day", status: "weekend", note: "Saturday; employees receive holiday credit" },
      ],
    },
    {
      id: "ca-courts",
      label: "State courts",
      source: CA_COURTS,
      through: "2027-12-31",
      closedText: "Courts closed",
      days: [
        { date: "2026-11-11", name: "Veterans Day", status: "closed" },
        { date: "2026-11-26", name: "Thanksgiving", status: "closed" },
        { date: "2026-11-27", name: "Day After Thanksgiving", status: "closed" },
        { date: "2026-12-25", name: "Christmas Day", status: "closed" },
        { date: "2027-01-01", name: "New Year's Day", status: "closed" },
        { date: "2027-01-18", name: "Martin Luther King, Jr., Day", status: "closed" },
        { date: "2027-02-12", name: "Lincoln's Birthday", status: "closed" },
        { date: "2027-02-15", name: "Washington's Birthday", status: "closed" },
        {
          date: "2027-04-09",
          name: "Farmworkers Day (formerly Cesar Chavez Day)",
          status: "closed",
          note: "date as published by the California courts; CalHR's rule for state employees is March 31",
        },
        { date: "2027-05-31", name: "Memorial Day", status: "closed" },
        { date: "2027-06-18", name: "Juneteenth", status: "closed" },
        { date: "2027-07-05", name: "Independence Day", status: "closed" },
        { date: "2027-09-06", name: "Labor Day", status: "closed" },
        { date: "2027-09-24", name: "Native American Day", status: "closed" },
        { date: "2027-11-11", name: "Veterans Day", status: "closed" },
        { date: "2027-11-25", name: "Thanksgiving Day", status: "closed" },
        { date: "2027-11-26", name: "Day after Thanksgiving", status: "closed" },
        { date: "2027-12-24", name: "Christmas Day", status: "closed" },
      ],
    },
    {
      id: "ca-dmv",
      label: "DMV offices",
      source: CA_DMV,
      through: "2027-01-01",
      weekend: "DMV offices are closed on weekends.",
      closedText: "All DMV offices closed",
      days: [
        { date: "2026-11-11", name: "Veterans Day", status: "closed" },
        { date: "2026-11-26", name: "Thanksgiving", status: "closed" },
        { date: "2026-11-27", name: "Thanksgiving", status: "closed" },
        { date: "2026-12-25", name: "Christmas Day", status: "closed" },
        { date: "2027-01-01", name: "New Year's Day", status: "closed" },
      ],
    },
  ],
  texas: [
    {
      id: "tx-state",
      label: "State agencies",
      source: TX_SAO,
      through: "2027-08-31",
      closedText: "All agencies closed",
      note: "On a skeleton-crew holiday \"a state agency must have enough state employees on duty during a state holiday to conduct the public business of the agency\" (Texas Government Code 662.004). The FY2028 schedule (Sep 2027 onward) is not published yet.",
      days: [
        { date: "2026-11-11", name: "Veterans Day", status: "closed" },
        { date: "2026-11-26", name: "Thanksgiving Day", status: "closed" },
        { date: "2026-11-27", name: "Day after Thanksgiving", status: "closed" },
        { date: "2026-12-24", name: "Christmas Eve Day", status: "closed" },
        { date: "2026-12-25", name: "Christmas Day", status: "closed" },
        { date: "2026-12-26", name: "Day after Christmas", status: "weekend", note: "Saturday" },
        { date: "2027-01-01", name: "New Year's Day", status: "closed" },
        { date: "2027-01-18", name: "Martin Luther King, Jr. Day", status: "closed" },
        { date: "2027-01-19", name: "Confederate Heroes Day", status: "skeleton" },
        { date: "2027-02-15", name: "Presidents' Day", status: "closed" },
        { date: "2027-03-02", name: "Texas Independence Day", status: "skeleton" },
        { date: "2027-03-26", name: "Good Friday", status: "optional" },
        { date: "2027-04-21", name: "San Jacinto Day", status: "skeleton" },
        { date: "2027-05-31", name: "Memorial Day", status: "closed" },
        { date: "2027-06-19", name: "Emancipation Day", status: "weekend", note: "Saturday" },
        { date: "2027-07-04", name: "Independence Day", status: "weekend", note: "Sunday" },
        { date: "2027-08-27", name: "LBJ Day", status: "skeleton" },
      ],
    },
  ],
  "new-york": [
    {
      id: "ny-state",
      label: "State offices (executive branch employees)",
      source: NY_CS,
      through: "2027-12-31",
      closedText: "State holiday",
      note: "Applies to classified service employees in the Executive Branch. Negotiated agreements can differ.",
      days: [
        { date: "2026-11-11", name: "Veterans' Day", status: "closed" },
        { date: "2026-11-26", name: "Thanksgiving Day", status: "closed" },
        { date: "2026-12-25", name: "Christmas Day", status: "closed" },
        { date: "2027-01-01", name: "New Year's Day", status: "closed" },
        { date: "2027-01-18", name: "Dr. Martin Luther King, Jr. Day", status: "closed" },
        { date: "2027-02-12", name: "Lincoln's Birthday", status: "floating", note: "floating holiday for state employees in certain bargaining units" },
        { date: "2027-02-15", name: "Washington's Birthday (Observed)", status: "closed" },
        { date: "2027-05-31", name: "Memorial Day", status: "closed" },
        { date: "2027-06-19", name: "Juneteenth", status: "weekend", note: "Saturday; a \"pass day\" holiday with no alternate day" },
        { date: "2027-07-04", name: "Independence Day", status: "weekend", note: "Sunday; observed Monday, July 5" },
        { date: "2027-07-05", name: "Independence Day (Observed)", status: "closed" },
        { date: "2027-09-06", name: "Labor Day", status: "closed" },
        { date: "2027-10-11", name: "Columbus Day", status: "closed" },
        { date: "2027-11-02", name: "Election Day", status: "floating", note: "not yet designated as a floating holiday for 2027" },
        { date: "2027-11-11", name: "Veterans' Day", status: "closed" },
        { date: "2027-11-25", name: "Thanksgiving Day", status: "closed" },
        { date: "2027-12-25", name: "Christmas Day", status: "weekend", note: "Saturday; a \"pass day\" holiday with no alternate day" },
      ],
    },
  ],
};

/** No official statewide schedule found (docs/prd.md v3.A). Shown as gaps, never filled in. */
export const GAPS: Record<StateKey, string[]> = {
  california: [],
  texas: ["DMV (Texas DPS driver license offices)", "State courts"],
  "new-york": ["State courts", "DMV offices"],
};

export const STATE_NAMES: Record<StateKey, string> = { california: "California", texas: "Texas", "new-york": "New York" };

const STATUS_TEXT: Record<Exclude<DayStatus, "closed">, string> = {
  skeleton: "Open with a skeleton crew (state holiday)",
  optional: "Optional holiday for state employees",
  floating: "Floating holiday (some employees only)",
  weekend: "Holiday falls on the weekend",
};

export type TodayKind = "closed" | "partial" | "open" | "weekend" | "unknown";

/** One institution's status on `d`, from its source only. */
export function institutionOn(inst: StateInstitution, d: string): { kind: TodayKind; text: string; day: StateDay | null } {
  if (d > inst.through) return { kind: "unknown", text: "Dates not published yet", day: null };
  const day = inst.days.find((x) => x.date === d) ?? null;
  if (day) {
    if (day.status === "closed") return { kind: "closed", text: `${inst.closedText}: ${day.name}`, day };
    return { kind: day.status === "weekend" ? "weekend" : "partial", text: `${STATUS_TEXT[day.status]}: ${day.name}`, day };
  }
  const wd = new Date(d + "T00:00:00Z").getUTCDay();
  if (wd === 0 || wd === 6) return inst.weekend ? { kind: "closed", text: inst.weekend, day: null } : { kind: "weekend", text: "Weekend", day: null };
  return { kind: "open", text: "Not a holiday on this schedule", day: null };
}

export const upcomingStateDays = (state: StateKey, after: string, limit = 10) =>
  STATE_INSTITUTIONS[state]
    .flatMap((inst) => inst.days.filter((x) => x.date > after).map((x) => ({ inst, day: x })))
    .sort((a, b) => a.day.date.localeCompare(b.day.date) || a.inst.label.localeCompare(b.inst.label))
    .slice(0, limit);

export const isStateKey = (s: string | null | undefined): s is StateKey => !!s && s in STATE_INSTITUTIONS;
