/// <reference types="vite-react-ssg" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";

const SITE = "https://isitholiday.today";

function buildSitemapXml(urls: string[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const entries = [...urls]
    .sort()
    .map(
      (u) =>
        `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq></url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function urlsFromDist(distDir: string): string[] {
  const all = readdirSync(distDir, { recursive: true }) as string[];
  return all
    .filter((f) => typeof f === "string" && f.endsWith("index.html"))
    .map((f) => f.replace(/\\/g, "/"))
    .map((f) => (f === "index.html" ? "/" : "/" + path.posix.dirname(f)));
}

function devSitemapPlugin(): Plugin {
  return {
    name: "isit-sitemap-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/sitemap.xml", async (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();
        try {
          const mod = await server.ssrLoadModule("/src/lib/data.ts");
          const pages = (mod as { PAGES: { slug: string }[] }).PAGES;
          const urls = ["/", "/holiday-checker", ...pages.map((p) => `/${p.slug}`)];
          res.setHeader("Content-Type", "application/xml; charset=utf-8");
          res.end(buildSitemapXml(urls));
        } catch (err) {
          next(err as Error);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devSitemapPlugin(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 8080,
  },
  ssgOptions: {
    script: "async",
    dirStyle: "nested",
    onFinished: (dir) => {
      writeFileSync(path.join(dir, "sitemap.xml"), buildSitemapXml(urlsFromDist(dir)));
    },
  },
});