import { Link } from "react-router-dom";
import AnswerBlock from "@/components/AnswerBlock";
import Calculator from "@/components/Calculator";
import { HOME_ANSWER } from "@/lib/answerPages";
import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";
import { webAppSchema } from "@/lib/schema";

const HOLIDAY_TYPES = [
  {
    name: "Public holiday",
    body: "Set by law. Government offices and most workplaces close. In the US these are the 11 federal holidays; states can add their own.",
  },
  {
    name: "Bank holiday",
    body: "Days banks and financial markets close. Usually overlaps with public holidays, but settlement and trading calendars can differ.",
  },
  {
    name: "School holiday",
    body: "Follows district and regional academic calendars: public holidays plus term breaks and teacher in-service days that aren't public holidays.",
  },
];

const FED_2026 = [
  { name: "New Year's Day", date: "Thu, Jan 1, 2026", observed: null },
  { name: "Martin Luther King Jr. Day", date: "Mon, Jan 19, 2026", observed: null },
  { name: "Washington's Birthday (Presidents' Day)", date: "Mon, Feb 16, 2026", observed: null },
  { name: "Memorial Day", date: "Mon, May 25, 2026", observed: null },
  { name: "Juneteenth National Independence Day", date: "Fri, Jun 19, 2026", observed: null },
  { name: "Independence Day", date: "Sat, Jul 4, 2026", observed: "Fri, Jul 3" },
  { name: "Labor Day", date: "Mon, Sep 7, 2026", observed: null },
  { name: "Columbus Day", date: "Mon, Oct 12, 2026", observed: null },
  { name: "Veterans Day", date: "Wed, Nov 11, 2026", observed: null },
  { name: "Thanksgiving Day", date: "Thu, Nov 26, 2026", observed: null },
  { name: "Christmas Day", date: "Fri, Dec 25, 2026", observed: null },
];

const FAQS = [
  {
    q: "How do I know if today is a holiday?",
    a: "Pick your country and region in the checker on this page. It compares today's date against the official public, bank, and school holiday calendars for that area and returns an instant yes or no, plus the next upcoming holiday.",
  },
  {
    q: "What's the difference between a public holiday and a bank holiday?",
    a: "A public holiday is a day set by law on which government offices and most workplaces close. A bank holiday specifically refers to a day banks and financial institutions close. The two often overlap, but some bank holidays aren't full public holidays, and vice versa.",
  },
  {
    q: "Are schools closed on every public holiday?",
    a: "Not always. School calendars include public holidays but also term breaks and teacher in-service days that aren't public holidays. Choose the school holiday type in the checker to see the school-specific answer for your region.",
  },
  {
    q: "What happens when a holiday falls on a weekend?",
    a: "Many countries shift the observed day to the nearest weekday. In the US, a federal holiday on a Saturday is usually observed the preceding Friday, and one on a Sunday the following Monday. Independence Day 2026 falls on Saturday, July 4, so it's observed Friday, July 3.",
  },
  {
    q: "Which countries are covered?",
    a: "The United States (federal holidays, California, Texas, New York, and Federal Reserve bank holidays), India (Central Government holidays, Kerala, Tamil Nadu, and bank holidays), the United Kingdom (bank holidays for England and Wales, Scotland and Northern Ireland) and Canada (federal general holidays and Ontario).",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// v2.L site-level structured data. No SearchAction: the site has no search.
// No sameAs: there are no social profiles. Logo = the real file in public/.
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "isitholiday.today",
  url: "https://isitholiday.today/",
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "isitholiday.today",
  url: "https://isitholiday.today/",
  logo: "https://isitholiday.today/favicon.svg",
  description:
    "Instant answers on whether today is a public or bank holiday in the US, India, the UK and Canada.",
};


export default function Index() {
  return (
    <>
      <Seo
        title={HOME_ANSWER.title}
        description={HOME_ANSWER.description}
        path="/"
        jsonLd={[websiteSchema, orgSchema, webAppSchema("https://isitholiday.today/"), faqSchema]}
      />
      <section className="space-y-2 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{HOME_ANSWER.h1}</h1>
      </section>

      <AnswerBlock kind={HOME_ANSWER.kind} upcomingHeading={HOME_ANSWER.upcomingHeading} />

      <section className="mt-12 border-t pt-10 mb-6 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Check a state, India, or a holiday type</h2>
        <p className="text-muted-foreground max-w-2xl">
          Pick a country and region for a yes/no on whether today is a holiday there, plus the next
          one coming up.
        </p>
      </section>

      <Calculator prefillCountry="usa" />

      <section className="mt-8">
        <Link to="/holiday-checker/" className="text-sm text-primary underline-offset-4 hover:underline">
          Open the dedicated checker page →
        </Link>
      </section>

      {/* What counts */}
      <section className="mt-12 border-t pt-10">
        <h2 className="text-2xl font-bold tracking-tight mb-1">
          Public, bank, and school holidays aren't the same thing
        </h2>
        <p className="text-muted-foreground max-w-2xl mb-6">
          A day off in one sense isn't a day off in another. Here's what each type actually means
          before you assume the office, the bank, or the school is closed.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOLIDAY_TYPES.map((t) => (
            <div key={t.name} className="rounded-lg border p-5">
              <h3 className="font-semibold mb-1">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2026 US federal table */}
      <section className="mt-12 border-t pt-10">
        <h2 className="text-2xl font-bold tracking-tight mb-1">2026 US federal holidays</h2>
        <p className="text-muted-foreground max-w-2xl mb-6">
          All 11 federal holidays for 2026 with their observed dates. When a holiday lands on a
          weekend, the federal government shifts the day off to the nearest weekday.
        </p>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Holiday</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Observed</th>
              </tr>
            </thead>
            <tbody>
              {FED_2026.map((h) => (
                <tr key={h.name} className="border-t">
                  <td className="px-4 py-3">{h.name}</td>
                  <td className="px-4 py-3">{h.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{h.observed ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Source: 5 U.S.C. 6103. Observed dates shown where they differ from the calendar date.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-12 border-t pt-10">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Common questions</h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="rounded-lg border px-4 py-1 [&_summary]:list-none">
              <summary className="cursor-pointer py-3 font-medium">{f.q}</summary>
              <p className="pb-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <InternalLinks excludeSlug="" />
    </>
  );
}
