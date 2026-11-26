import {
  GAPS,
  STATE_INSTITUTIONS,
  STATE_NAMES,
  institutionOn,
  upcomingStateDays,
  type StateKey,
  type TodayKind,
} from "@/lib/stateInstitutions";
import { todayIn, useNow } from "@/lib/today";
import { US_TZ, formatLong } from "@/lib/usAnswers";

const STYLE: Record<TodayKind, string> = {
  closed: "text-red-700 dark:text-red-400 font-semibold",
  partial: "text-amber-700 dark:text-amber-400 font-semibold",
  open: "text-green-700 dark:text-green-400",
  weekend: "text-muted-foreground",
  unknown: "text-muted-foreground",
};

/**
 * v3.F: state offices, courts and DMV for one state — today's status, the next
 * dates, sources, and the institutions with no official schedule (gaps).
 */
export default function StateInstitutions({ state, tz = US_TZ }: { state: StateKey; tz?: string }) {
  const now = useNow();
  const today = todayIn(tz, now);
  const name = STATE_NAMES[state];
  const insts = STATE_INSTITUTIONS[state];
  const next = upcomingStateDays(state, today, 10);

  return (
    <section className="mt-12 border-t pt-10">
      <h2 className="text-2xl font-bold tracking-tight mb-2">{name} state offices, courts and DMV today</h2>
      <p className="text-sm text-muted-foreground mb-4">Answer for {formatLong(today)}, from each institution's own schedule.</p>
      <div className="overflow-x-auto rounded-lg border mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Institution</th>
              <th className="px-4 py-3 font-medium">Today</th>
              <th className="px-4 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {insts.map((inst) => {
              const s = institutionOn(inst, today);
              return (
                <tr key={inst.id} className="border-t align-top">
                  <td className="px-4 py-3 font-medium">{inst.label}</td>
                  <td className={`px-4 py-3 ${STYLE[s.kind]}`}>
                    {s.text}
                    {s.day?.note && <span className="block text-xs font-normal text-muted-foreground">{s.day.note}</span>}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <a href={inst.source.url} className="underline underline-offset-2" rel="noopener">
                      {inst.source.label}
                    </a>
                  </td>
                </tr>
              );
            })}
            {GAPS[state].map((g) => (
              <tr key={g} className="border-t align-top">
                <td className="px-4 py-3 font-medium">{g}</td>
                <td className="px-4 py-3 text-muted-foreground" colSpan={2}>
                  No official statewide holiday schedule found; check the office or court directly.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {next.length > 0 && (
        <>
          <h3 className="text-xl font-bold tracking-tight mb-3">Upcoming {name} state closures</h3>
          <div className="overflow-x-auto rounded-lg border mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Holiday</th>
                  <th className="px-4 py-3 font-medium">Who</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {next.map(({ inst, day }) => {
                  const s = institutionOn(inst, day.date);
                  return (
                    <tr key={`${inst.id}-${day.date}`} className="border-t align-top">
                      <td className="px-4 py-3 whitespace-nowrap">{formatLong(day.date)}</td>
                      <td className="px-4 py-3">{day.name}</td>
                      <td className="px-4 py-3">{inst.label}</td>
                      <td className={`px-4 py-3 ${STYLE[s.kind]}`}>
                        {s.text.split(":")[0]}
                        {day.note && <span className="block text-xs font-normal text-muted-foreground">{day.note}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="space-y-2 max-w-3xl text-sm text-muted-foreground">
        {insts
          .filter((i) => i.note || i.weekend)
          .map((i) => (
            <p key={i.id}>
              <strong className="text-foreground">{i.label}:</strong> {[i.note, i.weekend].filter(Boolean).join(" ")}
            </p>
          ))}
        {insts.map((i) => (
          <p key={`t-${i.id}`}>
            {i.label}: dates through {formatLong(i.through)} ({i.source.label}).
          </p>
        ))}
      </div>
    </section>
  );
}
