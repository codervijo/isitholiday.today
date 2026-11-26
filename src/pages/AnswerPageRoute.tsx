import AnswerBlock from "@/components/AnswerBlock";
import Breadcrumbs from "@/components/Breadcrumbs";
import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";
import type { AnswerPage } from "@/lib/answerPages";
import { lastmodFor } from "@/lib/lastmod";
import { useNow } from "@/lib/today";

const SITE = "https://isitholiday.today";

/** One US "today" answer page (v2.H). Static copy from answerPages.ts; answer from usAnswers.ts. */
export default function AnswerPageRoute({ page }: { page: AnswerPage }) {
  const url = `${SITE}/${page.slug}/`;
  const dateModified = lastmodFor(`/${page.slug}/`, useNow()).value;
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebPage", name: page.title, url, description: page.description, dateModified },
    ...(page.faq.length
      ? [
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
        ]
      : []),
  ];

  return (
    <>
      <Seo title={page.title} description={page.description} path={`/${page.slug}`} jsonLd={jsonLd} />
      <Breadcrumbs trail={[{ name: page.h1.replace(/\?$/, ""), path: `/${page.slug}` }]} />
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">{page.h1}</h1>

      <AnswerBlock kind={page.kind} upcomingHeading={page.upcomingHeading} />

      <section className="mt-12 border-t pt-10 space-y-4 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight">{page.explainer.heading}</h2>
        {page.explainer.paragraphs.map((p) => (
          <p key={p.slice(0, 32)} className="text-muted-foreground">{p}</p>
        ))}
      </section>

      {page.faq.length > 0 && (
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
      )}

      <InternalLinks excludeSlug={page.slug} />
    </>
  );
}
