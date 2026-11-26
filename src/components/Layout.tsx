import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import NavLink from "./NavLink";
import { BUILD_TIME } from "@/lib/today";

/** v2.K footer: legal + E-E-A-T pages and key hubs. */
export const FOOTER_LINKS = [
  { to: "/", label: "Home" },
  { to: "/usa/", label: "USA" },
  { to: "/india/", label: "India" },
  { to: "/2027-federal-holiday-calendar/", label: "2027 calendar" },
  { to: "/holiday-checker/", label: "Holiday checker" },
  { to: "/all-locations/", label: "All pages" },
  { to: "/about/", label: "About" },
  { to: "/privacy/", label: "Privacy" },
  { to: "/terms/", label: "Terms" },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight">
            isitholiday.today
          </Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/holiday-checker/">Checker</NavLink>
            <NavLink to="/india/">India</NavLink>
            <NavLink to="/usa/">USA</NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">{children}</div>
      </main>

      <footer className="border-t py-6 text-sm text-muted-foreground">
        <div className="container space-y-3 text-center">
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {FOOTER_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="hover:underline underline-offset-2">
                {l.label}
              </Link>
            ))}
          </nav>
          <p>Holiday data compiled from official government sources and reviewed for each calendar year.</p>
          <p>© {BUILD_TIME.getUTCFullYear()} isitholiday.today · Static-first · Cloudflare Pages</p>
        </div>
      </footer>
    </div>
  );
}
