/**
 * All marketing copy in one place for review. Product-truth rules (CLAUDE.md):
 * no invented prices, statistics, customers or testimonials.
 */
export const COMMERCIAL_LINE = "Annual group licence + per-company onboarding; tailored to group size.";

export const SOURCES = ["Tally", "Business Central", "QuickBooks Online", "Zoho Books", "Shopify"] as const;

export const PROBLEMS = [
  {
    n: "01",
    title: "Separate ledgers",
    body: "Money moves through five different systems across ten companies. No single place sees all of it.",
  },
  {
    n: "02",
    title: "Manual Excel",
    body: "Someone exports, pastes and reconciles the group by hand every month. The invoices behind each total are lost along the way.",
  },
  {
    n: "03",
    title: "Days per question",
    body: "“What’s our cash across everything?” becomes an email chain. The answer comes back days later.",
  },
  {
    n: "04",
    title: "Stale on arrival",
    body: "By the time the group pack is ready, the numbers are 2–4 weeks old. Decisions get made on last month.",
  },
] as const;

export type TourMomentId = "dashboard" | "summary" | "statements" | "exceptions" | "ask" | "trace";

export const TOUR_MOMENTS: { id: TourMomentId; n: string; title: string; body: string; outcome: string }[] = [
  {
    id: "dashboard",
    n: "01",
    title: "Group dashboard",
    body: "Every company in one view: cash, revenue, margin and anything that needs attention. Open a company for its P&L, cash and latest movements.",
    outcome: "The whole group, visible, without asking anyone.",
  },
  {
    id: "summary",
    n: "02",
    title: "Same summary everywhere",
    body: "Five sources, one definition of each number. A Tally company and a Business Central company read the same way.",
    outcome: "Compare companies like-for-like, whatever system they run.",
  },
  {
    id: "statements",
    n: "03",
    title: "Group statements",
    body: "A consolidated income statement by sector, with intercompany trading eliminated. Built from captured movements, not from a spreadsheet.",
    outcome: "Group figures you can take into a board meeting.",
  },
  {
    id: "exceptions",
    n: "04",
    title: "Exceptions flagged",
    body: "Unreconciled accounts, debtors past threshold, VAT deadlines, facility crunches. The pipeline raises them as movements arrive.",
    outcome: "You hear about problems before they become surprises.",
  },
  {
    id: "ask",
    n: "05",
    title: "Ask a question",
    body: "Type the question you would have emailed. fibr answers from every company's captured movements and shows where each number came from.",
    outcome: "Answers in seconds, not days.",
  },
  {
    id: "trace",
    n: "06",
    title: "Trace to source",
    body: "Start at a group total and follow it down: company, customer, then the individual invoices behind it, each with its reference and source system.",
    outcome: "Every number on screen has a document behind it.",
  },
];

export type RoleId = "owner" | "cfo" | "holding" | "board";

export const ROLES: { id: RoleId; label: string; question: string; shows: string[]; opensTo: string }[] = [
  {
    id: "owner",
    label: "Chairman / Owner",
    question: "Where is the cash, and who owes us?",
    shows: [
      "Group cash today and at month-end, company by company",
      "Customers past 90 days, down to the invoices behind them",
      "The few things that need your attention, flagged",
    ],
    opensTo: "Group overview",
  },
  {
    id: "cfo",
    label: "Group CFO",
    question: "Are we covered for the next thirteen weeks?",
    shows: [
      "Facility maturities by week across every bank",
      "Weeks where maturities exceed forecast operating cash",
      "One consistent summary for every company, whatever the ledger",
    ],
    opensTo: "Bank facilities",
  },
  {
    id: "holding",
    label: "Holding Co. / Family Office",
    question: "Which companies are earning, and which are using cash?",
    shows: [
      "Net profit and margin by company, year to date",
      "Cash held in each company against its obligations",
      "Group statements by sector with intercompany eliminated",
    ],
    opensTo: "Group statements",
  },
  {
    id: "board",
    label: "Board & Audit Committee",
    question: "Are we ready for corporate tax and audit?",
    shows: [
      "Which companies need audited statements, and why",
      "VAT returns due across the group",
      "Every figure traceable to its invoice or receipt",
    ],
    opensTo: "Exceptions",
  },
];

export const PILOT_STEPS = [
  {
    week: "Week 1",
    title: "Scope",
    we: "Agree the 2–3 pilot companies and the questions that matter most.",
    you: "A 60-minute session with the owner and finance lead.",
  },
  {
    week: "Week 2",
    title: "Connect",
    we: "Connect each pilot company's sources read-only and start capturing movements.",
    you: "Approve read-only access. Nothing changes in the books.",
  },
  {
    week: "Week 3",
    title: "Load & reconcile",
    we: "Capture the year's transactions, invoices and receipts and tie them to the last signed accounts.",
    you: "Share the last signed accounts for each pilot company.",
  },
  {
    week: "Week 4",
    title: "Pilot live",
    we: "The group view goes live for the owner and finance team, signed in with Microsoft and MFA.",
    you: "Use it for real questions. Tell us what is missing.",
  },
  {
    week: "Week 5+",
    title: "Roll out",
    we: "Connect the remaining companies' sources, one or several at a time.",
    you: "Decide the order. Each company follows the same steps.",
  },
] as const;

export const FAQ = [
  {
    q: "Do we have to replace or change our accounting systems?",
    a: "No. Each company keeps its own source: Tally, Business Central, QuickBooks Online, Zoho Books or Shopify. fibr reads every transaction, invoice and receipt from them and never writes or posts anything. Your finance team works exactly as it does today, with no migration and no re-keying.",
  },
  {
    q: "Where is our data, and who can see it?",
    a: "fibr is hosted on Microsoft Azure UAE North in Dubai. Everyone signs in with their Microsoft account and multi-factor authentication. fibr reads your ledgers; it cannot write to them.",
  },
  {
    q: "Will the numbers match our audited accounts?",
    a: "During onboarding we tie every company's captured movements back to its last signed accounts before anyone relies on the numbers. If something does not tie out, you see the difference and the transactions behind it.",
  },
  {
    q: "How much of our finance team's time does it take?",
    a: "The pilot starts with 2–3 companies and goes live in four weeks. Your team approves read-only access, shares the last signed accounts and joins a few short working sessions. After that the pipeline captures movements on its own; there is nothing to re-key.",
  },
  {
    q: "What does it cost, and how is it priced?",
    a: `${COMMERCIAL_LINE} We confirm the figure once we know how many companies and ledgers are in scope, usually after the walkthrough.`,
  },
] as const;

export const COMPANY_COUNTS = ["2–5", "6–10", "11–20", "20+"] as const;
export const TIME_WINDOWS = ["Morning (9–12 GST)", "Afternoon (12–4 GST)", "Evening (4–7 GST)"] as const;

export const PIPELINE_STAGES = [
  { n: "01", title: "Sources", body: "Every system a company records money in, connected read-only." },
  { n: "02", title: "Captured", body: "Every transaction, invoice, receipt, payment and web order, pulled into one pipeline." },
  { n: "03", title: "Checked", body: "Tied to the last signed accounts. Gaps and anomalies raised as exceptions." },
  { n: "04", title: "Visible", body: "One view of the group, with every number traceable to its source document." },
] as const;
