import { describe, it, expect } from "vitest";
import { buildIcs, calendarRows, federalHolidayNames, icsRows, weekendFederal } from "./calendar";
import { buildCalendarPdf } from "./calendarPdf";

const rows = calendarRows(2027);
const row = (date: string) => {
  const r = rows.find((x) => x.date === date);
  if (!r) throw new Error(`no row ${date}`);
  return r;
};

describe("2027 calendar rows (sourced data)", () => {
  it("OPM: 11 federal holidays", () => {
    expect(federalHolidayNames(2027)).toHaveLength(11);
  });

  it("Good Friday: NYSE closed, federal offices open", () => {
    const r = row("2027-03-26");
    expect(r.name).toBe("Good Friday");
    expect(r.cells.nyse.status).toBe("closed");
    expect(r.cells.federal.status).toBe("open");
    expect(r.slug).toBeNull();
  });

  it("Juneteenth observed Fri Jun 18: federal + NYSE closed, Fed + Post Offices open", () => {
    const r = row("2027-06-18");
    expect(r.cells.federal.status).toBe("closed");
    expect(r.cells.nyse.status).toBe("closed");
    expect(r.cells.fed.status).toBe("open");
    expect(r.cells.postOffice.status).toBe("open");
    expect(r.slug).toBe("juneteenth");
  });

  it("Day after Thanksgiving: NYSE early close", () => {
    expect(row("2027-11-26").cells.nyse.status).toBe("early");
  });

  it("Fri Dec 31, 2027 (New Year's Day 2028 observed): federal closed, NYSE open", () => {
    const r = row("2027-12-31");
    expect(r.cells.federal.status).toBe("closed");
    expect(r.cells.nyse.status).toBe("open");
  });

  it("weekend federal holidays and their observed days", () => {
    expect(weekendFederal(2027)).toEqual([
      { name: "Juneteenth", date: "2027-06-19", observed: "2027-06-18" },
      { name: "Independence Day", date: "2027-07-04", observed: "2027-07-05" },
      { name: "Christmas Day", date: "2027-12-25", observed: "2027-12-24" },
    ]);
  });
});

describe("ICS", () => {
  const ics = buildIcs(rows, 2027, "2026-11-25T12:00:00.000Z");

  it("one all-day event per weekday federal offices close (12 in 2027)", () => {
    expect(icsRows(rows)).toHaveLength(12);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(12);
    expect(ics).toContain("DTSTART;VALUE=DATE:20270618\r\nDTEND;VALUE=DATE:20270619");
    expect(ics).toContain("DTSTAMP:20261125T120000Z");
  });

  it("RFC 5545: CRLF lines, none over 75 octets, text escaped", () => {
    const lines = ics.split("\r\n");
    for (const l of lines) expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
    expect(ics).not.toMatch(/[^\r]\n/);
    const unfolded = ics.replace(/\r\n /g, "");
    expect(unfolded).toMatch(/DESCRIPTION:Federal offices: Closed\. Federal Reserve: Closed\./);
    expect(unfolded).toContain("Sources: OPM\\, Federal Reserve\\, USPS\\, NYSE.");
  });
});

describe("PDF", () => {
  it("builds a PDF from the rows", async () => {
    const bytes = await buildCalendarPdf(rows, 2027, "2026-11-25");
    expect(new TextDecoder().decode(bytes.subarray(0, 5))).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(2000);
  });
});
