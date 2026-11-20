import { test } from "node:test";
import assert from "node:assert/strict";
import { ENTITIES, FACILITIES } from "../src/data/mockGroup";
import { groupTotals, ladder, monthlyRevenue, summaries, exceptions, debtorsOver90, maturitiesWithin } from "../src/lib/aggregate";

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

test("ten operating companies across five sectors", () => {
  assert.equal(ENTITIES.length, 10);
  assert.equal(new Set(ENTITIES.map((e) => e.sector)).size, 5);
});

test("monthly revenue sums exactly to YTD revenue", () => {
  for (const e of ENTITIES) assert.equal(sum(monthlyRevenue(e)), e.pnl.revenue, e.id);
});

test("group totals reconcile to entity sums", () => {
  const g = groupTotals();
  const s = summaries();
  assert.equal(g.cashOct, sum(s.map((x) => x.cashOct)));
  assert.equal(g.cashOct, 83_300_000);
  assert.equal(g.over90, sum(debtorsOver90().map((d) => d.amount)));
  assert.equal(g.netProfit, g.ebitda - sum(ENTITIES.map((e) => e.pnl.depreciation + e.pnl.financeCost)));
});

test("revolving facilities fully mature inside the ladder; term loans never exceed utilisation", () => {
  for (const f of FACILITIES) {
    const m = sum(f.maturities.map((x) => x.amount));
    if (["Trust receipts", "Letters of credit", "Revolving"].includes(f.type)) assert.equal(m, f.utilised, f.id);
    assert.ok(m <= f.utilised, f.id);
    assert.ok(f.utilised <= f.limit, f.id);
  }
});

test("ladder maturities equal facility maturities and two weeks are flagged", () => {
  const l = ladder();
  assert.equal(l.length, 13);
  assert.equal(sum(l.map((w) => w.maturities)), sum(FACILITIES.flatMap((f) => f.maturities.map((m) => m.amount))));
  assert.deepEqual(l.filter((w) => w.flagged).map((w) => w.week), [3, 6]);
  assert.ok(l.every((w) => w.projectedCash > 0));
});

test("exceptions and upcoming maturities derive from data", () => {
  assert.ok(exceptions().length >= 6);
  assert.ok(maturitiesWithin(4).every((m) => m.week <= 4));
});

import { consolidated } from "../src/lib/aggregate";
test("consolidation: sectors + eliminations = group; eliminations have no profit effect", () => {
  const c = consolidated();
  const g = groupTotals();
  assert.equal(c.columns.reduce((a, x) => a + x.revenue, 0), g.revenue);
  assert.equal(c.group.revenue, g.revenue - c.intercompanyTotal);
  assert.equal(c.eliminations.netProfit, 0);
  assert.equal(c.group.netProfit, g.netProfit);
});

import { captureCounts, groupCapture, overdueInvoices, latestMovements } from "../src/lib/movements";
test("pipeline: overdue invoices sum to each debtor balance; capture counts add up", () => {
  for (const e of ENTITIES) {
    e.receivables.over90.forEach((d, i) => {
      const inv = overdueInvoices(e.id, d, i);
      assert.equal(inv.reduce((a, x) => a + x.amount, 0), d.amount, `${e.id} ${d.name}`);
      assert.ok(inv.every((x) => x.amount > 0 && (x.daysOutstanding ?? 0) >= 90));
    });
    assert.ok(latestMovements(e.id).length >= 7);
  }
  const g = groupCapture();
  assert.equal(g.total, ENTITIES.reduce((a, e) => a + captureCounts(e).total, 0));
});
