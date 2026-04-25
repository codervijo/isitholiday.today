import { Link } from "react-router-dom";
import Calculator from "@/components/Calculator";
import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";

export default function Index() {
  return (
    <>
      <Seo
        title="Is Today a Holiday? — isitholiday.today"
        description="Instant answer: is today a public, bank, or school holiday in your country or state? Covers India, USA, UK, Canada, Australia."
        path="/"
      />
      <section className="space-y-2 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Is today a holiday?</h1>
        <p className="text-muted-foreground max-w-2xl">
          Pick a country and state to see whether today is a public, bank, or school holiday — plus the next upcoming holiday in your scope.
        </p>
      </section>

      <Calculator />

      <section className="mt-8">
        <Link to="/holiday-checker" className="text-sm text-primary underline-offset-4 hover:underline">
          Open the dedicated checker page →
        </Link>
      </section>

      <InternalLinks />
    </>
  );
}
