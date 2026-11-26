import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { ABOUT_DESCRIPTION, ABOUT_SLUG, ABOUT_TITLE, CONTACT_EMAIL, allSources } from "../pages/AboutPage";
import { PRIVACY_DESCRIPTION, PRIVACY_SLUG, PRIVACY_TITLE } from "../pages/PrivacyPage";
import { TERMS_DESCRIPTION, TERMS_SLUG, TERMS_TITLE } from "../pages/TermsPage";
import { FOOTER_LINKS } from "../components/Layout";

const SITE = "https://isitholiday.today";
const distDir = path.resolve(__dirname, "../../dist");
const dec = (s: string) => s.replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
const read = (slug: string) => {
  const f = path.join(distDir, slug, "index.html");
  if (!existsSync(f)) throw new Error(`Expected static HTML at ${f} — run the build first`);
  return dec(readFileSync(f, "utf8").replace(/<!-- -->/g, ""));
};

const LEGAL = [
  { slug: ABOUT_SLUG, title: ABOUT_TITLE, description: ABOUT_DESCRIPTION },
  { slug: PRIVACY_SLUG, title: PRIVACY_TITLE, description: PRIVACY_DESCRIPTION },
  { slug: TERMS_SLUG, title: TERMS_TITLE, description: TERMS_DESCRIPTION },
];

describe("v2.K — legal + E-E-A-T pages", () => {
  describe.each(LEGAL)("/$slug/", (p) => {
    it("one title, exact description (120–160 chars), canonical, index,follow, contact email", () => {
      const html = read(p.slug);
      const titles = html.match(/<title[^>]*>[^<]+<\/title>/g) ?? [];
      expect(titles).toHaveLength(1);
      expect(titles[0]).toContain(p.title);
      const desc = html.match(/name="description"[^>]*content="([^"]+)"/)?.[1] ?? "";
      expect(desc).toBe(p.description);
      expect(desc.length).toBeGreaterThanOrEqual(120);
      expect(desc.length).toBeLessThanOrEqual(160);
      expect(html).toMatch(new RegExp(`rel="canonical"[^>]*href="${SITE}/${p.slug}/"`));
      expect(html).toMatch(/<meta[^>]*name="robots"[^>]*content="index,follow"/);
      expect(html).toContain(`href="mailto:${CONTACT_EMAIL}"`);
    });
  });

  it("privacy discloses Google Analytics, the opt-out add-on and Cloudflare hosting", () => {
    const html = read(PRIVACY_SLUG);
    expect(html).toContain("Google Analytics 4");
    expect(html).toContain('href="https://tools.google.com/dlpage/gaoptout"');
    expect(html).toContain("Cloudflare Pages");
  });

  it("about lists every cited data source, brand only", () => {
    const html = read(ABOUT_SLUG);
    for (const s of allSources()) expect(html).toContain(`href="${s.url}"`);
    expect(html).toContain("published by isitholiday.today");
  });

  it("every page's footer links to About, Privacy, Terms and the key hubs", () => {
    for (const slug of ["", "usa", "thanksgiving", ABOUT_SLUG]) {
      const html = read(slug);
      for (const l of FOOTER_LINKS) expect(html).toContain(`href="${l.to}"`);
    }
  });
});
