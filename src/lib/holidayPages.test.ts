import { describe, it, expect } from "vitest";
import { HOLIDAY_DEFS, buildHolidayView, type HolidayView } from "./holidayPages";
import { FEDERAL_HOLIDAYS, addDays } from "./usAnswers";
import { NYSE_CLOSED, NYSE_EARLY_CLOSE } from "./nyse";

const view = (slug: string, today: string): HolidayView => {
  const def = HOLIDAY_DEFS.find((d) => d.slug === slug)!;
  const v = buildHolidayView(def, today);
  if (!v) throw new Error(`no view for ${slug} on ${today}`);
  return v;
};
const cellText = (v: HolidayView, inst: keyof HolidayView["cells"], date: string) =>
  v.cells[inst][v.dates.indexOf(date)];

describe("rule-based nominal dates match OPM's list", () => {
  it.each(HOLIDAY_DEFS)("$slug: 2027 nominal date is a federal holiday date", (def) => {
    const fed = new Set(FEDERAL_HOLIDAYS.map((h) => h.date));
    expect(fed.has(def.nominal(2027))).toBe(true);
  });
});

describe("buildHolidayView", () => {
  it("Thanksgiving on Nov 25, 2026: this year; NYSE early close the Friday after", () => {
    const v = view("thanksgiving", "2026-11-25");
    expect(v.year).toBe(2026);
    expect(v.dates).toEqual(["2026-11-26", "2026-11-27"]);
    expect(v.headline).toMatch(/^Yes\. Thanksgiving is a Federal Reserve holiday: Federal Reserve Banks are closed Thursday, November 26, 2026\.$/);
    expect(cellText(v, "nyse", "2026-11-27").status).toBe("early");
    expect(cellText(v, "federal", "2026-11-27").status).toBe("open");
    expect(cellText(v, "postOffice", "2026-11-26").status).toBe("closed");
  });

  it("Thanksgiving rolls to 2027 once the Friday after has passed", () => {
    expect(view("thanksgiving", "2026-11-27").year).toBe(2026);
    expect(view("thanksgiving", "2026-11-28").year).toBe(2027);
  });

  it("Veterans Day 2027: banks, Post Offices, federal closed; NYSE open", () => {
    const v = view("veterans-day", "2026-11-25");
    expect(v.year).toBe(2027);
    expect(v.dates).toEqual(["2027-11-11"]);
    expect(v.headline).toMatch(/^Yes\./);
    expect(v.details.join(" ")).toMatch(/NYSE\) is open on Veterans Day/);
    expect(cellText(v, "postOffice", "2027-11-11").status).toBe("closed");
  });

  it("Juneteenth 2027 (Saturday): Fed + USPS open Friday, NYSE + federal closed Friday", () => {
    const v = view("juneteenth", "2026-11-25");
    expect(v.dates).toEqual(["2027-06-18", "2027-06-19"]);
    expect(v.main).toBe("2027-06-18");
    expect(v.headline).toBe(
      "Yes, but Juneteenth falls on Saturday, June 19, 2027. It is on the Federal Reserve holiday schedule, and for a Saturday holiday Federal Reserve Banks are open the preceding Friday (Friday, June 18, 2027).",
    );
    expect(cellText(v, "fed", "2027-06-18").status).toBe("open");
    expect(cellText(v, "postOffice", "2027-06-18").status).toBe("open");
    expect(cellText(v, "mail", "2027-06-19").status).toBe("closed");
    expect(cellText(v, "nyse", "2027-06-18").status).toBe("closed");
    expect(cellText(v, "federal", "2027-06-18").status).toBe("closed");
    expect(v.faq[1].answer).toMatch(/Post Offices are open and mail is delivered on Friday, June 18, 2027/);
  });

  it("July 4th 2027 (Sunday): everything observed Monday July 5", () => {
    const v = view("fourth-of-july", "2026-11-25");
    expect(v.dates).toEqual(["2027-07-04", "2027-07-05"]);
    expect(v.headline).toMatch(/closed Monday, July 5, 2027, the observed holiday \(July 4th itself falls on Sunday\)/);
    for (const inst of ["fed", "postOffice", "nyse", "federal"] as const)
      expect(cellText(v, inst, "2027-07-05").status).toBe("closed");
    expect(cellText(v, "nyse", "2027-07-04").status).toBe("none");
  });

  it("Columbus Day 2027: Fed + USPS closed, NYSE open", () => {
    const v = view("columbus-day", "2026-11-25");
    expect(v.headline).toMatch(/^Yes\./);
    expect(cellText(v, "nyse", "2027-10-11").status).toBe("open");
    expect(cellText(v, "mail", "2027-10-11").status).toBe("closed");
  });

  it("MLK Day after Jan 18, 2027 rolls to 2028: NYSE 2028 shown, other calendars marked not yet in data", () => {
    const v = view("mlk-day", "2027-01-20");
    expect(v.year).toBe(2028);
    expect(v.headline).toBe("This site does not have the Federal Reserve's 2028 schedule yet.");
    expect(cellText(v, "nyse", "2028-01-17").status).toBe("closed");
    expect(cellText(v, "fed", "2028-01-17").text).toBe("Not in this site's data yet");
  });

  it("every page has a view and a 120–160 char description on every day through Nov 2027", () => {
    for (let d = "2026-11-25"; d <= "2027-11-25"; d = addDays(d, 7))
      for (const def of HOLIDAY_DEFS) {
        const v = buildHolidayView(def, d);
        expect(v, `${def.slug} on ${d}`).not.toBeNull();
        expect(v!.description.length, `${def.slug} on ${d}: ${v!.description}`).toBeGreaterThanOrEqual(120);
        expect(v!.description.length, `${def.slug} on ${d}`).toBeLessThanOrEqual(160);
        expect(v!.faq).toHaveLength(4);
      }
  });
});

describe("NYSE data", () => {
  it("sorted and unique; early closes never on a closed day", () => {
    for (const list of [NYSE_CLOSED, NYSE_EARLY_CLOSE]) {
      const dates = list.map((h) => h.date);
      expect([...dates].sort()).toEqual(dates);
      expect(new Set(dates).size).toBe(dates.length);
    }
    const closed = new Set(NYSE_CLOSED.map((h) => h.date));
    for (const e of NYSE_EARLY_CLOSE) expect(closed.has(e.date)).toBe(false);
  });
});
