/**
 * All marketing copy in one place. Product-truth rules (CLAUDE.md): no invented prices,
 * statistics, customers or testimonials. Hallmark budget: about 450 visible words a page.
 */
export const PRIMARY_CTA = "Book a 45-minute walkthrough";
export const COMMERCIAL_LINE = "Annual group licence + per-company onboarding; tailored to group size.";

export const SOURCES = ["Tally", "Business Central", "QuickBooks Online", "Zoho Books", "Shopify"] as const;

/** The status quo against the pipeline, one row per problem. */
export const BEFORE_AFTER = [
  { problem: "Separate ledgers", byHand: "Five systems, nothing adds them up", withFibr: "Every source captured" },
  { problem: "Manual Excel", byHand: "Exported and pasted every month", withFibr: "Nothing re-keyed" },
  { problem: "Days per question", byHand: "An email chain and a wait", withFibr: "Answered on screen" },
  { problem: "Stale on arrival", byHand: "2 to 4 weeks old", withFibr: "Last pulled today, 07:00" },
] as const;

export type MomentId = "group" | "trace" | "ask" | "facilities" | "statements" | "exceptions" | "summary";

/** The product's views, shown as a switcher. Each caption states one fact. */
export const MOMENTS: { id: MomentId; label: string; caption: string }[] = [
  { id: "group", label: "Group", caption: "Every company on one screen. Open one for its P&L, cash and movements." },
  { id: "trace", label: "Trace", caption: "Group total, company, customer, invoice. Every level adds up." },
  { id: "ask", label: "Ask", caption: "Ask in plain words. Answers come from the captured movements." },
  { id: "facilities", label: "Facilities", caption: "Thirteen weeks of maturities, across every bank." },
  { id: "statements", label: "Statements", caption: "Consolidated by sector, intercompany eliminated." },
  { id: "exceptions", label: "Exceptions", caption: "Raised from the movements as they arrive." },
  { id: "summary", label: "Summary", caption: "One definition of every number, whatever the source." },
];

export const UAE_RULES = [
  { figure: "9%", unit: "", line: "Corporate tax above AED 375,000, filed per company." },
  { figure: "50m", unit: "AED", line: "Revenue that needs audited statements." },
  { figure: "QFZP", unit: "", line: "Free-zone persons audited from 1 January 2025." },
  { figure: "5%", unit: "", line: "VAT, each company's return in view." },
] as const;

export const TRUST = [
  { title: "Microsoft sign-in", line: "Every user signs in with MFA." },
  { title: "Reconciled", line: "Tied to your last signed accounts before you rely on it." },
  { title: "Hosted in Dubai", line: "Microsoft Azure UAE North." },
] as const;

/** The pilot as a route: one plate per stop. */
export const ROLLOUT = [
  { week: "Week 1", stop: "Scope", line: "Pick 2 or 3 pilot companies" },
  { week: "Week 2", stop: "Connect", line: "Sources read-only" },
  { week: "Week 3", stop: "Reconcile", line: "Tie to signed accounts" },
  { week: "Week 4", stop: "Live", line: "The group view, in use" },
  { week: "Week 5+", stop: "Roll out", line: "The other companies" },
] as const;

/** Roles offered in the booking form. */
export const ROLES = [
  { id: "owner", label: "Chairman / Owner" },
  { id: "cfo", label: "Group CFO" },
  { id: "holding", label: "Holding Co. / Family Office" },
  { id: "board", label: "Board & Audit Committee" },
] as const;

export const COMPANY_COUNTS = ["2 to 5", "6 to 10", "11 to 20", "20+"] as const;
export const TIME_WINDOWS = ["Morning, 9 to 12 GST", "Afternoon, 12 to 4 GST", "Evening, 4 to 7 GST"] as const;
