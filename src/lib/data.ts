import type { HolidayType } from "./holidays";

export interface SeoPage {
  slug: string;
  title: string;
  h1: string;
  description: string;
  directAnswer: string;
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
    description: "Find out instantly whether today is a public, bank, or school holiday in India. Updated daily.",
    directAnswer: "Check today's holiday status across all of India — covers national public, bank, and school holidays.",
    prefill: { country: "india" },
  },
  {
    slug: "india/kerala",
    title: "Is Today a Holiday in Kerala, India? — isitholiday.today",
    h1: "Is Today a Holiday in Kerala?",
    description: "Today's holiday status for Kerala, India — includes Onam and other Kerala-specific observances.",
    directAnswer: "Kerala observes both national Indian holidays and state-specific ones like Onam.",
    prefill: { country: "india", state: "kerala" },
  },
  {
    slug: "india/tamil-nadu",
    title: "Is Today a Holiday in Tamil Nadu, India? — isitholiday.today",
    h1: "Is Today a Holiday in Tamil Nadu?",
    description: "Today's holiday status for Tamil Nadu — including Pongal and other state observances.",
    directAnswer: "Tamil Nadu observes Pongal and other regional holidays in addition to Indian national holidays.",
    prefill: { country: "india", state: "tamil-nadu" },
  },
  {
    slug: "india/bank-holiday",
    title: "Is Today a Bank Holiday in India? — isitholiday.today",
    h1: "Is Today a Bank Holiday in India?",
    description: "Find out if Indian banks are closed today. Bank annual and half-yearly closures included.",
    directAnswer: "Indian banks observe RBI-mandated bank holidays in addition to public holidays.",
    prefill: { country: "india", type: "bank" },
  },
  {
    slug: "usa",
    title: "Is Today a Holiday in the USA? — isitholiday.today",
    h1: "Is Today a Holiday in the USA?",
    description: "Find out instantly if today is a US federal, bank, or school holiday. Updated daily.",
    directAnswer: "Check today's holiday status across the United States — federal, bank, and observed holidays.",
    prefill: { country: "usa" },
  },
  {
    slug: "usa/california",
    title: "Is Today a Holiday in California? — isitholiday.today",
    h1: "Is Today a Holiday in California?",
    description: "Today's holiday status for California, USA — includes Cesar Chavez Day and federal holidays.",
    directAnswer: "California observes federal holidays plus state-specific ones like Cesar Chavez Day.",
    prefill: { country: "usa", state: "california" },
  },
  {
    slug: "usa/texas",
    title: "Is Today a Holiday in Texas? — isitholiday.today",
    h1: "Is Today a Holiday in Texas?",
    description: "Today's holiday status for Texas, USA — includes Texas Independence Day and federal holidays.",
    directAnswer: "Texas observes federal holidays plus state-specific ones like Texas Independence Day.",
    prefill: { country: "usa", state: "texas" },
  },
  {
    slug: "usa/new-york",
    title: "Is Today a Holiday in New York? — isitholiday.today",
    h1: "Is Today a Holiday in New York?",
    description: "Today's holiday status for New York State — federal holidays plus state observances.",
    directAnswer: "New York observes federal holidays plus state-specific ones such as Election Day.",
    prefill: { country: "usa", state: "new-york" },
  },
  {
    slug: "usa/bank-holiday",
    title: "Is Today a Bank Holiday in the USA? — isitholiday.today",
    h1: "Is Today a Bank Holiday in the USA?",
    description: "Find out if US banks are closed today. Federal Reserve and Federal Bank holiday schedule.",
    directAnswer: "US banks follow the Federal Reserve's holiday schedule, which mirrors federal holidays.",
    prefill: { country: "usa", type: "bank" },
  },
];

export const findPageBySlug = (slug: string): SeoPage | undefined =>
  PAGES.find((p) => p.slug === slug);
