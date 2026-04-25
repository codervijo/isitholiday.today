import Calculator from "@/components/Calculator";
import InternalLinks from "@/components/InternalLinks";
import Seo from "@/components/Seo";

export default function CalculatorPage() {
  return (
    <>
      <Seo
        title="Holiday Checker — isitholiday.today"
        description="Check whether today is a public, bank, or school holiday in any covered country or state."
        path="/holiday-checker"
      />
      <section className="space-y-2 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Holiday Checker</h1>
        <p className="text-muted-foreground max-w-2xl">
          The same widget powers every page — pick a country and state and get an instant yes/no with the next upcoming holiday.
        </p>
      </section>

      <Calculator />
      <InternalLinks />
    </>
  );
}
