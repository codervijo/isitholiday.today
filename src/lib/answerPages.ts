/**
 * v2.H — copy for the US "today" answer pages. The dynamic answer comes from
 * computeAnswer() in usAnswers.ts; everything here is static and must only say
 * what the cited sources say.
 */
import type { AnswerKind } from "./usAnswers";
import type { Faq } from "./closures";

export interface AnswerPage {
  /** "" for the homepage. */
  slug: string;
  kind: AnswerKind;
  title: string;
  h1: string;
  description: string;
  /** Heading for the upcoming-dates table. */
  upcomingHeading: string;
  explainer: { heading: string; paragraphs: string[] };
  faq: Faq[];
}

const FEDERAL_EXPLAINER = [
  "US federal holidays are the days on the list the Office of Personnel Management (OPM) publishes each year: New Year's Day, Martin Luther King Jr. Day, Presidents' Day, Memorial Day, Juneteenth, Independence Day, Labor Day, Columbus Day, Veterans Day, Thanksgiving and Christmas Day.",
  "When a holiday falls on a Saturday, federal employees get the preceding Friday off; when it falls on a Sunday, the following Monday. Both the calendar date and the observed date appear in the table below.",
  "The Federal Reserve and the Postal Service keep their own schedules. They don't always follow OPM's Saturday rule: for a Saturday holiday, Federal Reserve Banks are open the preceding Friday, and USPS keeps Post Offices open that Friday.",
];

const MAIL_EXPLAINER = [
  "USPS says regular mail delivery occurs Monday through Saturday, with the exception of postal holidays. So there is no regular mail on Sundays or on a postal holiday.",
  "On Sundays, USPS says Priority Mail Express and Amazon parcels are the only mail eligible for delivery.",
  "For a postal holiday on a Saturday (Juneteenth and Christmas in 2027), USPS says deliveries will occur as normal on the Friday before.",
];

const BANK_EXPLAINER = [
  "In the US, \"bank holiday\" usually means a day on the Federal Reserve's holiday schedule. The Federal Reserve publishes that schedule; it lists the same days as the federal holidays.",
  "The Federal Reserve handles Saturday holidays differently from OPM: \"For holidays falling on Saturday, Federal Reserve Banks and Branches will be open the preceding Friday.\" For holidays falling on Sunday, all Federal Reserve offices are closed the following Monday.",
  "Individual banks set their own branch hours, including weekends. This site has no branch-level data, so check with your bank.",
];

/** The homepage answers "what holiday is today". */
export const HOME_ANSWER: AnswerPage = {
  slug: "",
  kind: "what-today",
  title: "What Holiday Is Today? US Federal, Bank & Postal Holidays — isitholiday.today",
  h1: "What holiday is today?",
  description:
    "What holiday is today in the US? See whether today is a federal holiday, a Federal Reserve bank holiday or a USPS postal holiday, plus the next one coming up.",
  upcomingHeading: "Upcoming US federal holidays",
  explainer: { heading: "How US holidays work", paragraphs: FEDERAL_EXPLAINER },
  faq: [],
};

export const ANSWER_PAGES: AnswerPage[] = [
  {
    slug: "is-tomorrow-a-holiday",
    kind: "tomorrow",
    title: "Is Tomorrow a Holiday? US Federal, Bank & Postal Check",
    h1: "Is tomorrow a holiday?",
    description:
      "Is tomorrow a holiday in the US? Check whether tomorrow is a federal holiday, a Federal Reserve bank holiday or a USPS postal holiday, with official sources.",
    upcomingHeading: "Upcoming US federal holidays",
    explainer: { heading: "How US holidays work", paragraphs: FEDERAL_EXPLAINER },
    faq: [
      {
        question: "Which calendars does this page check?",
        answer:
          "Three official US schedules: OPM's federal holiday list, the Federal Reserve's holiday schedule, and USPS's postal holiday list. They mostly overlap but not always, so each is shown separately.",
      },
      {
        question: "What timezone is \"tomorrow\" based on?",
        answer:
          "US Eastern time. The page is rebuilt shortly after midnight Eastern, and your browser updates the answer from its own clock when the page loads.",
      },
    ],
  },
  {
    slug: "next-holiday",
    kind: "next",
    title: "Next Holiday: When Is the Next US Federal Holiday?",
    h1: "When is the next holiday?",
    description:
      "When is the next holiday in the US? The next federal holiday and how many days away it is, plus the next Federal Reserve and USPS postal holidays.",
    upcomingHeading: "Upcoming US federal holidays",
    explainer: { heading: "How US holidays work", paragraphs: FEDERAL_EXPLAINER },
    faq: [
      {
        question: "How many federal holidays are there?",
        answer:
          "Eleven: New Year's Day, Martin Luther King Jr. Day, Presidents' Day, Memorial Day, Juneteenth, Independence Day, Labor Day, Columbus Day, Veterans Day, Thanksgiving and Christmas Day, per OPM's federal holiday list.",
      },
      {
        question: "Are the Federal Reserve and USPS holidays the same as federal holidays?",
        answer:
          "Mostly. The difference is Saturday holidays: federal employees get the Friday before off, but Federal Reserve Banks and Post Offices stay open that Friday.",
      },
    ],
  },
  {
    slug: "federal-holiday-today",
    kind: "federal",
    title: "Is Today a Federal Holiday? Live US Answer",
    h1: "Is today a federal holiday?",
    description:
      "Is today a federal holiday in the US? A yes-or-no answer for today from OPM's federal holiday list, plus the next federal holiday and how many days away it is.",
    upcomingHeading: "Upcoming US federal holidays",
    explainer: { heading: "What makes a day a federal holiday", paragraphs: FEDERAL_EXPLAINER },
    faq: [
      {
        question: "Who decides the federal holidays?",
        answer:
          "Federal holidays are set by law, and the Office of Personnel Management (OPM) publishes the dates each year, including the observed date when a holiday falls on a weekend.",
      },
      {
        question: "Can a president add a day off?",
        answer:
          "A president can close executive departments for a day by executive order, as happened on December 24 and 26, 2025. That gives federal employees a day off for that year only; it does not add a federal holiday.",
      },
    ],
  },
  {
    slug: "post-office-open-today",
    kind: "post-office",
    title: "Is the Post Office Open Today? Is Today a Postal Holiday?",
    h1: "Is the post office open today?",
    description:
      "Is the post office open today, and is today a postal holiday? Checks today against the USPS postal holiday list and Sunday closures, plus the next one.",
    upcomingHeading: "Upcoming USPS postal holidays",
    explainer: {
      heading: "When Post Offices close",
      paragraphs: [
        "USPS publishes its own list of postal holidays. Post Offices close on those days. USPS also says its facilities are usually closed for retail transactions on Sundays.",
        "USPS doesn't always follow the federal government's Saturday rule. In 2027 Juneteenth and Christmas fall on Saturdays, and USPS says Post Offices will be open on the Fridays before, June 18 and December 24, with deliveries as normal.",
        "This site has no data for individual Post Office locations. Hours differ by location, so check your local Post Office before you go.",
      ],
    },
    faq: [
      {
        question: "Is today a postal holiday?",
        answer:
          "The answer box at the top of this page checks today against USPS's published postal holiday list, in US Eastern time. On a postal holiday Post Offices close and there is no regular mail delivery.",
      },
      {
        question: "Is the post office open on federal holidays?",
        answer:
          "Post Offices close on USPS postal holidays, which match the federal holidays. The exception is a Saturday holiday: USPS keeps Post Offices open on the Friday before, which federal employees get off.",
      },
      {
        question: "Is the post office open on Sunday?",
        answer:
          "Usually not for retail. USPS says its facilities are usually closed for retail transactions on Sundays, though Priority Mail Express is still delivered.",
      },
    ],
  },
  {
    slug: "mail-today",
    kind: "mail",
    title: "Is There Mail Today? USPS Delivery Check",
    h1: "Is there mail today?",
    description:
      "Is there mail today? Regular USPS delivery runs Monday through Saturday except postal holidays. See today's answer and the next postal holiday with no mail.",
    upcomingHeading: "Upcoming USPS postal holidays (no regular delivery)",
    explainer: {
      heading: "When mail is delivered",
      paragraphs: MAIL_EXPLAINER,
    },
    faq: [
      {
        question: "Is mail delivered on Saturday?",
        answer:
          "Yes. USPS says regular mail delivery occurs Monday through Saturday, except on postal holidays.",
      },
      {
        question: "Is mail delivered on Sunday?",
        answer:
          "Not regular mail. USPS says Priority Mail Express and Amazon parcels are the only mail eligible for Sunday delivery.",
      },
    ],
  },
  {
    slug: "mail-tomorrow",
    kind: "mail-tomorrow",
    title: "Is There Mail Tomorrow? USPS Delivery Check",
    h1: "Is there mail tomorrow?",
    description:
      "Is there mail tomorrow? Checks tomorrow against the USPS postal holiday list and Sunday delivery rules, plus the next postal holiday with no regular mail.",
    upcomingHeading: "Upcoming USPS postal holidays (no regular delivery)",
    explainer: { heading: "When mail is delivered", paragraphs: MAIL_EXPLAINER },
    faq: [
      {
        question: "Is there mail the day after a holiday?",
        answer:
          "Yes, if that day is Monday through Saturday and not itself a postal holiday. USPS says regular delivery occurs Monday through Saturday, with the exception of postal holidays.",
      },
      {
        question: "What timezone is \"tomorrow\" based on?",
        answer:
          "US Eastern time. The page is rebuilt shortly after midnight Eastern, and your browser updates the answer from its own clock when the page loads.",
      },
    ],
  },
  {
    slug: "banks-open-today",
    kind: "banks",
    title: "Are Banks Closed Today? Federal Reserve Holiday Check",
    h1: "Are banks closed today?",
    description:
      "Are banks open or closed today? Checks today against the Federal Reserve holiday schedule, plus the next Federal Reserve closure and how many days away it is.",
    upcomingHeading: "Upcoming Federal Reserve holidays",
    explainer: {
      heading: "What a bank holiday means",
      paragraphs: BANK_EXPLAINER,
    },
    faq: [
      {
        question: "Are banks closed on federal holidays?",
        answer:
          "The Federal Reserve closes on the federal holidays on its schedule. Individual banks set their own branch hours, so check with your bank.",
      },
      {
        question: "What if a holiday falls on a Saturday?",
        answer:
          "Federal Reserve Banks and Branches are open the preceding Friday. If a holiday falls on a Sunday, Federal Reserve offices close the following Monday.",
      },
    ],
  },
  {
    slug: "banks-open-tomorrow",
    kind: "banks-tomorrow",
    title: "Are Banks Open Tomorrow? Is Tomorrow a Bank Holiday?",
    h1: "Are banks open tomorrow?",
    description:
      "Are banks open tomorrow, or is tomorrow a bank holiday? Checks tomorrow against the Federal Reserve holiday schedule, plus the next Federal Reserve closure.",
    upcomingHeading: "Upcoming Federal Reserve holidays",
    explainer: { heading: "What a bank holiday means", paragraphs: BANK_EXPLAINER },
    faq: [
      {
        question: "Is tomorrow a bank holiday?",
        answer:
          "The answer box at the top of this page checks tomorrow against the Federal Reserve's holiday schedule, in US Eastern time. Individual banks set their own branch hours, so check with your bank.",
      },
      {
        question: "Are banks open on Saturday?",
        answer:
          "It depends on the bank. The Federal Reserve's schedule covers holidays, not weekends, and this site has no branch-level data.",
      },
    ],
  },
];
