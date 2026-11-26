import { describe, it, expect } from "vitest";
import { STATE_INSTITUTIONS, institutionOn, upcomingStateDays, type StateKey } from "./stateInstitutions";
import { weekday } from "./usAnswers";

const inst = (state: StateKey, id: string) => STATE_INSTITUTIONS[state].find((i) => i.id === id)!;
const all = Object.values(STATE_INSTITUTIONS).flat();

describe("state institution data", () => {
  it.each(all.map((i) => [i.id, i] as const))("%s: sorted, unique, within coverage", (_id, i) => {
    const dates = i.days.map((d) => d.date);
    expect([...dates].sort()).toEqual(dates);
    expect(new Set(dates).size).toBe(dates.length);
    for (const d of dates) expect(d <= i.through).toBe(true);
  });

  it.each(all.map((i) => [i.id, i] as const))("%s: 'weekend' only on weekends; closures only on weekdays", (_id, i) => {
    for (const d of i.days) {
      const wd = weekday(d.date);
      if (d.status === "weekend") expect([0, 6], `${d.date} ${d.name}`).toContain(wd);
      else expect([0, 6], `${d.date} ${d.name}`).not.toContain(wd);
    }
  });
});

describe("institutionOn", () => {
  it("CA DMV: closed on weekends (source), dates not published after Jan 1, 2027", () => {
    expect(institutionOn(inst("california", "ca-dmv"), "2026-11-28").kind).toBe("closed");
    expect(institutionOn(inst("california", "ca-dmv"), "2027-01-01").kind).toBe("closed");
    expect(institutionOn(inst("california", "ca-dmv"), "2027-02-15").kind).toBe("unknown");
  });

  it("CA courts close Fri Apr 9, 2027 (Farmworkers Day as published); CalHR uses Mar 31", () => {
    expect(institutionOn(inst("california", "ca-courts"), "2027-04-09").kind).toBe("closed");
    expect(institutionOn(inst("california", "ca-state"), "2027-03-31").kind).toBe("closed");
    expect(institutionOn(inst("california", "ca-courts"), "2027-03-31").kind).toBe("open");
  });

  it("Texas: skeleton-crew day is partial; schedule ends Aug 31, 2027", () => {
    expect(institutionOn(inst("texas", "tx-state"), "2027-01-19").kind).toBe("partial");
    expect(institutionOn(inst("texas", "tx-state"), "2027-03-26").kind).toBe("partial");
    expect(institutionOn(inst("texas", "tx-state"), "2027-09-06").kind).toBe("unknown");
  });

  it("New York: Juneteenth 2027 is a Saturday pass day; Friday Jun 18 is not a state holiday", () => {
    expect(institutionOn(inst("new-york", "ny-state"), "2027-06-19").kind).toBe("weekend");
    expect(institutionOn(inst("new-york", "ny-state"), "2027-06-18").kind).toBe("open");
    expect(institutionOn(inst("new-york", "ny-state"), "2027-02-12").kind).toBe("partial");
  });

  it("upcoming merges institutions in date order", () => {
    const next = upcomingStateDays("california", "2026-11-25", 4);
    expect(next.map((n) => n.day.date)).toEqual(["2026-11-26", "2026-11-26", "2026-11-26", "2026-11-27"]);
  });
});
