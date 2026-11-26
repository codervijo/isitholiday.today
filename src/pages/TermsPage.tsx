import Breadcrumbs from "@/components/Breadcrumbs";
import Seo from "@/components/Seo";
import { CONTACT_EMAIL } from "./AboutPage";

export const TERMS_SLUG = "terms";
export const TERMS_TITLE = "Terms of Use — isitholiday.today";
export const TERMS_DESCRIPTION =
  "Terms of use: holiday and closure information is provided as is, without warranty. Confirm with the bank, office or agency before relying on it.";
export const TERMS_EFFECTIVE = "November 26, 2026";

export default function TermsPage() {
  return (
    <>
      <Seo title={TERMS_TITLE} description={TERMS_DESCRIPTION} path={`/${TERMS_SLUG}`} />
      <Breadcrumbs trail={[{ name: "Terms of use", path: `/${TERMS_SLUG}/` }]} />
      <article className="max-w-3xl space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Terms of use</h1>
        <p className="text-sm text-muted-foreground">Effective {TERMS_EFFECTIVE}.</p>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Information only</h2>
          <p>
            isitholiday.today publishes holiday and closure information compiled from official sources, which each page
            links to. It is general information, not legal, financial or professional advice. Institutions can change
            their schedules, and individual branches, offices and locations can keep different hours. Confirm with the
            bank, office or agency before relying on an answer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">No warranty</h2>
          <p>
            The site and its content are provided "as is" and "as available", without warranties of any kind, express
            or implied, including accuracy, completeness, fitness for a particular purpose and availability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by applicable law, isitholiday.today is not liable for any loss or damage
            arising from use of, or reliance on, the site or its content, including missed deadlines, payments or
            appointments.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Use of the site</h2>
          <p>
            You may read, link to and share pages for personal or informational use. Do not use the site in a way that
            harms it or its availability to others. Third-party sources and data credited on the site remain subject to
            their own terms; Jewish holiday data from Hebcal.com is licensed under Creative Commons Attribution 4.0.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Changes and contact</h2>
          <p>
            These terms may be updated; the new version will be posted here with a new effective date. Questions or
            corrections:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </article>
    </>
  );
}
