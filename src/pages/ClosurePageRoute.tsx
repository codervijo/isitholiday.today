import Breadcrumbs from "@/components/Breadcrumbs";
import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";
import { CHECKED, SOURCES, type ClosurePage, type SourceId } from "@/lib/closures";
import { todayIn, useNow } from "@/lib/today";
import { lastmodFor } from "@/lib/lastmod";

const SITE = "https://isitholiday.today";

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(to + "T00:00:00Z") - Date.parse(from + "T00:00:00Z")) / 86_400_000);

function countdown(days: number, holiday: string): string {
  if (days > 1) return `${holiday} is ${days} days away.`;
  if (days === 1) return `${holiday} is tomorrow.`;
  if (days === 0) return `${holiday} is today.`;
  return `${holiday} has passed for this year; next year's dates will be added here.`;
}

function SourceLinks({ ids }: { ids: SourceId[] }) {
  return (
    <>
      {ids.map((id, i) => (
        <span key={id}>
          {i > 0 && " · "}
          <a href={SOURCES[id].url} className="underline underline-offset-2" rel="noopener">
            {SOURCES[id].label}
          </a>
        </span>
      ))}
    </>
  );
}

/** One US holiday-closure page (v2.G). All facts come from src/lib/closures.ts. */
export default function ClosurePageRoute({ page }: { page: ClosurePage }) {
  const now = useNow();
  // US closure schedules are national; Eastern time is the reference zone.
  const today = todayIn("America/New_York", now);
  const days = daysBetween(today, page.date);
  const url = `${SITE}/${page.slug}/`;
  const usedSources = [...new Set(page.rows.flatMap((r) => r.sources))];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      url,
      description: page.description,
      dateModified: lastmodFor(`/${page.slug}/`, now).value,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url,
      mainEntity: page.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <>
      <Seo title={page.title} description={page.description} path={`/${page.slug}`} jsonLd={jsonLd} />
      <Breadcrumbs trail={[{ name: page.holiday, path: `/${page.slug}` }]} />
      <section className="space-y-3 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{page.h1}</h1>
        <p className="text-base max-w-2xl">{page.directAnswer}</p>
        <p className="text-sm text-muted-foreground">
          {page.holiday}: {formatDate(page.date)}. {countdown(days, page.holiday)}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          What's open on {page.holiday} ({formatDate(page.date)})
        </h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Who</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {page.rows.map((r) => (
                <tr key={r.who} className="border-t align-top">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{r.who}</td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap font-semibold ${
                      r.status === "closed"
                        ? "text-red-700 dark:text-red-400"
                        : r.status === "early"
                          ? "text-amber-700 dark:text-amber-400"
                          : "text-green-700 dark:text-green-400"
                    }`}
                  >
                    {r.status === "closed" ? "❌ " : r.status === "early" ? "⏰ " : "✅ "}
                    {r.label}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.detail}{" "}
                    <span className="text-xs">
                      (<SourceLinks ids={r.sources} />)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Last checked against the sources: {formatDate(CHECKED)}. This site has no data for individual
          bank branches or Post Office locations.
        </p>
      </section>

      <section className="mt-12 border-t pt-10 space-y-4 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">{page.explainer.heading}</h2>
        {page.explainer.paragraphs.map((p) => (
          <p key={p.slice(0, 32)} className="text-muted-foreground">{p}</p>
        ))}
      </section>

      <section className="mt-12 border-t pt-10 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Frequently asked questions</h2>
        <dl className="space-y-5">
          {page.faq.map((f) => (
            <div key={f.question}>
              <dt className="font-semibold">{f.question}</dt>
              <dd className="text-muted-foreground mt-1">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 border-t pt-10">
        <h2 className="text-lg font-semibold mb-2">Sources</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {usedSources.map((id) => (
            <li key={id}>
              <a href={SOURCES[id].url} className="underline underline-offset-2" rel="noopener">
                {SOURCES[id].label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <InternalLinks excludeSlug={page.slug} />
    </>
  );
}
