/**
 * v3.C — NYSE market holidays and early closes.
 *
 * Source: nyse.com/markets/hours-calendars, "Holidays & Trading Hours"
 * (read 2026-11-25). "All NYSE markets observe U.S. holidays as listed below
 * for 2026, 2027, and 2028." Early closes are the page's footnotes: "Each
 * market will close early at 1:00 p.m. (1:15 p.m. for eligible options)".
 *
 * The page states holidays only. It says nothing about weekends, so this site
 * never asserts NYSE weekend status. NYSE does not always follow OPM's
 * observed-date rule: "Because the holiday falls on Saturday, January 1, 2028,
 * no New Year's Day holiday is observed."
 */
import type { DatedName } from "./usAnswers";

export const NYSE_CLOSED: DatedName[] = [
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-01-19", name: "Martin Luther King, Jr. Day" },
  { date: "2026-02-16", name: "Washington's Birthday" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-05-25", name: "Memorial Day" },
  { date: "2026-06-19", name: "Juneteenth National Independence Day" },
  { date: "2026-07-03", name: "Independence Day observed" },
  { date: "2026-09-07", name: "Labor Day" },
  { date: "2026-11-26", name: "Thanksgiving Day" },
  { date: "2026-12-25", name: "Christmas Day" },
  { date: "2027-01-01", name: "New Year's Day" },
  { date: "2027-01-18", name: "Martin Luther King, Jr. Day" },
  { date: "2027-02-15", name: "Washington's Birthday" },
  { date: "2027-03-26", name: "Good Friday" },
  { date: "2027-05-31", name: "Memorial Day" },
  { date: "2027-06-18", name: "Juneteenth National Independence Day observed" },
  { date: "2027-07-05", name: "Independence Day observed" },
  { date: "2027-09-06", name: "Labor Day" },
  { date: "2027-11-25", name: "Thanksgiving Day" },
  { date: "2027-12-24", name: "Christmas Day observed" },
  { date: "2028-01-17", name: "Martin Luther King, Jr. Day" },
  { date: "2028-02-21", name: "Washington's Birthday" },
  { date: "2028-04-14", name: "Good Friday" },
  { date: "2028-05-29", name: "Memorial Day" },
  { date: "2028-06-19", name: "Juneteenth National Independence Day" },
  { date: "2028-07-04", name: "Independence Day" },
  { date: "2028-09-04", name: "Labor Day" },
  { date: "2028-11-23", name: "Thanksgiving Day" },
  { date: "2028-12-25", name: "Christmas Day" },
];

/** 1:00 p.m. ET early closes (the page's footnotes). */
export const NYSE_EARLY_CLOSE: DatedName[] = [
  { date: "2026-11-27", name: "Day after Thanksgiving" },
  { date: "2026-12-24", name: "Christmas Eve" },
  { date: "2027-11-26", name: "Day after Thanksgiving" },
  { date: "2028-07-03", name: "Day before Independence Day" },
  { date: "2028-11-24", name: "Day after Thanksgiving" },
];

export const NYSE_EARLY_CLOSE_TIME = "1:00 p.m. ET";

export const nyseClosed = (date: string) => NYSE_CLOSED.find((h) => h.date === date) ?? null;
export const nyseEarly = (date: string) => NYSE_EARLY_CLOSE.find((h) => h.date === date) ?? null;
