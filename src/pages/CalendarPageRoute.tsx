import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";
import {
  CAL_COLUMNS,
  CALENDAR_SLUG,
  CALENDAR_YEAR,
  ICS_PATH,
  PDF_PATH,
  calendarRows,
  federalHolidayNames,
  icsRows,
  weekendFederal,
} from "@/lib/calendar";
import type { CellStatus } from "@/lib/holidayPages";
import { US_SOURCES } from "@/lib/usAnswers";
import { lastmodFor } from "@/lib/lastmod";
import { useNow } from "@/lib/today";
import { formatLong } from "@/lib/holidayPages";

const SITE = "https://isitholiday.today";
const Y = CALENDAR_YEAR;

const STATUS_STYLE: Record<CellStatus, string> = {
  closed: "text-red-700 dark:text-red-400 font-semibold",
  open: "text-green-700 dark:text-green-400",
  early: "text-amber-700 dark:text-amber-400 font-semibold",
  none: "text-muted-foreground",
};

const fmtShort = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

/** Static copy + FAQ, all derived from the sourced calendars. Exported for tests. */
export function calendarCopy() {
  const rows = calendarRows(Y);
  const names = federalHolidayNames(Y);
  const weekend = weekendFederal(Y);
  const goodFriday = rows.find((r) => /Good Friday/.test(r.name));
  const title = `${Y} Federal Holiday Calendar: Banks, USPS & NYSE (PDF, ICS)`;
  const description = `All ${Y} US federal holidays with observed dates, plus Federal Reserve, USPS and NYSE closures. Free PDF and ICS calendar downloads, with official sources.`;
  const weekendText = weekend
    .map((w) => `${w.name} (${formatLong(w.date)}${w.observed ? `; observed ${formatLong(w.observed)}` : ""})`)
    .join("; ");
  const faq = [
    {
      question: `How many federal holidays are there in ${Y}?`,
      answer: `OPM lists ${names.length} federal holidays for ${Y}: ${names.join(", ")}.`,
    },
    {
      question: `Which ${Y} federal holidays fall on a weekend?`,
      answer: weekend.length
        ? `${weekendText}. Federal employees get the Friday before a Saturday holiday off and the Monday after a Sunday holiday.`
        : `None of the ${Y} federal holidays fall on a weekend.`,
    },
    ...(goodFriday
      ? [
          {
            question: "Is Good Friday a federal holiday?",
            answer: `No. Good Friday (${formatLong(goodFriday.date)}) is not on OPM's federal holiday list, but NYSE lists it as a market holiday, so the stock market is closed.`,
          },
        ]
      : []),
    {
      question: `Can I add the ${Y} federal holidays to my calendar?`,
      answer: `Yes. The ICS file on this page adds each day federal offices close in ${Y} as an all-day event, and the PDF is a printable copy of the table.`,
    },
  ];
  return { rows, names, title, description, faq };
}

/** v3.D: annual US federal holiday calendar with build-time PDF + ICS downloads. */
export default function CalendarPageRoute() {
  const { rows, names, title, description, faq } = calendarCopy();
  const url = `${SITE}/${CALENDAR_SLUG}/`;
  const dateModified = lastmodFor(`/${CALENDAR_SLUG}/`, useNow()).value;
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebPage", name: title, url, description, dateModified },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url,
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    },
  ];

  return (
    <>
      <Seo title={title} description={description} path={`/${CALENDAR_SLUG}`} jsonLd={jsonLd} />
      <Breadcrumbs trail={[{ name: `${Y} federal holiday calendar`, path: `/${CALENDAR_SLUG}` }]} />
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{Y} federal holiday calendar</h1>
      <p className="text-base max-w-3xl mb-6">
        OPM lists {names.length} US federal holidays for {Y}. The table shows every day in {Y} that a federal, Federal
        Reserve, USPS or NYSE schedule marks, and what is open or closed on each.
      </p>

      <div className="flex flex-wrap gap-3 mb-8">
        <a href={PDF_PATH} download className="rounded-lg border-2 px-4 py-2 font-semibold hover:bg-muted">
          Download PDF
        </a>
        <a href={ICS_PATH} download className="rounded-lg border-2 px-4 py-2 font-semibold hover:bg-muted">
          Add to calendar (ICS, {icsRows(rows).length} events)
        </a>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">{Y} US holidays and closures</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Holiday</th>
                {CAL_COLUMNS.map((c) => (
                  <th key={c.id} className="px-3 py-3 font-medium">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.date} className="border-t align-top">
                  <td className="px-3 py-3 whitespace-nowrap">{fmtShort(r.date)}</td>
                  <td className="px-3 py-3">
                    {r.slug ? (
                      <Link to={`/${r.slug}/`} className="underline underline-offset-2">
                        {r.name}
                      </Link>
                    ) : (
                      r.name
                    )}
                  </td>
                  {CAL_COLUMNS.map((c) => (
                    <td key={c.id} className={`px-3 py-3 ${STATUS_STYLE[r.cells[c.id].status]}`}>
                      {r.cells[c.id].text}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          "—" means the source publishes no schedule for that weekend day. Individual banks and Post Office locations set
          their own hours.
        </p>
      </section>

      <section className="mt-12 border-t pt-10 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Frequently asked questions</h2>
        <dl className="space-y-5">
          {faq.map((f) => (
            <div key={f.question}>
              <dt className="font-semibold">{f.question}</dt>
              <dd className="text-muted-foreground mt-1">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 border-t pt-10 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Sources</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {(["opm", "fed", "usps", "nyse"] as const).map((id) => (
            <li key={id}>
              <a href={US_SOURCES[id].url} className="underline underline-offset-2" rel="noopener">
                {US_SOURCES[id].label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <InternalLinks excludeSlug={CALENDAR_SLUG} />
    </>
  );
}
