import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { GROUP_FILES, REVISED, lastmodFor, localMidnight, type Group } from "./lastmod";
import { HOLIDAY_DEFS, holidayContentSince } from "./holidayPages";

describe("localMidnight", () => {
  it("US Eastern: EST in winter, EDT in summer", () => {
    expect(localMidnight("America/New_York", new Date("2026-11-26T05:05:00Z"))).toBe("2026-11-26T00:00:00-05:00");
    expect(localMidnight("America/New_York", new Date("2027-07-01T04:05:00Z"))).toBe("2027-07-01T00:00:00-04:00");
  });

  it("India: IST; the 18:35 UTC build is already the next IST day", () => {
    expect(localMidnight("Asia/Kolkata", new Date("2026-11-26T18:35:00Z"))).toBe("2026-11-27T00:00:00+05:30");
  });

  it("California at 05:05 UTC is still the previous Pacific day", () => {
    expect(localMidnight("America/Los_Angeles", new Date("2026-11-26T05:05:00Z"))).toBe("2026-11-25T00:00:00-08:00");
  });

  it("DST start day (Mar 14, 2027): midnight is still EST", () => {
    expect(localMidnight("America/New_York", new Date("2027-03-14T12:00:00Z"))).toBe("2027-03-14T00:00:00-05:00");
  });
});

describe("lastmodFor", () => {
  const now = new Date("2026-11-26T13:00:00Z");

  it("the same lastmod for all three of a day's rebuilds (daily pages)", () => {
    const builds = ["2026-11-26T05:05:00Z", "2026-11-26T08:05:00Z", "2026-11-26T18:35:00Z"].map((t) => new Date(t));
    expect(new Set(builds.map((b) => lastmodFor("/banks-open-today/", b).value)).size).toBe(1);
  });

  it("classifies daily vs content pages", () => {
    expect(lastmodFor("/", now).kind).toBe("daily");
    expect(lastmodFor("/usa/texas/", now).value).toBe("2026-11-26T00:00:00-06:00");
    expect(lastmodFor("/india/kerala/", now).value).toBe("2026-11-26T00:00:00+05:30");
    expect(lastmodFor("/privacy/", now)).toEqual({ kind: "content", value: REVISED.legal });
    expect(lastmodFor("/christmas-eve/", now)).toEqual({ kind: "content", value: REVISED.closures });
  });

  it("holiday pages move to the rollover date once they switch to next year's dates", () => {
    const tg = HOLIDAY_DEFS.find((d) => d.slug === "thanksgiving")!;
    // Thanksgiving 2026's last related date is Fri Nov 27 (NYSE early close).
    expect(holidayContentSince(tg, "2026-11-28")).toBe("2026-11-28");
    expect(lastmodFor("/thanksgiving/", new Date("2026-11-29T12:00:00Z")).value).toBe("2026-11-28");
    expect(lastmodFor("/thanksgiving/", now).value).toBe(REVISED.holidayPages);
  });

  it("throws on an unclassified path", () => {
    expect(() => lastmodFor("/nope/", now)).toThrow(/unclassified/);
  });
});

/**
 * Keeps REVISED honest: if a group's files were committed after its REVISED
 * date, or are modified now, REVISED must be bumped. Needs git history, so it
 * runs locally (Cloudflare builds don't run tests).
 */
describe("REVISED matches git history", () => {
  const git = (...args: string[]) => {
    try {
      return execFileSync("git", args, { encoding: "utf8" }).trim();
    } catch {
      return null;
    }
  };
  const hasGit = git("rev-parse", "--is-inside-work-tree") === "true";
  const today = new Date().toISOString().slice(0, 10);

  it.skipIf(!hasGit).each(Object.keys(REVISED) as Group[])("%s", (group) => {
    const files = GROUP_FILES[group];
    const committed = git("log", "-1", "--format=%cs", "--", ...files) || "0000-00-00";
    const dirty = (git("status", "--porcelain", "--", ...files) ?? "").length > 0;
    const required = dirty ? today : committed;
    expect(REVISED[group] >= required, `bump REVISED.${group} to ≥ ${required}`).toBe(true);
  });
});
