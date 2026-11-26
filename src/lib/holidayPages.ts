/**
 * v3.C — one page per US federal holiday: banks (Federal Reserve), Post Offices
 * and mail (USPS), the stock market (NYSE) and federal offices (OPM).
 *
 * Nothing here is hand-written per year. Each page finds the holiday's next
 * occurrence from the build date and reads every status from the sourced
 * calendars (usAnswers.ts, nyse.ts), so the copy rolls forward on each rebuild.
 * Christmas and New Year's Day keep their v2.G pages (closures.ts).
 *
 * Weekend cells are "—" unless a source lists the day: no source here states
 * weekend hours for federal offices, the Federal Reserve or NYSE.
 */
import type { Faq } from "./closures";
import { NYSE_CLOSED, NYSE_EARLY_CLOSE, NYSE_EARLY_CLOSE_TIME, nyseClosed, nyseEarly } from "./nyse";
import { CALENDARS, coveredThrough, daysBetween, on, weekday, type DatedName, type UsSourceId } from "./usAnswers";

export interface HolidayDef {
  slug: string;
  /** Full name, as in H1s. */
  name: string;
  /** Short name for titles. */
  short: string;
  /** Matches this holiday's entry names on every calendar. */
  matches: RegExp;
  /** "the fourth Thursday in November" */
  rule: string;
  nominal: (year: number) => string;
}

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** nth (1-based) weekday (0 = Sun) of a month. */
function nthWeekday(y: number, m: number, wd: number, n: number): string {
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  return iso(y, m, 1 + ((wd - first + 7) % 7) + (n - 1) * 7);
}

function lastWeekday(y: number, m: number, wd: number): string {
  const lastDay = new Date(Date.UTC(y, m, 0));
  const back = (lastDay.getUTCDay() - wd + 7) % 7;
  return iso(y, m, lastDay.getUTCDate() - back);
}

export const HOLIDAY_DEFS: HolidayDef[] = [
  {
    slug: "mlk-day",
    name: "Martin Luther King Jr. Day",
    short: "MLK Day",
    matches: /Martin Luther King|MLK/,
    rule: "the third Monday in January",
    nominal: (y) => nthWeekday(y, 1, 1, 3),
  },
  {
    slug: "presidents-day",
    name: "Presidents' Day",
    short: "Presidents' Day",
    matches: /President|Washington/,
    rule: "the third Monday in February (officially Washington's Birthday)",
    nominal: (y) => nthWeekday(y, 2, 1, 3),
  },
  {
    slug: "memorial-day",
    name: "Memorial Day",
    short: "Memorial Day",
    matches: /Memorial/,
    rule: "the last Monday in May",
    nominal: (y) => lastWeekday(y, 5, 1),
  },
  {
    slug: "juneteenth",
    name: "Juneteenth",
    short: "Juneteenth",
    matches: /Juneteenth/,
    rule: "June 19",
    nominal: (y) => iso(y, 6, 19),
  },
  {
    slug: "fourth-of-july",
    name: "Independence Day (Fourth of July)",
    short: "July 4th",
    matches: /Independence/,
    rule: "July 4",
    nominal: (y) => iso(y, 7, 4),
  },
  {
    slug: "labor-day",
    name: "Labor Day",
    short: "Labor Day",
    matches: /Labor/,
    rule: "the first Monday in September",
    nominal: (y) => nthWeekday(y, 9, 1, 1),
  },
  {
    slug: "columbus-day",
    name: "Columbus Day",
    short: "Columbus Day",
    matches: /Columbus/,
    rule: "the second Monday in October",
    nominal: (y) => nthWeekday(y, 10, 1, 2),
  },
  {
    slug: "veterans-day",
    name: "Veterans Day",
    short: "Veterans Day",
    matches: /Veterans/,
    rule: "November 11",
    nominal: (y) => iso(y, 11, 11),
  },
  {
    slug: "thanksgiving",
    name: "Thanksgiving",
    short: "Thanksgiving",
    matches: /Thanksgiving/,
    rule: "the fourth Thursday in November",
    nominal: (y) => nthWeekday(y, 11, 4, 4),
  },
];

export type Institution = "fed" | "postOffice" | "mail" | "nyse" | "federal";

export const INSTITUTIONS: { id: Institution; label: string; sources: UsSourceId[] }[] = [
  { id: "fed", label: "Federal Reserve Banks", sources: ["fed"] },
  { id: "postOffice", label: "Post Offices", sources: ["usps"] },
  { id: "mail", label: "Mail delivery", sources: ["usps", "uspsDelivery"] },
  { id: "nyse", label: "Stock market (NYSE)", sources: ["nyse"] },
  { id: "federal", label: "Federal government offices", sources: ["opm"] },
];

export type CellStatus = "closed" | "open" | "early" | "none";
export interface Cell {
  status: CellStatus;
  text: string;
}

const isWeekend = (d: string) => weekday(d) === 0 || weekday(d) === 6;

const NYSE_THROUGH = NYSE_CLOSED[NYSE_CLOSED.length - 1].date;
/** Whether this site has the institution's published schedule for `d`'s year. */
export function covered(inst: Institution, d: string): boolean {
  const y = d.slice(0, 4);
  const through =
    inst === "nyse" ? NYSE_THROUGH : coveredThrough(inst === "postOffice" || inst === "mail" ? "postal" : inst);
  return y <= through.slice(0, 4);
}
const NOT_PUBLISHED: Cell = { status: "none", text: "Not in this site's data yet" };

/** One institution's status on one date, from the sourced calendars only. */
export function cell(inst: Institution, d: string): Cell {
  if (!covered(inst, d)) return NOT_PUBLISHED;
  const wd = weekday(d);
  switch (inst) {
    case "federal":
    case "fed": {
      const e = on(inst, d);
      if (e) return isWeekend(d) ? { status: "none", text: "Holiday falls on the weekend" } : { status: "closed", text: "Closed" };
      return isWeekend(d) ? { status: "none", text: "—" } : { status: "open", text: "Open" };
    }
    case "postOffice": {
      if (on("postal", d)) return { status: "closed", text: "Closed" };
      if (wd === 0) return { status: "closed", text: "Usually closed (Sunday)" };
      if (wd === 6) return { status: "none", text: "—" };
      return { status: "open", text: "Open" };
    }
    case "mail": {
      if (on("postal", d)) return { status: "closed", text: "No regular delivery" };
      if (wd === 0) return { status: "closed", text: "No regular delivery (Sunday)" };
      return { status: "open", text: "Regular delivery" };
    }
    case "nyse": {
      if (nyseClosed(d)) return { status: "closed", text: "Closed" };
      if (nyseEarly(d)) return { status: "early", text: `Closes early, ${NYSE_EARLY_CLOSE_TIME}` };
      return isWeekend(d) ? { status: "none", text: "—" } : { status: "open", text: "Open" };
    }
  }
}

export const formatLong = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

const formatShort = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const dayName = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });

/** All dates within 3 days of the nominal date that any calendar ties to this holiday. */
function windowDates(def: HolidayDef, nominal: string): string[] {
  const near = (d: string) => Math.abs(daysBetween(nominal, d)) <= 3;
  const lists: DatedName[][] = [CALENDARS.federal, CALENDARS.fed, CALENDARS.postal, NYSE_CLOSED, NYSE_EARLY_CLOSE];
  const dates = new Set<string>([nominal]);
  for (const list of lists) for (const e of list) if (near(e.date) && def.matches.test(e.name)) dates.add(e.date);
  return [...dates].sort();
}

export interface HolidayView {
  def: HolidayDef;
  year: number;
  nominal: string;
  /** The weekday most institutions close (federal observed date, else nominal). */
  main: string;
  dates: string[];
  cells: Record<Institution, Cell[]>;
  title: string;
  h1: string;
  description: string;
  headline: string;
  details: string[];
  faq: Faq[];
}

/** The occurrence a page should show on `today`: this year's unless every related date has passed. */
export function occurrence(def: HolidayDef, today: string): { year: number; nominal: string; dates: string[] } | null {
  const y = Number(today.slice(0, 4));
  for (const year of [y, y + 1]) {
    const nominal = def.nominal(year);
    const dates = windowDates(def, nominal);
    if (dates[dates.length - 1] < today) continue;
    if (!INSTITUTIONS.some((i) => covered(i.id, nominal))) return null;
    return { year, nominal, dates };
  }
  return null;
}

/**
 * Date the page started showing its current occurrence: the day after the
 * previous occurrence's last related date. Used for lastmod — the page's
 * dates and statuses changed then, not on every rebuild.
 */
export function holidayContentSince(def: HolidayDef, today: string): string {
  const occ = occurrence(def, today);
  const year = occ ? occ.year : Number(today.slice(0, 4));
  const prev = windowDates(def, def.nominal(year - 1));
  const d = new Date(prev[prev.length - 1] + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function buildHolidayView(def: HolidayDef, today: string): HolidayView | null {
  const occ = occurrence(def, today);
  if (!occ) return null;
  const { year, nominal, dates } = occ;
  const cells = Object.fromEntries(
    INSTITUTIONS.map(({ id }) => [id, dates.map((d) => cell(id, d))]),
  ) as Record<Institution, Cell[]>;

  const weekdayEntry = (cal: "federal" | "fed" | "postal") =>
    dates.find((d) => !isWeekend(d) && on(cal, d) && def.matches.test(on(cal, d)!.name)) ?? null;
  const weekendEntry = (cal: "federal" | "fed" | "postal") =>
    dates.find((d) => isWeekend(d) && on(cal, d) && def.matches.test(on(cal, d)!.name)) ?? null;
  const observedNote = (d: string) =>
    d !== nominal ? `, the observed holiday (${def.short} itself falls on ${dayName(nominal)})` : "";

  const fedDay = weekdayEntry("federal");
  const main = fedDay ?? nominal;

  // Banks (Federal Reserve).
  const fr = weekdayEntry("fed");
  const frWeekend = weekendEntry("fed");
  const missing = (who: string) => `This site does not have the ${who} ${year} schedule yet.`;
  let bank: string;
  if (!covered("fed", nominal)) bank = missing("Federal Reserve's");
  else if (fr) bank = `Yes. ${def.name} is a Federal Reserve holiday: Federal Reserve Banks are closed ${formatLong(fr)}${observedNote(fr)}.`;
  else if (frWeekend && weekday(frWeekend) === 6) {
    const fri = dates.find((d) => daysBetween(d, frWeekend) === 1);
    bank = `Yes, but ${def.name} falls on ${formatLong(frWeekend)}. It is on the Federal Reserve holiday schedule, and for a Saturday holiday Federal Reserve Banks are open the preceding Friday${fri ? ` (${formatLong(fri)})` : ""}.`;
  } else bank = `No. ${def.name} ${year} is not on the Federal Reserve holiday schedule.`;

  // Post Offices + mail (USPS).
  const ps = weekdayEntry("postal");
  const psWeekend = weekendEntry("postal");
  let postal: string;
  if (!covered("postOffice", nominal)) postal = missing("USPS");
  else if (ps) postal = `Post Offices are closed and there is no regular mail delivery on ${formatLong(ps)}${observedNote(ps)}.`;
  else if (psWeekend) {
    const fri = dates.find((d) => weekday(d) === 5 && cell("postOffice", d).status === "open");
    postal = `${def.name} falls on ${formatLong(psWeekend)}, a USPS postal holiday with no regular mail delivery.${
      fri ? ` Post Offices are open and mail is delivered on ${formatLong(fri)}.` : ""
    }`;
  } else postal = `${def.name} ${year} is not on USPS's postal holiday list, so Post Offices are open and mail is delivered.`;

  // Stock market (NYSE).
  const nc = dates.filter((d) => nyseClosed(d));
  const ne = dates.filter((d) => nyseEarly(d));
  let market: string;
  if (!covered("nyse", nominal)) market = missing("NYSE");
  else if (nc.length) market = `The stock market (NYSE) is closed ${nc.map(formatLong).join(" and ")}.`;
  else if (!isWeekend(nominal)) market = `The stock market (NYSE) is open on ${def.name}: ${formatLong(nominal)} is not on NYSE's holiday list.`;
  else market = `NYSE lists no market holiday for ${def.name} ${year}.`;
  if (ne.length) market += ` It closes early, at ${NYSE_EARLY_CLOSE_TIME}, on ${ne.map(formatLong).join(" and ")}.`;

  // Federal offices (OPM).
  const federal = !covered("federal", nominal)
    ? missing("OPM")
    : fedDay
    ? `${def.name} is a federal holiday: federal government offices are closed ${formatLong(fedDay)}${observedNote(fedDay)}.`
    : `${def.name} ${year} has no weekday federal holiday on OPM's list.`;

  const branch = "Individual banks set their own branch hours, so check with your bank.";
  return {
    def,
    year,
    nominal,
    main,
    dates,
    cells,
    title: `Is ${def.short} ${year} a Bank Holiday? Banks, Mail & NYSE`,
    h1: `Is ${def.name} ${year} a bank holiday?`,
    description: `${def.short} ${year} is ${formatShort(main)}. Are banks, Post Offices and the stock market open? Federal Reserve, USPS, NYSE and federal office status, with sources.`,
    headline: bank,
    details: [postal, market, federal],
    faq: [
      { question: `Is ${def.name} ${year} a bank holiday?`, answer: `${bank} ${branch}` },
      { question: `Is the post office open on ${def.name} ${year}?`, answer: postal },
      { question: `Is the stock market open on ${def.name} ${year}?`, answer: market },
      { question: `Is ${def.name} a federal holiday?`, answer: federal },
    ],
  };
}

/** Shared explainer paragraphs (holiday-specific rule sentence is added by the route). */
export const OBSERVED_RULES = [
  "When a federal holiday falls on a Saturday, federal employees get the preceding Friday off; on a Sunday, the following Monday (OPM).",
  "The Federal Reserve handles Saturdays differently: \"For holidays falling on Saturday, Federal Reserve Banks and Branches will be open the preceding Friday.\" For a Sunday holiday, Federal Reserve offices close the following Monday.",
  "USPS keeps Post Offices open on the Friday before a Saturday postal holiday (as it says for Juneteenth and Christmas in 2027). NYSE publishes its own list and does not always add an observed day: \"Because the holiday falls on Saturday, January 1, 2028, no New Year's Day holiday is observed.\"",
];
