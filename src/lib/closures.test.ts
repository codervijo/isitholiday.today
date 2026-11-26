import { describe, it, expect } from "vitest";
import { CLOSURE_PAGES, CHECKED, SOURCES } from "./closures";
import { HOLIDAYS } from "./holidays";
import { nyseClosed, nyseEarly } from "./nyse";

const usaOn = (date: string, type: "public" | "bank") =>
  HOLIDAYS.some((h) => h.country === "usa" && h.state === null && h.type === type && h.date === date);

describe("closure pages agree with the sourced holiday data", () => {
  it.each(CLOSURE_PAGES)("$slug: federal + Fed flags match HOLIDAYS", (p) => {
    expect(usaOn(p.date, "public")).toBe(p.federalHoliday);
    expect(usaOn(p.date, "bank")).toBe(p.fedClosed);
  });

  it.each(CLOSURE_PAGES)("$slug: status rows match the flags", (p) => {
    const row = (who: string) => p.rows.find((r) => r.who === who)!;
    expect(row("Federal government offices").status).toBe(p.federalHoliday ? "closed" : "open");
    expect(row("Federal Reserve").status).toBe(p.fedClosed ? "closed" : "open");
    expect(p.rows).toHaveLength(5);
    const nyse = row("Stock market (NYSE)").status;
    expect(nyse).toBe(nyseClosed(p.date) ? "closed" : nyseEarly(p.date) ? "early" : "open");
  });

  it.each(CLOSURE_PAGES)("$slug: every row cites a known source; description 120–160 chars", (p) => {
    for (const r of p.rows) {
      expect(r.sources.length).toBeGreaterThan(0);
      for (const s of r.sources) expect(SOURCES[s]).toBeDefined();
    }
    expect(p.description.length).toBeGreaterThanOrEqual(120);
    expect(p.description.length).toBeLessThanOrEqual(160);
  });

  it("slugs are unique and dates are in the future of CHECKED", () => {
    expect(new Set(CLOSURE_PAGES.map((p) => p.slug)).size).toBe(CLOSURE_PAGES.length);
    for (const p of CLOSURE_PAGES) expect(p.date > CHECKED).toBe(true);
  });
});
