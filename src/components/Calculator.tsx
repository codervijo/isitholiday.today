import { useMemo, useState } from "react";
import { CalendarCheck2, CalendarX2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getTodayHoliday } from "@/lib/holiday";
import type { HolidayType } from "@/lib/holidays";

const COUNTRIES = [
  { value: "india", label: "India" },
  { value: "usa", label: "United States" },
];

const STATES_BY_COUNTRY: Record<string, { value: string; label: string }[]> = {
  india: [
    { value: "all", label: "All of India" },
    { value: "kerala", label: "Kerala" },
    { value: "tamil-nadu", label: "Tamil Nadu" },
  ],
  usa: [
    { value: "all", label: "All of USA" },
    { value: "california", label: "California" },
    { value: "texas", label: "Texas" },
    { value: "new-york", label: "New York" },
  ],
};

const TYPES: { value: HolidayType | "all"; label: string }[] = [
  { value: "all", label: "Any type" },
  { value: "public", label: "Public" },
  { value: "bank", label: "Bank" },
  { value: "school", label: "School" },
];

interface Props {
  prefillCountry?: string;
  prefillState?: string | null;
  prefillType?: HolidayType | null;
}

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export default function Calculator({ prefillCountry = "india", prefillState = null, prefillType = null }: Props) {
  const [country, setCountry] = useState<string>(prefillCountry);
  const [state, setState] = useState<string>(prefillState ?? "all");
  const [type, setType] = useState<string>(prefillType ?? "all");

  const result = useMemo(
    () =>
      getTodayHoliday({
        country,
        state: state === "all" ? null : state,
        type: type === "all" ? null : (type as HolidayType),
      }),
    [country, state, type]
  );

  const stateOptions = STATES_BY_COUNTRY[country] ?? [{ value: "all", label: "All" }];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Holiday Checker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={(v) => { setCountry(v); setState("all"); }}>
              <SelectTrigger id="country"><SelectValue /></SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State / region</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger id="state"><SelectValue /></SelectTrigger>
              <SelectContent>
                {stateOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Holiday type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border p-5 bg-muted/40">
          {result.isHoliday ? (
            <div className="flex items-start gap-3">
              <CalendarCheck2 className="h-7 w-7 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xl font-semibold">
                  ✅ Yes, today ({formatDate(result.date)}) is {result.holidayName}.
                </p>
                <p className="text-sm text-muted-foreground mt-1">Type: {result.type}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <CalendarX2 className="h-7 w-7 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xl font-semibold">
                  ❌ No, today ({formatDate(result.date)}) is not a holiday.
                </p>
                {result.nextHoliday && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Next holiday: <span className="font-medium text-foreground">{result.nextHoliday.name}</span> on {formatDate(result.nextHoliday.date)}.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
