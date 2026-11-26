import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PAGES } from "../lib/data";
import { CLOSURE_PAGES } from "../lib/closures";
import { ANSWER_PAGES } from "../lib/answerPages";
import { HOLIDAY_DEFS } from "../lib/holidayPages";
import { RELIGIOUS_SLUG, OBSERVANCES } from "../lib/religious";
import { CALENDAR_SLUG, ICS_PATH, PDF_PATH, calendarRows, CALENDAR_YEAR } from "../lib/calendar";

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
    expect(html).toMatch(/<h1[^>]*>What holiday is today\?<\/h1>/);
    expect(html).toMatch(/<title[^>]*>What Holiday Is Today\? US Federal, Bank &amp; Postal Holidays — isitholiday\.today<\/title>/);
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
  const routes = ["", "holiday-checker", ...ANSWER_PAGES.map((p) => p.slug), ...CLOSURE_PAGES.map((p) => p.slug), ...HOLIDAY_DEFS.map((d) => d.slug), CALENDAR_SLUG, RELIGIOUS_SLUG, ...PAGES.map((p) => p.slug)];

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
      ...ANSWER_PAGES.map((p) => `${SITE}/${p.slug}/`),
      ...CLOSURE_PAGES.map((p) => `${SITE}/${p.slug}/`),
      ...HOLIDAY_DEFS.map((d) => `${SITE}/${d.slug}/`),
      `${SITE}/${CALENDAR_SLUG}/`,
      `${SITE}/${RELIGIOUS_SLUG}/`,
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
  const routes = ["", "holiday-checker", ...CLOSURE_PAGES.map((p) => p.slug), ...HOLIDAY_DEFS.map((d) => d.slug), CALENDAR_SLUG, RELIGIOUS_SLUG, ...PAGES.map((p) => p.slug)];

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

describe("v2.H — US answer pages", () => {
  describe.each(ANSWER_PAGES)("/$slug/", (page) => {
    let html: string;
    beforeAll(() => {
      html = readDistHtml(page.slug);
    });

    it("renders H1 and a prerendered answer (not an empty shell)", () => {
      expect(html).toContain(`>${page.h1}</h1>`);
      expect(html).toMatch(/Answer for (<!-- -->)?[A-Z][a-z]+day, /);
      expect(html).toContain(page.upcomingHeading.replace(/\(/g, "(").slice(0, 20));
    });

    it("one matching <title>, own canonical, exact description", () => {
      const titles = html.match(/<title[^>]*>([^<]+)<\/title>/g) ?? [];
      expect(titles).toHaveLength(1);
      const dec = (s: string) => s.replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
      expect(dec(titles[0] ?? "")).toContain(page.title);
      expect(html).toMatch(new RegExp(`rel="canonical"[^>]*href="${SITE}/${page.slug}/"`));
      const desc = html.match(/name="description"[^>]*content="([^"]+)"/)?.[1] ?? "";
      expect(dec(desc)).toBe(page.description);
    });

    it("FAQPage JSON-LD matches the visible FAQ; JSON-LD urls = canonical", () => {
      const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([^<]+)<\/script>/g)]
        .map((m) => JSON.parse(m[1]));
      const faq = blocks.find((b) => b["@type"] === "FAQPage");
      expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(page.faq.map((f) => f.question));
      for (const b of blocks) if (b.url) expect(b.url).toBe(`${SITE}/${page.slug}/`);
    });
  });

  it("home links to every answer page and shows today's answer", () => {
    const html = readDistHtml("");
    for (const p of ANSWER_PAGES) expect(html).toContain(`href="/${p.slug}/"`);
    expect(html).toMatch(/Answer for (<!-- -->)?[A-Z][a-z]+day, /);
  });
});

describe("v3.C — one page per US federal holiday", () => {
  const dec = (s: string) => s.replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');

  describe.each(HOLIDAY_DEFS)("/$slug/", (def) => {
    let html: string;
    beforeAll(() => {
      html = dec(readDistHtml(def.slug).replace(/<!-- -->/g, ""));
    });

    it("H1 + title name the holiday and a year; own canonical", () => {
      expect(html).toMatch(new RegExp(`>Is ${escapeRegex(def.name)} 20\\d\\d a bank holiday\\?</h1>`));
      const titles = html.match(/<title[^>]*>([^<]+)<\/title>/g) ?? [];
      expect(titles).toHaveLength(1);
      expect(titles[0]).toContain(`Is ${def.short} 20`);
      expect(html).toMatch(new RegExp(`rel="canonical"[^>]*href="${SITE}/${def.slug}/"`));
      const desc = html.match(/name="description"[^>]*content="([^"]+)"/)?.[1] ?? "";
      expect(desc.length).toBeGreaterThanOrEqual(120);
      expect(desc.length).toBeLessThanOrEqual(160);
    });

    it("prerenders the status table with all five institutions", () => {
      for (const who of ["Federal Reserve Banks", "Post Offices", "Mail delivery", "Stock market (NYSE)", "Federal government offices"])
        expect(html).toContain(`>${who}</td>`);
    });

    it("FAQPage JSON-LD matches the visible FAQ; JSON-LD urls = canonical", () => {
      const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([^<]+)<\/script>/g)].map((m) => JSON.parse(m[1]));
      const faq = blocks.find((b) => b["@type"] === "FAQPage");
      const visible = [...html.matchAll(/<dt[^>]*>([^<]+)<\/dt>/g)].map((m) => m[1]);
      expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(visible);
      for (const b of blocks) if (b.url) expect(b.url).toBe(`${SITE}/${def.slug}/`);
    });
  });

  it("home links to every holiday page", () => {
    const html = readDistHtml("");
    for (const d of HOLIDAY_DEFS) expect(html).toContain(`href="/${d.slug}/"`);
  });
});

describe("v3.D — annual calendar + downloads", () => {
  const dec = (s: string) => s.replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
  let html: string;
  beforeAll(() => {
    html = dec(readDistHtml(CALENDAR_SLUG).replace(/<!-- -->/g, ""));
  });

  it("H1, one title, canonical, 120–160 char description", () => {
    expect(html).toContain(`>${CALENDAR_YEAR} federal holiday calendar</h1>`);
    expect(html.match(/<title[^>]*>[^<]+<\/title>/g)).toHaveLength(1);
    expect(html).toMatch(new RegExp(`rel="canonical"[^>]*href="${SITE}/${CALENDAR_SLUG}/"`));
    const desc = html.match(/name="description"[^>]*content="([^"]+)"/)?.[1] ?? "";
    expect(desc.length).toBeGreaterThanOrEqual(120);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it("prerenders one table row per calendar date and links the downloads", () => {
    const rows = calendarRows(CALENDAR_YEAR);
    for (const r of rows) expect(html).toContain(`>${r.name}<`);
    expect(html).toContain(`href="${PDF_PATH}"`);
    expect(html).toContain(`href="${ICS_PATH}"`);
  });

  it("FAQPage JSON-LD matches the visible FAQ", () => {
    const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([^<]+)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const faq = blocks.find((b) => b["@type"] === "FAQPage");
    const visible = [...html.matchAll(/<dt[^>]*>([^<]+)<\/dt>/g)].map((m) => m[1]);
    expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(visible);
  });

  it("dist has a valid ICS and PDF", () => {
    const ics = readFileSync(path.join(distDir, ICS_PATH.slice(1)), "utf8");
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    const pdf = readFileSync(path.join(distDir, PDF_PATH.slice(1)));
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(2000);
  });

  it("not in the sitemap as a page: downloads are files, not URLs", () => {
    const sitemap = readFileSync(path.join(distDir, "sitemap.xml"), "utf8");
    expect(sitemap).not.toContain(".ics");
    expect(sitemap).not.toContain(".pdf");
  });
});

describe("v3.E — religious holiday page", () => {
  const dec = (s: string) => s.replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
  let html: string;
  beforeAll(() => {
    html = dec(readDistHtml(RELIGIOUS_SLUG).replace(/<!-- -->/g, ""));
  });

  it("H1, one title, canonical, 120–160 char description", () => {
    expect(html).toContain(">What religious holiday is today?</h1>");
    expect(html.match(/<title[^>]*>[^<]+<\/title>/g)).toHaveLength(1);
    expect(html).toMatch(new RegExp(`rel="canonical"[^>]*href="${SITE}/${RELIGIOUS_SLUG}/"`));
    const desc = html.match(/name="description"[^>]*content="([^"]+)"/)?.[1] ?? "";
    expect(desc.length).toBeGreaterThanOrEqual(120);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it("prerenders today's answer and an upcoming table from the data", () => {
    expect(html).toMatch(/Answer for [A-Z][a-z]+day, /);
    expect(html).toContain("Upcoming religious holidays");
    expect(OBSERVANCES.some((o) => html.includes(`>${o.name}<`))).toBe(true);
  });

  it("credits Hebcal (CC BY 4.0) and states what is not covered", () => {
    expect(html).toContain("Hebcal.com, licensed CC BY 4.0");
    expect(html).toContain("Not covered yet: Hindu");
  });

  it("FAQPage JSON-LD matches the visible FAQ", () => {
    const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([^<]+)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const faq = blocks.find((b) => b["@type"] === "FAQPage");
    const visible = [...html.matchAll(/<dt[^>]*>([^<]+)<\/dt>/g)].map((m) => m[1]);
    expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(visible);
  });
});
