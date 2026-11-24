import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PAGES } from "../lib/data";
import { CLOSURE_PAGES } from "../lib/closures";

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
        new RegExp(`rel="canonical"[^>]*href="${SITE}/${page.slug.replace(/\//g, "\\/")}\/"`),
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

describe("Trailing slashes — CF Pages 308-redirects /<path> to /<path>/", () => {
  const routes = ["", "holiday-checker", ...CLOSURE_PAGES.map((p) => p.slug), ...PAGES.map((p) => p.slug)];

  it.each(routes)("internal page links in /%s point at the slashed (200) URL", (slug) => {
    const html = readDistHtml(slug);
    const hrefs = [...html.matchAll(/<a[^>]*href="(\/[^"#?]*)"/g)].map((m) => m[1]);
    expect(hrefs.length).toBeGreaterThan(0);
    const unslashed = hrefs.filter((h) => !h.endsWith("/") && !/\.[a-z0-9]+$/i.test(h));
    expect(unslashed).toEqual([]);
  });
});

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
      `${SITE}/holiday-checker/`,
      ...CLOSURE_PAGES.map((p) => `${SITE}/${p.slug}/`),
      ...PAGES.map((p) => `${SITE}/${p.slug}/`),
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

describe("v2.E — meta robots + real 404", () => {
  const routes = ["", "holiday-checker", ...CLOSURE_PAGES.map((p) => p.slug), ...PAGES.map((p) => p.slug)];

  it.each(routes)("/%s declares index,follow", (slug) => {
    expect(readDistHtml(slug)).toMatch(/<meta[^>]*name="robots"[^>]*content="index,follow"/);
  });

  it("dist/404.html exists, is noindex, and is not in the sitemap", () => {
    const html = readFileSync(path.join(distDir, "404.html"), "utf8");
    expect(html).toMatch(/<meta[^>]*name="robots"[^>]*content="noindex,follow"/);
    expect(existsSync(path.join(distDir, "404"))).toBe(false);
    expect(readFileSync(path.join(distDir, "sitemap.xml"), "utf8")).not.toContain("404");
  });

  it("home JSON-LD urls all equal the home canonical", () => {
    const urls = [...readDistHtml("").matchAll(/"url":"([^"]+)"/g)].map((m) => m[1]);
    expect(urls.length).toBeGreaterThan(0);
    expect(new Set(urls)).toEqual(new Set([`${SITE}/`]));
  });
});

describe("v2.G — holiday closure pages", () => {
  describe.each(CLOSURE_PAGES)("/$slug/", (page) => {
    let html: string;
    beforeAll(() => {
      html = readDistHtml(page.slug);
    });

    it("renders H1, direct answer, and every status row in static markup", () => {
      expect(html).toContain(`>${page.h1}</h1>`);
      expect(html).toContain(page.directAnswer);
      for (const r of page.rows) expect(html).toContain(r.label);
    });

    it("has one matching <title>, own canonical, and description", () => {
      const titles = html.match(/<title[^>]*>([^<]+)<\/title>/g) ?? [];
      expect(titles).toHaveLength(1);
      const decoded = (titles[0] ?? "").replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&");
      expect(decoded).toContain(page.title);
      const desc = html.match(/name="description"[^>]*content="([^"]+)"/)?.[1] ?? "";
      expect(desc.replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&")).toBe(page.description);
      expect(html).toMatch(new RegExp(`rel="canonical"[^>]*href="${SITE}/${page.slug}/"`));
    });

    it("FAQPage JSON-LD questions match the visible FAQ", () => {
      const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([^<]+)<\/script>/g)]
        .map((m) => JSON.parse(m[1]));
      const faq = blocks.find((b) => b["@type"] === "FAQPage");
      expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(page.faq.map((f) => f.question));
      for (const b of blocks) if (b.url) expect(b.url).toBe(`${SITE}/${page.slug}/`);
    });
  });

  it("every page links to every closure page", () => {
    const html = readDistHtml("");
    for (const p of CLOSURE_PAGES) expect(html).toContain(`href="/${p.slug}/"`);
  });
});
