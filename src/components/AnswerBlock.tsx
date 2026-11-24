import { CALENDAR_LABEL, US_SOURCES, US_TZ, computeAnswer, daysBetween, formatLong, upcoming, type AnswerKind } from "@/lib/usAnswers";
import { todayIn, useNow } from "@/lib/today";

interface Props {
  kind: AnswerKind;
  /** Heading for the upcoming-dates table. */
  upcomingHeading: string;
}

/**
 * v2.H answer block: today's answer (US Eastern) + the upcoming dates on the
 * relevant calendar. Prerendered from BUILD_TIME; advances to the live clock
 * after mount (see useNow).
 */
export default function AnswerBlock({ kind, upcomingHeading }: Props) {
  const now = useNow();
  const today = todayIn(US_TZ, now);
  const a = computeAnswer(kind, today);
  const rows = upcoming(a.calendar, today, 8);

  return (
    <>
      <section
        className={`rounded-xl border-2 p-5 sm:p-6 mb-8 ${
          a.closed ? "border-red-300 bg-red-50 dark:bg-red-950/30" : "border-green-300 bg-green-50 dark:bg-green-950/30"
        }`}
        aria-live="polite"
      >
        <p className="text-xl sm:text-2xl font-bold leading-snug">{a.headline}</p>
        <ul className="mt-3 space-y-1 text-sm sm:text-base">
          {a.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Answer for {formatLong(today)}, US Eastern time. Sources:{" "}
          {a.sources.map((id, i) => (
            <span key={id}>
              {i > 0 && " · "}
              <a href={US_SOURCES[id].url} className="underline underline-offset-2" rel="noopener">
                {US_SOURCES[id].label}
              </a>
            </span>
          ))}
        </p>
      </section>

      {rows.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">{upcomingHeading}</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">{CALENDAR_LABEL[a.calendar]}</th>
                  <th className="px-4 py-3 font-medium">Days away</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((h) => {
                  const d = daysBetween(today, h.date);
                  return (
                    <tr key={`${h.date}-${h.name}`} className="border-t">
                      <td className="px-4 py-3 whitespace-nowrap">{formatLong(h.date)}</td>
                      <td className="px-4 py-3">{h.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{d === 0 ? "Today" : d}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
