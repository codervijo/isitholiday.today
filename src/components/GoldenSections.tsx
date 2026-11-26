import { Link } from "react-router-dom";
import { ANSWER_PAGES } from "@/lib/answerPages";
import { CLOSURE_PAGES } from "@/lib/closures";
import { PAGES, type GoldenContent } from "@/lib/data";

/** "2026-09-25" → "September 2026". */
export const monthYear = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

const LABELS: Record<string, string> = {
  "": "What holiday is today?",
  "holiday-checker": "Holiday checker",
  ...Object.fromEntries(PAGES.map((p) => [p.slug, p.h1])),
  ...Object.fromEntries(ANSWER_PAGES.map((p) => [p.slug, p.h1])),
  ...Object.fromEntries(CLOSURE_PAGES.map((p) => [p.slug, p.h1])),
};

export const relatedLabel = (slug: string) => LABELS[slug] ?? slug;

/** v2.J: tagline + freshness line, shown under the H1. */
export function GoldenHeader({ content }: { content: GoldenContent }) {
  return (
    <>
      <p className="text-lg text-muted-foreground max-w-2xl">{content.tagline}</p>
      <p className="text-xs text-muted-foreground">
        Data verified: {monthYear(content.dataUpdated)} · Page updated: {content.lastUpdated}
      </p>
    </>
  );
}

/** FAQPage JSON-LD for a page's visible FAQ. */
export const faqJsonLd = (content: GoldenContent, url: string) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url,
  mainEntity: content.faq.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

/** v2.J: intro, how it works, tips, FAQ and related pages, below the checker. */
export function GoldenBody({ content, introHeading }: { content: GoldenContent; introHeading: string }) {
  return (
    <>
      <section className="mt-12 border-t pt-10 space-y-4 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">{introHeading}</h2>
        {content.intro.map((para) => (
          <p key={para.slice(0, 32)} className="text-muted-foreground">{para}</p>
        ))}
      </section>

      <section className="mt-12 border-t pt-10 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4">How this page works</h2>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          {content.howItWorks.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="mt-12 border-t pt-10 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Tips</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          {content.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

/** FAQ list + related links; rendered after the holiday table. */
export function GoldenFaq({ content }: { content: GoldenContent }) {
  return (
    <>
      <section className="mt-12 border-t pt-10 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Frequently asked questions</h2>
        <dl className="space-y-5">
          {content.faq.map((f) => (
            <div key={f.question}>
              <dt className="font-semibold">{f.question}</dt>
              <dd className="text-muted-foreground mt-1">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 border-t pt-10 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Related pages</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {content.relatedSlugs.map((slug) => (
            <li key={slug}>
              <Link to={slug ? `/${slug}/` : "/"} className="underline underline-offset-2">
                {relatedLabel(slug)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
