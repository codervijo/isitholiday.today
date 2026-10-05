import { describe, expect, it } from "vitest";
import { getTodayHoliday } from "./holiday";
import { scopeTimeZone, todayIn } from "./today";

describe("scopeTimeZone", () => {
  it("maps countries and states to their zones", () => {
    expect(scopeTimeZone("india")).toBe("Asia/Kolkata");
    expect(scopeTimeZone("india", "kerala")).toBe("Asia/Kolkata");
    expect(scopeTimeZone("usa")).toBe("America/New_York");
    expect(scopeTimeZone("usa", "california")).toBe("America/Los_Angeles");
    expect(scopeTimeZone("usa", "texas")).toBe("America/Chicago");
  });
});

describe("todayIn", () => {
  // 2026-10-05 20:00 UTC = 2026-10-06 01:30 IST, 16:00 EDT, 13:00 PDT.
  const evening = new Date("2026-10-05T20:00:00Z");

  it("uses the scope's calendar date, not UTC's", () => {
    expect(todayIn("Asia/Kolkata", evening)).toBe("2026-10-06");
    expect(todayIn("America/New_York", evening)).toBe("2026-10-05");
  });

  it("keeps the US on the previous day after UTC midnight", () => {
    const lateEvening = new Date("2026-10-06T03:00:00Z"); // 23:00 EDT, 20:00 PDT
    expect(todayIn("America/New_York", lateEvening)).toBe("2026-10-05");
    expect(todayIn("America/Los_Angeles", lateEvening)).toBe("2026-10-05");
  });
});

describe("getTodayHoliday with now", () => {
  it("answers Republic Day for India from 18:30 UTC the day before", () => {
    const r = getTodayHoliday({ country: "india", now: new Date("2026-01-25T18:45:00Z") });
    expect(r.date).toBe("2026-01-26");
    expect(r.holidayName).toBe("Republic Day");
  });

  it("does not call Christmas early for the US at UTC midnight", () => {
    const r = getTodayHoliday({ country: "usa", now: new Date("2026-12-25T02:00:00Z") });
    expect(r.date).toBe("2026-12-24");
    expect(r.isHoliday).toBe(false);
  });

  it("lets an explicit today win over now", () => {
    const r = getTodayHoliday({ country: "usa", today: "2026-12-25", now: new Date("2026-06-01T12:00:00Z") });
    expect(r.date).toBe("2026-12-25");
  });
});
