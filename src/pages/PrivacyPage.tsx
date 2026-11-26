import Breadcrumbs from "@/components/Breadcrumbs";
import Seo from "@/components/Seo";
import { CONTACT_EMAIL } from "./AboutPage";

export const PRIVACY_SLUG = "privacy";
export const PRIVACY_TITLE = "Privacy Policy — isitholiday.today";
export const PRIVACY_DESCRIPTION =
  "Privacy policy for isitholiday.today: no accounts or forms, Google Analytics for visit statistics, Cloudflare hosting, and how to opt out or contact us.";
export const PRIVACY_EFFECTIVE = "November 26, 2026";

const mail = (
  <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
    {CONTACT_EMAIL}
  </a>
);

export default function PrivacyPage() {
  return (
    <>
      <Seo title={PRIVACY_TITLE} description={PRIVACY_DESCRIPTION} path={`/${PRIVACY_SLUG}`} />
      <Breadcrumbs trail={[{ name: "Privacy policy", path: `/${PRIVACY_SLUG}/` }]} />
      <article className="max-w-3xl space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy policy</h1>
        <p className="text-sm text-muted-foreground">Effective {PRIVACY_EFFECTIVE}.</p>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">What this site collects</h2>
          <p>
            isitholiday.today has no accounts, sign-ups, forms or comments, and does not ask you for any personal
            information. The holiday checker runs in your browser; your selections are not sent to us.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Google Analytics</h2>
          <p>
            The site uses Google Analytics 4 to count visits and see which pages are used. Google Analytics sets
            cookies in your browser and collects usage data such as pages viewed, approximate location, device and
            browser type, and the site that referred you. Google processes this data under the{" "}
            <a href="https://policies.google.com/privacy" className="underline underline-offset-2" rel="noopener">
              Google Privacy Policy
            </a>
            . This site uses the reports only to understand which pages are useful. It does not show ads.
          </p>
          <p>
            You can block Google Analytics with your browser's cookie or tracking settings, or with Google's{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" className="underline underline-offset-2" rel="noopener">
              Google Analytics Opt-out Browser Add-on
            </a>
            . The site works the same either way.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Hosting</h2>
          <p>
            The site is hosted on Cloudflare Pages. Like any web host, Cloudflare receives technical request data such
            as your IP address and browser details in order to deliver and protect the site, under the{" "}
            <a href="https://www.cloudflare.com/privacypolicy/" className="underline underline-offset-2" rel="noopener">
              Cloudflare Privacy Policy
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Email</h2>
          <p>
            If you email {mail}, your message and address are used only to reply and to correct the site. They are not
            added to any mailing list.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Your rights (GDPR and CCPA)</h2>
          <p>
            Depending on where you live, laws such as the EU and UK GDPR and the California Consumer Privacy Act give
            you rights over your personal information, including the right to know what is collected, to access or
            delete it, and to object to its use. This site does not sell personal information for money. Because the
            site itself holds no personal information beyond emails you send, requests about analytics data are best
            handled with the opt-out above or through Google. For anything else, contact {mail}.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight">Changes</h2>
          <p>If this policy changes, the new version will be posted here with a new effective date.</p>
        </section>
      </article>
    </>
  );
}
