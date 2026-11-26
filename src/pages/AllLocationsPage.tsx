import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import Seo from "@/components/Seo";
import { ANSWER_PAGES } from "@/lib/answerPages";
import { CALENDAR_SLUG, CALENDAR_YEAR } from "@/lib/calendar";
import { CLOSURE_PAGES } from "@/lib/closures";
import { PAGES } from "@/lib/data";
import { HOLIDAY_DEFS } from "@/lib/holidayPages";
import { RELIGIOUS_SLUG } from "@/lib/religious";

export const ALL_LOCATIONS_SLUG = "all-locations";
export const ALL_LOCATIONS_DESCRIPTION =
  "Every page on isitholiday.today in one list: today's US holiday answers, bank and post office checks, holiday closure pages, calendars and locations.";

interface Item {
  to: string;
  label: string;
}

/** Every indexable page, grouped. Exported for tests. */
export function allPageGroups(): { heading: string; items: Item[] }[] {
  const slash = (slug: string) => (slug ? `/${slug}/` : "/");
  return [
    {
      heading: "Today's answers (US)",
      items: [
        { to: "/", label: "What holiday is today?" },
        ...ANSWER_PAGES.map((p) => ({ to: slash(p.slug), label: p.h1 })),
        { to: slash(RELIGIOUS_SLUG), label: "What religious holiday is today?" },
      ],
    },
    {
      heading: "US holidays: banks, post office, stock market",
      items: [
        ...HOLIDAY_DEFS.map((d) => ({ to: slash(d.slug), label: `Is ${d.name} a bank holiday?` })),
        ...CLOSURE_PAGES.map((p) => ({ to: slash(p.slug), label: p.h1 })),
      ],
    },
    {
      heading: "Calendars and tools",
      items: [
        { to: slash(CALENDAR_SLUG), label: `${CALENDAR_YEAR} federal holiday calendar (PDF, ICS)` },
        { to: "/holiday-checker/", label: "Holiday checker: any country, state or type" },
      ],
    },
    {
      heading: "Countries and states",
      items: PAGES.map((p) => ({ to: slash(p.slug), label: p.h1 })),
    },
  ];
}

/** v2.L: static, server-rendered list of every page (crawl fallback). */
export default function AllLocationsPage() {
  return (
    <>
      <Seo
        title="All Pages — isitholiday.today"
        description={ALL_LOCATIONS_DESCRIPTION}
        path={`/${ALL_LOCATIONS_SLUG}`}
      />
      <Breadcrumbs trail={[{ name: "All pages", path: `/${ALL_LOCATIONS_SLUG}` }]} />
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">All pages</h1>
      <div className="space-y-8">
        {allPageGroups().map((g) => (
          <section key={g.heading}>
            <h2 className="text-xl font-bold tracking-tight mb-3">{g.heading}</h2>
            <ul className="list-disc pl-5 space-y-1">
              {g.items.map((i) => (
                <li key={i.to}>
                  <Link to={i.to} className="underline underline-offset-2">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
