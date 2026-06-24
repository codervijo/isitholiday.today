import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import NavLink from "./NavLink";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="font-semibold tracking-tight">
            isitholiday.today
          </Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/holiday-checker">Checker</NavLink>
            <NavLink to="/india">India</NavLink>
            <NavLink to="/usa">USA</NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">{children}</div>
      </main>

      <footer className="border-t py-6 text-sm text-muted-foreground">
        <div className="container space-y-1 text-center">
          <p>Holiday data compiled from official government sources and reviewed for each calendar year.</p>
          <p>© {new Date().getFullYear()} isitholiday.today · Static-first · Cloudflare Pages</p>
        </div>
      </footer>
    </div>
  );
}
