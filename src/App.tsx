import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { RouteRecord } from "vite-react-ssg";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import CalculatorPage from "./pages/CalculatorPage";
import SeoPageRoute from "./pages/SeoPageRoute";
import NotFound from "./pages/NotFound";
import ClosurePageRoute from "./pages/ClosurePageRoute";
import { CLOSURE_PAGES } from "./lib/closures";
import AnswerPageRoute from "./pages/AnswerPageRoute";
import { ANSWER_PAGES } from "./lib/answerPages";
import { HOLIDAY_DEFS } from "./lib/holidayPages";
import HolidayPageRoute from "./pages/HolidayPageRoute";
import CalendarPageRoute from "./pages/CalendarPageRoute";
import ReligiousPageRoute from "./pages/ReligiousPageRoute";
import { RELIGIOUS_SLUG } from "./lib/religious";
import { CALENDAR_SLUG } from "./lib/calendar";
import { PAGES } from "./lib/data";

const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Outlet />
      </Layout>
    </QueryClientProvider>
  );
}

const countrySlugs = PAGES.filter((p) => !p.slug.includes("/")).map((p) => p.slug);
const nestedSlugs = PAGES.filter((p) => p.slug.includes("/")).map((p) => p.slug);

export const routes: RouteRecord[] = [
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Index },
      { path: "holiday-checker", Component: CalculatorPage },
      // v2.H US "today" answer pages.
      ...ANSWER_PAGES.map((page) => ({
        path: page.slug,
        Component: () => <AnswerPageRoute page={page} />,
      })),
      // v3.E religious holidays.
      { path: RELIGIOUS_SLUG, Component: ReligiousPageRoute },
      // v3.D annual calendar.
      { path: CALENDAR_SLUG, Component: CalendarPageRoute },
      // v3.C one page per US federal holiday.
      ...HOLIDAY_DEFS.map((def) => ({
        path: def.slug,
        Component: () => <HolidayPageRoute def={def} />,
      })),
      // v2.G holiday closure pages: static segments outrank the :country param route.
      ...CLOSURE_PAGES.map((page) => ({
        path: page.slug,
        Component: () => <ClosurePageRoute page={page} />,
      })),
      {
        path: ":country",
        Component: SeoPageRoute,
        getStaticPaths: () => countrySlugs,
      },
      {
        path: ":country/:state",
        Component: SeoPageRoute,
        getStaticPaths: () => nestedSlugs,
      },
      // Prerendered to dist/404.html (see vite.config.ts) so CF Pages returns a real 404.
      { path: "404", Component: NotFound },
      { path: "*", Component: NotFound },
    ],
  },
];

export default routes;
