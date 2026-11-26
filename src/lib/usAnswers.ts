/**
 * v2.H — pure answer logic for the US "today" pages.
 *
 * Three calendars, each from its own official source:
 *   - federal:  OPM federal holidays        → HOLIDAYS (country usa, national, type public)
 *   - fed:      Federal Reserve K.8 schedule → HOLIDAYS (country usa, national, type bank)
 *   - postal:   USPS postal holidays         → POSTAL_HOLIDAYS below
 *
 * Weekend facts come only from USPS (regular delivery Monday–Saturday; retail
 * usually closed Sundays). The site has no weekend data for banks or federal
 * offices, so it never asserts their weekend hours.
 */
import type { Source } from "./data";
import { HOLIDAYS } from "./holidays";

export const US_TZ = "America/New_York";

export const US_SOURCES = {
  opm: {
    label: "OPM federal holidays",
    url: "https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/",
  },
  fed: {
    label: "Federal Reserve holiday schedule",
    url: "https://www.federalreserve.gov/aboutthefed/k8.htm",
  },
  usps: {
    label: "USPS holidays",
    url: "https://about.usps.com/newsroom/events/",
  },
  uspsDelivery: {
    label: "USPS FAQ: No mail delivery?",
    url: "https://faq.usps.com/s/article/No-Mail-Delivery",
  },
  uspsSunday: {
    label: "USPS release: retail Post Offices closed Easter Sunday (2025)",
    url: "https://about.usps.com/newsroom/local-releases/ny/2025/0404-retail-post-offices-closed-easter-sunday.htm",
  },
} satisfies Record<string, Source>;

export type UsSourceId = keyof typeof US_SOURCES;

export interface DatedName {
  date: string;
  name: string;
}

// Source: about.usps.com/newsroom/events/ (read 2026-11-23). The page lists only
// the remaining 2026 holidays, and all of 2027. Footnote for 2027: "Post Offices
// will be open on Friday, June 18, and Friday, Dec. 24, and deliveries will occur
// as normal." So USPS does NOT shift Saturday holidays to Friday the way OPM does.
export const POSTAL_HOLIDAYS: DatedName[] = [
  { date: "2026-11-26", name: "Thanksgiving Day" },
  { date: "2026-12-25", name: "Christmas Day" },
  { date: "2027-01-01", name: "New Year's Day" },
  { date: "2027-01-18", name: "Martin Luther King, Jr. Day" },
  { date: "2027-02-15", name: "Presidents Day" },
  { date: "2027-05-31", name: "Memorial Day" },
  { date: "2027-06-19", name: "Juneteenth" },
  { date: "2027-07-05", name: "Independence Day" },
  { date: "2027-09-06", name: "Labor Day" },
  { date: "2027-10-11", name: "Columbus Day" },
  { date: "2027-11-11", name: "Veterans Day" },
  { date: "2027-11-25", name: "Thanksgiving Day" },
  { date: "2027-12-25", name: "Christmas Day" },
];

const usNational = (type: "public" | "bank"): DatedName[] =>
  HOLIDAYS.filter((h) => h.country === "usa" && h.state === null && h.type === type)
    .map(({ date, name }) => ({ date, name }))
    .sort((a, b) => a.date.localeCompare(b.date));

export const FEDERAL_HOLIDAYS = usNational("public");
// Strip the "Federal Reserve closed (…)" wrapper for display.
export const FED_CLOSURES = usNational("bank").map((h) => ({
  date: h.date,
  name: h.name.replace(/^Federal Reserve closed \((.*)\)$/, "$1"),
}));

export type Calendar = "federal" | "fed" | "postal";

export const CALENDARS: Record<Calendar, DatedName[]> = {
  federal: FEDERAL_HOLIDAYS,
  fed: FED_CLOSURES,
  postal: POSTAL_HOLIDAYS,
};

export const CALENDAR_LABEL: Record<Calendar, string> = {
  federal: "Federal holiday",
  fed: "Federal Reserve closed",
  postal: "USPS postal holiday",
};

/** The calendars' data end date: answers past it would be guesses. */
export function coveredThrough(cal: Calendar): string {
  const list = CALENDARS[cal];
  return list[list.length - 1].date;
}

export const on = (cal: Calendar, date: string): DatedName | null =>
  CALENDARS[cal].find((h) => h.date === date) ?? null;

export const upcoming = (cal: Calendar, fromInclusive: string, limit = 6): DatedName[] =>
  CALENDARS[cal].filter((h) => h.date >= fromInclusive).slice(0, limit);

export function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(to + "T00:00:00Z") - Date.parse(from + "T00:00:00Z")) / 86_400_000);

/** 0 = Sunday … 6 = Saturday. */
export const weekday = (iso: string) => new Date(iso + "T00:00:00Z").getUTCDay();

export const formatLong = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

const dayName = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });

export type AnswerKind =
  | "what-today"
  | "tomorrow"
  | "next"
  | "federal"
  | "post-office"
  | "mail"
  | "mail-tomorrow"
  | "banks"
  | "banks-tomorrow";

export interface Answer {
  /** true = "yes, it's a holiday / it's closed"; drives the colour of the answer. */
  closed: boolean;
  /** The one-line answer. */
  headline: string;
  /** Supporting sentences. */
  details: string[];
  /** Which date the answer is about. */
  date: string;
  /** Calendar whose upcoming dates the page lists. */
  calendar: Calendar;
  sources: UsSourceId[];
}

function nextLine(cal: Calendar, after: string, today: string, noun: string): string {
  const n = upcoming(cal, addDays(after, 1), 1)[0];
  if (!n) return `This site has no ${noun} dates after ${formatLong(coveredThrough(cal))} yet.`;
  const d = daysBetween(today, n.date);
  return `The next ${noun} is ${n.name} on ${formatLong(n.date)}, ${d === 1 ? "tomorrow" : `${d} days away`}.`;
}

/** Pure: the answer for one page kind on one US (Eastern) calendar date. */
export function computeAnswer(kind: AnswerKind, today: string): Answer {
  switch (kind) {
    case "what-today":
    case "federal": {
      const fed = on("federal", today);
      const details: string[] = [];
      if (kind === "what-today") {
        const fr = on("fed", today);
        const ps = on("postal", today);
        details.push(
          fr ? `The Federal Reserve is closed (${fr.name}).` : "It is not a Federal Reserve holiday.",
          ps ? `It is a USPS postal holiday (${ps.name}).` : "It is not a USPS postal holiday.",
        );
      }
      details.push(nextLine("federal", today, today, "federal holiday"));
      return {
        closed: !!fed,
        headline: fed
          ? `Yes. Today, ${formatLong(today)}, is ${fed.name}, a US federal holiday.`
          : `No. Today, ${formatLong(today)}, is not a US federal holiday.`,
        details,
        date: today,
        calendar: "federal",
        sources: kind === "what-today" ? ["opm", "fed", "usps"] : ["opm"],
      };
    }
    case "tomorrow": {
      const t = addDays(today, 1);
      const fed = on("federal", t);
      const fr = on("fed", t);
      const ps = on("postal", t);
      return {
        closed: !!fed,
        headline: fed
          ? `Yes. Tomorrow, ${formatLong(t)}, is ${fed.name}, a US federal holiday.`
          : `No. Tomorrow, ${formatLong(t)}, is not a US federal holiday.`,
        details: [
          fr ? `The Federal Reserve is closed tomorrow (${fr.name}).` : "Tomorrow is not a Federal Reserve holiday.",
          ps ? `Tomorrow is a USPS postal holiday (${ps.name}).` : "Tomorrow is not a USPS postal holiday.",
          nextLine("federal", t, today, "federal holiday after tomorrow"),
        ],
        date: t,
        calendar: "federal",
        sources: ["opm", "fed", "usps"],
      };
    }
    case "next": {
      const todayFed = on("federal", today);
      const n = upcoming("federal", addDays(today, 1), 1)[0];
      const details: string[] = [];
      if (todayFed) details.push(`Today is ${todayFed.name}.`);
      const fr = upcoming("fed", addDays(today, 1), 1)[0];
      const ps = upcoming("postal", addDays(today, 1), 1)[0];
      if (fr) details.push(`Next Federal Reserve closure: ${fr.name}, ${formatLong(fr.date)}.`);
      if (ps) details.push(`Next USPS postal holiday: ${ps.name}, ${formatLong(ps.date)}.`);
      return {
        closed: false,
        headline: n
          ? `The next US federal holiday is ${n.name} on ${formatLong(n.date)}, ${
              daysBetween(today, n.date) === 1 ? "tomorrow" : `${daysBetween(today, n.date)} days away`
            }.`
          : `This site has no federal holiday dates after ${formatLong(coveredThrough("federal"))} yet.`,
        details,
        date: n?.date ?? today,
        calendar: "federal",
        sources: ["opm", "fed", "usps"],
      };
    }
    case "post-office": {
      const ps = on("postal", today);
      const sunday = weekday(today) === 0;
      const details: string[] = [];
      if (!ps && sunday)
        details.push("USPS says its facilities are usually closed for retail transactions on Sundays.");
      if (!ps && !sunday)
        details.push("Hours differ by location; check your local Post Office's hours before you go.");
      details.push(nextLine("postal", today, today, "USPS postal holiday"));
      return {
        closed: !!ps || sunday,
        headline: ps
          ? `No. Post Offices are closed today, ${formatLong(today)}, for ${ps.name}, a USPS postal holiday.`
          : sunday
            ? `Usually not: today is Sunday, ${formatLong(today)}. It is not a postal holiday, but Post Offices are usually closed for retail on Sundays.`
            : `Yes. Today, ${formatLong(today)}, is not a USPS postal holiday, so Post Offices keep their regular hours.`,
        details,
        date: today,
        calendar: "postal",
        sources: sunday ? ["usps", "uspsSunday"] : ["usps"],
      };
    }
    case "mail":
      return mailAnswer(today, today, "today");
    case "mail-tomorrow":
      return mailAnswer(addDays(today, 1), today, "tomorrow");
    case "banks":
      return bankAnswer(today, today, "today");
    case "banks-tomorrow":
      return bankAnswer(addDays(today, 1), today, "tomorrow");
  }
}

type When = "today" | "tomorrow";
const cap = (w: When) => (w === "today" ? "Today" : "Tomorrow");

/** USPS regular delivery on `date` (= today or tomorrow). */
function mailAnswer(date: string, today: string, when: When): Answer {
  const ps = on("postal", date);
  const sunday = weekday(date) === 0;
  const details: string[] = [
    "USPS: regular mail delivery occurs Monday through Saturday, with the exception of postal holidays.",
  ];
  if (sunday || ps)
    details.push("Priority Mail Express and Amazon parcels are the only mail eligible for Sunday delivery.");
  details.push(nextLine("postal", date, today, "USPS postal holiday"));
  return {
    closed: !!ps || sunday,
    headline: ps
      ? `No regular mail ${when}, ${formatLong(date)}: it's ${ps.name}, a USPS postal holiday.`
      : sunday
        ? `No regular mail ${when}: it's Sunday, ${formatLong(date)}.`
        : `Yes. Regular mail is delivered ${when}, ${formatLong(date)}.`,
    details,
    date,
    calendar: "postal",
    sources: ["usps", "uspsDelivery"],
  };
}

/** Federal Reserve schedule on `date` (= today or tomorrow). Never asserts branch or weekend hours. */
function bankAnswer(date: string, today: string, when: When): Answer {
  const fr = on("fed", date);
  const wd = weekday(date);
  const weekend = wd === 0 || wd === 6;
  return {
    closed: !!fr,
    headline: fr
      ? `${when === "today" ? "Yes" : "No"}. ${cap(when)}, ${formatLong(date)}, the Federal Reserve is closed for ${fr.name}.`
      : weekend
        ? `${cap(when)} is ${dayName(date)}, ${formatLong(date)}. It is not a Federal Reserve holiday; weekend hours are up to each bank.`
        : when === "today"
          ? `No. Today, ${formatLong(date)}, is not a Federal Reserve holiday.`
          : `Yes. Tomorrow, ${formatLong(date)}, is not a Federal Reserve holiday.`,
    details: [
      "Individual banks set their own branch hours; this site has no branch-level data, so check with your bank.",
      nextLine("fed", date, today, "Federal Reserve holiday"),
    ],
    date,
    calendar: "fed",
    sources: ["fed"],
  };
}
