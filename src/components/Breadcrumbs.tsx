import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { withTrailingSlash } from "@/lib/utils";

const SITE = "https://isitholiday.today";

export interface Crumb {
  name: string;
  /** Site path; normalised to the trailing-slash canonical form. */
  path: string;
}

/** schema.org BreadcrumbList; item URLs are the canonical (trailing-slash) URLs. */
export function breadcrumbSchema(items: Crumb[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE}${withTrailingSlash(c.path)}`,
    })),
  };
}

/**
 * v2.L: visible breadcrumb trail + its BreadcrumbList JSON-LD (emitted through
 * its own <Head>, which merges with the page's Seo tags). "Home" is prepended;
 * pass the trail below it, ending with the current page.
 */
export default function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const items: Crumb[] = [{ name: "Home", path: "/" }, ...trail];
  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema(items))}</script>
      </Head>
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((c, i) => (
            <Fragment key={c.path}>
              {i > 0 && <li aria-hidden="true">›</li>}
              <li>
                {i === items.length - 1 ? (
                  <span aria-current="page">{c.name}</span>
                ) : (
                  <Link to={withTrailingSlash(c.path)} className="underline underline-offset-2 hover:text-foreground">
                    {c.name}
                  </Link>
                )}
              </li>
            </Fragment>
          ))}
        </ol>
      </nav>
    </>
  );
}

const COUNTRY_CRUMB: Record<string, string> = { india: "India", usa: "USA" };
const titleCase = (s: string) => s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

/** Trail for a location page slug ("usa", "usa/california", "india/bank-holiday"). */
export function locationTrail(slug: string): Crumb[] {
  const [country, sub] = slug.split("/");
  const trail: Crumb[] = [{ name: COUNTRY_CRUMB[country] ?? titleCase(country), path: `/${country}` }];
  if (sub) trail.push({ name: sub === "bank-holiday" ? "Bank holiday" : titleCase(sub), path: `/${slug}` });
  return trail;
}
