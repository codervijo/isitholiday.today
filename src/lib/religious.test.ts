import { describe, it, expect } from "vitest";
import { OBSERVANCES, FAITHS, RELIGIOUS_THROUGH, beginningTonight, dayOf, observancesOn, upcomingObservances } from "./religious";
import { weekday } from "./usAnswers";
import { RELIGIOUS_DESCRIPTION, religiousFaq } from "../pages/ReligiousPageRoute";

describe("religious observances data", () => {
  it("every entry has a known faith, valid order, and starts by the data end", () => {
    for (const o of OBSERVANCES) {
      expect(FAITHS[o.faith]).toBeDefined();
      expect(o.date <= RELIGIOUS_THROUGH).toBe(true);
      if (o.end) expect(o.end > o.date).toBe(true);
    }
  });

  it("Sunday feasts fall on Sundays (USCCB + ACROD)", () => {
    for (const n of [/^Easter/, /^Palm Sunday/, /^Pentecost/, /^Pascha/, /^First Sunday of Advent/])
      for (const o of OBSERVANCES.filter((x) => n.test(x.name))) expect(weekday(o.date), `${o.name} ${o.date}`).toBe(0);
  });

  it("Hebcal day counts: Chanukah and Passover are 8 days, Sukkot 7", () => {
    const len = (name: RegExp, year: string) => {
      const o = OBSERVANCES.find((x) => name.test(x.name) && x.date.startsWith(year))!;
      return dayOf(o, o.end!);
    };
    expect(len(/^Chanukah/, "2026")).toBe("day 8 of 8");
    expect(len(/^Passover/, "2027")).toBe("day 8 of 8");
    expect(len(/^Sukkot/, "2027")).toBe("day 7 of 7");
  });

  it("FCNA: Ramadan 1448 runs Feb 8 – Mar 8, 2027; Eid al-Fitr is Mar 9 (Shawwal 1)", () => {
    expect(observancesOn("2027-03-08").map((o) => o.name)).toContain("Ramadan");
    expect(observancesOn("2027-03-09").map((o) => o.name)).toEqual(["Eid al-Fitr"]);
  });
});

describe("today logic", () => {
  it("Dec 6, 2026: Chanukah day 2", () => {
    const [o] = observancesOn("2026-12-06");
    expect(o.name).toBe("Chanukah");
    expect(dayOf(o, "2026-12-06")).toBe("day 2 of 8");
  });

  it("Oct 10, 2027: Yom Kippur begins at sundown tonight", () => {
    expect(beginningTonight("2027-10-10", "2027-10-11").map((o) => o.name)).toEqual(["Yom Kippur"]);
  });

  it("Christian observances do not 'begin tonight'", () => {
    expect(beginningTonight("2027-03-27", "2027-03-28")).toEqual([]);
  });

  it("Mar 26, 2027: Good Friday (Catholic)", () => {
    expect(observancesOn("2027-03-26").map((o) => o.name)).toEqual(["Good Friday"]);
  });

  it("upcoming from Nov 26, 2026 starts with Advent", () => {
    expect(upcomingObservances("2026-11-26", 1)[0].name).toBe("First Sunday of Advent");
  });
});

describe("page copy", () => {
  it("description 120–160 chars; FAQ derived from data", () => {
    expect(RELIGIOUS_DESCRIPTION.length).toBeGreaterThanOrEqual(120);
    expect(RELIGIOUS_DESCRIPTION.length).toBeLessThanOrEqual(160);
    const faq = religiousFaq();
    expect(faq.map((f) => f.question)).toContain("When is Easter 2027?");
    expect(faq.find((f) => f.question === "When is Easter 2027?")!.answer).toMatch(/March 28, 2027.*May 2, 2027/);
    expect(faq.find((f) => f.question === "When is Yom Kippur 2027?")!.answer).toMatch(/sundown on Sunday, October 10, 2027/);
  });
});
