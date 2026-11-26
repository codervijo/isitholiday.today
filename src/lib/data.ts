import type { HolidayType } from "./holidays";
import type { Faq } from "./closures";

export interface Source {
  label: string;
  url: string;
}

// Mirrors the source comments in src/lib/holidays.ts — keep the two in step.
const DOPT: Source = {
  label: "DoPT gazetted holidays 2026 (Central Government offices)",
  url: "https://dfe.gov.in/uploads/documents/list-of-gazetted-holidays-2026.pdf",
};
const RBI: Source = {
  label: "Reserve Bank of India holiday matrix",
  url: "https://rbi.org.in/Scripts/HolidayMatrixDisplay.aspx",
};
const KERALA_GAD: Source = {
  label: "Kerala GAD public holidays 2026",
  url: "https://gad.kerala.gov.in/sites/default/files/inline-files/public-holidays-2026_0.pdf",
};
const OPM: Source = {
  label: "OPM federal holidays",
  url: "https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/",
};
const GOV_UK: Source = { label: "GOV.UK bank holidays", url: "https://www.gov.uk/bank-holidays" };
const CA_CLC: Source = {
  label: "Canada.ca: general holidays (federally regulated workplaces)",
  url: "https://www.canada.ca/en/services/jobs/workplace/federal-labour-standards/vacations-holidays.html",
};
const CA_HOLIDAYS_ACT: Source = { label: "Holidays Act (Canada)", url: "https://laws-lois.justice.gc.ca/eng/acts/H-5/" };
const CRA_HOLIDAYS: Source = { label: "CRA public holidays 2026", url: "https://www.canada.ca/en/revenue-agency/services/tax/public-holidays.html" };
const ON_ESA: Source = {
  label: "Ontario: public holidays (Employment Standards Act guide)",
  url: "https://www.ontario.ca/document/your-guide-employment-standards-act-0/public-holidays",
};

const FED: Source = {
  label: "Federal Reserve holiday schedule",
  url: "https://www.federalreserve.gov/aboutthefed/k8.htm",
};

/**
 * v2.J golden-page content: the fields every location page (and the holiday
 * checker) must carry. Every holiday fact in this copy comes from the sourced
 * data in holidays.ts, usAnswers.ts, nyse.ts and stateInstitutions.ts.
 */
export interface GoldenContent {
  /** 1–2 sentences shown under the H1. */
  tagline: string;
  /** 6–8 long-tail variants, primary first. */
  keywords: string[];
  /** 2–4 paragraphs below the checker. */
  intro: string[];
  /** 4–6 numbered steps: how the page reaches its answer. */
  howItWorks: string[];
  /** 4–6 actionable bullets. */
  tips: string[];
  /** Exactly 5, 40–80 words each. Rendered visibly and as FAQPage JSON-LD. */
  faq: Faq[];
  /** Month the page copy was last revised, e.g. "November 2026". */
  lastUpdated: string;
  /** ISO date the page's holiday data was last checked against its sources. */
  dataUpdated: string;
  /** ≥3 related routes (slugs without slashes; "" = home). */
  relatedSlugs: string[];
}

export interface SeoPage extends GoldenContent {
  slug: string;
  title: string;
  h1: string;
  /** 120–160 characters. */
  description: string;
  directAnswer: string;
  /** Official sources the page's holiday data comes from. */
  sources?: Source[];
  prefill: {
    country: string;
    state?: string | null;
    type?: HolidayType | null;
  };
}

// Data-verification dates (dataUpdated):
//   2026-09-25 — India national, Kerala, Tamil Nadu and RBI data entered and checked
//                (commit 93417c1); not re-verified in v2.J.
//   2026-11-23 — OPM federal + Federal Reserve schedules checked (v2.G CHECKED).
//   2026-11-26 — CA / TX / NY state office, court and DMV sources read (v3.F).
const INDIA_VERIFIED = "2026-09-25";
const US_FEDERAL_VERIFIED = "2026-11-23";
const US_STATE_VERIFIED = "2026-11-26";
const COPY_UPDATED = "November 2026";

const IST_FAQ: Faq = {
  question: "What time zone does the answer use?",
  answer:
    "Indian Standard Time. The page is rebuilt several times a day, and when it loads your browser recomputes the answer from its own clock using the date in India. So the answer switches at midnight IST, not at midnight where you are, which matters if you are checking from outside India.",
};

export const PAGES: SeoPage[] = [
  {
    slug: "india",
    title: "Is Today a Holiday in India? — isitholiday.today",
    h1: "Is Today a Holiday in India?",
    description: "Is today a holiday in India? Today's answer from the Central Government gazetted list, the next holiday, and every upcoming date, in Indian Standard Time.",
    directAnswer: "Checked against the Central Government's gazetted holiday list and nationwide bank closures, using today's date in Indian Standard Time.",
    tagline:
      "Find out at a glance whether today is a gazetted holiday for Central Government offices in India, and when the next one falls.",
    keywords: [
      "is today a holiday in india",
      "india holiday today",
      "gazetted holidays 2026",
      "gazetted holidays 2027",
      "central government holidays india",
      "next holiday in india",
      "is today a government holiday",
    ],
    intro: [
      "India's Central Government holidays are fixed each year by the Department of Personnel and Training (DoPT). Its 2026 list has 17 gazetted holidays for Central Government offices, and DoPT added Ambedkar Jayanti (14 April) by a separate order on 9 April 2026. The 2027 list was issued on 16 July 2026, and both years appear in the table below.",
      "Four of those holidays — Id-ul-Fitr, Id-ul-Zuha (Bakrid), Muharram and Milad-un-Nabi — follow the lunar calendar, so the actual day can shift by a day once the moon is sighted.",
      "States publish their own lists on top of the national one. Kerala's adds the four days of Onam and Tamil Nadu's adds Pongal; the state pages below answer for those. Banks follow the Reserve Bank of India's calendar, which differs by state — the bank-holiday page covers the nationwide closures.",
    ],
    howItWorks: [
      "The page takes today's date in Indian Standard Time, so the answer changes at midnight in India.",
      "It checks that date against the gazetted holidays DoPT lists for Central Government offices for 2026 and 2027.",
      "It also checks the Reserve Bank of India's nationwide bank closures, such as the annual closing of accounts on 1 April 2026.",
      "If today is on either list, the answer is yes and names the holiday; otherwise it shows the next holiday and how many days away it is.",
      "For state holidays such as Onam in Kerala or Pongal in Tamil Nadu, which the national list does not include, use the state pages.",
    ],
    tips: [
      "Check again close to Id-ul-Fitr, Id-ul-Zuha, Muharram and Milad-un-Nabi: their dates can move by a day once the moon is sighted.",
      "If you work for a state government, a bank or a private company, check that employer's or state's own list as well; the gazetted list is for Central Government offices.",
      "Use the upcoming-holidays table below to plan leave: it lists every remaining 2026 and 2027 gazetted holiday with the number of days away.",
      "Before a bank visit, check the bank-holiday page and the RBI holiday matrix for your state, since bank holidays differ from the gazetted list.",
    ],
    faq: [
      {
        question: "How many gazetted holidays are there in India in 2026?",
        answer:
          "DoPT's 2026 list has 17 gazetted holidays for Central Government offices. DoPT then declared Ambedkar Jayanti, 14 April 2026, a holiday by a separate order dated 9 April 2026, so this site shows 18 dates for 2026. State governments and banks publish their own lists, which can differ from it.",
      },
      {
        question: "Is Diwali a gazetted holiday in 2027?",
        answer:
          "Yes. DoPT's 2027 list for Central Government offices, issued on 16 July 2026, includes Diwali on Friday, 29 October 2027. The upcoming-holidays table on this page shows it alongside the other 2027 gazetted holidays, with the number of days left until each one.",
      },
      {
        question: "Why can Eid and Muharram dates change?",
        answer:
          "Id-ul-Fitr, Id-ul-Zuha (Bakrid), Muharram and Milad-un-Nabi follow the lunar calendar. DoPT publishes a date for each in advance, but the actual holiday can move by a day once the moon is sighted. This page shows the date on DoPT's published list, so check again close to the day.",
      },
      {
        question: "Does the national list include state holidays?",
        answer:
          "No. DoPT's list covers Central Government offices. States publish their own lists: Kerala's 2026 list adds four days of Onam, from 25 to 28 August, and Tamil Nadu's adds Pongal on 15 January 2026. The Kerala and Tamil Nadu pages on this site answer for those states.",
      },
      IST_FAQ,
    ],
    lastUpdated: COPY_UPDATED,
    dataUpdated: INDIA_VERIFIED,
    relatedSlugs: ["india/kerala", "india/tamil-nadu", "india/bank-holiday"],
    sources: [DOPT, RBI],
    prefill: { country: "india" },
  },
  {
    slug: "india/kerala",
    title: "Is Today a Holiday in Kerala, India? — isitholiday.today",
    h1: "Is Today a Holiday in Kerala?",
    description:
      "Is today a holiday in Kerala? Checks today against the Onam days on the Kerala government's 2026 list and the Central Government gazetted holidays, in IST.",
    directAnswer:
      "Checked against the Central Government's gazetted holidays and the Onam holidays on the Kerala government's 2026 list, using today's date in Indian Standard Time.",
    tagline:
      "See whether today is a holiday in Kerala, with the Onam dates from the state government's 2026 list and the national gazetted holidays.",
    keywords: [
      "is today a holiday in kerala",
      "kerala holiday today",
      "onam holidays 2026",
      "kerala public holidays 2026",
      "kerala government holidays",
      "next holiday in kerala",
    ],
    intro: [
      "Kerala's General Administration Department publishes the state's public holiday list each year. Its 2026 list gives four days for Onam: First Onam on 25 August, Thiruvonam on 26 August, Third Onam on 27 August and Fourth Onam on 28 August 2026.",
      "Central Government offices follow the national gazetted list from DoPT instead, which has 17 holidays for 2026 plus Ambedkar Jayanti, and 2027 dates issued in July 2026. The checker on this page shows both lists.",
      "Of Kerala's own list, this site currently carries the Onam days. When the data was last verified in September 2026, Kerala had not yet published its 2027 list; this site will add it once it is notified.",
    ],
    howItWorks: [
      "The page takes today's date in Indian Standard Time.",
      "It checks the date against the Central Government's gazetted holidays for 2026 and 2027.",
      "It checks the Onam holidays from the Kerala government's 2026 list.",
      "If either list has today, the answer is yes with the holiday's name; otherwise it shows the next holiday and how far away it is.",
    ],
    tips: [
      "Plan around Onam early: in 2026 the four Onam holidays run from Tuesday 25 August to Friday 28 August.",
      "Central Government staff go by the national gazetted list; Kerala state government staff go by the state's own list.",
      "Before a bank visit, check the Reserve Bank of India's holiday matrix for Kerala, which can differ from both lists.",
      "Check back for 2027: Kerala's 2027 list had not been published when this page's data was last verified.",
    ],
    faq: [
      {
        question: "When is Onam in 2026?",
        answer:
          "Kerala's 2026 public holiday list gives four Onam holidays: First Onam on Tuesday 25 August, Thiruvonam on Wednesday 26 August, Third Onam on Thursday 27 August and Fourth Onam on Friday 28 August 2026. They are on the state government's list, not on the national gazetted list.",
      },
      {
        question: "Is Onam a national holiday in India?",
        answer:
          "No. Onam is not on DoPT's 2026 gazetted holiday list for Central Government offices. It is a public holiday on the Kerala government's own list, so during Onam the answer on this Kerala page differs from the answer on the national India page.",
      },
      {
        question: "What does the Kerala page check?",
        answer:
          "Two lists: the gazetted holidays DoPT publishes for Central Government offices, for 2026 and 2027, and the Onam holidays from the Kerala government's 2026 list. The answer uses today's date in Indian Standard Time and names the holiday when today is on either list.",
      },
      {
        question: "Has Kerala published its 2027 holiday list?",
        answer:
          "Not when this page's data was last verified in September 2026. Kerala's General Administration Department notifies each year's list separately, and this site adds it once it is published. Until then, the Kerala page shows the national 2027 dates from DoPT's list issued on 16 July 2026.",
      },
      {
        question: "Are banks in Kerala closed on the same days?",
        answer:
          "Not necessarily. Banks follow the Reserve Bank of India's holiday calendar, which RBI publishes state by state, and it can differ from both the Kerala government's list and the national gazetted list. Check RBI's holiday matrix for Kerala, or ask your branch, before a visit.",
      },
    ],
    lastUpdated: COPY_UPDATED,
    dataUpdated: INDIA_VERIFIED,
    relatedSlugs: ["india", "india/tamil-nadu", "india/bank-holiday"],
    sources: [DOPT, KERALA_GAD],
    prefill: { country: "india", state: "kerala" },
  },
  {
    slug: "india/tamil-nadu",
    title: "Is Today a Holiday in Tamil Nadu, India? — isitholiday.today",
    h1: "Is Today a Holiday in Tamil Nadu?",
    description:
      "Is today a holiday in Tamil Nadu? Checks today against Pongal on the state's 2026 holiday list and the Central Government gazetted holidays, in IST.",
    directAnswer:
      "Checked against the Central Government's gazetted holidays and the Pongal holiday on the Tamil Nadu government's 2026 list, using today's date in Indian Standard Time.",
    tagline:
      "See whether today is a holiday in Tamil Nadu, with Pongal from the state's 2026 list and the national gazetted holidays.",
    keywords: [
      "is today a holiday in tamil nadu",
      "tamil nadu holiday today",
      "pongal holiday 2026",
      "tamil nadu government holidays 2026",
      "tamil nadu public holidays",
      "next holiday in tamil nadu",
    ],
    intro: [
      "The Tamil Nadu government notifies the state's public holidays each year by a Government Order. Its 2026 list includes Pongal on 15 January 2026, which this site carries.",
      "Central Government offices follow the national gazetted list from DoPT, which has 17 holidays for 2026 plus Ambedkar Jayanti, and 2027 dates issued in July 2026. The checker on this page shows both lists.",
      "When this site's data was last verified in September 2026, Tamil Nadu had not published its 2027 list; this site will add it once it is notified.",
    ],
    howItWorks: [
      "The page takes today's date in Indian Standard Time.",
      "It checks the date against the Central Government's gazetted holidays for 2026 and 2027.",
      "It checks Pongal from the Tamil Nadu government's 2026 list.",
      "If either list has today, the answer is yes with the holiday's name; otherwise it shows the next holiday and how far away it is.",
    ],
    tips: [
      "Pongal is a Tamil Nadu holiday: in 2026 it falls on Thursday 15 January.",
      "Central Government staff go by the national gazetted list; Tamil Nadu government staff go by the state's own list.",
      "Before a bank visit, check the Reserve Bank of India's holiday matrix for Tamil Nadu, which can differ from both lists.",
      "Check back for 2027: Tamil Nadu's 2027 list had not been published when this page's data was last verified.",
    ],
    faq: [
      {
        question: "When is Pongal in 2026?",
        answer:
          "The Tamil Nadu government's 2026 holiday list gives Pongal on Thursday, 15 January 2026. It is a state holiday and does not appear on DoPT's gazetted list for Central Government offices, so on that day the answer here differs from the answer on the national India page.",
      },
      {
        question: "What does the Tamil Nadu page check?",
        answer:
          "Two lists: the gazetted holidays DoPT publishes for Central Government offices, for 2026 and 2027, and Pongal from the Tamil Nadu government's 2026 list. The answer uses today's date in Indian Standard Time and names the holiday when today is on either list.",
      },
      {
        question: "Has Tamil Nadu published its 2027 holiday list?",
        answer:
          "Not when this page's data was last verified in September 2026. The state notifies each year's holidays by a separate Government Order, and this site adds them once they are published. Until then, the page shows the national 2027 dates from DoPT's list issued on 16 July 2026.",
      },
      {
        question: "Are banks in Tamil Nadu closed on the same days?",
        answer:
          "Not necessarily. Banks follow the Reserve Bank of India's holiday calendar, which RBI publishes state by state, and it can differ from both the Tamil Nadu government's list and the national gazetted list. Check RBI's holiday matrix for Tamil Nadu, or ask your branch, before a visit.",
      },
      {
        question: "Why can some national holiday dates move?",
        answer:
          "Four gazetted holidays follow the lunar calendar: Id-ul-Fitr, Id-ul-Zuha (Bakrid), Muharram and Milad-un-Nabi. DoPT publishes a date for each in advance, but the actual day can move by one once the moon is sighted. This page shows the published date, so check again close to the day.",
      },
    ],
    lastUpdated: COPY_UPDATED,
    dataUpdated: INDIA_VERIFIED,
    relatedSlugs: ["india", "india/kerala", "india/bank-holiday"],
    sources: [DOPT],
    prefill: { country: "india", state: "tamil-nadu" },
  },
  {
    slug: "india/bank-holiday",
    title: "Is Today a Bank Holiday in India? — isitholiday.today",
    h1: "Is Today a Bank Holiday in India?",
    description:
      "Is today a bank holiday in India? Checks today against the Reserve Bank of India's nationwide closures, such as the 1 April annual closing, in IST.",
    directAnswer:
      "Checked against the nationwide bank closures on the Reserve Bank of India's holiday matrix, using today's date in Indian Standard Time.",
    tagline:
      "See whether Indian banks have a nationwide holiday today, from the Reserve Bank of India's holiday matrix.",
    keywords: [
      "is today a bank holiday in india",
      "bank holiday today india",
      "rbi bank holidays 2026",
      "bank annual closing 1 april",
      "are banks closed today india",
      "rbi holiday matrix",
    ],
    intro: [
      "The Reserve Bank of India publishes bank holidays in a holiday matrix, state by state, and the dates differ between states: a holiday for banks in one state can be a working day in another.",
      "This page tracks the closures that apply to banks nationwide. For 2026 that is 1 April, which RBI lists \"to enable Banks to close their yearly accounts\". 30 September is not an RBI holiday.",
      "RBI had not published its 2027 holidays when this site's data was last verified in September 2026. For state-specific bank holidays, use RBI's holiday matrix for your state.",
    ],
    howItWorks: [
      "The page takes today's date in Indian Standard Time.",
      "It checks that date against the nationwide closures on the RBI holiday matrix.",
      "If today is one of them, the answer is yes with the reason; otherwise it shows the next nationwide closure and how far away it is.",
      "For holidays that apply only in some states, check RBI's holiday matrix for your state.",
    ],
    tips: [
      "Plan branch visits around 1 April: RBI listed 1 April 2026 as a bank holiday for the annual closing of accounts.",
      "Check RBI's holiday matrix for your state before a branch visit; state bank holidays are not shown here.",
      "Ask your branch about its own hours and any local closures.",
      "For Central Government office holidays, use the India page; the bank calendar is different.",
    ],
    faq: [
      {
        question: "Is 1 April a bank holiday in India?",
        answer:
          "Yes, in 2026. RBI's holiday matrix lists Wednesday, 1 April 2026 as a bank holiday \"to enable Banks to close their yearly accounts\". It applies to banks across India, so plan branch visits for the days before or after it. RBI had not published its 2027 dates when this data was verified.",
      },
      {
        question: "Is 30 September a bank holiday?",
        answer:
          "No. 30 September is not listed as a holiday on RBI's holiday matrix. Only 1 April appears as the nationwide annual closing in this site's data for 2026. State-specific bank holidays can still fall on other dates, so check RBI's matrix for your state.",
      },
      {
        question: "Why are bank holidays different in each state?",
        answer:
          "The Reserve Bank of India lists bank holidays state by state in its holiday matrix, and the dates differ between states. A bank holiday in Kerala or Tamil Nadu may be a normal working day for banks elsewhere. This page shows only the closures that apply to banks nationwide.",
      },
      {
        question: "Has RBI published 2027 bank holidays?",
        answer:
          "Not when this page's data was last verified in September 2026; this site will add the 2027 dates once RBI publishes them. Central Government office holidays for 2027 are already on the India page, from DoPT's list issued on 16 July 2026.",
      },
      IST_FAQ,
    ],
    lastUpdated: COPY_UPDATED,
    dataUpdated: INDIA_VERIFIED,
    relatedSlugs: ["india", "india/kerala", "india/tamil-nadu", "usa/bank-holiday"],
    sources: [RBI],
    prefill: { country: "india", type: "bank" },
  },
  {
    slug: "usa",
    title: "Is Today a Holiday in the USA? — isitholiday.today",
    h1: "Is Today a Holiday in the USA?",
    description:
      "Is today a holiday in the USA? Checks today against OPM's federal holiday list and the Federal Reserve schedule, with every upcoming date, in US Eastern time.",
    directAnswer:
      "Checked against OPM's federal holiday list and the Federal Reserve's holiday schedule, using today's date in US Eastern time.",
    tagline:
      "A yes-or-no answer for the United States today: federal holidays from OPM and bank holidays from the Federal Reserve.",
    keywords: [
      "is today a holiday in the usa",
      "is today a federal holiday",
      "us holidays today",
      "federal holidays 2027",
      "observed federal holidays",
      "next federal holiday",
      "us bank holidays",
    ],
    intro: [
      "US federal holidays are the eleven days on the list the Office of Personnel Management (OPM) publishes each year: New Year's Day, Martin Luther King Jr. Day, Presidents' Day, Memorial Day, Juneteenth, Independence Day, Labor Day, Columbus Day, Veterans Day, Thanksgiving and Christmas Day.",
      "When a federal holiday falls on a Saturday, federal employees get the Friday before off; on a Sunday, the Monday after. The Federal Reserve handles Saturdays differently: Federal Reserve Banks stay open the Friday before. In 2027 Juneteenth and Christmas Day both fall on Saturdays.",
      "States add their own holidays, such as Farmworkers Day in California, Texas Independence Day, and Election Day on New York's legal holiday list. The state pages cover those, along with state office, court and DMV closures.",
    ],
    howItWorks: [
      "The page takes today's date in US Eastern time.",
      "It checks the date against OPM's federal holiday list, including observed days when a holiday falls on a weekend.",
      "It checks the Federal Reserve's holiday schedule, which US bank holidays follow.",
      "If today is on either list, the answer is yes with the holiday's name; otherwise it shows the next holiday and how many days away it is.",
      "For state holidays, open the California, Texas or New York page.",
    ],
    tips: [
      "Look at the observed date: in 2027 federal employees take Juneteenth on Friday, June 18 and Christmas on Friday, December 24.",
      "Plan long weekends around the Monday holidays: Martin Luther King Jr. Day, Presidents' Day, Memorial Day, Labor Day and Columbus Day always fall on a Monday.",
      "Banks follow the Federal Reserve schedule, but each bank sets its own branch hours; check with yours before a weekend visit.",
      "Post Offices and the stock market keep their own calendars; check the post office and per-holiday pages before planning mail or trades.",
    ],
    faq: [
      {
        question: "How many federal holidays are there in the US?",
        answer:
          "Eleven, on the list the Office of Personnel Management publishes: New Year's Day, Martin Luther King Jr. Day, Presidents' Day, Memorial Day, Juneteenth, Independence Day, Labor Day, Columbus Day, Veterans Day, Thanksgiving and Christmas Day. When one falls on a weekend, a nearby weekday is observed instead.",
      },
      {
        question: "What happens when a federal holiday falls on a weekend?",
        answer:
          "Under OPM's rule a Saturday holiday is observed on the Friday before and a Sunday holiday on the Monday after. In 2027 Juneteenth (Saturday, June 19) is observed on Friday, June 18, Independence Day (Sunday, July 4) on Monday, July 5, and Christmas (Saturday, December 25) on Friday, December 24.",
      },
      {
        question: "Are banks closed on federal holidays?",
        answer:
          "The Federal Reserve closes on the holidays on its schedule, which are the same days as the federal holidays, and US bank holidays follow it. For a Saturday holiday Federal Reserve Banks stay open the Friday before; for a Sunday holiday they close the following Monday. Individual banks set their own branch hours.",
      },
      {
        question: "Is the stock market closed on every federal holiday?",
        answer:
          "No. NYSE publishes its own holiday list. In 2027 the market is open on Columbus Day and Veterans Day, which are federal holidays, and closed on Good Friday, March 26, which is not. The per-holiday pages on this site show NYSE status next to banks, Post Offices and federal offices.",
      },
      {
        question: "What time zone does the answer use?",
        answer:
          "US Eastern time. The page is rebuilt several times a day, and when it loads your browser recomputes the answer from its own clock using the date in the Eastern time zone. If you are on the West Coast, the answer switches to the next day at 9 p.m. Pacific.",
      },
    ],
    lastUpdated: COPY_UPDATED,
    dataUpdated: US_FEDERAL_VERIFIED,
    relatedSlugs: ["usa/bank-holiday", "federal-holiday-today", "usa/california", "usa/texas", "usa/new-york"],
    sources: [OPM, FED],
    prefill: { country: "usa" },
  },
  {
    slug: "usa/california",
    title: "Is Today a Holiday in California? — isitholiday.today",
    h1: "Is Today a Holiday in California?",
    description:
      "Is today a holiday in California? Federal holidays, Farmworkers Day (formerly Cesar Chavez Day), and state office, court and DMV closures from official lists.",
    directAnswer:
      "Checked against OPM's federal holidays and California's March 31 state holiday, plus today's status for state offices, courts and the DMV from their own schedules.",
    tagline: "See whether today is a holiday in California, and whether state offices, courts and the DMV are open.",
    keywords: [
      "is today a holiday in california",
      "california state holidays 2027",
      "california court holidays",
      "california dmv holidays",
      "cesar chavez day",
      "farmworkers day california",
      "calhr state holidays",
    ],
    intro: [
      "California state employees follow the holiday list CalHR publishes. It has 11 holidays: New Year's Day, Martin Luther King Jr. Day, Presidents' Day, March 31, Memorial Day, Independence Day, Labor Day, Veterans Day, Thanksgiving, the day after Thanksgiving and Christmas. Juneteenth and Columbus Day, both federal holidays, are not on it.",
      "CalHR's list applies to excluded employees; represented employees follow their bargaining unit's agreement. When a holiday falls on a Saturday employees receive holiday credit, and a Sunday holiday is observed on the following Monday.",
      "California's courts publish their own schedule, which adds Lincoln's Birthday (February 12), Juneteenth and Native American Day in late September. For 2027 the courts list Farmworkers Day (formerly Cesar Chavez Day) on Friday, April 9, while CalHR's rule is March 31.",
      "The DMV publishes its own closures and says DMV offices are closed on weekends. When this page's data was checked in November 2026, the DMV had published closures only through January 1, 2027.",
    ],
    howItWorks: [
      "The page takes today's date in California (Pacific time).",
      "It checks the date against OPM's federal holidays and California's March 31 holiday.",
      "The state section below checks state offices, courts and DMV offices against each one's own published schedule.",
      "If today is a holiday, the answer names it; otherwise it shows the next holiday and how far away it is.",
    ],
    tips: [
      "Check the courts separately in 2027: they close on Friday, April 9 for Farmworkers Day, not on March 31.",
      "Don't plan a DMV visit for a weekend: the DMV says its offices are closed on weekends.",
      "State employees in a bargaining unit should check their union agreement; CalHR's list covers excluded employees.",
      "Juneteenth and Columbus Day are federal holidays but not on CalHR's list, so federal and state offices can differ on those days.",
    ],
    faq: [
      {
        question: "Is Cesar Chavez Day a state holiday in California?",
        answer:
          "Yes. CalHR's state holiday list includes March 31, which the California courts and DMV now call Farmworkers Day (formerly Cesar Chavez Day). For 2027 the courts list Farmworkers Day on Friday, April 9 instead, so state offices and courts may close on different days that year.",
      },
      {
        question: "Is Juneteenth a California state holiday?",
        answer:
          "It is not on CalHR's holiday list for state employees, which covers excluded employees; represented employees follow their bargaining agreements. California's courts do close for Juneteenth: in 2027 on Friday, June 18, because June 19 falls on a Saturday. Federal offices close that Friday as well.",
      },
      {
        question: "Are California courts closed the day after Thanksgiving?",
        answer:
          "Yes. The California courts' schedule lists the Day after Thanksgiving as a court holiday: Friday, November 27, 2026 and Friday, November 26, 2027. CalHR's list for state employees includes the day after Thanksgiving too, and the DMV lists Friday, November 27, 2026 as a closure.",
      },
      {
        question: "Is the California DMV open on weekends?",
        answer:
          "No. The DMV's holiday page says DMV offices are closed on weekends. It also lists weekday closures for holidays; when this page's data was checked in November 2026, it had published those only through New Year's Day, January 1, 2027, so later closures are marked as not yet published.",
      },
      {
        question: "Does California observe Columbus Day?",
        answer:
          "Columbus Day is a federal holiday, so federal offices close, but it is not on CalHR's holiday list for state employees, and the California courts' 2026 and 2027 schedules do not list it. Native American Day, in late September, is on the courts' schedule instead.",
      },
    ],
    lastUpdated: COPY_UPDATED,
    dataUpdated: US_STATE_VERIFIED,
    relatedSlugs: ["usa", "usa/texas", "usa/new-york", "usa/bank-holiday"],
    sources: [OPM],
    prefill: { country: "usa", state: "california" },
  },
  {
    slug: "usa/texas",
    title: "Is Today a Holiday in Texas? — isitholiday.today",
    h1: "Is Today a Holiday in Texas?",
    description:
      "Is today a holiday in Texas? Federal holidays plus Texas state holidays such as Texas Independence Day, with state agency closures from the State Auditor.",
    directAnswer:
      "Checked against OPM's federal holidays and Texas Independence Day, plus today's status for Texas state agencies from the State Auditor's Office holiday schedule.",
    tagline:
      "See whether today is a holiday in Texas, and whether state agencies are closed or open with a skeleton crew.",
    keywords: [
      "is today a holiday in texas",
      "texas state holidays 2027",
      "texas skeleton crew holidays",
      "texas independence day holiday",
      "texas state agency holidays",
      "emancipation day texas",
    ],
    intro: [
      "Texas state holidays are set out in Texas Government Code Chapter 662, and the State Auditor's Office publishes each fiscal year's schedule. For fiscal 2027, September 2026 to August 2027, it lists days when all agencies are closed, skeleton-crew days and optional holidays.",
      "On a skeleton-crew holiday \"a state agency must have enough state employees on duty during a state holiday to conduct the public business of the agency\". In 2027 those are Confederate Heroes Day (January 19), Texas Independence Day (March 2), San Jacinto Day (April 21) and LBJ Day (August 27).",
      "The fiscal 2027 schedule also closes all agencies on the day after Thanksgiving and on Christmas Eve, December 24, 2026, and lists Good Friday, March 26, 2027 as an optional holiday. The fiscal 2028 schedule is not published yet.",
      "This site found no official statewide holiday schedule for Texas DPS driver license offices or for Texas courts, so it does not answer for them.",
    ],
    howItWorks: [
      "The page takes today's date in Texas (Central time).",
      "It checks the date against OPM's federal holidays and Texas Independence Day.",
      "The state section below checks state agencies against the State Auditor's fiscal-year schedule: closed, skeleton crew or optional.",
      "If today is a holiday, the answer names it; otherwise it shows the next holiday and how far away it is.",
    ],
    tips: [
      "On a skeleton-crew day, call ahead before visiting a state agency: it is open, but staffed for essential public business.",
      "Federal and state calendars differ in 2027: Texas lists no weekday off for Juneteenth or Independence Day, while federal employees get Friday, June 18 and Monday, July 5.",
      "For a driver license office or a court, check with the office directly; this site found no statewide holiday schedule for them.",
      "Check back from September 2027: the fiscal 2028 schedule had not been published when this data was checked.",
    ],
    faq: [
      {
        question: "What is a skeleton crew holiday in Texas?",
        answer:
          "A state holiday on which agencies stay open. Texas Government Code 662.004 says \"a state agency must have enough state employees on duty during a state holiday to conduct the public business of the agency\". In 2027 that covers Confederate Heroes Day, Texas Independence Day, San Jacinto Day and LBJ Day.",
      },
      {
        question: "Is Good Friday a holiday in Texas?",
        answer:
          "It is an optional holiday for Texas state employees: the State Auditor's fiscal 2027 schedule lists Good Friday, March 26, 2027 as an \"Optional Holiday\". It is not a federal holiday, so federal offices are open, but the stock market (NYSE) is closed that day.",
      },
      {
        question: "Are Texas state offices closed on Christmas Eve?",
        answer:
          "Yes, in 2026. The State Auditor's fiscal 2027 schedule lists Christmas Eve Day, Thursday, December 24, 2026, as a day when all agencies are closed, along with Christmas Day on Friday, December 25. Christmas Eve 2026 is not on OPM's federal holiday list.",
      },
      {
        question: "Is Juneteenth a state holiday in Texas?",
        answer:
          "Yes, as Emancipation Day. The State Auditor's Office says June 19 is listed as a state holiday rather than a national holiday under Texas law, and therefore requires a skeleton crew. In 2027 it falls on a Saturday, and the fiscal 2027 schedule lists no weekday off for it.",
      },
      {
        question: "Is the Texas DMV open on holidays?",
        answer:
          "This site found no official statewide holiday schedule for Texas driver license offices, which the Department of Public Safety runs, so it does not answer for them; check your local office before you go. The state agency closures on this page come from the State Auditor's Office schedule.",
      },
    ],
    lastUpdated: COPY_UPDATED,
    dataUpdated: US_STATE_VERIFIED,
    relatedSlugs: ["usa", "usa/california", "usa/new-york", "usa/bank-holiday"],
    sources: [OPM],
    prefill: { country: "usa", state: "texas" },
  },
  {
    slug: "usa/new-york",
    title: "Is Today a Holiday in New York? — isitholiday.today",
    h1: "Is Today a Holiday in New York?",
    description:
      "Is today a holiday in New York? Federal holidays plus New York legal holidays such as Lincoln's Birthday and Election Day, with state office closures.",
    directAnswer:
      "Checked against OPM's federal holidays and New York's Election Day, plus today's status for state offices from the Department of Civil Service holiday calendar.",
    tagline: "See whether today is a holiday in New York State, and whether state offices are closed.",
    keywords: [
      "is today a holiday in new york",
      "new york state holidays 2027",
      "nys legal holidays",
      "lincoln's birthday new york",
      "election day holiday new york",
      "new york state employee holidays",
    ],
    intro: [
      "New York's legal holidays are those in the state's General Construction Law. The Department of Civil Service publishes a yearly calendar of them for state employees in the classified service of the Executive Branch; with the exception of Flag Day, all legal holidays are observed by eligible state employees.",
      "Two work differently. Lincoln's Birthday (February 12) and Election Day are floating holidays for state employees in certain bargaining units. Election Day 2027, November 2, had not yet been designated as a floating holiday when this data was checked.",
      "A holiday that falls on a Saturday is a \"pass day\" with no alternate day: in 2027 that applies to Juneteenth and Christmas Day. A Sunday holiday is observed on the following Monday, as Independence Day is on July 5, 2027.",
      "This site found no official statewide holiday schedule for New York's courts or DMV offices, so it does not answer for them.",
    ],
    howItWorks: [
      "The page takes today's date in New York (Eastern time).",
      "It checks the date against OPM's federal holidays and New York's Election Day.",
      "The state section below checks state offices against the Department of Civil Service calendar, including floating and pass-day holidays.",
      "If today is a holiday, the answer names it; otherwise it shows the next holiday and how far away it is.",
    ],
    tips: [
      "State employees: check your bargaining unit for floating holidays such as Lincoln's Birthday.",
      "In 2027 Juneteenth and Christmas are pass days for New York state employees, while federal employees get Friday, June 18 and Friday, December 24 off.",
      "Columbus Day and Veterans' Day are on New York's legal holiday list, so plan state office visits around them.",
      "For a court or DMV office, check with the office directly; this site found no statewide holiday schedule for them.",
    ],
    faq: [
      {
        question: "Is Lincoln's Birthday a holiday in New York?",
        answer:
          "It is a legal holiday in New York. For 2026 and 2027 the state designated it a floating holiday for state employees in certain bargaining units, so whether a state employee has February 12 off depends on their unit. It is not a federal holiday, so federal offices are open.",
      },
      {
        question: "Is Election Day a state holiday in New York?",
        answer:
          "Election Day is on New York's legal holiday list. The state designated it a floating holiday in 2026 for employees in certain bargaining units. For 2027, Tuesday, November 2, it had not yet been designated as a floating holiday when this page's data was checked in November 2026.",
      },
      {
        question: "What is a pass day holiday?",
        answer:
          "A holiday that falls on a Saturday for which New York names no alternate day off. The Department of Civil Service says it has not designated an alternate day for Juneteenth or Christmas Day in 2027, so both are pass days, while federal employees get the Friday before each one off.",
      },
      {
        question: "Do New York state offices close on Columbus Day?",
        answer:
          "Columbus Day is on the Department of Civil Service calendar of legal holidays observed by eligible state employees: Monday, October 11, 2027. It is also a federal holiday that year, so federal and New York state offices both observe it. The stock market (NYSE) stays open on Columbus Day.",
      },
      {
        question: "Are New York courts closed on state holidays?",
        answer:
          "This site found no official statewide holiday schedule for New York's courts that it could read, so it does not answer for them; check with the court directly before you go. The state office dates on this page come from the Department of Civil Service calendar.",
      },
    ],
    lastUpdated: COPY_UPDATED,
    dataUpdated: US_STATE_VERIFIED,
    relatedSlugs: ["usa", "usa/california", "usa/texas", "usa/bank-holiday"],
    sources: [OPM],
    prefill: { country: "usa", state: "new-york" },
  },
  {
    slug: "usa/bank-holiday",
    title: "Is Today a Bank Holiday in the USA? — isitholiday.today",
    h1: "Is Today a Bank Holiday in the USA?",
    description: "Is today a bank holiday in the US? Checks today against the Federal Reserve holiday schedule in US Eastern time, plus every upcoming bank holiday date.",
    directAnswer: "Checked against the Federal Reserve's holiday schedule, the calendar US bank holidays follow, using today's date in US Eastern time.",
    tagline: "See whether today is a US bank holiday on the Federal Reserve's schedule, and when the next one is.",
    keywords: [
      "is today a bank holiday",
      "bank holiday today usa",
      "federal reserve holidays 2027",
      "us bank holidays 2027",
      "are banks closed today",
      "next bank holiday",
    ],
    intro: [
      "In the US, a bank holiday is a day on the Federal Reserve's holiday schedule. The Federal Reserve lists the same days as the federal holidays: New Year's Day, Martin Luther King Jr. Day, Presidents' Day, Memorial Day, Juneteenth, Independence Day, Labor Day, Columbus Day, Veterans Day, Thanksgiving and Christmas Day.",
      "Weekend holidays work differently from the federal government's rule. The Federal Reserve says: \"For holidays falling on Saturday, Federal Reserve Banks and Branches will be open the preceding Friday.\" For holidays falling on Sunday, all Federal Reserve offices are closed the following Monday.",
      "Individual banks set their own branch hours, including weekends, and this site has no branch-level data. To check whether banks are open on a given day, or tomorrow, see the bank pages linked below.",
    ],
    howItWorks: [
      "The page takes today's date in US Eastern time.",
      "It checks the date against the Federal Reserve's holiday schedule.",
      "If today is a Federal Reserve holiday, the answer is yes with its name; otherwise it shows the next one and how many days away it is.",
      "For whether banks are open tomorrow, use the banks-open-tomorrow page.",
    ],
    tips: [
      "Mind Saturday holidays: Federal Reserve Banks open the Friday before, so Friday, June 18 and Friday, December 24, 2027 are not bank holidays.",
      "Check with your own bank about weekend hours; the Federal Reserve schedule covers holidays only.",
      "Columbus Day and Veterans Day are Federal Reserve holidays even though the stock market is open on both.",
      "Check the banks-open-tomorrow page the evening before a planned branch visit.",
    ],
    faq: [
      {
        question: "How many bank holidays are there in the US?",
        answer:
          "The Federal Reserve's holiday schedule lists eleven: New Year's Day, Martin Luther King Jr. Day, Presidents' Day, Memorial Day, Juneteenth, Independence Day, Labor Day, Columbus Day, Veterans Day, Thanksgiving and Christmas Day. They are the same days as the federal holidays, with a different rule for Saturdays.",
      },
      {
        question: "What happens when a bank holiday falls on a Saturday?",
        answer:
          "The Federal Reserve says: \"For holidays falling on Saturday, Federal Reserve Banks and Branches will be open the preceding Friday.\" In 2027 Juneteenth and Christmas Day fall on Saturdays, so Federal Reserve Banks are open on Friday, June 18 and Friday, December 24, even though federal employees have those Fridays off.",
      },
      {
        question: "What happens when a bank holiday falls on a Sunday?",
        answer:
          "For holidays falling on a Sunday, all Federal Reserve offices are closed the following Monday. In 2027 Independence Day, July 4, is a Sunday, so the Federal Reserve is closed on Monday, July 5, 2027. Federal employees get the same Monday off under OPM's rule.",
      },
      {
        question: "Are banks open on weekends?",
        answer:
          "That depends on the bank. The Federal Reserve's schedule lists holidays, not weekend hours, and individual banks set their own branch hours, including on Saturdays. This site has no branch-level data, so check with your own bank or branch before planning a weekend visit.",
      },
      {
        question: "Is the stock market closed on bank holidays?",
        answer:
          "Not always. NYSE publishes its own holiday list. In 2027 the stock market is open on Columbus Day and Veterans Day, both Federal Reserve holidays, and closed on Good Friday, March 26, which is not a bank holiday. The per-holiday pages show both side by side.",
      },
    ],
    lastUpdated: COPY_UPDATED,
    dataUpdated: US_FEDERAL_VERIFIED,
    relatedSlugs: ["banks-open-today", "banks-open-tomorrow", "usa", "india/bank-holiday"],
    sources: [FED],
    prefill: { country: "usa", type: "bank" },
  },
  // ---------- v3.G: United Kingdom + Canada ----------
  {
    slug: "uk",
    title: "Is Today a Bank Holiday in the UK? England and Wales — isitholiday.today",
    h1: "Is Today a Bank Holiday in the UK?",
    description:
      "Is today a bank holiday in the UK? Today's answer for England and Wales from GOV.UK's official list, plus the next bank holiday and every date through 2028.",
    directAnswer:
      "Checked against GOV.UK's official bank holiday list for England and Wales, using today's date in UK time. Scotland and Northern Ireland have their own lists and pages.",
    tagline: "See whether today is a bank holiday in England and Wales, and when the next one is.",
    keywords: [
      "is today a bank holiday",
      "is today a bank holiday uk",
      "uk bank holidays 2027",
      "next bank holiday",
      "bank holidays england 2027",
      "bank holiday substitute day",
    ],
    intro: [
      "The government publishes UK bank holidays on GOV.UK as three separate lists: England and Wales, Scotland, and Northern Ireland. This page answers for England and Wales; Scotland and Northern Ireland have their own pages because their dates differ.",
      "England and Wales have eight bank holidays in 2027: New Year's Day (1 January), Good Friday (26 March), Easter Monday (29 March), the early May bank holiday (3 May), the spring bank holiday (31 May), the summer bank holiday (30 August), and substitute days for Christmas Day and Boxing Day on 27 and 28 December.",
      "When a bank holiday falls on a weekend, GOV.UK lists a weekday substitute day instead. In 2026 Boxing Day falls on a Saturday, so the bank holiday is Monday, 28 December 2026; in 2027 both Christmas Day and Boxing Day fall on a weekend.",
    ],
    howItWorks: [
      "The page takes today's date in UK time (GMT or BST).",
      "It checks the date against GOV.UK's bank holiday list for England and Wales.",
      "Substitute days count as the bank holiday, because GOV.UK lists them as the bank holiday dates.",
      "If today is a bank holiday the answer names it; otherwise it shows the next one and how many days away it is.",
    ],
    tips: [
      "Christmas 2027 needs care: 25 and 26 December fall on a weekend, so the bank holidays are Monday 27 and Tuesday 28 December.",
      "Easter Monday is a bank holiday in England, Wales and Northern Ireland, but not in Scotland.",
      "Scotland's summer bank holiday is Monday, 2 August 2027, four weeks before the one in England and Wales on 30 August.",
      "This page lists bank holidays only; it has no data on individual shops or businesses, so check their opening hours.",
    ],
    faq: [
      {
        question: "How many bank holidays are there in England and Wales in 2027?",
        answer:
          "Eight, per GOV.UK: New Year's Day, Good Friday, Easter Monday, the early May bank holiday, the spring bank holiday, the summer bank holiday, and substitute days for Christmas Day and Boxing Day on Monday 27 and Tuesday 28 December 2027, because 25 and 26 December fall on a weekend.",
      },
      {
        question: "What is a substitute bank holiday?",
        answer:
          "When a bank holiday falls on a Saturday or Sunday, GOV.UK lists a weekday as the bank holiday instead and marks it as a substitute day. In 2026 Boxing Day falls on a Saturday, so the bank holiday in England and Wales is Monday, 28 December 2026.",
      },
      {
        question: "Is Easter Monday a bank holiday in the UK?",
        answer:
          "In England, Wales and Northern Ireland, yes: GOV.UK lists Easter Monday, 29 March 2027, as a bank holiday in both of those lists. Scotland's list has no Easter Monday. All three UK lists include Good Friday, which falls on 26 March 2027.",
      },
      {
        question: "When are the Christmas bank holidays in 2026?",
        answer:
          "In England and Wales, Christmas Day is Friday, 25 December 2026. Boxing Day falls on Saturday, 26 December, so GOV.UK lists Monday, 28 December 2026, as the substitute bank holiday. Scotland and Northern Ireland have the same two Christmas bank holiday dates in 2026.",
      },
      {
        question: "Do Scotland and Northern Ireland have different bank holidays?",
        answer:
          "Yes. GOV.UK publishes a separate list for each. Scotland adds 2 January and St Andrew's Day and has its summer bank holiday in early August; Northern Ireland adds St Patrick's Day and the Battle of the Boyne (Orangemen's Day). Each has its own page on this site.",
      },
    ],
    lastUpdated: "November 2026",
    dataUpdated: "2026-11-26",
    relatedSlugs: ["uk/scotland", "uk/northern-ireland", "canada", "usa"],
    sources: [GOV_UK],
    prefill: { country: "uk", state: "england-and-wales" },
  },
  {
    slug: "uk/scotland",
    title: "Is Today a Bank Holiday in Scotland? — isitholiday.today",
    h1: "Is Today a Bank Holiday in Scotland?",
    description:
      "Is today a bank holiday in Scotland? Today's answer from GOV.UK's official Scottish list, including St Andrew's Day and 2 January, plus every upcoming date.",
    directAnswer: "Checked against GOV.UK's official bank holiday list for Scotland, using today's date in UK time.",
    tagline: "See whether today is a bank holiday in Scotland, including St Andrew's Day and 2 January.",
    keywords: [
      "is today a bank holiday in scotland",
      "scotland bank holidays 2027",
      "st andrews day bank holiday",
      "2nd january bank holiday scotland",
      "scottish bank holidays",
      "next bank holiday scotland",
    ],
    intro: [
      "GOV.UK publishes Scotland's bank holidays as a separate list from England and Wales. Scotland's list includes 2 January and St Andrew's Day (30 November), has no Easter Monday, and has its summer bank holiday on 2 August in 2027 rather than at the end of August.",
      "In 2027 Scotland has nine bank holidays on GOV.UK's list: New Year's Day, a substitute day for 2 January on Monday 4 January, Good Friday (26 March), the early May (3 May) and spring (31 May) bank holidays, the summer bank holiday (2 August), St Andrew's Day (30 November), and substitute days for Christmas Day and Boxing Day on 27 and 28 December.",
      "Substitute days are listed when a bank holiday falls on a weekend. 2 January 2027 is a Saturday, so the bank holiday moves to Monday, 4 January.",
    ],
    howItWorks: [
      "The page takes today's date in UK time (GMT or BST).",
      "It checks the date against GOV.UK's bank holiday list for Scotland only.",
      "Substitute days count as the bank holiday, as GOV.UK lists them.",
      "If today is a bank holiday the answer names it; otherwise it shows the next one and how many days away it is.",
    ],
    tips: [
      "St Andrew's Day 2026 is Monday, 30 November, and St Andrew's Day 2027 is Tuesday, 30 November.",
      "There is no Easter Monday bank holiday in Scotland; Good Friday, 26 March 2027, is on the list.",
      "New Year 2027 gives two bank holidays: Friday 1 January and the substitute for 2 January on Monday 4 January.",
      "This page lists bank holidays only; check individual shops, offices and services for their own opening hours.",
    ],
    faq: [
      {
        question: "Is St Andrew's Day a bank holiday in Scotland?",
        answer:
          "Yes. GOV.UK lists St Andrew's Day as a Scottish bank holiday on Monday, 30 November 2026, and Tuesday, 30 November 2027. It is not on the England and Wales or Northern Ireland lists, so it is a bank holiday in Scotland only.",
      },
      {
        question: "Is 2 January a bank holiday in Scotland?",
        answer:
          "Yes. Scotland's list includes 2 January, which the England and Wales and Northern Ireland lists do not. In 2027, 2 January falls on a Saturday, so GOV.UK lists Monday, 4 January 2027, as the substitute bank holiday for it in Scotland.",
      },
      {
        question: "Is Easter Monday a bank holiday in Scotland?",
        answer:
          "No. GOV.UK's Scottish list has Good Friday, 26 March 2027, but no Easter Monday. England, Wales and Northern Ireland do have Easter Monday as a bank holiday, on 29 March 2027, so the two parts of the UK differ that week.",
      },
      {
        question: "When is the summer bank holiday in Scotland?",
        answer:
          "Monday, 2 August 2027, per GOV.UK's Scottish list. That is four weeks earlier than the summer bank holiday in England, Wales and Northern Ireland, which GOV.UK lists on Monday, 30 August 2027, so check which of the two lists applies to you.",
      },
      {
        question: "How many bank holidays does Scotland have in 2027?",
        answer:
          "Nine on GOV.UK's list: New Year's Day, the 2 January substitute day, Good Friday, the early May and spring bank holidays, the summer bank holiday, St Andrew's Day, and substitute days for Christmas Day and Boxing Day on 27 and 28 December 2027.",
      },
    ],
    lastUpdated: "November 2026",
    dataUpdated: "2026-11-26",
    relatedSlugs: ["uk", "uk/northern-ireland", "canada"],
    sources: [GOV_UK],
    prefill: { country: "uk", state: "scotland" },
  },
  {
    slug: "uk/northern-ireland",
    title: "Is Today a Bank Holiday in Northern Ireland? — isitholiday.today",
    h1: "Is Today a Bank Holiday in Northern Ireland?",
    description:
      "Is today a bank holiday in Northern Ireland? Today's answer from GOV.UK's official list, including St Patrick's Day and the Battle of the Boyne, plus dates.",
    directAnswer: "Checked against GOV.UK's official bank holiday list for Northern Ireland, using today's date in UK time.",
    tagline: "See whether today is a bank holiday in Northern Ireland, including St Patrick's Day and the Twelfth.",
    keywords: [
      "is today a bank holiday in northern ireland",
      "northern ireland bank holidays 2027",
      "st patricks day bank holiday",
      "battle of the boyne bank holiday",
      "12th july bank holiday",
      "ni bank holidays",
    ],
    intro: [
      "GOV.UK publishes Northern Ireland's bank holidays as its own list. It has every bank holiday in England and Wales plus two of its own: St Patrick's Day (17 March) and the Battle of the Boyne, also called Orangemen's Day (12 July).",
      "In 2027 Northern Ireland has ten bank holidays: New Year's Day, St Patrick's Day (17 March), Good Friday (26 March), Easter Monday (29 March), the early May (3 May) and spring (31 May) bank holidays, the Battle of the Boyne (12 July), the summer bank holiday (30 August), and substitute days for Christmas Day and Boxing Day on 27 and 28 December.",
      "When a bank holiday falls on a weekend, GOV.UK lists a weekday substitute day. Both Christmas bank holidays in 2027 are substitute days because 25 and 26 December fall on a Saturday and Sunday.",
    ],
    howItWorks: [
      "The page takes today's date in UK time (GMT or BST).",
      "It checks the date against GOV.UK's bank holiday list for Northern Ireland.",
      "Substitute days count as the bank holiday, as GOV.UK lists them.",
      "If today is a bank holiday the answer names it; otherwise it shows the next one and how many days away it is.",
    ],
    tips: [
      "St Patrick's Day 2027 is a Wednesday, 17 March: a midweek bank holiday in Northern Ireland only.",
      "The Battle of the Boyne bank holiday is Monday, 12 July 2027.",
      "Christmas 2027: the bank holidays are Monday 27 and Tuesday 28 December, not the 25th and 26th.",
      "This page lists bank holidays only; check individual shops, offices and services for their own opening hours.",
    ],
    faq: [
      {
        question: "Is St Patrick's Day a bank holiday in Northern Ireland?",
        answer:
          "Yes. GOV.UK lists St Patrick's Day, Wednesday, 17 March 2027, as a bank holiday in Northern Ireland. It is not on the England and Wales or Scotland lists, so it is a bank holiday in Northern Ireland only within the UK.",
      },
      {
        question: "Is 12 July a bank holiday in Northern Ireland?",
        answer:
          "Yes. GOV.UK lists the Battle of the Boyne, also called Orangemen's Day, as a Northern Ireland bank holiday on Monday, 12 July 2027. No other part of the UK has it on its bank holiday list, so it applies in Northern Ireland only.",
      },
      {
        question: "How many bank holidays does Northern Ireland have in 2027?",
        answer:
          "Ten on GOV.UK's list: New Year's Day, St Patrick's Day, Good Friday, Easter Monday, the early May and spring bank holidays, the Battle of the Boyne, the summer bank holiday, and substitute days for Christmas Day and Boxing Day on 27 and 28 December.",
      },
      {
        question: "Is Easter Monday a bank holiday in Northern Ireland?",
        answer:
          "Yes. GOV.UK lists Easter Monday, 29 March 2027, as a bank holiday in Northern Ireland, as it does in England and Wales. Scotland's list has no Easter Monday. Good Friday, 26 March 2027, is a bank holiday in all three parts of the UK.",
      },
      {
        question: "When are the Christmas bank holidays in Northern Ireland in 2027?",
        answer:
          "Monday, 27 December and Tuesday, 28 December 2027. Christmas Day and Boxing Day fall on a Saturday and Sunday that year, so GOV.UK lists both bank holidays as substitute days on the following Monday and Tuesday. The same two substitute days apply in England, Wales and Scotland.",
      },
    ],
    lastUpdated: "November 2026",
    dataUpdated: "2026-11-26",
    relatedSlugs: ["uk", "uk/scotland", "canada"],
    sources: [GOV_UK],
    prefill: { country: "uk", state: "northern-ireland" },
  },
  {
    slug: "canada",
    title: "Is Today a Holiday in Canada? Federal Statutory Holidays — isitholiday.today",
    h1: "Is Today a Holiday in Canada?",
    description:
      "Is today a statutory holiday in Canada? Checked against the 10 federal general holidays in the Canada Labour Code, with upcoming dates and the Ontario list.",
    directAnswer:
      "Checked against the 10 general holidays in the Canada Labour Code, which apply to federally regulated workplaces, using today's date in Eastern time. Provinces set their own lists; Ontario has its own page.",
    tagline: "See whether today is a federal general holiday in Canada, and when the next one is.",
    keywords: [
      "is today a holiday in canada",
      "canada statutory holidays 2027",
      "federal statutory holidays canada",
      "is today a stat holiday",
      "national day for truth and reconciliation holiday",
      "canada general holidays",
    ],
    intro: [
      "Canada has no single list of holidays for every worker. The Canada Labour Code gives employees of federally regulated employers 10 general holidays, while each province sets its own list for most other workplaces. This page answers for the federal list; Ontario has its own page.",
      "The 10 federal general holidays are New Year's Day, Good Friday, Victoria Day, Canada Day, Labour Day, the National Day for Truth and Reconciliation (September 30), Thanksgiving Day, Remembrance Day, Christmas Day and Boxing Day.",
      "Federal law fixes most dates. The Holidays Act makes Canada Day July 1 (July 2 when July 1 is a Sunday), Remembrance Day November 11, and Victoria Day the Monday immediately preceding May 25; the Interpretation Act makes Labour Day the first Monday in September. Thanksgiving is set by proclamation each year, so this site adds the 2027 date once it is published.",
      "When New Year's Day, Canada Day, the National Day for Truth and Reconciliation, Remembrance Day, Christmas Day or Boxing Day falls on a Saturday or Sunday that is not a scheduled work day, the employee gets a paid holiday on the scheduled work day immediately before or after it.",
    ],
    howItWorks: [
      "The page takes today's date in Eastern time (Ottawa).",
      "It checks the date against the federal general holidays: 2026 dates from the CRA's public holiday list, 2027 dates from the rules in federal law.",
      "A holiday on a weekend is shown on its calendar date; the Code moves the paid day to the work day before or after, which depends on the employee's schedule.",
      "If today is a holiday the answer names it; otherwise it shows the next one and how many days away it is.",
    ],
    tips: [
      "Check whether your employer is federally regulated; provincial holiday lists apply to most other workplaces.",
      "Boxing Day 2026 falls on a Saturday and Christmas Day 2027 on a Saturday; under the Code the paid day moves to the scheduled work day immediately before or after.",
      "Victoria Day 2027 is Monday, May 24: the Monday immediately preceding May 25.",
      "Thanksgiving 2027 is not listed yet; its date is set by proclamation.",
    ],
    faq: [
      {
        question: "What are the statutory holidays in Canada?",
        answer:
          "For federally regulated workplaces, the Canada Labour Code lists 10 general holidays: New Year's Day, Good Friday, Victoria Day, Canada Day, Labour Day, the National Day for Truth and Reconciliation, Thanksgiving Day, Remembrance Day, Christmas Day and Boxing Day. Provinces set their own lists for most other workers.",
      },
      {
        question: "Is the National Day for Truth and Reconciliation a holiday?",
        answer:
          "It is one of the 10 general holidays in the Canada Labour Code, observed on September 30, so Thursday, September 30, 2027, for federally regulated workplaces. It is not one of the nine public holidays in Ontario's Employment Standards Act, so most Ontario employers do not have to give it.",
      },
      {
        question: "Is Remembrance Day a statutory holiday in Canada?",
        answer:
          "For federally regulated workplaces, yes: it is a general holiday under the Canada Labour Code, on November 11 (Thursday, November 11, 2027). In Ontario it is not a public holiday; Ontario's guide says some employers give it but are not required to under the Employment Standards Act.",
      },
      {
        question: "When is Victoria Day 2027?",
        answer:
          "Monday, May 24, 2027. The Holidays Act makes Victoria Day the first Monday immediately preceding May 25, and in 2027 that Monday is May 24. It is a general holiday under the Canada Labour Code and a public holiday in Ontario.",
      },
      {
        question: "What happens when a federal holiday falls on a weekend?",
        answer:
          "For New Year's Day, Canada Day, the National Day for Truth and Reconciliation, Remembrance Day, Christmas Day and Boxing Day, a weekend day that is not a scheduled work day gives the employee a paid holiday on the scheduled work day immediately before or after the holiday, under the Canada Labour Code.",
      },
    ],
    lastUpdated: "November 2026",
    dataUpdated: "2026-11-26",
    relatedSlugs: ["canada/ontario", "uk", "usa"],
    sources: [CA_CLC, CA_HOLIDAYS_ACT, CRA_HOLIDAYS],
    prefill: { country: "canada", state: "federal" },
  },
  {
    slug: "canada/ontario",
    title: "Is Today a Holiday in Ontario? Public Holidays — isitholiday.today",
    h1: "Is Today a Holiday in Ontario?",
    description:
      "Is today a public holiday in Ontario? Checked against the nine public holidays in Ontario's Employment Standards Act, including Family Day, with upcoming dates.",
    directAnswer: "Checked against the nine public holidays in Ontario's Employment Standards Act, using today's date in Eastern time.",
    tagline: "See whether today is a public holiday in Ontario, including Family Day, and when the next one is.",
    keywords: [
      "is today a holiday in ontario",
      "ontario statutory holidays 2027",
      "ontario public holidays",
      "family day ontario 2027",
      "is today a stat holiday in ontario",
      "ontario holidays 2027",
    ],
    intro: [
      "Ontario has nine public holidays under the Employment Standards Act: New Year's Day, Family Day, Good Friday, Victoria Day, Canada Day, Labour Day, Thanksgiving Day, Christmas Day and Boxing Day (December 26). Most employees who qualify get these days off with public holiday pay.",
      "The Act makes Family Day the third Monday in February, which is Monday, February 15, 2027. Victoria Day, Canada Day and Labour Day follow federal law; Thanksgiving is set by proclamation each year, so this site adds the 2027 date once it is published.",
      "Ontario's guide says some employers give a holiday on Easter Sunday, Easter Monday, the first Monday in August or Remembrance Day, but are not required to under the Act, so this page does not count those days.",
    ],
    howItWorks: [
      "The page takes today's date in Eastern time (Toronto).",
      "It checks the date against Ontario's nine public holidays: 2026 dates from the CRA's public holiday list, 2027 dates from the Act and federal law.",
      "A holiday on a weekend is shown on its calendar date; an employee who isn't scheduled that day gets a substitute day, which depends on the employer.",
      "If today is a public holiday the answer names it; otherwise it shows the next one and how many days away it is.",
    ],
    tips: [
      "Family Day 2027 is Monday, February 15.",
      "The first Monday in August is not an Ontario public holiday under the Act, even though many employers give it.",
      "Boxing Day 2026 falls on a Saturday, and both Christmas Day and Boxing Day 2027 fall on a weekend: employees not scheduled that day are owed a substitute day off or public holiday pay.",
      "Federally regulated workplaces in Ontario follow the federal list instead, which adds the National Day for Truth and Reconciliation and Remembrance Day.",
    ],
    faq: [
      {
        question: "How many public holidays does Ontario have?",
        answer:
          "Nine, under the Employment Standards Act: New Year's Day, Family Day, Good Friday, Victoria Day, Canada Day, Labour Day, Thanksgiving Day, Christmas Day and Boxing Day (December 26). Most employees who qualify are entitled to take these days off work and be paid public holiday pay.",
      },
      {
        question: "When is Family Day in Ontario in 2027?",
        answer:
          "Monday, February 15, 2027. Ontario's Employment Standards Act defines Family Day as the third Monday in February, and in 2027 that is February 15. It is one of Ontario's nine public holidays but is not on the federal list of general holidays.",
      },
      {
        question: "Is the first Monday in August a holiday in Ontario?",
        answer:
          "Not under the Employment Standards Act. Ontario's guide says some employers give their employees a holiday on the first Monday in August, as well as Easter Sunday, Easter Monday or Remembrance Day, but the employer is not required to do so under the Act.",
      },
      {
        question: "Is Remembrance Day a holiday in Ontario?",
        answer:
          "Not a public holiday under Ontario's Employment Standards Act; the guide says employers who give it are not required to. Federally regulated workplaces in Ontario are different: the Canada Labour Code makes Remembrance Day, November 11, a general holiday for their employees.",
      },
      {
        question: "What if a public holiday falls on my day off in Ontario?",
        answer:
          "When a public holiday falls on a day that is not ordinarily a working day for you, or during your vacation, Ontario's guide says you are entitled to a substitute holiday off with public holiday pay, or to public holiday pay if you agree to that in writing or electronically.",
      },
    ],
    lastUpdated: "November 2026",
    dataUpdated: "2026-11-26",
    relatedSlugs: ["canada", "uk", "usa"],
    sources: [ON_ESA, CA_HOLIDAYS_ACT, CRA_HOLIDAYS],
    prefill: { country: "canada", state: "ontario" },
  },
];

/** v2.J: the /holiday-checker/ page lifted past the golden-page bar. */
export const CHECKER_PAGE: GoldenContent & { description: string } = {
  description:
    "Holiday checker: pick India, the USA, Kerala, Tamil Nadu, California, Texas or New York and see whether today is a public or bank holiday, from official lists.",
  tagline:
    "Pick a country, a state and a holiday type to see whether today is a holiday there, and when the next one falls.",
  keywords: [
    "holiday checker",
    "is today a holiday",
    "public holiday checker",
    "bank holiday checker",
    "check holiday by state",
    "india and us holidays",
  ],
  intro: [
    "The checker covers two countries and five states: India, with Kerala and Tamil Nadu, and the United States, with California, Texas and New York. Each answer comes from an official list: DoPT's gazetted holidays and the Reserve Bank of India for India, and OPM and the Federal Reserve for the US.",
    "The answer uses today's date in the place you pick, not your own time zone: Indian Standard Time for India, and Pacific, Central or Eastern time for the US states.",
    "Each location also has its own page with more detail, including state office, court and DMV closures for the three US states.",
  ],
  howItWorks: [
    "Choose a country.",
    "Choose a state, or leave it on the whole country.",
    "Choose a holiday type, or leave it on any type.",
    "The checker takes today's date in that place and looks it up on the matching official lists.",
    "It answers yes or no, names the holiday, and shows the next one.",
  ],
  tips: [
    "Set the holiday type to Bank to see bank closures only.",
    "Pick a state to include its own holidays, such as Onam in Kerala or Texas Independence Day.",
    "If you're checking from abroad, remember the answer follows the date in the place you picked.",
    "Open the location's own page for its full upcoming-holiday table and sources.",
  ],
  faq: [
    {
      question: "Which places does the holiday checker cover?",
      answer:
        "India, including the states of Kerala and Tamil Nadu, and the United States, including California, Texas and New York. For India it uses DoPT's gazetted holidays and the Reserve Bank of India's nationwide bank closures; for the US it uses OPM's federal holidays and the Federal Reserve's schedule, plus state holidays.",
    },
    {
      question: "Does the checker cover school holidays?",
      answer:
        "Not yet. School closures are set by individual districts or schools, and this site has not found an official list it can use, so the School type has no dates behind it. Check with your school or district. Public and bank holidays come from the official lists named on each page.",
    },
    {
      question: "Whose date does the checker use?",
      answer:
        "The date in the place you pick: Indian Standard Time for India, Kerala and Tamil Nadu; Pacific time for California; Central time for Texas; Eastern time for New York and the US as a whole. So the answer can differ from your own calendar date when you check from another time zone.",
    },
    {
      question: "How current is the holiday data?",
      answer:
        "Each location page shows when its data was last verified against the official source. The site is rebuilt several times a day so that the answer follows the calendar, and new dates are added to the holiday lists after governments, the Reserve Bank of India or the Federal Reserve publish them.",
    },
    {
      question: "Why might a holiday not show for my employer?",
      answer:
        "The checker uses government and central bank lists. Private employers, state agencies and banks can set different days off, and some holidays apply only to certain employees. When in doubt, check your employer's own holiday calendar, or the state office and court details on each US state page.",
    },
  ],
  lastUpdated: COPY_UPDATED,
  // Same data as the location pages; the most recent of their verification dates.
  dataUpdated: US_STATE_VERIFIED,
  relatedSlugs: ["", "india", "usa", "usa/bank-holiday"],
};

export const findPageBySlug = (slug: string): SeoPage | undefined =>
  PAGES.find((p) => p.slug === slug);
