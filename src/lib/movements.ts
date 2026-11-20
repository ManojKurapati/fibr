/**
 * The movements pipeline: how many transactions, invoices and receipts are captured from each
 * source, and a deterministic sample of the latest movements per company. Overdue invoices are
 * split so they always sum exactly to each debtor's over-90 balance.
 */
import { ENTITIES, TODAY_ISO } from "../data/mockGroup";
import type { EntityId } from "../data/names";
import { getEntity } from "./aggregate";
import { addDays } from "./format";
import type { Debtor, Entity, LedgerSource, Movement, MovementKind } from "./types";

export interface CaptureCounts {
  salesInvoices: number;
  receipts: number;
  purchaseInvoices: number;
  payments: number;
  webOrders: number;
  total: number;
}

export function captureCounts(e: Entity): CaptureCounts {
  const web = e.docs.webShare ?? 0;
  const salesInvoices = Math.round((e.pnl.revenue * (1 - web)) / e.docs.avgSale);
  const webOrders = web && e.docs.avgWebOrder ? Math.round((e.pnl.revenue * web) / e.docs.avgWebOrder) : 0;
  const receipts = Math.round(salesInvoices * 0.94);
  const purchaseInvoices = Math.round((e.pnl.cogs + e.pnl.opex * 0.6) / e.docs.avgPurchase);
  const payments = Math.round(purchaseInvoices * 0.97);
  return { salesInvoices, receipts, purchaseInvoices, payments, webOrders, total: salesInvoices + receipts + purchaseInvoices + payments + webOrders };
}

export function groupCapture(): CaptureCounts {
  const all = ENTITIES.map(captureCounts);
  const s = (k: keyof CaptureCounts) => all.reduce((a, c) => a + c[k], 0);
  return { salesInvoices: s("salesInvoices"), receipts: s("receipts"), purchaseInvoices: s("purchaseInvoices"), payments: s("payments"), webOrders: s("webOrders"), total: s("total") };
}

/** Movements captured per source system, across the group. */
export function captureBySource(): { source: LedgerSource; companies: number; movements: number }[] {
  const map = new Map<LedgerSource, { companies: number; movements: number }>();
  for (const e of ENTITIES) {
    const c = captureCounts(e);
    for (const l of e.ledgers) {
      const cur = map.get(l) ?? { companies: 0, movements: 0 };
      cur.companies += 1;
      cur.movements += l === "Shopify" ? c.webOrders : c.total - c.webOrders;
      map.set(l, cur);
    }
  }
  return [...map.entries()].map(([source, v]) => ({ source, ...v }));
}

const PREFIX: Record<EntityId, string> = { tradA: "TA", tradB: "TB", mfgA: "MA", mfgB: "MB", distA: "DA", distB: "DB", contA: "CA", contB: "CB", propA: "PA", propB: "PB" };
const CUSTOMERS: Record<Entity["sector"], string[]> = {
  Trading: ["Contractor · Al Quoz", "Builder's merchant · Sharjah", "Developer · Dubai South"],
  Manufacturing: ["Main contractor · Business Bay", "Distributor · Ajman", "FMCG brand owner · Sharjah"],
  Distribution: ["Retail chain · Dubai", "Pharmacy group · Abu Dhabi", "Convenience chain · RAK"],
  Contracting: ["Developer · JVC", "Hotel owner · Palm", "Main contractor · Dubai Hills"],
  Property: ["Logistics tenant · Unit 9", "Tenant · Al Reem tower", "Retail tenant · Unit 3"],
};
const SUPPLIERS: Record<Entity["sector"], string[]> = {
  Trading: ["Cement supplier · Fujairah", "Steel mill · Jebel Ali"],
  Manufacturing: ["Steel coil supplier", "Resin importer · Jebel Ali"],
  Distribution: ["Brand principal · regional", "Logistics provider · DIC"],
  Contracting: ["MEP subcontractor · Dubai", "Cable supplier · Sharjah"],
  Property: ["Facilities management", "Maintenance contractor · Dubai"],
};

/** Splits an overdue debtor balance into 2–3 invoices that sum exactly to it. */
export function overdueInvoices(entityId: EntityId, d: Debtor, n: number): Movement[] {
  const e = getEntity(entityId);
  const parts = d.amount >= 1_000_000 ? [0.46, 0.33] : [0.6];
  const amounts = parts.map((p) => Math.round((d.amount * p) / 100) * 100);
  amounts.push(d.amount - amounts.reduce((a, b) => a + b, 0));
  return amounts.map((amount, i) => {
    const days = d.daysOutstanding + (amounts.length - 1 - i) * 14;
    return {
      id: `${entityId}-od-${n}-${i}`,
      entityId,
      kind: "Sales invoice" as const,
      ref: `INV-${PREFIX[entityId]}-${String(4100 + n * 37 + i * 3).padStart(5, "0")}`,
      date: addDays(TODAY_ISO, -days),
      counterparty: d.name,
      amount,
      source: e.ledgers[0] ?? "Tally",
      daysOutstanding: days,
    };
  });
}

const PATTERN: { kind: MovementKind; mult: number; day: number; time: string }[] = [
  { kind: "Receipt", mult: 1.4, day: 0, time: "06:52" },
  { kind: "Sales invoice", mult: 0.9, day: 0, time: "06:31" },
  { kind: "Payment", mult: 1.1, day: -1, time: "17:48" },
  { kind: "Sales invoice", mult: 1.7, day: -1, time: "15:12" },
  { kind: "Purchase invoice", mult: 0.8, day: -1, time: "11:05" },
  { kind: "Receipt", mult: 0.6, day: -2, time: "16:20" },
  { kind: "Purchase invoice", mult: 1.3, day: -2, time: "09:44" },
];

/** Latest movements captured for a company (most recent first). */
export function latestMovements(entityId: EntityId): Movement[] {
  const e = getEntity(entityId);
  const ledger = e.ledgers[0] ?? "Tally";
  const cust = CUSTOMERS[e.sector];
  const sup = SUPPLIERS[e.sector];
  const out: Movement[] = PATTERN.map((p, i) => {
    const sale = p.kind === "Sales invoice" || p.kind === "Receipt";
    const base = sale ? e.docs.avgSale : e.docs.avgPurchase;
    const prefix = p.kind === "Sales invoice" ? "INV" : p.kind === "Receipt" ? "RCT" : p.kind === "Purchase invoice" ? "PINV" : "PAY";
    return {
      id: `${entityId}-m-${i}`,
      entityId,
      kind: p.kind,
      ref: `${prefix}-${PREFIX[entityId]}-${String(8800 + i * 7 + PREFIX[entityId].charCodeAt(0)).padStart(5, "0")}`,
      date: addDays(TODAY_ISO, p.day),
      time: p.time,
      counterparty: (sale ? cust : sup)[i % (sale ? cust.length : sup.length)] ?? "",
      amount: Math.round((base * p.mult) / 10) * 10,
      source: ledger,
    };
  });
  if (e.ledgers.includes("Shopify")) {
    out.splice(1, 0, { id: `${entityId}-w-0`, entityId, kind: "Web order", ref: "#SH-20841", date: TODAY_ISO, time: "06:40", counterparty: "Web store customer", amount: 1_260, source: "Shopify" });
    out.splice(3, 0, { id: `${entityId}-w-1`, entityId, kind: "Web order", ref: "#SH-20836", date: TODAY_ISO, time: "05:58", counterparty: "Web store customer", amount: 385, source: "Shopify" });
  }
  return out;
}
