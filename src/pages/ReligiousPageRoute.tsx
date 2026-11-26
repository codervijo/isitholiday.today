import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";
import {
  FAITHS,
  RELIGIOUS_SLUG,
  RELIGIOUS_THROUGH,
  beginningTonight,
  dayOf,
  findObservance,
  observancesOn,
  upcomingObservances,
  type Faith,
  type Observance,
} from "@/lib/religious";
import { todayIn, useNow } from "@/lib/today";
import { US_TZ, addDays, daysBetween, formatLong } from "@/lib/usAnswers";

const SITE = "https://isitholiday.today";
export const RELIGIOUS_TITLE = "What Religious Holiday Is Today? Jewish, Christian, Muslim";
export const RELIGIOUS_DESCRIPTION =
  "What religious holiday is today? Jewish, Catholic, Orthodox and Islamic observances for today in the US, and what comes next, from each faith's own calendar.";

const label = (o: Observance) => `${o.name} (${FAITHS[o.faith].label})`;

const FAITH_NOTES: Record<Faith, string> = {
  jewish:
    "Dates are Hebcal's Diaspora schedule, which is the one used in the US. Jewish holidays begin at sundown on the evening before the first full day.",
  catholic:
    "Dates are from the US Catholic bishops' (USCCB) liturgical calendar. Christmas and the Immaculate Conception are the only Holydays of Obligation in Hawaii; in 2027 All Saints (Monday, Nov 1) is not a Holyday of Obligation.",
  islamic:
    "Dates follow the Fiqh Council of North America's calculated calendar; FCNA says physical sighting of the moon is not necessary. Mosques that rely on local moon sighting may observe a day later. Islamic days begin at sunset the evening before.",
  orthodox:
    "Movable feasts are from ACROD's table, published with the Greek Orthodox Archdiocese of America. Orthodox Pascha (Easter) is often on a different Sunday from Western Easter.",
};

/** FAQ answers derived from the data so they can't drift from the table. Exported for tests. */
export function religiousFaq() {
  const easter = findObservance("catholic", /^Easter/, "2027");
  const pascha = findObservance("orthodox", /^Pascha/, "2027");
  const ramadan = findObservance("islamic", /^Ramadan/, "2027");
  const eid = findObservance("islamic", /^Eid al-Fitr/, "2027");
  const yk = findObservance("jewish", /^Yom Kippur/, "2027");
  const chanukah = findObservance("jewish", /^Chanukah/, "2026");
  return [
    easter && pascha && {
      question: "When is Easter 2027?",
      answer: `Catholic (Western) Easter is ${formatLong(easter.date)}, per the USCCB. Orthodox Pascha is ${formatLong(pascha.date)}, per ACROD.`,
    },
    ramadan && eid && {
      question: "When is Ramadan 2027?",
      answer: `Ramadan 1448 begins ${formatLong(ramadan.date)} and Eid al-Fitr is ${formatLong(eid.date)}, per the Fiqh Council of North America's calculated calendar. Mosques that rely on local moon sighting may differ by a day.`,
    },
    yk && {
      question: "When is Yom Kippur 2027?",
      answer: `Yom Kippur begins at sundown on ${formatLong(addDays(yk.date, -1))} and lasts through ${formatLong(yk.date)}, per Hebcal.`,
    },
    chanukah && {
      question: "When is Hanukkah 2026?",
      answer: `Chanukah begins at sundown on ${formatLong(addDays(chanukah.date, -1))}, and its eighth day is ${formatLong(chanukah.end!)}, per Hebcal.`,
    },
    {
      question: "Which religions does this page cover?",
      answer:
        "Jewish, Catholic, Orthodox Christian and Islamic observances, each from a calendar its own community publishes. Hindu, Buddhist, Sikh and other holidays are not covered yet: this site found no single authoritative US calendar for them.",
    },
  ].filter((f): f is { question: string; answer: string } => !!f);
}

/** v3.E: "what religious holiday is today" (US Eastern date). */
export default function ReligiousPageRoute() {
  const now = useNow();
  const today = todayIn(US_TZ, now);
  const todays = observancesOn(today);
  const tonight = beginningTonight(today, addDays(today, 1));
  const next = upcomingObservances(today, 12);
  const faq = religiousFaq();
  const url = `${SITE}/${RELIGIOUS_SLUG}/`;

  const headline = todays.length
    ? `Today, ${formatLong(today)}: ${todays.map((o) => {
        const d = dayOf(o, today);
        return d ? `${label(o)}, ${d}` : label(o);
      }).join("; ")}.`
    : today > RELIGIOUS_THROUGH
      ? `This site has no religious calendar dates after ${formatLong(RELIGIOUS_THROUGH)} yet.`
      : `No major Jewish, Catholic, Orthodox or Islamic observance on these calendars today, ${formatLong(today)}.`;

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebPage", name: RELIGIOUS_TITLE, url, description: RELIGIOUS_DESCRIPTION },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url,
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    },
  ];

  return (
    <>
      <Seo title={RELIGIOUS_TITLE} description={RELIGIOUS_DESCRIPTION} path={`/${RELIGIOUS_SLUG}`} jsonLd={jsonLd} />
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">What religious holiday is today?</h1>

      <section className="rounded-xl border-2 border-violet-300 bg-violet-50 dark:bg-violet-950/30 p-5 sm:p-6 mb-8" aria-live="polite">
        <p className="text-xl sm:text-2xl font-bold leading-snug">{headline}</p>
        <ul className="mt-3 space-y-1 text-sm sm:text-base">
          {todays.filter((o) => o.note).map((o) => (
            <li key={`n-${o.name}`}>{o.name}: {o.note}.</li>
          ))}
          {tonight.map((o) => (
            <li key={`t-${o.name}`}>{label(o)} begins at sundown tonight.</li>
          ))}
          {!todays.length && next[0] && (
            <li>
              Next: {label(next[0])}, {formatLong(next[0].date)} ({daysBetween(today, next[0].date)} days away).
            </li>
          )}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">Answer for {formatLong(today)}, US Eastern time.</p>
      </section>

      {next.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Upcoming religious holidays</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Observance</th>
                  <th className="px-4 py-3 font-medium">Tradition</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {next.map((o) => (
                  <tr key={`${o.faith}-${o.date}-${o.name}`} className="border-t align-top">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatLong(o.date)}
                      {o.end && <> – {formatLong(o.end)}</>}
                    </td>
                    <td className="px-4 py-3 font-medium">{o.name}</td>
                    <td className="px-4 py-3">
                      <a href={FAITHS[o.faith].source.url} className="underline underline-offset-2" rel="noopener">
                        {FAITHS[o.faith].label}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {[FAITHS[o.faith].sundown && `Begins at sundown ${formatLong(addDays(o.date, -1))}`, o.note]
                        .filter(Boolean)
                        .join(". ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mt-12 border-t pt-10 space-y-4 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">Where these dates come from</h2>
        {(Object.keys(FAITHS) as Faith[]).map((f) => (
          <p key={f} className="text-muted-foreground">
            <strong className="text-foreground">{FAITHS[f].label}:</strong> {FAITH_NOTES[f]}{" "}
            <a href={FAITHS[f].source.url} className="underline underline-offset-2" rel="noopener">
              {FAITHS[f].source.label}
            </a>
          </p>
        ))}
        <p className="text-muted-foreground">
          Not covered yet: Hindu, Buddhist, Sikh and other traditions, for which this site found no single authoritative US
          calendar. Jewish holiday data: Hebcal.com, licensed CC BY 4.0.
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

      <InternalLinks excludeSlug={RELIGIOUS_SLUG} />
    </>
  );
}
