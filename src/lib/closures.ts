/**
 * v2.G — US holiday closure pages (Christmas Eve, Christmas, New Year's Eve,
 * New Year's Day).
 *
 * Every status below is taken from an official source in SOURCES. Do not add a
 * status, date, or claim that a source does not state. Things this site cannot
 * know (a local branch's hours, an individual bank's hours) are said to vary,
 * never asserted.
 *
 * Slugs carry no year so each page builds authority across years. Each cycle,
 * update `date`, the copy, and CHECKED. Around Dec 18 each year, re-check the
 * Federal Register for an executive order closing federal offices on Dec 24 or
 * Dec 31 (one was issued on Dec 18, 2025) and update the Christmas Eve page.
 */
import type { Source } from "./data";

/** Date the facts on these pages were last checked against the sources. */
export const CHECKED = "2026-11-23";

export const SOURCES = {
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
  usps2025: {
    label: "USPS holiday release, Dec 24, 2025",
    url: "https://about.usps.com/newsroom/local-releases/mn/2025/1224-postal-service-closed-christmas-day-and-new-year-day.htm",
  },
  nyse: {
    label: "NYSE holidays & trading hours",
    url: "https://www.nyse.com/markets/hours-calendars",
  },
  eo2025: {
    label: "Government Executive: feds get Dec 24 and Dec 26, 2025 off",
    url: "https://www.govexec.com/pay-benefits/2025/12/feds-will-have-dec-24-and-dec-26/410226/",
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

export type ClosureStatus = "open" | "closed" | "early";

export interface ClosureRow {
  /** Who/what the row is about. */
  who: "Federal government offices" | "Federal Reserve" | "Post Offices" | "Mail delivery" | "Stock market (NYSE)";
  status: ClosureStatus;
  /** Short label shown in the status column. */
  label: string;
  detail: string;
  sources: SourceId[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface ClosurePage {
  slug: string;
  holiday: string;
  /** ISO date this cycle's page is about. */
  date: string;
  /** Whether the date is a federal holiday on OPM's list. Cross-checked against HOLIDAYS. */
  federalHoliday: boolean;
  /** Whether the Federal Reserve is closed. Cross-checked against HOLIDAYS. */
  fedClosed: boolean;
  title: string;
  h1: string;
  description: string;
  directAnswer: string;
  rows: ClosureRow[];
  explainer: { heading: string; paragraphs: string[] };
  faq: Faq[];
}

const BANKS_VARY =
  "Individual banks set their own branch hours; this site has no branch-level data, so check with your bank.";

export const CLOSURE_PAGES: ClosurePage[] = [
  {
    slug: "christmas-eve",
    holiday: "Christmas Eve",
    date: "2026-12-24",
    federalHoliday: false,
    fedClosed: false,
    title: "Is Christmas Eve a Federal Holiday in 2026? Banks, Post Office & Mail",
    h1: "Is Christmas Eve a federal holiday in 2026?",
    description:
      "No. Christmas Eve (Thu, Dec 24, 2026) is not a federal holiday. See whether federal offices, the Federal Reserve, Post Offices and mail are open, with sources.",
    directAnswer:
      "No. Christmas Eve, Thursday, December 24, 2026, is not a federal holiday. Christmas Day, Friday, December 25, is. Dec 24 is not on the Federal Reserve or USPS holiday schedules either. A president can still give federal employees the day off by executive order, as happened in 2025.",
    rows: [
      {
        who: "Federal government offices",
        status: "open",
        label: "Open (not a federal holiday)",
        detail:
          "Dec 24, 2026 is not on OPM's federal holiday list. In 2025 an executive order signed Dec 18 gave most federal employees Dec 24 and Dec 26 off; agency heads could keep some offices open. We found no such order for 2026 as of the date below.",
        sources: ["opm", "eo2025"],
      },
      {
        who: "Federal Reserve",
        status: "open",
        label: "Open",
        detail: `Dec 24, 2026 is not on the Federal Reserve's holiday schedule. ${BANKS_VARY}`,
        sources: ["fed"],
      },
      {
        who: "Post Offices",
        status: "open",
        label: "Open (hours may be limited)",
        detail:
          "Dec 24 is not on USPS's 2026 postal holiday list. In 2025 USPS said some Post Offices “may have limited hours on Christmas Eve”; check your local Post Office.",
        sources: ["usps", "usps2025"],
      },
      {
        who: "Mail delivery",
        status: "open",
        label: "Regular service day",
        detail: "Christmas Eve is not a postal holiday, so it is a regular USPS service day.",
        sources: ["usps"],
      },
      {
        who: "Stock market (NYSE)",
        status: "early",
        label: "Closes early, 1:00 p.m. ET",
        detail: "NYSE lists Thursday, Dec 24, 2026 as an early close: markets close at 1:00 p.m. ET (1:15 p.m. for eligible options).",
        sources: ["nyse"],
      },
    ],
    explainer: {
      heading: "Why Christmas Eve is sometimes a day off for federal workers",
      paragraphs: [
        "Federal holidays are the days on the list the U.S. Office of Personnel Management (OPM) publishes each year. For 2026, Christmas Day (Friday, December 25) is on it; Christmas Eve is not.",
        "A president can still close executive departments for a day by executive order. On December 18, 2025, an order gave most federal employees both December 24 and December 26, 2025 off, while letting agency heads keep offices open for national security, defense, or other public need. An order like that covers one year only, and it does not make Dec 24 a federal holiday.",
        "The Federal Reserve and the Postal Service publish their own holiday schedules. Neither lists Christmas Eve 2026. USPS's 2025 release did not announce a Christmas Eve closure; it said some Post Offices may have limited hours that day.",
      ],
    },
    faq: [
      {
        question: "Is Christmas Eve 2026 a federal holiday?",
        answer:
          "No. Christmas Eve falls on Thursday, December 24, 2026, and it is not on OPM's federal holiday list. The federal holiday is Christmas Day, Friday, December 25, 2026.",
      },
      {
        question: "Do federal employees get Christmas Eve off in 2026?",
        answer:
          "Only if the president issues an executive order for it. In 2025 an order signed December 18 gave most federal employees December 24 and 26 off. We found no order for December 24, 2026 as of the last-checked date on this page.",
      },
      {
        question: "Is the post office open on Christmas Eve 2026?",
        answer:
          "Christmas Eve is not on USPS's 2026 postal holiday list, so Post Offices are scheduled to be open and mail is a regular service day. In 2025 USPS said some Post Offices may have limited hours on Christmas Eve, so check your local office.",
      },
      {
        question: "Are banks open on Christmas Eve 2026?",
        answer:
          "December 24, 2026 is not on the Federal Reserve's holiday schedule. Individual banks set their own branch hours, so check with your bank.",
      },
    ],
  },
  {
    slug: "christmas",
    holiday: "Christmas Day",
    date: "2026-12-25",
    federalHoliday: true,
    fedClosed: true,
    title: "Is the Post Office Open on Christmas 2026? Banks & Mail on Dec 25",
    h1: "Is the post office open on Christmas Day 2026?",
    description:
      "No. Christmas Day (Fri, Dec 25, 2026) is a federal and postal holiday: Post Offices, federal offices and the Federal Reserve are closed. Sources included.",
    directAnswer:
      "No. Christmas Day, Friday, December 25, 2026, is a federal holiday and a USPS postal holiday. Post Offices are closed, federal government offices are closed, and the Federal Reserve is closed.",
    rows: [
      {
        who: "Federal government offices",
        status: "closed",
        label: "Closed (federal holiday)",
        detail: "Christmas Day, Friday, December 25, 2026, is on OPM's federal holiday list.",
        sources: ["opm"],
      },
      {
        who: "Federal Reserve",
        status: "closed",
        label: "Closed",
        detail: `December 25, 2026 is on the Federal Reserve's holiday schedule. ${BANKS_VARY}`,
        sources: ["fed"],
      },
      {
        who: "Post Offices",
        status: "closed",
        label: "Closed",
        detail:
          "Christmas Day is on USPS's 2026 postal holiday list. In 2025 USPS said “Post Office locations nationwide will be closed on Christmas Day.”",
        sources: ["usps", "usps2025"],
      },
      {
        who: "Mail delivery",
        status: "closed",
        label: "No regular delivery",
        detail:
          "Christmas Day is a postal holiday. In 2025 USPS said regular mail delivery would resume the day after Christmas.",
        sources: ["usps", "usps2025"],
      },
      {
        who: "Stock market (NYSE)",
        status: "closed",
        label: "Closed",
        detail: "Christmas Day, Friday, Dec 25, 2026, is on NYSE's market holiday list.",
        sources: ["nyse"],
      },
    ],
    explainer: {
      heading: "What is closed on Christmas Day",
      paragraphs: [
        "Christmas Day is one of the federal holidays on OPM's list, so federal government offices close. In 2026 it falls on a Friday, so there is no shift to an observed day.",
        "The Federal Reserve closes on Christmas Day, and USPS lists it as a postal holiday. In 2025 USPS said all Post Office locations would reopen, and regular delivery resume, the day after Christmas.",
      ],
    },
    faq: [
      {
        question: "Is the post office open on Christmas Day 2026?",
        answer:
          "No. Christmas Day, Friday, December 25, 2026, is on USPS's postal holiday list. In 2025 USPS said Post Office locations nationwide would be closed on Christmas Day.",
      },
      {
        question: "Is mail delivered on Christmas Day?",
        answer:
          "No regular delivery. Christmas Day is a postal holiday; in 2025 USPS said regular mail delivery would resume the day after Christmas.",
      },
      {
        question: "Are banks open on Christmas Day 2026?",
        answer:
          "The Federal Reserve is closed on December 25, 2026. Individual banks set their own branch hours, so check with your bank.",
      },
    ],
  },
  {
    slug: "new-years-eve",
    holiday: "New Year's Eve",
    date: "2026-12-31",
    federalHoliday: false,
    fedClosed: false,
    title: "Are Banks Open on New Year's Eve 2026? Post Office & Mail on Dec 31",
    h1: "Are banks open on New Year's Eve 2026?",
    description:
      "New Year's Eve (Thu, Dec 31, 2026) is not a federal, Federal Reserve or postal holiday. See what is open on Dec 31, and what closes on New Year's Day.",
    directAnswer:
      "New Year's Eve, Thursday, December 31, 2026, is not a federal holiday, and it is not on the Federal Reserve or USPS holiday schedules. The holiday is the next day: New Year's Day, Friday, January 1, 2027. Individual banks set their own hours.",
    rows: [
      {
        who: "Federal government offices",
        status: "open",
        label: "Open (not a federal holiday)",
        detail: "Dec 31, 2026 is not on OPM's federal holiday list. New Year's Day, Jan 1, 2027, is.",
        sources: ["opm"],
      },
      {
        who: "Federal Reserve",
        status: "open",
        label: "Open",
        detail: `Dec 31, 2026 is not on the Federal Reserve's holiday schedule. ${BANKS_VARY}`,
        sources: ["fed"],
      },
      {
        who: "Post Offices",
        status: "open",
        label: "Open",
        detail:
          "Dec 31 is not on USPS's 2026 postal holiday list. In 2025 USPS said there were “no plans for limited hours on New Year's Eve.”",
        sources: ["usps", "usps2025"],
      },
      {
        who: "Mail delivery",
        status: "open",
        label: "Regular service day",
        detail: "New Year's Eve is not a postal holiday, so it is a regular USPS service day.",
        sources: ["usps"],
      },
      {
        who: "Stock market (NYSE)",
        status: "open",
        label: "Open",
        detail: "Dec 31, 2026 is not on NYSE's 2026 holiday or early-close list.",
        sources: ["nyse"],
      },
    ],
    explainer: {
      heading: "New Year's Eve vs. New Year's Day",
      paragraphs: [
        "The holiday on federal, Federal Reserve and USPS calendars is New Year's Day, January 1. In 2026, December 31 is not on any of the three schedules.",
        "In 2026, New Year's Eve is a Thursday and New Year's Day is Friday, January 1, 2027. Federal offices, the Federal Reserve and Post Offices are closed on January 1.",
      ],
    },
    faq: [
      {
        question: "Are banks open on New Year's Eve 2026?",
        answer:
          "December 31, 2026 is not on the Federal Reserve's holiday schedule. Individual banks set their own branch hours, so check with your bank.",
      },
      {
        question: "Is the post office open on New Year's Eve 2026?",
        answer:
          "New Year's Eve is not on USPS's 2026 postal holiday list, so Post Offices are scheduled to be open and mail is a regular service day. In 2025 USPS said it had no plans for limited hours on New Year's Eve.",
      },
      {
        question: "Is New Year's Eve a federal holiday?",
        answer:
          "No. New Year's Eve, December 31, 2026, is not on OPM's federal holiday list. New Year's Day, Friday, January 1, 2027, is.",
      },
    ],
  },
  {
    slug: "new-years-day",
    holiday: "New Year's Day",
    date: "2027-01-01",
    federalHoliday: true,
    fedClosed: true,
    title: "Are Banks Open on New Year's Day 2027? Post Office & Mail on Jan 1",
    h1: "Are banks open on New Year's Day 2027?",
    description:
      "New Year's Day (Fri, Jan 1, 2027) is a federal, Federal Reserve and postal holiday: federal offices, the Fed and Post Offices are closed. Sources included.",
    directAnswer:
      "New Year's Day, Friday, January 1, 2027, is a federal holiday. The Federal Reserve is closed, and so are Post Offices and federal government offices. Individual banks set their own hours, so check with your bank.",
    rows: [
      {
        who: "Federal government offices",
        status: "closed",
        label: "Closed (federal holiday)",
        detail: "New Year's Day, Friday, January 1, 2027, is on OPM's federal holiday list.",
        sources: ["opm"],
      },
      {
        who: "Federal Reserve",
        status: "closed",
        label: "Closed",
        detail: `January 1, 2027 is on the Federal Reserve's holiday schedule. ${BANKS_VARY}`,
        sources: ["fed"],
      },
      {
        who: "Post Offices",
        status: "closed",
        label: "Closed",
        detail:
          "New Year's Day is on USPS's 2027 postal holiday list. In 2025 USPS said Post Office locations nationwide would be closed on New Year's Day.",
        sources: ["usps", "usps2025"],
      },
      {
        who: "Mail delivery",
        status: "closed",
        label: "No regular delivery",
        detail:
          "New Year's Day is a postal holiday. In 2025 USPS said regular mail delivery would resume the day after New Year's Day.",
        sources: ["usps", "usps2025"],
      },
      {
        who: "Stock market (NYSE)",
        status: "closed",
        label: "Closed",
        detail: "New Year's Day, Friday, Jan 1, 2027, is on NYSE's market holiday list.",
        sources: ["nyse"],
      },
    ],
    explainer: {
      heading: "What is closed on New Year's Day",
      paragraphs: [
        "New Year's Day is on OPM's federal holiday list, so federal government offices close. In 2027 it falls on a Friday, so there is no shift to an observed day.",
        "The Federal Reserve closes on January 1, and USPS lists it as a postal holiday. The day before, New Year's Eve (December 31, 2026), is not on any of the three schedules.",
      ],
    },
    faq: [
      {
        question: "Are banks open on New Year's Day 2027?",
        answer:
          "The Federal Reserve is closed on January 1, 2027. Individual banks set their own branch hours, so check with your bank.",
      },
      {
        question: "Is the post office open on New Year's Day 2027?",
        answer:
          "No. New Year's Day, Friday, January 1, 2027, is on USPS's postal holiday list. In 2025 USPS said Post Office locations nationwide would be closed on New Year's Day.",
      },
      {
        question: "Is mail delivered on New Year's Day?",
        answer:
          "No regular delivery. New Year's Day is a postal holiday; in 2025 USPS said regular mail delivery would resume the next day.",
      },
    ],
  },
];

export function findClosurePage(slug: string): ClosurePage | undefined {
  return CLOSURE_PAGES.find((p) => p.slug === slug);
}
