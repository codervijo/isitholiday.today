import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PAGES } from "../lib/data";

const repoRoot = path.resolve(__dirname, "../..");
const distDir = path.join(repoRoot, "dist");
const SITE = "https://isitholiday.today";

function readDistHtml(slug: string): string {
  const file = slug === "" ? "index.html" : path.join(slug, "index.html");
  const full = path.join(distDir, file);
  if (!existsSync(full)) {
    throw new Error(`Expected static HTML at ${full} — did you run \`pnpm build\` first?`);
  }
  return readFileSync(full, "utf8");
}

describe("Phase 4-A1 — vite-react-ssg static output", () => {
  beforeAll(() => {
    if (!existsSync(distDir)) {
      throw new Error(
        `dist/ does not exist. Run \`pnpm build\` before \`pnpm test:seo\`. ` +
          `(The parent Makefile's \`make test proj=isitholiday.today\` does this in the right order.)`,
      );
    }
  });

  it("emits a static index.html for the home route", () => {
    const html = readDistHtml("");
    expect(html).toMatch(/<h1[^>]*>Is today a holiday\?<\/h1>/);
    expect(html).toMatch(/<title[^>]*>Is Today a Holiday\? — isitholiday\.today<\/title>/);
  });

  it("emits a static page for /holiday-checker", () => {
    const html = readDistHtml("holiday-checker");
    expect(html).toMatch(/<h1[^>]*>Holiday Checker<\/h1>/);
    expect(html).toMatch(/<title[^>]*>Holiday Checker — isitholiday\.today<\/title>/);
  });

  describe.each(PAGES)("$slug", (page) => {
    let html: string;
    beforeAll(() => {
      html = readDistHtml(page.slug);
    });

    it("renders the H1 in static markup (not just an empty React shell)", () => {
      expect(html).toContain(`>${page.h1}</h1>`);
    });

    it("renders the directAnswer paragraph in static markup", () => {
      expect(html).toContain(page.directAnswer);
    });

    it("has exactly one <title> element matching page.title", () => {
      const matches = html.match(/<title[^>]*>([^<]+)<\/title>/g) ?? [];
      expect(matches).toHaveLength(1);
      expect(matches[0]).toContain(page.title);
    });

    it("has a page-specific canonical link", () => {
      expect(html).toMatch(
        new RegExp(`rel="canonical"[^>]*href="${SITE}/${page.slug.replace(/\//g, "\\/")}"`),
      );
    });

    it("has a page-specific meta description", () => {
      expect(html).toMatch(
        new RegExp(`name="description"[^>]*content="${escapeRegex(page.description)}"`),
      );
    });
  });
});

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe("Crawl surface — sitemap.xml + robots.txt", () => {
  it("dist/sitemap.xml exists with the sitemaps.org namespace", () => {
    const sitemap = readFileSync(path.join(distDir, "sitemap.xml"), "utf8");
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  });

  it("sitemap.xml lists exactly the static routes that were emitted (no extras, no missing)", () => {
    const sitemap = readFileSync(path.join(distDir, "sitemap.xml"), "utf8");
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const expected = [
      `${SITE}/`,
      `${SITE}/holiday-checker`,
      ...PAGES.map((p) => `${SITE}/${p.slug}`),
    ].sort();
    expect(locs.sort()).toEqual(expected);
  });

  it("each sitemap entry has a <lastmod> in YYYY-MM-DD form and changefreq=daily", () => {
    const sitemap = readFileSync(path.join(distDir, "sitemap.xml"), "utf8");
    const lastmods = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
    expect(lastmods.length).toBeGreaterThan(0);
    for (const d of lastmods) expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(sitemap.match(/<changefreq>daily<\/changefreq>/g)?.length).toBe(lastmods.length);
  });

  it("dist/robots.txt exists, allows all crawlers, and points to sitemap.xml", () => {
    const robots = readFileSync(path.join(distDir, "robots.txt"), "utf8");
    expect(robots).toMatch(/User-agent:\s*\*/);
    expect(robots).toMatch(/Allow:\s*\//);
    expect(robots).toMatch(new RegExp(`Sitemap:\\s*${escapeRegex(SITE)}/sitemap\\.xml`));
  });
});
