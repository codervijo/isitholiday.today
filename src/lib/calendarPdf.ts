/**
 * v3.D — build-time PDF of the annual calendar (pdf-lib, standard Helvetica).
 * Imported only by vite.config.ts and tests; never by the client bundle.
 */
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { CAL_COLUMNS, CALENDAR_SLUG, type CalendarRow } from "./calendar";
import { US_SOURCES } from "./usAnswers";

const fmt = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

/** Short cell labels so every column fits at 8.5pt. Same meaning as the page's text. */
const SHORT: Record<string, string> = {
  "Holiday falls on the weekend": "Weekend holiday",
  "Usually closed (Sunday)": "Usually closed (Sun)",
  "No regular delivery (Sunday)": "No delivery (Sun)",
  "No regular delivery": "No delivery",
  "Regular delivery": "Delivered",
  "Closes early, 1:00 p.m. ET": "Early close, 1 p.m. ET",
  "Not in this site's data yet": "No data yet",
};

/** Standard PDF fonts are WinAnsi-only; keep text to that set. */
const ansi = (s: string) => s.replace(/[’]/g, "'").replace(/[^\x20-\x7E—–]/g, "");

export async function buildCalendarPdf(rows: CalendarRow[], year: number, builtOn: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${year} US Federal Holiday Calendar`);
  doc.setAuthor("isitholiday.today");
  doc.setSubject("US federal, Federal Reserve, USPS and NYSE holiday dates");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const W = 792; // US Letter landscape
  const H = 612;
  const M = 36;
  const colX = [M, M + 76, M + 250, M + 340, M + 440, M + 540, M + 620];
  const red = rgb(0.7, 0.1, 0.1);
  const green = rgb(0.05, 0.45, 0.2);
  const amber = rgb(0.6, 0.4, 0.0);
  const grey = rgb(0.4, 0.4, 0.4);
  const color = { closed: red, open: green, early: amber, none: grey } as const;

  let page = doc.addPage([W, H]);
  let y = H - M;
  const text = (s: string, x: number, size: number, f = font, c = rgb(0, 0, 0)) =>
    page.drawText(ansi(s), { x, y, size, font: f, color: c });

  const header = () => {
    text(`${year} US Federal Holiday Calendar`, M, 18, bold);
    y -= 18;
    text("Federal offices (OPM), Federal Reserve Banks, Post Offices and mail (USPS), and the stock market (NYSE).", M, 9, font, grey);
    y -= 22;
    ["Date", "Holiday", ...CAL_COLUMNS.map((c) => c.label)].forEach((h, i) => text(h, colX[i], 9, bold));
    y -= 6;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.5, color: grey });
    y -= 13;
  };
  header();

  for (const r of rows) {
    if (y < M + 70) {
      page = doc.addPage([W, H]);
      y = H - M;
      header();
    }
    text(fmt(r.date), colX[0], 9);
    text(r.name.length > 34 ? r.name.slice(0, 33) + "..." : r.name, colX[1], 9);
    CAL_COLUMNS.forEach((c, i) => {
      const cl = r.cells[c.id];
      text(SHORT[cl.text] ?? cl.text, colX[i + 2], 8.5, font, color[cl.status]);
    });
    y -= 15;
  }

  y -= 8;
  const notes = [
    "Weekend cells marked with a dash: the source publishes no schedule for that day. Individual banks and Post Office locations set their own hours.",
    ...(["opm", "fed", "usps", "nyse"] as const).map((id) => `Source: ${US_SOURCES[id].label} — ${US_SOURCES[id].url}`),
    `Generated ${builtOn} from https://isitholiday.today/${CALENDAR_SLUG}/`,
  ];
  for (const n of notes) {
    if (y < M) {
      page = doc.addPage([W, H]);
      y = H - M;
    }
    text(n, M, 7.5, font, grey);
    y -= 11;
  }
  return doc.save();
}
