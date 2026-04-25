import { describe, expect, it } from "vitest";
import { getTodayHoliday } from "./holiday";

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

  it("scopes to a state when provided (Kerala — Onam)", () => {
    const r = getTodayHoliday({ country: "india", state: "kerala", today: "2026-09-04" });
    expect(r.isHoliday).toBe(true);
    expect(r.holidayName).toBe("Onam");
  });

  it("filters by holiday type when provided (USA bank)", () => {
    const r = getTodayHoliday({ country: "usa", type: "bank", today: "2026-12-25" });
    expect(r.isHoliday).toBe(true);
    expect(r.type).toBe("bank");
  });
});
