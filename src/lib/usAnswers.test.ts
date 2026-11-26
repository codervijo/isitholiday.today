import { describe, it, expect } from "vitest";
import { computeAnswer, POSTAL_HOLIDAYS, FEDERAL_HOLIDAYS, FED_CLOSURES, addDays, weekday } from "./usAnswers";
import { ANSWER_PAGES, HOME_ANSWER } from "./answerPages";

describe("computeAnswer", () => {
  it("Thanksgiving 2026: federal, Fed and postal all closed", () => {
    expect(computeAnswer("federal", "2026-11-26").closed).toBe(true);
    expect(computeAnswer("banks", "2026-11-26").closed).toBe(true);
    expect(computeAnswer("post-office", "2026-11-26").closed).toBe(true);
    expect(computeAnswer("mail", "2026-11-26").headline).toMatch(/No regular mail.*Thanksgiving/);
    expect(computeAnswer("what-today", "2026-11-26").headline).toMatch(/is Thanksgiving, a US federal holiday/);
  });

  it("ordinary weekday: nothing closed", () => {
    for (const k of ["federal", "banks", "post-office", "mail"] as const)
      expect(computeAnswer(k, "2026-11-24").closed).toBe(false);
  });

  it("Sunday: no regular mail, post office usually closed, banks not a Fed holiday", () => {
    expect(weekday("2026-11-29")).toBe(0);
    expect(computeAnswer("mail", "2026-11-29").closed).toBe(true);
    expect(computeAnswer("post-office", "2026-11-29").headline).toMatch(/Sunday/);
    const b = computeAnswer("banks", "2026-11-29");
    expect(b.closed).toBe(false);
    expect(b.headline).toMatch(/Sunday.*not a Federal Reserve holiday/);
  });

  it("Saturday: regular mail is delivered", () => {
    expect(weekday("2026-11-28")).toBe(6);
    expect(computeAnswer("mail", "2026-11-28").closed).toBe(false);
  });

  it("Fri Jun 18, 2027 (Juneteenth on Sat): federal observed, but Fed + USPS open", () => {
    expect(computeAnswer("federal", "2027-06-18").closed).toBe(true);
    expect(computeAnswer("banks", "2027-06-18").closed).toBe(false);
    expect(computeAnswer("post-office", "2027-06-18").closed).toBe(false);
    expect(computeAnswer("mail", "2027-06-18").closed).toBe(false);
  });

  it("banks-tomorrow: day before Thanksgiving says closed; Sat Jun 19 2027 eve is open", () => {
    const a = computeAnswer("banks-tomorrow", "2026-11-25");
    expect(a.closed).toBe(true);
    expect(a.date).toBe("2026-11-26");
    expect(a.headline).toMatch(/^No\. Tomorrow.*Federal Reserve is closed for Thanksgiving/);
    // Thu Jun 17, 2027 → Fri Jun 18: OPM observed day off, but Fed open
    const b = computeAnswer("banks-tomorrow", "2027-06-17");
    expect(b.closed).toBe(false);
    expect(b.headline).toMatch(/^Yes\. Tomorrow/);
    // Fri → Sat: weekend wording, no hours claim
    expect(computeAnswer("banks-tomorrow", "2026-11-27").headline).toMatch(/^Tomorrow is Saturday.*up to each bank/);
  });

  it("mail-tomorrow: Wed before Thanksgiving no; Fri→Sat yes; Sat→Sun no", () => {
    expect(computeAnswer("mail-tomorrow", "2026-11-25").headline).toMatch(/^No regular mail tomorrow.*Thanksgiving/);
    expect(computeAnswer("mail-tomorrow", "2026-11-27").closed).toBe(false);
    const sun = computeAnswer("mail-tomorrow", "2026-11-28");
    expect(sun.closed).toBe(true);
    expect(sun.headline).toMatch(/Sunday/);
  });

  it("tomorrow: day before Thanksgiving says yes", () => {
    const a = computeAnswer("tomorrow", "2026-11-25");
    expect(a.closed).toBe(true);
    expect(a.date).toBe("2026-11-26");
    expect(a.headline).toMatch(/^Yes\. Tomorrow/);
  });

  it("next: from Nov 23, 2026 the next federal holiday is Thanksgiving in 3 days", () => {
    expect(computeAnswer("next", "2026-11-23").headline).toMatch(/Thanksgiving.*3 days away/);
  });

  it("day before a holiday says 'tomorrow' not '1 days'", () => {
    expect(computeAnswer("federal", "2026-11-25").details.join(" ")).toMatch(/Thanksgiving.*tomorrow/);
  });
});

describe("calendar data", () => {
  it("postal holidays: sorted, unique, no Friday-before shift for 2027 Saturday holidays", () => {
    const dates = POSTAL_HOLIDAYS.map((h) => h.date);
    expect([...dates].sort()).toEqual(dates);
    expect(new Set(dates).size).toBe(dates.length);
    expect(dates).not.toContain("2027-06-18");
    expect(dates).not.toContain("2027-12-24");
  });

  it("every postal holiday from Nov 26, 2026 on is also a federal holiday date", () => {
    const fed = new Set(FEDERAL_HOLIDAYS.map((h) => h.date));
    for (const p of POSTAL_HOLIDAYS) expect(fed.has(p.date)).toBe(true);
  });

  it("Fed closures display names are unwrapped", () => {
    for (const f of FED_CLOSURES) expect(f.name).not.toMatch(/^Federal Reserve closed/);
  });

  it("addDays crosses month/year boundaries", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("answer page copy", () => {
  it.each([HOME_ANSWER, ...ANSWER_PAGES])("$kind: description 120–160 chars", (p) => {
    expect(p.description.length).toBeGreaterThanOrEqual(120);
    expect(p.description.length).toBeLessThanOrEqual(160);
  });
  it("slugs unique", () => {
    expect(new Set(ANSWER_PAGES.map((p) => p.slug)).size).toBe(ANSWER_PAGES.length);
  });
});
