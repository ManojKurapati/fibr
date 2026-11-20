/**
 * Preset Ask fibr questions. Answers are computed from the same aggregate functions as the
 * tiles and charts, so every figure reconciles. Free-text questions go to the live model (/api/ask).
 */
import { ENTITIES, FACILITIES } from "../../data/mockGroup";
import { auditReasons, debtorsOver90, groupTotals, ladder, maturitiesWithin, summaries } from "../aggregate";
import { aed, compact, dateShort, pct } from "../format";

export interface AnswerRow {
  label: string;
  sub?: string;
  value: string;
  tone?: "amber" | "emerald";
}

export interface AnswerChartDatum {
  name: string;
  value: number;
  highlight?: "ink" | "amber" | "emerald" | "muted";
}

export interface PresetAnswer {
  /** Lead sentence; the key figure is rendered large from `figure`. */
  lead: string;
  figure: string;
  figureLabel: string;
  rows: AnswerRow[];
  moreNote?: string;
  chart: { title: string; data: AnswerChartDatum[]; layout: "vertical" | "horizontal"; refLine?: { value: number; label: string } };
  footnote: string;
  steps: string[];
}

export interface Preset {
  id: string;
  question: string;
  short: string;
  answer: () => PresetAnswer;
}

const shortName = (n: string) => n.replace("Manufacturing", "Mfg.").replace("Distribution", "Dist.").replace("Contracting", "Contr.").replace(" Co.", "");

export const PRESETS: Preset[] = [
  {
    id: "cash-oct",
    question: "What was our cash across all companies at the end of October?",
    short: "Cash at end of October",
    answer: () => {
      const t = groupTotals();
      const rows = summaries()
        .slice()
        .sort((a, b) => b.cashOct - a.cashOct);
      const accounts = ENTITIES.reduce((n, e) => n + e.bankAccounts.length, 0);
      return {
        lead: `Group cash at the 31 October close, across ${ENTITIES.length} companies and ${accounts} bank accounts.`,
        figure: aed(t.cashOct, { compact: true, dp: 2 }),
        figureLabel: "31 Oct 2026 close",
        rows: rows.slice(0, 6).map((s) => ({
          label: s.entity.name,
          sub: `${s.entity.bankAccounts.length} account${s.entity.bankAccounts.length > 1 ? "s" : ""} · ${pct(s.cashOct / t.cashOct)} of group`,
          value: aed(s.cashOct, { compact: true, dp: 2 }),
        })),
        moreNote: `+ ${rows.length - 6} more companies holding ${aed(rows.slice(6).reduce((a, s) => a + s.cashOct, 0), { compact: true, dp: 2 })}`,
        chart: {
          title: "Cash by company · 31 Oct, AED",
          layout: "vertical",
          data: rows.map((s, i) => ({ name: shortName(s.entity.name), value: s.cashOct, highlight: i < 3 ? "emerald" : "ink" })),
        },
        footnote: `Today's balance is ${aed(t.cashToday, { compact: true, dp: 2 })} (${t.cashToday >= t.cashOct ? "+" : "−"}${compact(Math.abs(t.cashToday - t.cashOct), 0)} since close).`,
        steps: ["Reading 10 ledgers", "Matching 15 bank accounts", "Totalling at 31 Oct close"],
      };
    },
  },
  {
    id: "ar-90",
    question: "Who owes us more than 90 days?",
    short: "Debtors over 90 days",
    answer: () => {
      const debtors = debtorsOver90();
      const t = groupTotals();
      const byCo = summaries()
        .filter((s) => s.over90 > 0)
        .sort((a, b) => b.over90 - a.over90);
      return {
        lead: `${debtors.length} customers across ${byCo.length} companies owe more than 90 days. The largest five make up ${pct(debtors.slice(0, 5).reduce((a, d) => a + d.amount, 0) / t.over90, 0)} of it.`,
        figure: aed(t.over90, { compact: true, dp: 2 }),
        figureLabel: "Over 90 days, group total",
        rows: debtors.slice(0, 6).map((d) => ({
          label: d.name,
          sub: `${d.entityName} · ${d.daysOutstanding} days`,
          value: aed(d.amount, { compact: true, dp: 2 }),
          tone: d.amount >= 1_500_000 ? "amber" : undefined,
        })),
        moreNote: `+ ${debtors.length - 6} smaller balances totalling ${aed(debtors.slice(6).reduce((a, d) => a + d.amount, 0), { compact: true, dp: 2 })}`,
        chart: {
          title: "Over 90 days by company, AED",
          layout: "vertical",
          data: byCo.map((s) => ({ name: shortName(s.entity.name), value: s.over90, highlight: s.over90 >= 2_000_000 ? "amber" : "ink" })),
        },
        footnote: `Over-90 balances are ${pct(t.over90 / t.receivables)} of total receivables of ${aed(t.receivables, { compact: true, dp: 1 })}.`,
        steps: ["Reading 10 receivables ledgers", "Ageing 14 debtor balances", "Ranking by amount"],
      };
    },
  },
  {
    id: "maturities-4w",
    question: "Which facilities mature in the next 4 weeks?",
    short: "Maturities, next 4 weeks",
    answer: () => {
      const m = maturitiesWithin(4);
      const total = m.reduce((a, x) => a + x.amount, 0);
      const weeks = ladder().slice(0, 4);
      const flagged = weeks.filter((w) => w.flagged);
      return {
        lead: `${m.length} repayments fall due in the next four weeks across ${new Set(m.map((x) => x.facility.bank)).size} banks.${
          flagged.length ? ` Week of ${flagged.map((w) => w.label).join(", ")} exceeds forecast operating cash.` : ""
        }`,
        figure: aed(total, { compact: true, dp: 2 }),
        figureLabel: `Weeks of ${dateShort(weeks[0]?.weekStart ?? "")} to ${dateShort(weeks[3]?.weekStart ?? "")}`,
        rows: m.slice(0, 7).map((x) => ({
          label: `${x.entityName} · ${x.facility.type}`,
          sub: `${x.facility.bank} · week of ${dateShort(x.weekStart)}`,
          value: aed(x.amount, { compact: true, dp: 2 }),
          tone: weeks.find((w) => w.week === x.week)?.flagged ? "amber" : undefined,
        })),
        moreNote: m.length > 7 ? `+ ${m.length - 7} more` : undefined,
        chart: {
          title: "Maturities by week, AED",
          layout: "horizontal",
          data: weeks.map((w) => ({ name: w.label, value: w.maturities, highlight: w.flagged ? "amber" : "ink" })),
        },
        footnote: `Undrawn lines across the group: ${aed(groupTotals().undrawn, { compact: true, dp: 1 })} on ${FACILITIES.length} facilities.`,
        steps: ["Reading 13 facility schedules", "Building 13-week ladder", "Testing against cash forecast"],
      };
    },
  },
  {
    id: "audit",
    question: "Which companies need audited statements for corporate tax?",
    short: "Audit requirement",
    answer: () => {
      const rows = summaries()
        .slice()
        .sort((a, b) => b.entity.fy2025Revenue - a.entity.fy2025Revenue);
      const req = rows.filter((s) => s.auditRequired);
      return {
        lead: `${req.length} of ${rows.length} companies meet a trigger for audited financial statements: FY2025 revenue above AED 50m, or Qualifying Free Zone Person status.`,
        figure: `${req.length} of ${rows.length}`,
        figureLabel: "Companies requiring an audit",
        rows: req.map((s) => ({
          label: s.entity.name,
          sub: auditReasons(s.entity).join(" + "),
          value: aed(s.entity.fy2025Revenue, { compact: true, dp: 1 }),
        })),
        chart: {
          title: "FY2025 revenue vs AED 50m threshold",
          layout: "vertical",
          refLine: { value: 50_000_000, label: "AED 50m" },
          data: rows.map((s) => ({ name: shortName(s.entity.name), value: s.entity.fy2025Revenue, highlight: s.auditRequired ? "ink" : "muted" })),
        },
        footnote: "Corporate tax is filed entity by entity. This is a reading of the rules, not tax advice; confirm with your adviser.",
        steps: ["Reading FY2025 revenue", "Checking free-zone status", "Applying audit triggers"],
      };
    },
  },
];
