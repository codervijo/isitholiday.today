import Breadcrumbs from "@/components/Breadcrumbs";
import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";
import {
  INSTITUTIONS,
  OBSERVED_RULES,
  buildHolidayView,
  formatLong,
  type CellStatus,
  type HolidayDef,
} from "@/lib/holidayPages";
import { US_SOURCES, US_TZ, daysBetween } from "@/lib/usAnswers";
import { todayIn, useNow } from "@/lib/today";
import { lastmodFor } from "@/lib/lastmod";

const SITE = "https://isitholiday.today";

const STATUS_STYLE: Record<CellStatus, string> = {
  closed: "text-red-700 dark:text-red-400 font-semibold",
  open: "text-green-700 dark:text-green-400 font-semibold",
  early: "text-amber-700 dark:text-amber-400 font-semibold",
  none: "text-muted-foreground",
};
const STATUS_ICON: Record<CellStatus, string> = { closed: "❌ ", open: "✅ ", early: "⏰ ", none: "" };

/** v3.C: one US federal holiday — banks, Post Offices, mail, NYSE, federal offices. */
export default function HolidayPageRoute({ def }: { def: HolidayDef }) {
  const now = useNow();
  const today = todayIn(US_TZ, now);
  const v = buildHolidayView(def, today);
  const url = `${SITE}/${def.slug}/`;

  if (!v) {
    const title = `Is ${def.short} a Bank Holiday? Banks, Mail & NYSE`;
    return (
      <>
        <Seo
          title={title}
          description={`${def.name}: whether banks, Post Offices and the stock market are open. This site has no official dates for the next ${def.name} yet.`}
          path={`/${def.slug}`}
        />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">Is {def.name} a bank holiday?</h1>
        <p>This site has no official dates for the next {def.name} yet. They will be added once published.</p>
        <InternalLinks excludeSlug={def.slug} />
      </>
    );
  }

  const days = daysBetween(today, v.main);
  const countdown =
    days > 1 ? `${def.short} is ${days} days away.` : days === 1 ? `${def.short} is tomorrow.` : days === 0 ? `${def.short} is today.` : "";
  const sourceIds = [...new Set(INSTITUTIONS.flatMap((i) => i.sources))];

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebPage", name: v.title, url, description: v.description, dateModified: lastmodFor(`/${def.slug}/`, now).value },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url,
      mainEntity: v.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <>
      <Seo title={v.title} description={v.description} path={`/${def.slug}`} jsonLd={jsonLd} />
      <Breadcrumbs trail={[{ name: def.name, path: `/${def.slug}` }]} />
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">{v.h1}</h1>

      <section className="rounded-xl border-2 border-sky-300 bg-sky-50 dark:bg-sky-950/30 p-5 sm:p-6 mb-8" aria-live="polite">
        <p className="text-xl sm:text-2xl font-bold leading-snug">{v.headline}</p>
        <ul className="mt-3 space-y-1 text-sm sm:text-base">
          {v.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        {countdown && <p className="mt-3 text-sm font-medium">{countdown}</p>}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          What's open on {def.name} {v.year}
        </h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Who</th>
                {v.dates.map((d) => (
                  <th key={d} className="px-4 py-3 font-medium whitespace-nowrap">
                    {formatLong(d).replace(/, \d{4}$/, "")}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {INSTITUTIONS.map((inst) => (
                <tr key={inst.id} className="border-t align-top">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{inst.label}</td>
                  {v.cells[inst.id].map((c, i) => (
                    <td key={v.dates[i]} className={`px-4 py-3 whitespace-nowrap ${STATUS_STYLE[c.status]}`}>
                      {STATUS_ICON[c.status]}
                      {c.text}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-xs">
                    {inst.sources.map((id, i) => (
                      <span key={id}>
                        {i > 0 && " · "}
                        <a href={US_SOURCES[id].url} className="underline underline-offset-2" rel="noopener">
                          {US_SOURCES[id].label}
                        </a>
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          "—" means the source publishes no schedule for that weekend day. This site has no data for individual bank
          branches or Post Office locations.
        </p>
      </section>

      <section className="mt-12 border-t pt-10 space-y-4 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">When {def.name} is observed</h2>
        <p className="text-muted-foreground">
          {def.name} falls on {def.rule}. In {v.year} that is {formatLong(v.nominal)}. It is one of the 11 federal
          holidays on OPM's list, and the Federal Reserve, USPS and NYSE each publish their own schedule for it.
        </p>
        {OBSERVED_RULES.map((p) => (
          <p key={p.slice(0, 32)} className="text-muted-foreground">{p}</p>
        ))}
      </section>

      <section className="mt-12 border-t pt-10 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Frequently asked questions</h2>
        <dl className="space-y-5">
          {v.faq.map((f) => (
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
          {sourceIds.map((id) => (
            <li key={id}>
              <a href={US_SOURCES[id].url} className="underline underline-offset-2" rel="noopener">
                {US_SOURCES[id].label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <InternalLinks excludeSlug={def.slug} />
    </>
  );
}
