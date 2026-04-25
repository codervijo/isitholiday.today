import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Not Found — isitholiday.today" description="That page doesn't exist." path="/404" />
      <section className="py-12 text-center space-y-4">
        <h1 className="text-3xl font-bold">404 — Page not found</h1>
        <p className="text-muted-foreground">We couldn't find that location or holiday page.</p>
        <Link to="/" className="text-primary underline-offset-4 hover:underline">
          ← Back to home
        </Link>
      </section>
    </>
  );
}
