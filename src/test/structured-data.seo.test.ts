/**
 * v2.L — structured data across every built page: every JSON-LD block parses,
 * every URL in it is a canonical trailing-slash site URL, every non-home page
 * has exactly one BreadcrumbList (Home first, the page itself last, positions
 * 1..n) and a visible breadcrumb trail. Runs against dist/ (pnpm build first).
 */
import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ALL_LOCATIONS_DESCRIPTION, allPageGroups } from "../pages/AllLocationsPage";

const SITE = "https://isitholiday.today";
const distDir = path.resolve(__dirname, "../../dist");

/** [route, html] for every dist/**\/index.html (404.html excluded: noindex). */
function builtPages(): [string, string][] {
  const out: [string, string][] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") {
        const rel = path.relative(distDir, path.dirname(p)).split(path.sep).join("/");
        out.push([rel ? `/${rel}/` : "/", readFileSync(p, "utf8")]);
      }
    }
  };
  if (!existsSync(distDir)) throw new Error("dist/ missing — run pnpm build first");
  walk(distDir);
  return out.sort();
}

const blocks = (html: string) =>
  [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([^<]*)<\/script>/g)].map((m) => m[1]);

const canonicalUrl = (u: unknown) => typeof u === "string" && u.startsWith(`${SITE}/`) && u.endsWith("/");

const pages = builtPages();

describe("v2.L — JSON-LD on every built page", () => {
  it("found the built pages", () => {
    expect(pages.length).toBeGreaterThan(30);
  });

  describe.each(pages)("%s", (route, html) => {
    const parsed = blocks(html).map((b) => JSON.parse(b) as Record<string, unknown>);

    it("every block parses, has schema.org context, and its url (if any) is this page's canonical", () => {
      expect(parsed.length).toBeGreaterThan(0);
      for (const b of parsed) {
        expect(b["@context"]).toBe("https://schema.org");
        if ("url" in b) expect(b.url).toBe(`${SITE}${route}`);
      }
    });

    if (route === "/") {
      it("home: WebSite (no SearchAction), Organization (no sameAs), WebApplication; no BreadcrumbList", () => {
        const types = parsed.map((b) => b["@type"]);
        for (const t of ["WebSite", "Organization", "WebApplication"]) expect(types).toContain(t);
        expect(types).not.toContain("BreadcrumbList");
        const site = parsed.find((b) => b["@type"] === "WebSite")!;
        expect(site).not.toHaveProperty("potentialAction");
        const org = parsed.find((b) => b["@type"] === "Organization")!;
        expect(org).not.toHaveProperty("sameAs");
        expect(existsSync(path.join(distDir, "favicon.svg"))).toBe(true);
        expect(org.logo).toBe(`${SITE}/favicon.svg`);
      });
    } else {
      it("one BreadcrumbList: Home first, this page last, positions 1..n, canonical items; visible trail", () => {
        const crumbs = parsed.filter((b) => b["@type"] === "BreadcrumbList");
        expect(crumbs).toHaveLength(1);
        const items = crumbs[0].itemListElement as { position: number; item: string; name: string }[];
        expect(items.length).toBeGreaterThanOrEqual(2);
        expect(items.map((i) => i.position)).toEqual(items.map((_, i) => i + 1));
        for (const i of items) expect(canonicalUrl(i.item), i.item).toBe(true);
        expect(items[0]).toMatchObject({ name: "Home", item: `${SITE}/` });
        expect(items[items.length - 1].item).toBe(`${SITE}${route}`);
        expect(html).toContain('aria-label="Breadcrumb"');
      });
    }

    it("WebApplication only on / and /holiday-checker/", () => {
      const hasApp = parsed.some((b) => b["@type"] === "WebApplication");
      expect(hasApp).toBe(route === "/" || route === "/holiday-checker/");
    });

    it("no Event or SearchAction markup (dropped in v2.L)", () => {
      expect(html).not.toMatch(/"@type":"Event"/);
      expect(html).not.toMatch(/SearchAction/);
    });
  });
});

describe("v2.L — /all-locations/", () => {
  const html = (pages.find(([r]) => r === "/all-locations/") ?? [, ""])[1];

  it("lists every other built page as a static link", () => {
    for (const [route] of pages) {
      if (route === "/all-locations/") continue;
      expect(html, route).toContain(`href="${route}"`);
    }
  });

  it("groups match the rendered list; description 120–160 chars", () => {
    const linked = allPageGroups().flatMap((g) => g.items.map((i) => i.to));
    expect(new Set(linked).size).toBe(linked.length);
    expect(ALL_LOCATIONS_DESCRIPTION.length).toBeGreaterThanOrEqual(120);
    expect(ALL_LOCATIONS_DESCRIPTION.length).toBeLessThanOrEqual(160);
  });
});
