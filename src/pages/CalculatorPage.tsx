import Breadcrumbs from "@/components/Breadcrumbs";
import Calculator from "@/components/Calculator";
import { GoldenBody, GoldenFaq, GoldenHeader, faqJsonLd } from "@/components/GoldenSections";
import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";
import { webAppSchema } from "@/lib/schema";
import { CHECKER_PAGE } from "@/lib/data";

const URL = "https://isitholiday.today/holiday-checker/";

/** /holiday-checker/: the widget plus v2.J golden-page content. */
export default function CalculatorPage() {
  return (
    <>
      <Seo
        title="Holiday Checker — isitholiday.today"
        description={CHECKER_PAGE.description}
        path="/holiday-checker"
        jsonLd={[webAppSchema(URL), faqJsonLd(CHECKER_PAGE, URL)]}
      />
      <Breadcrumbs trail={[{ name: "Holiday checker", path: "/holiday-checker" }]} />
      <section className="space-y-2 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Holiday Checker</h1>
        <GoldenHeader content={CHECKER_PAGE} />
      </section>

      <Calculator />
      <GoldenBody content={CHECKER_PAGE} introHeading="What the holiday checker covers" />
      <GoldenFaq content={CHECKER_PAGE} />
      <InternalLinks excludeSlug="holiday-checker" />
    </>
  );
}
