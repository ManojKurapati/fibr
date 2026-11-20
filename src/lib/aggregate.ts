/**
 * Every derived number on the site comes from here, so tiles, drawers, charts and
 * Ask fibr answers always reconcile to the same ledger data.
 */
import {
  ENTITIES,
  EXCEPTION_FACTS,
  FACILITIES,
  LADDER_START_ISO,
  LADDER_WEEKS,
  TODAY_ISO,
  WEEKLY_NET_OPERATING,
} from "../data/mockGroup";
import type { EntityId } from "../data/names";
import type { Debtor, Entity, Facility, FacilityType, FinanceException } from "./types";
import { addDays, aed, daysBetween, dateShort, pct } from "./format";

const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);

export function getEntity(id: EntityId): Entity {
  const e = ENTITIES.find((x) => x.id === id);
  if (!e) throw new Error(`Unknown entity ${id}`);
  return e;
}

/* ---------- Entity-level ---------- */

export interface EntitySummary {
  entity: Entity;
  revenue: number;
  grossProfit: number;
  grossMargin: number;
  ebitda: number;
  netProfit: number;
  netMargin: number;
  cashToday: number;
  cashOct: number;
  receivablesTotal: number;
  over90: number;
  payables: number;
  vatNet: number;
  auditRequired: boolean;
  auditReasons: string[];
  facilityLimit: number;
  facilityUtilised: number;
  monthlyRevenue: number[];
  exceptionCount: number;
}

export function monthlyRevenue(e: Entity): number[] {
  const w = sum(e.seasonality);
  const months = e.seasonality.map((s) => Math.round((e.pnl.revenue * s) / w / 1000) * 1000);
  // Put the rounding remainder in the last month so months always sum to YTD revenue exactly.
  const last = months.length - 1;
  months[last] = (months[last] ?? 0) + (e.pnl.revenue - sum(months));
  return months;
}

export function over90Total(e: Entity): number {
  return sum(e.receivables.over90.map((d) => d.amount));
}

export function auditReasons(e: Entity): string[] {
  const r: string[] = [];
  if (e.fy2025Revenue > 50_000_000) r.push("Revenue above AED 50m");
  if (e.qfzp) r.push("Qualifying Free Zone Person");
  return r;
}

export function summarise(e: Entity): EntitySummary {
  const { revenue, cogs, opex, depreciation, financeCost } = e.pnl;
  const grossProfit = revenue - cogs;
  const ebitda = grossProfit - opex;
  const netProfit = ebitda - depreciation - financeCost;
  const facilities = FACILITIES.filter((f) => f.entityId === e.id);
  const over90 = over90Total(e);
  const reasons = auditReasons(e);
  return {
    entity: e,
    revenue,
    grossProfit,
    grossMargin: grossProfit / revenue,
    ebitda,
    netProfit,
    netMargin: netProfit / revenue,
    cashToday: sum(e.bankAccounts.map((a) => a.today)),
    cashOct: sum(e.bankAccounts.map((a) => a.octClose)),
    receivablesTotal: e.receivables.current + e.receivables.d31to60 + e.receivables.d61to90 + over90,
    over90,
    payables: e.payables,
    vatNet: e.vat.outputVat - e.vat.inputVat,
    auditRequired: reasons.length > 0,
    auditReasons: reasons,
    facilityLimit: sum(facilities.map((f) => f.limit)),
    facilityUtilised: sum(facilities.map((f) => f.utilised)),
    monthlyRevenue: monthlyRevenue(e),
    exceptionCount: exceptions().filter((x) => x.entityId === e.id).length,
  };
}

export const summaries = (): EntitySummary[] => ENTITIES.map(summarise);

/* ---------- Group-level ---------- */

export interface GroupTotals {
  revenue: number;
  grossProfit: number;
  ebitda: number;
  netProfit: number;
  cashToday: number;
  cashOct: number;
  receivables: number;
  over90: number;
  payables: number;
  facilityLimit: number;
  facilityUtilised: number;
  undrawn: number;
}

export function groupTotals(): GroupTotals {
  const s = summaries();
  const t = (k: keyof EntitySummary) => sum(s.map((x) => x[k] as number));
  const facilityLimit = sum(FACILITIES.map((f) => f.limit));
  const facilityUtilised = sum(FACILITIES.map((f) => f.utilised));
  return {
    revenue: t("revenue"),
    grossProfit: t("grossProfit"),
    ebitda: t("ebitda"),
    netProfit: t("netProfit"),
    cashToday: t("cashToday"),
    cashOct: t("cashOct"),
    receivables: t("receivablesTotal"),
    over90: t("over90"),
    payables: t("payables"),
    facilityLimit,
    facilityUtilised,
    undrawn: facilityLimit - facilityUtilised,
  };
}

export interface GroupDebtor extends Debtor {
  entityId: EntityId;
  entityName: string;
}

export function debtorsOver90(): GroupDebtor[] {
  return ENTITIES.flatMap((e) =>
    e.receivables.over90.map((d) => ({ ...d, entityId: e.id, entityName: e.name })),
  ).sort((a, b) => b.amount - a.amount);
}

/* ---------- 13-week maturity ladder ---------- */

export const FACILITY_TYPES: FacilityType[] = ["Trust receipts", "Letters of credit", "Revolving", "Term loan"];

export interface LadderWeek {
  week: number;
  weekStart: string;
  label: string;
  byType: Record<FacilityType, number>;
  maturities: number;
  netOperating: number;
  /** Projected group cash at week end, after operating flows and maturities. */
  projectedCash: number;
  /** Maturities exceed the week's operating cash generation — funded from balances or redraw. */
  flagged: boolean;
}

export function ladder(): LadderWeek[] {
  let cash = sum(ENTITIES.flatMap((e) => e.bankAccounts.map((a) => a.today)));
  return Array.from({ length: LADDER_WEEKS }, (_, i) => {
    const week = i + 1;
    const weekStart = addDays(LADDER_START_ISO, i * 7);
    const byType = { "Trust receipts": 0, "Letters of credit": 0, Revolving: 0, "Term loan": 0, Overdraft: 0 } as Record<FacilityType, number>;
    for (const f of FACILITIES) {
      for (const m of f.maturities) if (m.week === week) byType[f.type] += m.amount;
    }
    const maturities = sum(Object.values(byType));
    const netOperating = WEEKLY_NET_OPERATING[i] ?? 0;
    cash = cash + netOperating - maturities;
    return {
      week,
      weekStart,
      label: dateShort(weekStart),
      byType,
      maturities,
      netOperating,
      projectedCash: cash,
      flagged: maturities > netOperating,
    };
  });
}

export interface UpcomingMaturity {
  facility: Facility;
  entityName: string;
  week: number;
  weekStart: string;
  amount: number;
}

export function maturitiesWithin(weeks: number): UpcomingMaturity[] {
  return FACILITIES.flatMap((f) =>
    f.maturities
      .filter((m) => m.week <= weeks)
      .map((m) => ({
        facility: f,
        entityName: getEntity(f.entityId).name,
        week: m.week,
        weekStart: addDays(LADDER_START_ISO, (m.week - 1) * 7),
        amount: m.amount,
      })),
  ).sort((a, b) => a.week - b.week || b.amount - a.amount);
}

/* ---------- Exceptions (derived from the data, never typed by hand) ---------- */

let exceptionCache: FinanceException[] | null = null;

export function exceptions(): FinanceException[] {
  if (exceptionCache) return exceptionCache;
  const out: FinanceException[] = [];
  const f = EXCEPTION_FACTS;

  out.push({
    id: "x-recon",
    entityId: "contB",
    kind: "reconciliation",
    title: `Bank ••${f.contBUnreconciled.last4} not reconciled for ${f.contBUnreconciled.days} days`,
    detail: `${f.contBUnreconciled.lines} unmatched lines, ${aed(f.contBUnreconciled.amount)}. Last reconciled ${f.contBUnreconciled.lastReconciled}.`,
  });

  for (const d of debtorsOver90().filter((x) => x.amount >= f.singleDebtorThreshold)) {
    out.push({
      id: `x-ar-${d.entityId}-${d.daysOutstanding}`,
      entityId: d.entityId,
      kind: "receivable",
      title: `${d.name}: ${d.daysOutstanding} days`,
      detail: `${aed(d.amount, { compact: true, dp: 2 })} outstanding, above the ${aed(f.singleDebtorThreshold, { compact: true })} single-debtor threshold.`,
    });
  }

  const vatDue = ENTITIES.filter((e) => {
    const days = daysBetween(TODAY_ISO, e.vat.due);
    return days >= 0 && days <= 10;
  });
  const firstVat = vatDue[0];
  if (firstVat) {
    const net = sum(vatDue.map((e) => e.vat.outputVat - e.vat.inputVat));
    out.push({
      id: "x-vat",
      entityId: null,
      kind: "vat",
      title: `${vatDue.length} VAT returns due ${dateShort(firstVat.vat.due)}`,
      detail: `${firstVat.vat.period}: group net payable ${aed(net)} across ${vatDue.length} companies.`,
    });
  }

  for (const w of ladder().filter((x) => x.flagged)) {
    out.push({
      id: `x-ladder-${w.week}`,
      entityId: null,
      kind: "facility",
      title: `Week of ${w.label}: ${aed(w.maturities, { compact: true })} maturing`,
      detail: `Maturities exceed forecast operating cash of ${aed(w.netOperating, { compact: true })} that week.`,
    });
  }

  out.push({
    id: "x-margin-mfgB",
    entityId: "mfgB",
    kind: "margin",
    title: `October gross margin ${pct(f.mfgBOctGrossMargin)}`,
    detail: `Resin input costs up; year-to-date gross margin ${pct(summariseLite("mfgB").grossMargin)}.`,
  });

  for (const fac of FACILITIES) {
    const u = fac.utilised / fac.limit;
    if (fac.type === "Overdraft" && u >= 0.85) {
      out.push({
        id: `x-util-${fac.id}`,
        entityId: fac.entityId,
        kind: "utilisation",
        title: `Overdraft ${pct(u, 0)} utilised`,
        detail: `${fac.bank}: ${aed(fac.utilised, { compact: true, dp: 2 })} of ${aed(fac.limit, { compact: true })}.`,
      });
    }
  }

  exceptionCache = out;
  return out;
}

/** Margin-only summary used inside exceptions() to avoid recursion through summarise(). */
function summariseLite(id: EntityId): { grossMargin: number } {
  const e = getEntity(id);
  return { grossMargin: (e.pnl.revenue - e.pnl.cogs) / e.pnl.revenue };
}
