import { Link } from "react-router-dom";
import { PAGES } from "@/lib/data";

interface Props {
  excludeSlug?: string;
}

// Every page links to every other page as plain <a href> in the static HTML.
// With 9 pages that is cheap, and it is what keeps any page from being orphaned
// (a fixed prefix slice previously left /usa/new-york/ and /usa/bank-holiday/
// with zero inbound links). Revisit with sibling/parent linking once v3 adds
// enough pages to make "link everything" noisy.
const LINKS = [
  { to: "/holiday-checker/", label: "Holiday checker — any country, state, or type", slug: "holiday-checker" },
  ...PAGES.map((p) => ({ to: `/${p.slug}/`, label: p.h1, slug: p.slug })),
];

export default function InternalLinks({ excludeSlug }: Props) {
  const items = LINKS.filter((l) => l.slug !== excludeSlug);
  return (
    <nav aria-label="All holiday pages" className="mt-12 border-t pt-10">
      <h2 className="text-lg font-semibold mb-3">All holiday pages</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((l) => (
          <li key={l.slug}>
            <Link
              to={l.to}
              className="block rounded-md border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
