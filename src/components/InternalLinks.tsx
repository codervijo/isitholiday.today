import { Link } from "react-router-dom";
import { PAGES } from "@/lib/data";

interface Props {
  excludeSlug?: string;
  limit?: number;
}

export default function InternalLinks({ excludeSlug, limit = 6 }: Props) {
  const items = PAGES.filter((p) => p.slug !== excludeSlug).slice(0, limit);
  return (
    <nav aria-label="Related pages" className="mt-8">
      <h2 className="text-lg font-semibold mb-3">Related pages</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/${p.slug}`}
              className="block rounded-md border px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {p.h1}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
