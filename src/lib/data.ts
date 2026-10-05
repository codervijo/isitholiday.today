import type { HolidayType } from "./holidays";

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
const FED: Source = {
  label: "Federal Reserve holiday schedule",
  url: "https://www.federalreserve.gov/aboutthefed/k8.htm",
};

export interface SeoPage {
  slug: string;
  title: string;
  h1: string;
  description: string;
  directAnswer: string;
  /** Below-calculator prose (v2.H golden-page field; optional until backfilled). */
  intro?: string[];
  /** Official sources the page's holiday data comes from. */
  sources?: Source[];
  prefill: {
    country: string;
    state?: string | null;
    type?: HolidayType | null;
  };
}

export const PAGES: SeoPage[] = [
  {
    slug: "india",
    title: "Is Today a Holiday in India? — isitholiday.today",
    h1: "Is Today a Holiday in India?",
    description: "Is today a holiday in India? Today's answer from the Central Government gazetted list, the next holiday, and every upcoming date, in Indian Standard Time.",
    directAnswer: "Checked against the Central Government's gazetted holiday list and nationwide bank closures, using today's date in Indian Standard Time.",
    intro: [
      "India's Central Government holidays are fixed each year by the Department of Personnel and Training (DoPT). Its 2026 list has 17 gazetted holidays for Central Government offices, and DoPT added Ambedkar Jayanti (14 April) by a separate order on 9 April 2026. The 2027 list was issued on 16 July 2026, and both years appear in the table below.",
      "Four of those holidays — Id-ul-Fitr, Id-ul-Zuha (Bakrid), Muharram and Milad-un-Nabi — follow the lunar calendar, so the actual day can shift by a day once the moon is sighted.",
      "States publish their own lists on top of the national one. Kerala's adds the four days of Onam and Tamil Nadu's adds Pongal; the state pages below answer for those. Banks follow the Reserve Bank of India's calendar, which differs by state — the bank-holiday page covers the nationwide closures.",
    ],
    sources: [DOPT, RBI],
    prefill: { country: "india" },
  },
  {
    slug: "india/kerala",
    title: "Is Today a Holiday in Kerala, India? — isitholiday.today",
    h1: "Is Today a Holiday in Kerala?",
    description: "Today's holiday status for Kerala, India — includes Onam and other Kerala-specific observances.",
    directAnswer: "Kerala observes both national Indian holidays and state-specific ones like Onam.",
    sources: [DOPT, KERALA_GAD],
    prefill: { country: "india", state: "kerala" },
  },
  {
    slug: "india/tamil-nadu",
    title: "Is Today a Holiday in Tamil Nadu, India? — isitholiday.today",
    h1: "Is Today a Holiday in Tamil Nadu?",
    description: "Today's holiday status for Tamil Nadu — including Pongal and other state observances.",
    directAnswer: "Tamil Nadu observes Pongal and other regional holidays in addition to Indian national holidays.",
    sources: [DOPT],
    prefill: { country: "india", state: "tamil-nadu" },
  },
  {
    slug: "india/bank-holiday",
    title: "Is Today a Bank Holiday in India? — isitholiday.today",
    h1: "Is Today a Bank Holiday in India?",
    description: "Find out if Indian banks are closed today. Bank annual and half-yearly closures included.",
    directAnswer: "Indian banks observe RBI-mandated bank holidays in addition to public holidays.",
    sources: [RBI],
    prefill: { country: "india", type: "bank" },
  },
  {
    slug: "usa",
    title: "Is Today a Holiday in the USA? — isitholiday.today",
    h1: "Is Today a Holiday in the USA?",
    description: "Find out instantly if today is a US federal, bank, or school holiday. Updated daily.",
    directAnswer: "Check today's holiday status across the United States — federal, bank, and observed holidays.",
    sources: [OPM, FED],
    prefill: { country: "usa" },
  },
  {
    slug: "usa/california",
    title: "Is Today a Holiday in California? — isitholiday.today",
    h1: "Is Today a Holiday in California?",
    description: "Today's holiday status for California, USA — includes Cesar Chavez Day and federal holidays.",
    directAnswer: "California observes federal holidays plus state-specific ones like Cesar Chavez Day.",
    sources: [OPM],
    prefill: { country: "usa", state: "california" },
  },
  {
    slug: "usa/texas",
    title: "Is Today a Holiday in Texas? — isitholiday.today",
    h1: "Is Today a Holiday in Texas?",
    description: "Today's holiday status for Texas, USA — includes Texas Independence Day and federal holidays.",
    directAnswer: "Texas observes federal holidays plus state-specific ones like Texas Independence Day.",
    sources: [OPM],
    prefill: { country: "usa", state: "texas" },
  },
  {
    slug: "usa/new-york",
    title: "Is Today a Holiday in New York? — isitholiday.today",
    h1: "Is Today a Holiday in New York?",
    description: "Today's holiday status for New York State — federal holidays plus state observances.",
    directAnswer: "New York observes federal holidays plus state-specific ones such as Election Day.",
    sources: [OPM],
    prefill: { country: "usa", state: "new-york" },
  },
  {
    slug: "usa/bank-holiday",
    title: "Is Today a Bank Holiday in the USA? — isitholiday.today",
    h1: "Is Today a Bank Holiday in the USA?",
    description: "Find out if US banks are closed today. Federal Reserve and Federal Bank holiday schedule.",
    directAnswer: "US banks follow the Federal Reserve's holiday schedule, which mirrors federal holidays.",
    sources: [FED],
    prefill: { country: "usa", type: "bank" },
  },
];

export const findPageBySlug = (slug: string): SeoPage | undefined =>
  PAGES.find((p) => p.slug === slug);
