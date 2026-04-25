import { useParams } from "react-router-dom";
import Calculator from "@/components/Calculator";
import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";
import { findPageBySlug } from "@/lib/data";
import NotFound from "./NotFound";

export default function SeoPageRoute() {
  const params = useParams<{ country?: string; state?: string }>();
  const slug = [params.country, params.state].filter(Boolean).join("/");
  const page = findPageBySlug(slug);

  if (!page) return <NotFound />;

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

      <InternalLinks excludeSlug={page.slug} />
    </>
  );
}
