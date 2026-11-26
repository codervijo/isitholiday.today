import Breadcrumbs from "@/components/Breadcrumbs";
import Seo from "@/components/Seo";
import { PAGES, type Source } from "@/lib/data";
import { SOURCES as CLOSURE_SOURCES } from "@/lib/closures";
import { FAITHS } from "@/lib/religious";
import { STATE_INSTITUTIONS } from "@/lib/stateInstitutions";
import { US_SOURCES } from "@/lib/usAnswers";

export const ABOUT_SLUG = "about";
export const ABOUT_TITLE = "About isitholiday.today — Methodology & Data Sources";
export const ABOUT_DESCRIPTION =
  "How isitholiday.today answers whether today is a holiday: official government, central bank, USPS, NYSE and religious calendars, checked by date and timezone.";
export const CONTACT_EMAIL = "hello@isitholiday.today";

/** Every source the site's data cites, de-duplicated by URL. Exported for tests. */
export function allSources(): Source[] {
  const list: Source[] = [
    ...PAGES.flatMap((p) => p.sources ?? []),
    ...Object.values(US_SOURCES),
    ...Object.values(CLOSURE_SOURCES),
    ...Object.values(FAITHS).map((f) => f.source),
    ...Object.values(STATE_INSTITUTIONS).flatMap((insts) => insts.map((i) => i.source)),
  ];
  const seen = new Set<string>();
  return list
    .filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export default function AboutPage() {
  const sources = allSources();
  return (
    <>
      <Seo title={ABOUT_TITLE} description={ABOUT_DESCRIPTION} path={`/${ABOUT_SLUG}`} />
      <Breadcrumbs trail={[{ name: "About", path: `/${ABOUT_SLUG}/` }]} />
      <article className="max-w-3xl space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">About isitholiday.today</h1>
        <p>
          isitholiday.today answers one question quickly: is today (or tomorrow, or a given holiday) a day off — for
          federal offices, banks, Post Offices, the stock market, state offices, courts and DMVs, or a religious
          observance. It is published by isitholiday.today.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">How the answers are made</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Every date comes from an official or authoritative calendar, listed below. Nothing is estimated: when a
              source has not published a year yet, the page says so instead of guessing.
            </li>
            <li>
              "Today" means today in the place the answer is about: US Eastern time for US pages, India Standard Time
              for India pages.
            </li>
            <li>
              Pages are built ahead of time and rebuilt automatically three times a day, so the answer in the page
              matches the current date. Your browser also updates the answer from its own clock when the page loads.
            </li>
            <li>
              The site has no data for individual bank branches, Post Office locations or local offices. Their hours
              can differ, so check with them directly.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Data sources</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} className="underline underline-offset-2" rel="noopener">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Corrections</h2>
          <p>
            If an answer is wrong or a source has changed, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>{" "}
            with the page and the source. Corrections are checked against the official source before the page is
            updated.
          </p>
        </section>
      </article>
    </>
  );
}
