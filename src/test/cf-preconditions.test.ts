import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "../..");

function git(args: string): string {
  return execSync(`git -c safe.directory=* ${args}`, {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
}

function pkg(): Record<string, unknown> {
  return JSON.parse(readFileSync(path.join(repoRoot, "package.json"), "utf8"));
}

describe("Cloudflare Pages build preconditions", () => {
  it("HEAD has no submodule gitlinks (would break --recurse-submodules clone)", () => {
    const gitlinks = git("ls-tree -r HEAD")
      .split("\n")
      .filter((line) => line.split(/\s+/)[1] === "commit");
    expect(gitlinks).toEqual([]);
  });

  it("vite version is >= 6 (Wrangler refuses Vite < 6)", () => {
    const { devDependencies } = pkg() as { devDependencies: Record<string, string> };
    const vite = devDependencies?.vite ?? "";
    const major = Number(vite.replace(/^[\^~]/, "").split(".")[0]);
    expect(major).toBeGreaterThanOrEqual(6);
  });

  it("packageManager pin is set to a pnpm version", () => {
    const { packageManager } = pkg() as { packageManager?: string };
    expect(packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+/);
  });

  it("pnpm-lock.yaml is committed at lockfileVersion >= 9.0", () => {
    const lock = readFileSync(path.join(repoRoot, "pnpm-lock.yaml"), "utf8");
    const match = lock.match(/^lockfileVersion:\s*['"]?([\d.]+)['"]?/m);
    expect(match, "pnpm-lock.yaml missing lockfileVersion header").not.toBeNull();
    const major = Number(match![1].split(".")[0]);
    expect(major).toBeGreaterThanOrEqual(9);
  });

  it("no foreign-package-manager lockfiles are committed", () => {
    const tracked = git("ls-files");
    for (const stray of ["bun.lock", "bun.lockb", "package-lock.json", "yarn.lock"]) {
      expect(tracked.split("\n")).not.toContain(stray);
    }
  });

  it("genai/ (Lovable scaffold) is not tracked", () => {
    const tracked = git("ls-files genai").trim();
    expect(tracked).toBe("");
  });

  it(".gitignore covers dist, node_modules, and .vite-react-ssg-temp", () => {
    const ignored = readFileSync(path.join(repoRoot, ".gitignore"), "utf8");
    expect(ignored).toMatch(/^dist\/?\s*$/m);
    expect(ignored).toMatch(/^node_modules\/?\s*$/m);
    expect(ignored).toMatch(/^\.vite-react-ssg-temp\/?\s*$/m);
  });

  it("vite-react-ssg is a runtime dependency (build script needs it)", () => {
    const { dependencies } = pkg() as { dependencies?: Record<string, string> };
    expect(dependencies?.["vite-react-ssg"]).toBeTruthy();
  });

  it("build script invokes vite-react-ssg, not plain vite build", () => {
    const { scripts } = pkg() as { scripts: Record<string, string> };
    expect(scripts.build).toContain("vite-react-ssg build");
  });

  it("public/robots.txt exists (required by CF Pages SEO baseline)", () => {
    expect(existsSync(path.join(repoRoot, "public/robots.txt"))).toBe(true);
  });
});
