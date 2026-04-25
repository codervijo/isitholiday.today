export type HolidayType = "public" | "bank" | "school";

export interface Holiday {
  country: string;
  state: string | null;
  date: string;
  name: string;
  type: HolidayType;
}

export const HOLIDAYS: Holiday[] = [
  // ---------- India — public ----------
  { country: "india", state: null, date: "2026-01-01", name: "New Year's Day", type: "public" },
  { country: "india", state: null, date: "2026-01-26", name: "Republic Day", type: "public" },
  { country: "india", state: null, date: "2026-03-04", name: "Holi", type: "public" },
  { country: "india", state: null, date: "2026-04-14", name: "Ambedkar Jayanti", type: "public" },
  { country: "india", state: null, date: "2026-08-15", name: "Independence Day", type: "public" },
  { country: "india", state: null, date: "2026-10-02", name: "Gandhi Jayanti", type: "public" },
  { country: "india", state: null, date: "2026-10-20", name: "Diwali", type: "public" },
  { country: "india", state: null, date: "2026-12-25", name: "Christmas Day", type: "public" },

  // ---------- India — state-level (Kerala, Tamil Nadu) ----------
  { country: "india", state: "kerala", date: "2026-09-04", name: "Onam", type: "public" },
  { country: "india", state: "tamil-nadu", date: "2026-01-15", name: "Pongal", type: "public" },

  // ---------- India — bank ----------
  { country: "india", state: null, date: "2026-04-01", name: "Bank Annual Closing", type: "bank" },
  { country: "india", state: null, date: "2026-09-30", name: "Bank Half-Yearly Closing", type: "bank" },

  // ---------- USA — public (federal) ----------
  { country: "usa", state: null, date: "2026-01-01", name: "New Year's Day", type: "public" },
  { country: "usa", state: null, date: "2026-01-19", name: "Martin Luther King Jr. Day", type: "public" },
  { country: "usa", state: null, date: "2026-02-16", name: "Presidents' Day", type: "public" },
  { country: "usa", state: null, date: "2026-05-25", name: "Memorial Day", type: "public" },
  { country: "usa", state: null, date: "2026-06-19", name: "Juneteenth", type: "public" },
  { country: "usa", state: null, date: "2026-07-03", name: "Independence Day (observed)", type: "public" },
  { country: "usa", state: null, date: "2026-07-04", name: "Independence Day", type: "public" },
  { country: "usa", state: null, date: "2026-09-07", name: "Labor Day", type: "public" },
  { country: "usa", state: null, date: "2026-10-12", name: "Columbus Day", type: "public" },
  { country: "usa", state: null, date: "2026-11-11", name: "Veterans Day", type: "public" },
  { country: "usa", state: null, date: "2026-11-26", name: "Thanksgiving", type: "public" },
  { country: "usa", state: null, date: "2026-12-25", name: "Christmas Day", type: "public" },

  // ---------- USA — state-level ----------
  { country: "usa", state: "california", date: "2026-03-31", name: "Cesar Chavez Day", type: "public" },
  { country: "usa", state: "texas", date: "2026-03-02", name: "Texas Independence Day", type: "public" },
  { country: "usa", state: "new-york", date: "2026-11-03", name: "Election Day", type: "public" },

  // ---------- USA — bank (Federal Reserve closures) ----------
  { country: "usa", state: null, date: "2026-01-01", name: "Federal Reserve closed (New Year)", type: "bank" },
  { country: "usa", state: null, date: "2026-12-25", name: "Federal Reserve closed (Christmas)", type: "bank" },
];
