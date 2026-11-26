import { useParams } from "react-router-dom";
import Breadcrumbs, { locationTrail } from "@/components/Breadcrumbs";
import Calculator from "@/components/Calculator";
import { GoldenBody, GoldenFaq, GoldenHeader, faqJsonLd } from "@/components/GoldenSections";
import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";
import StateInstitutions from "@/components/StateInstitutions";
import UpcomingHolidays from "@/components/UpcomingHolidays";
import { isStateKey } from "@/lib/stateInstitutions";
import { findPageBySlug } from "@/lib/data";
import { scopeTimeZone } from "@/lib/today";
import NotFound from "./NotFound";

const SITE = "https://isitholiday.today";

const COUNTRY_NAMES: Record<string, string> = { india: "India", usa: "the USA", uk: "the UK", canada: "Canada" };
/** Regions whose slug doesn't title-case cleanly (v3.G). */
const REGION_NAMES: Record<string, string> = { "england-and-wales": "England and Wales", federal: "Canada (federal)" };

const titleCase = (slug: string) =>
  slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

export default function SeoPageRoute() {
  const params = useParams<{ country?: string; state?: string }>();
  const slug = [params.country, params.state].filter(Boolean).join("/");
  const page = findPageBySlug(slug);

  if (!page) return <NotFound />;

  const { country, state = null, type = null } = page.prefill;
  const place = state ? (REGION_NAMES[state] ?? titleCase(state)) : (COUNTRY_NAMES[country] ?? titleCase(country));
  const heading = `Upcoming ${type === "bank" ? "bank holidays" : "holidays"} in ${place}`;

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        path={`/${page.slug}`}
        jsonLd={[faqJsonLd(page, `${SITE}/${page.slug}/`)]}
      />
      <Breadcrumbs trail={locationTrail(page.slug)} />
      <section className="space-y-2 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{page.h1}</h1>
        <GoldenHeader content={page} />
        <p className="text-base max-w-2xl">{page.directAnswer}</p>
      </section>

      <Calculator
        prefillCountry={page.prefill.country}
        prefillState={page.prefill.state ?? null}
        prefillType={page.prefill.type ?? null}
      />

      <GoldenBody content={page} introHeading={`How holidays work in ${place}`} />

      <UpcomingHolidays query={{ country, state, type }} heading={heading} sources={page.sources} />

      {country === "usa" && !type && isStateKey(state) && <StateInstitutions state={state} tz={scopeTimeZone(country, state)} />}

      <GoldenFaq content={page} />

      <InternalLinks excludeSlug={page.slug} />
    </>
  );
}
