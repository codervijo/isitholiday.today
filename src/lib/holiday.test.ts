import { describe, expect, it } from "vitest";
import { getTodayHoliday, getUpcomingHolidays } from "./holiday";

describe("getTodayHoliday", () => {
  it("returns isHoliday=true on a known Indian holiday", () => {
    const r = getTodayHoliday({ country: "india", today: "2026-01-26" });
    expect(r.isHoliday).toBe(true);
    expect(r.holidayName).toBe("Republic Day");
    expect(r.type).toBe("public");
  });

  it("returns isHoliday=false on a non-holiday weekday", () => {
    const r = getTodayHoliday({ country: "india", today: "2026-04-25" });
    expect(r.isHoliday).toBe(false);
    expect(r.holidayName).toBeNull();
  });

  it("includes a nextHoliday when there are upcoming entries", () => {
    const r = getTodayHoliday({ country: "usa", today: "2026-04-25" });
    expect(r.nextHoliday).not.toBeNull();
    expect(r.nextHoliday!.date >= "2026-04-25").toBe(true);
  });

  it("scopes to a state when provided (Tamil Nadu — Pongal)", () => {
    const r = getTodayHoliday({ country: "india", state: "tamil-nadu", today: "2026-01-15" });
    expect(r.isHoliday).toBe(true);
    expect(r.holidayName).toBe("Pongal");
    expect(getTodayHoliday({ country: "india", state: "kerala", today: "2026-01-15" }).isHoliday).toBe(false);
  });

  it("prefers the state observance on a shared date (Kerala Onam vs Milad-un-Nabi)", () => {
    expect(getTodayHoliday({ country: "india", state: "kerala", today: "2026-08-26" }).holidayName).toBe("Onam (Thiruvonam)");
    expect(getTodayHoliday({ country: "india", today: "2026-08-26" }).holidayName).toBe("Milad-un-Nabi");
  });

  it("applies the type filter to national entries in a state query", () => {
    const r = getTodayHoliday({ country: "usa", state: "new-york", type: "bank", today: "2026-11-03" });
    expect(r.isHoliday).toBe(false);
  });

  it("does not treat Sep 30 as an Indian bank holiday", () => {
    expect(getTodayHoliday({ country: "india", type: "bank", today: "2026-09-30" }).isHoliday).toBe(false);
  });

  it("uses the DoPT gazetted date for Diwali 2026", () => {
    expect(getTodayHoliday({ country: "india", today: "2026-11-08" }).holidayName).toBe("Diwali");
    expect(getTodayHoliday({ country: "india", today: "2026-10-20" }).holidayName).toBe("Dussehra");
  });

  it("rolls into 2027 (next holiday after Christmas 2026)", () => {
    expect(getTodayHoliday({ country: "usa", today: "2026-12-26" }).nextHoliday!.date).toBe("2027-01-01");
    expect(getTodayHoliday({ country: "india", today: "2026-12-26" }).nextHoliday!.date).toBe("2027-01-26");
  });

  it("observes Sunday July 4, 2027 on Monday July 5 (federal + Fed)", () => {
    expect(getTodayHoliday({ country: "usa", today: "2027-07-05" }).isHoliday).toBe(true);
    expect(getTodayHoliday({ country: "usa", type: "bank", today: "2027-07-05" }).isHoliday).toBe(true);
  });

  it("filters by holiday type when provided (USA bank)", () => {
    const r = getTodayHoliday({ country: "usa", type: "bank", today: "2026-12-25" });
    expect(r.isHoliday).toBe(true);
    expect(r.type).toBe("bank");
  });
});

describe("getUpcomingHolidays", () => {
  it("lists today and later, soonest first, within scope", () => {
    const list = getUpcomingHolidays({ country: "india", today: "2026-10-02" }, 3);
    expect(list.map((h) => h.date)).toEqual([...list.map((h) => h.date)].sort());
    expect(list[0].name).toBe("Gandhi Jayanti");
    expect(list.every((h) => h.country === "india" && h.state === null)).toBe(true);
  });
});
