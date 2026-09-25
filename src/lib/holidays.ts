export type HolidayType = "public" | "bank" | "school";

export interface Holiday {
  country: string;
  state: string | null;
  date: string;
  name: string;
  type: HolidayType;
}

export const HOLIDAYS: Holiday[] = [
  // ---------- India — public 2026 ----------
  // Source: DoPT OM F.No.12/2/2023-JCA dated 03.07.2025, Annexure-I (17 gazetted
  // holidays, Central Govt offices), via dfe.gov.in/uploads/documents/list-of-gazetted-holidays-2026.pdf
  { country: "india", state: null, date: "2026-01-26", name: "Republic Day", type: "public" },
  { country: "india", state: null, date: "2026-03-04", name: "Holi", type: "public" },
  { country: "india", state: null, date: "2026-03-21", name: "Id-ul-Fitr", type: "public" },
  { country: "india", state: null, date: "2026-03-26", name: "Ram Navami", type: "public" },
  { country: "india", state: null, date: "2026-03-31", name: "Mahavir Jayanti", type: "public" },
  { country: "india", state: null, date: "2026-04-03", name: "Good Friday", type: "public" },
  // Not in Annexure-I; declared by DoPT OM No. 12/4/2020-JCA dated 09.04.2026 (via mowr.nic.in
  // circular of the same date). Declared year by year — 2027 not yet declared.
  { country: "india", state: null, date: "2026-04-14", name: "Ambedkar Jayanti", type: "public" },
  { country: "india", state: null, date: "2026-05-01", name: "Buddha Purnima", type: "public" },
  { country: "india", state: null, date: "2026-05-27", name: "Id-ul-Zuha (Bakrid)", type: "public" },
  { country: "india", state: null, date: "2026-06-26", name: "Muharram", type: "public" },
  { country: "india", state: null, date: "2026-08-15", name: "Independence Day", type: "public" },
  { country: "india", state: null, date: "2026-08-26", name: "Milad-un-Nabi", type: "public" },
  { country: "india", state: null, date: "2026-09-04", name: "Janmashtami", type: "public" },
  { country: "india", state: null, date: "2026-10-02", name: "Gandhi Jayanti", type: "public" },
  { country: "india", state: null, date: "2026-10-20", name: "Dussehra", type: "public" },
  { country: "india", state: null, date: "2026-11-08", name: "Diwali", type: "public" },
  { country: "india", state: null, date: "2026-11-24", name: "Guru Nanak Jayanti", type: "public" },
  { country: "india", state: null, date: "2026-12-25", name: "Christmas Day", type: "public" },

  // ---------- India — public 2027 ----------
  // Source: DoPT OM F.No.12/2/2023-JCA dated 16.07.2026, Annexure-I, as reproduced by
  // staffnews.in (doptcirculars.nic.in unreachable at time of entry — re-verify against the PDF).
  // Id-ul-Fitr, Id-ul-Zuha, Muharram, Milad-un-Nabi may shift with moon sighting.
  { country: "india", state: null, date: "2027-01-26", name: "Republic Day", type: "public" },
  { country: "india", state: null, date: "2027-03-10", name: "Id-ul-Fitr", type: "public" },
  { country: "india", state: null, date: "2027-03-23", name: "Holi", type: "public" },
  { country: "india", state: null, date: "2027-03-26", name: "Good Friday", type: "public" },
  { country: "india", state: null, date: "2027-04-15", name: "Ram Navami", type: "public" },
  { country: "india", state: null, date: "2027-04-19", name: "Mahavir Jayanti", type: "public" },
  { country: "india", state: null, date: "2027-05-17", name: "Id-ul-Zuha (Bakrid)", type: "public" },
  { country: "india", state: null, date: "2027-05-20", name: "Buddha Purnima", type: "public" },
  { country: "india", state: null, date: "2027-06-16", name: "Muharram", type: "public" },
  { country: "india", state: null, date: "2027-08-15", name: "Independence Day", type: "public" },
  { country: "india", state: null, date: "2027-08-15", name: "Milad-un-Nabi", type: "public" },
  { country: "india", state: null, date: "2027-08-25", name: "Janmashtami", type: "public" },
  { country: "india", state: null, date: "2027-10-02", name: "Gandhi Jayanti", type: "public" },
  { country: "india", state: null, date: "2027-10-09", name: "Dussehra", type: "public" },
  { country: "india", state: null, date: "2027-10-29", name: "Diwali", type: "public" },
  { country: "india", state: null, date: "2027-11-14", name: "Guru Nanak Jayanti", type: "public" },
  { country: "india", state: null, date: "2027-12-25", name: "Christmas Day", type: "public" },

  // ---------- India — state-level (Kerala, Tamil Nadu) ----------
  // Kerala: gad.kerala.gov.in/sites/default/files/inline-files/public-holidays-2026_0.pdf
  // TN: 2026 state G.O. (Chief Secretary notification). 2027 state lists not published as of
  // 2026-09-25 — add when Kerala GAD / TN P&AR notify them.
  { country: "india", state: "kerala", date: "2026-08-25", name: "First Onam", type: "public" },
  { country: "india", state: "kerala", date: "2026-08-26", name: "Onam (Thiruvonam)", type: "public" },
  { country: "india", state: "kerala", date: "2026-08-27", name: "Third Onam", type: "public" },
  { country: "india", state: "kerala", date: "2026-08-28", name: "Fourth Onam", type: "public" },
  { country: "india", state: "tamil-nadu", date: "2026-01-15", name: "Pongal", type: "public" },

  // ---------- India — bank ----------
  // Source: rbi.org.in/Scripts/HolidayMatrixDisplay.aspx (Apr 2026: "To enable Banks to close
  // their yearly accounts"). Sep 30 is not an RBI holiday. RBI has not published 2027 yet.
  { country: "india", state: null, date: "2026-04-01", name: "Bank Annual Closing", type: "bank" },

  // ---------- USA — public (federal) 2026 ----------
  // Source: opm.gov/policy-data-oversight/pay-leave/federal-holidays/
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

  // ---------- USA — public (federal) 2027 ----------
  // Source: OPM (same page). Saturday → preceding Friday; Sunday → following Monday.
  { country: "usa", state: null, date: "2027-01-01", name: "New Year's Day", type: "public" },
  { country: "usa", state: null, date: "2027-01-18", name: "Martin Luther King Jr. Day", type: "public" },
  { country: "usa", state: null, date: "2027-02-15", name: "Presidents' Day", type: "public" },
  { country: "usa", state: null, date: "2027-05-31", name: "Memorial Day", type: "public" },
  { country: "usa", state: null, date: "2027-06-18", name: "Juneteenth (observed)", type: "public" },
  { country: "usa", state: null, date: "2027-06-19", name: "Juneteenth", type: "public" },
  { country: "usa", state: null, date: "2027-07-04", name: "Independence Day", type: "public" },
  { country: "usa", state: null, date: "2027-07-05", name: "Independence Day (observed)", type: "public" },
  { country: "usa", state: null, date: "2027-09-06", name: "Labor Day", type: "public" },
  { country: "usa", state: null, date: "2027-10-11", name: "Columbus Day", type: "public" },
  { country: "usa", state: null, date: "2027-11-11", name: "Veterans Day", type: "public" },
  { country: "usa", state: null, date: "2027-11-25", name: "Thanksgiving", type: "public" },
  { country: "usa", state: null, date: "2027-12-24", name: "Christmas Day (observed)", type: "public" },
  { country: "usa", state: null, date: "2027-12-25", name: "Christmas Day", type: "public" },
  // Jan 1, 2028 is a Saturday → observed Fri Dec 31, 2027 (OPM Saturday rule).
  { country: "usa", state: null, date: "2027-12-31", name: "New Year's Day (observed)", type: "public" },

  // ---------- USA — state-level ----------
  // Fixed-date state holidays (Cesar Chavez Day Mar 31, Texas Independence Day Mar 2).
  // NY: General Construction Law §24 ("each general election day") + Election Law §8-100
  // (held annually, Tuesday after the first Monday in November).
  { country: "usa", state: "california", date: "2026-03-31", name: "Cesar Chavez Day", type: "public" },
  { country: "usa", state: "california", date: "2027-03-31", name: "Cesar Chavez Day", type: "public" },
  { country: "usa", state: "texas", date: "2026-03-02", name: "Texas Independence Day", type: "public" },
  { country: "usa", state: "texas", date: "2027-03-02", name: "Texas Independence Day", type: "public" },
  { country: "usa", state: "new-york", date: "2026-11-03", name: "Election Day", type: "public" },
  { country: "usa", state: "new-york", date: "2027-11-02", name: "Election Day", type: "public" },

  // ---------- USA — bank (Federal Reserve closures) ----------
  // Source: federalreserve.gov/aboutthefed/k8.htm. Saturday holidays: Reserve Banks open the
  // preceding Friday. Sunday holidays: all offices closed the following Monday.
  { country: "usa", state: null, date: "2026-01-01", name: "Federal Reserve closed (New Year)", type: "bank" },
  { country: "usa", state: null, date: "2026-01-19", name: "Federal Reserve closed (MLK Day)", type: "bank" },
  { country: "usa", state: null, date: "2026-02-16", name: "Federal Reserve closed (Presidents' Day)", type: "bank" },
  { country: "usa", state: null, date: "2026-05-25", name: "Federal Reserve closed (Memorial Day)", type: "bank" },
  { country: "usa", state: null, date: "2026-06-19", name: "Federal Reserve closed (Juneteenth)", type: "bank" },
  { country: "usa", state: null, date: "2026-07-04", name: "Federal Reserve closed (Independence Day)", type: "bank" },
  { country: "usa", state: null, date: "2026-09-07", name: "Federal Reserve closed (Labor Day)", type: "bank" },
  { country: "usa", state: null, date: "2026-10-12", name: "Federal Reserve closed (Columbus Day)", type: "bank" },
  { country: "usa", state: null, date: "2026-11-11", name: "Federal Reserve closed (Veterans Day)", type: "bank" },
  { country: "usa", state: null, date: "2026-11-26", name: "Federal Reserve closed (Thanksgiving)", type: "bank" },
  { country: "usa", state: null, date: "2026-12-25", name: "Federal Reserve closed (Christmas)", type: "bank" },
  { country: "usa", state: null, date: "2027-01-01", name: "Federal Reserve closed (New Year)", type: "bank" },
  { country: "usa", state: null, date: "2027-01-18", name: "Federal Reserve closed (MLK Day)", type: "bank" },
  { country: "usa", state: null, date: "2027-02-15", name: "Federal Reserve closed (Presidents' Day)", type: "bank" },
  { country: "usa", state: null, date: "2027-05-31", name: "Federal Reserve closed (Memorial Day)", type: "bank" },
  { country: "usa", state: null, date: "2027-06-19", name: "Federal Reserve closed (Juneteenth)", type: "bank" },
  { country: "usa", state: null, date: "2027-07-05", name: "Federal Reserve closed (Independence Day observed)", type: "bank" },
  { country: "usa", state: null, date: "2027-09-06", name: "Federal Reserve closed (Labor Day)", type: "bank" },
  { country: "usa", state: null, date: "2027-10-11", name: "Federal Reserve closed (Columbus Day)", type: "bank" },
  { country: "usa", state: null, date: "2027-11-11", name: "Federal Reserve closed (Veterans Day)", type: "bank" },
  { country: "usa", state: null, date: "2027-11-25", name: "Federal Reserve closed (Thanksgiving)", type: "bank" },
  { country: "usa", state: null, date: "2027-12-25", name: "Federal Reserve closed (Christmas)", type: "bank" },
];
