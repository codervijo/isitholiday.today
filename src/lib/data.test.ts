import { describe, it, expect } from "vitest";
import { CHECKER_PAGE, PAGES, type GoldenContent } from "./data";
import { ANSWER_PAGES } from "./answerPages";
import { CLOSURE_PAGES } from "./closures";

const words = (s: string) => s.trim().split(/\s+/).length;
const ROUTES = new Set([
  "",
  "holiday-checker",
  ...PAGES.map((p) => p.slug),
  ...ANSWER_PAGES.map((p) => p.slug),
  ...CLOSURE_PAGES.map((p) => p.slug),
]);

const ALL: [string, GoldenContent & { description: string }][] = [
  ...PAGES.map((p) => [p.slug, p] as [string, GoldenContent & { description: string }]),
  ["holiday-checker", CHECKER_PAGE],
];

describe("v2.J golden-page content", () => {
  it.each(ALL)("%s: field counts and lengths", (slug, p) => {
    expect(p.description.length).toBeGreaterThanOrEqual(120);
    expect(p.description.length).toBeLessThanOrEqual(160);
    expect(p.tagline.length).toBeGreaterThan(0);
    expect(p.keywords.length).toBeGreaterThanOrEqual(6);
    expect(p.keywords.length).toBeLessThanOrEqual(8);
    expect(p.intro.length).toBeGreaterThanOrEqual(2);
    expect(p.intro.length).toBeLessThanOrEqual(4);
    expect(p.howItWorks.length).toBeGreaterThanOrEqual(4);
    expect(p.howItWorks.length).toBeLessThanOrEqual(6);
    expect(p.tips.length).toBeGreaterThanOrEqual(4);
    expect(p.tips.length).toBeLessThanOrEqual(6);
    expect(p.faq).toHaveLength(5);
    for (const f of p.faq) {
      expect(words(f.answer), `${slug}: ${f.question}`).toBeGreaterThanOrEqual(40);
      expect(words(f.answer), `${slug}: ${f.question}`).toBeLessThanOrEqual(80);
    }
    expect(new Set(p.faq.map((f) => f.question)).size).toBe(5);
    expect(p.lastUpdated).toMatch(/^[A-Z][a-z]+ \d{4}$/);
    expect(p.dataUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(p.dataUpdated <= "2026-11-26").toBe(true);
  });

  it.each(ALL)("%s: ≥3 related pages, all real routes, none self", (slug, p) => {
    expect(p.relatedSlugs.length).toBeGreaterThanOrEqual(3);
    for (const r of p.relatedSlugs) {
      expect(ROUTES.has(r), r).toBe(true);
      expect(r).not.toBe(slug);
    }
  });

  it("descriptions are unique across location pages", () => {
    const d = PAGES.map((p) => p.description);
    expect(new Set(d).size).toBe(d.length);
  });
});
