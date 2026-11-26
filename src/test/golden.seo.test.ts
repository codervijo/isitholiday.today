import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { CHECKER_PAGE, PAGES, type GoldenContent } from "../lib/data";

const SITE = "https://isitholiday.today";
const dist = path.resolve(__dirname, "../../dist");
const read = (slug: string) =>
  readFileSync(path.join(dist, slug ? `${slug}/index.html` : "index.html"), "utf8")
    .replace(/<!-- -->/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

const CASES: [string, GoldenContent][] = [...PAGES.map((p) => [p.slug, p] as [string, GoldenContent]), ["holiday-checker", CHECKER_PAGE]];

describe("v2.J — golden-page content in the static HTML", () => {
  describe.each(CASES)("/%s/", (slug, p) => {
    const html = read(slug);

    it("renders tagline, data-verified line, intro, steps, tips", () => {
      expect(html).toContain(p.tagline);
      expect(html).toMatch(/Data verified: [A-Z][a-z]+ \d{4}/);
      for (const para of p.intro) expect(html).toContain(para);
      for (const s of p.howItWorks) expect(html).toContain(`<li>${s}</li>`);
      for (const t of p.tips) expect(html).toContain(`<li>${t}</li>`);
    });

    it("FAQPage JSON-LD matches the visible FAQ exactly; url = canonical", () => {
      const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([^<]+)<\/script>/g)].map((m) => JSON.parse(m[1]));
      const faq = blocks.find((b) => b["@type"] === "FAQPage");
      expect(faq).toBeDefined();
      expect(faq.url).toBe(`${SITE}/${slug}/`);
      const visible = [...html.matchAll(/<dt[^>]*>([^<]+)<\/dt>/g)].map((m) => m[1]);
      expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(visible);
      expect(visible).toEqual(p.faq.map((f) => f.question));
      for (const f of p.faq) expect(html).toContain(f.answer);
    });

    it("links every related page", () => {
      for (const r of p.relatedSlugs) expect(html).toContain(`href="${r ? `/${r}/` : "/"}"`);
    });
  });
});
