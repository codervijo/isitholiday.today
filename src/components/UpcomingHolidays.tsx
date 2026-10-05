import { getUpcomingHolidays, type HolidayQuery } from "@/lib/holiday";
import type { Source } from "@/lib/data";
import { scopeTimeZone, todayIn, useNow } from "@/lib/today";

interface Props {
  query: Omit<HolidayQuery, "today" | "now">;
  /** Section heading, e.g. "Upcoming holidays in Kerala". */
  heading: string;
  sources?: Source[];
}

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(to + "T00:00:00Z") - Date.parse(from + "T00:00:00Z")) / 86_400_000);

/** Server-rendered schedule for a page's scope. Uses BUILD_TIME until mounted (see useNow). */
export default function UpcomingHolidays({ query, heading, sources }: Props) {
  const now = useNow();
  const today = todayIn(scopeTimeZone(query.country, query.state), now);
  const rows = getUpcomingHolidays({ ...query, today });
  // An empty schedule reads as a thin page; omit it until the data exists.
  if (rows.length === 0) return null;

  return (
    <section className="mt-12 border-t pt-10">
      <h2 className="text-2xl font-bold tracking-tight mb-1">{heading}</h2>
      <p className="text-muted-foreground max-w-2xl mb-6">
        The next {rows.length} dates on the official calendars this site tracks, counted from today.
      </p>
      <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Holiday</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Days away</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h) => {
                const d = daysBetween(today, h.date);
                return (
                  <tr key={`${h.date}-${h.name}`} className="border-t">
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(h.date)}</td>
                    <td className="px-4 py-3">{h.name}</td>
                    <td className="px-4 py-3 capitalize">{h.type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d === 0 ? "Today" : d}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      {sources && sources.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Sources:{" "}
          {sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && " · "}
              <a href={s.url} className="underline underline-offset-2" rel="noopener">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
