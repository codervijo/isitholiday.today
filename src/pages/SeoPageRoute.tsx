import { useParams } from "react-router-dom";
import Calculator from "@/components/Calculator";
import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";
import UpcomingHolidays from "@/components/UpcomingHolidays";
import { findPageBySlug } from "@/lib/data";
import NotFound from "./NotFound";

const COUNTRY_NAMES: Record<string, string> = { india: "India", usa: "the USA" };

const titleCase = (slug: string) =>
  slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

export default function SeoPageRoute() {
  const params = useParams<{ country?: string; state?: string }>();
  const slug = [params.country, params.state].filter(Boolean).join("/");
  const page = findPageBySlug(slug);

  if (!page) return <NotFound />;

  const { country, state = null, type = null } = page.prefill;
  const place = state ? titleCase(state) : (COUNTRY_NAMES[country] ?? titleCase(country));
  const heading = `Upcoming ${type === "bank" ? "bank holidays" : "holidays"} in ${place}`;

  return (
    <>
      <Seo title={page.title} description={page.description} path={`/${page.slug}`} />
      <section className="space-y-2 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{page.h1}</h1>
        <p className="text-base max-w-2xl">{page.directAnswer}</p>
      </section>

      <Calculator
        prefillCountry={page.prefill.country}
        prefillState={page.prefill.state ?? null}
        prefillType={page.prefill.type ?? null}
      />

      {page.intro && (
        <section className="mt-12 border-t pt-10 space-y-4 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">How holidays work in {place}</h2>
          {page.intro.map((para) => (
            <p key={para.slice(0, 32)} className="text-muted-foreground">{para}</p>
          ))}
        </section>
      )}

      <UpcomingHolidays query={{ country, state, type }} heading={heading} sources={page.sources} />

      <InternalLinks excludeSlug={page.slug} />
    </>
  );
}
