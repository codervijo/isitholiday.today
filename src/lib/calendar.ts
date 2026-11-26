/**
 * v3.D — annual US holiday calendar: one row per date that any sourced calendar
 * lists (OPM, Federal Reserve, USPS, NYSE closures + early closes), with every
 * institution's status from holidayPages.cell(). Also the build-time ICS file.
 * Pure: no dates, names or statuses beyond what the source data holds.
 */
import { HOLIDAY_DEFS, cell, type Cell, type Institution } from "./holidayPages";
import { NYSE_CLOSED, NYSE_EARLY_CLOSE } from "./nyse";
import { CALENDARS, weekday, type DatedName } from "./usAnswers";

export const CALENDAR_YEAR = 2027;
export const CALENDAR_SLUG = `${CALENDAR_YEAR}-federal-holiday-calendar`;
export const ICS_PATH = `/${CALENDAR_SLUG}.ics`;
export const PDF_PATH = `/${CALENDAR_SLUG}.pdf`;

/** Column order for the calendar table, PDF and ICS description. */
export const CAL_COLUMNS: { id: Institution; label: string }[] = [
  { id: "federal", label: "Federal offices" },
  { id: "fed", label: "Federal Reserve" },
  { id: "postOffice", label: "Post Offices" },
  { id: "mail", label: "Mail" },
  { id: "nyse", label: "NYSE" },
];

export interface CalendarRow {
  date: string;
  name: string;
  /** Page that covers this holiday, if any. */
  slug: string | null;
  cells: Record<Institution, Cell>;
}

const LINKS: { slug: string; matches: RegExp }[] = [
  ...HOLIDAY_DEFS.map((d) => ({ slug: d.slug, matches: d.matches })),
  { slug: "new-years-day", matches: /New Year/ },
  { slug: "christmas", matches: /Christmas Day/ },
];

export const stripObserved = (name: string) => name.replace(/\s*\(?observed\)?$/i, "").trim();

export function calendarRows(year: number): CalendarRow[] {
  const inYear = (e: DatedName) => e.date.startsWith(`${year}-`);
  // Name precedence: OPM, then the Federal Reserve, USPS, NYSE.
  const lists: DatedName[][] = [CALENDARS.federal, CALENDARS.fed, CALENDARS.postal, NYSE_CLOSED, NYSE_EARLY_CLOSE];
  const names = new Map<string, string>();
  for (const list of lists) for (const e of list) if (inYear(e) && !names.has(e.date)) names.set(e.date, e.name);
  return [...names.keys()].sort().map((date) => {
    const name = names.get(date)!;
    return {
      date,
      name,
      slug: LINKS.find((l) => l.matches.test(name))?.slug ?? null,
      cells: Object.fromEntries(CAL_COLUMNS.map(({ id }) => [id, cell(id, date)])) as Record<Institution, Cell>,
    };
  });
}

/** Distinct federal holidays OPM lists in the year (observed days are not extra holidays). */
export function federalHolidayNames(year: number): string[] {
  const names = CALENDARS.federal.filter((h) => h.date.startsWith(`${year}-`)).map((h) => stripObserved(h.name));
  return [...new Set(names)];
}

/** Federal holidays whose calendar date falls on a weekend, with the observed weekday. */
export function weekendFederal(year: number): { name: string; date: string; observed: string | null }[] {
  const fed = CALENDARS.federal.filter((h) => h.date.startsWith(`${year}-`));
  return fed
    .filter((h) => !/observed/i.test(h.name) && (weekday(h.date) === 0 || weekday(h.date) === 6))
    .map((h) => ({
      name: h.name,
      date: h.date,
      observed:
        CALENDARS.federal.find(
          (o) => /observed/i.test(o.name) && stripObserved(o.name) === h.name && Math.abs(Date.parse(o.date) - Date.parse(h.date)) <= 86_400_000,
        )?.date ?? null,
    }));
}

/** Rows for the ICS: weekdays OPM lists, i.e. the days federal offices close. */
export const icsRows = (rows: CalendarRow[]) => rows.filter((r) => r.cells.federal.status === "closed");

const icsEscape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** RFC 5545 line folding: lines over 75 octets continue with CRLF + space. */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let cur = "";
  let len = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (len + n > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = "";
      len = 0;
    }
    cur += ch;
    len += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

const ymd = (iso: string) => iso.replace(/-/g, "");
const nextDay = (iso: string) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

/** All-day VEVENTs for each federal holiday closure day. `stamp` = build time (ISO). */
export function buildIcs(rows: CalendarRow[], year: number, stamp: string): string {
  const dtstamp = stamp.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//isitholiday.today//US federal holidays//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:US federal holidays ${year}`,
    "X-WR-TIMEZONE:America/New_York",
  ];
  for (const r of icsRows(rows)) {
    const status = CAL_COLUMNS.map((c) => `${c.label}: ${r.cells[c.id].text}`).join(". ");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${r.date}-federal-holiday@isitholiday.today`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${ymd(r.date)}`,
      `DTEND;VALUE=DATE:${ymd(nextDay(r.date))}`,
      `SUMMARY:${icsEscape(r.name)}`,
      `DESCRIPTION:${icsEscape(`${status}. Sources: OPM, Federal Reserve, USPS, NYSE. https://isitholiday.today/${CALENDAR_SLUG}/`)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
