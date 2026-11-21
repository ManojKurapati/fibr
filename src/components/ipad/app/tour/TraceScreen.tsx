"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { debtorsOver90, groupTotals, summaries } from "@/lib/aggregate";
import { LAST_PULLED } from "@/data/mockGroup";
import { amount, compact, dateShort } from "@/lib/format";
import { overdueInvoices } from "@/lib/movements";
import { ViewHeader } from "../GroupView";
import { MovementList } from "../MovementList";

const t = groupTotals();
const companies = summaries()
  .filter((s) => s.over90 > 0)
  .sort((a, b) => b.over90 - a.over90);
const debtors = debtorsOver90();

/** Group total → company → customer → the invoices behind it. Every level is clickable. */
export function TraceScreen() {
  const [co, setCo] = useState(companies[0]?.entity.id);
  const coDebtors = debtors.filter((d) => d.entityId === co);
  const [dn, setDn] = useState(0);
  const d = coDebtors[dn] ?? coDebtors[0];
  const idx = d ? (companies.find((c) => c.entity.id === co)?.entity.receivables.over90.findIndex((x) => x.name === d.name) ?? 0) : 0;
  const invoices = d && co ? overdueInvoices(co, d, idx) : [];
  const coName = companies.find((c) => c.entity.id === co)?.entity.name ?? "";

  return (
    <div className="h-full overflow-y-auto px-4 pb-5 pt-1 @min-[54rem]:px-5">
      <ViewHeader title="Trace to source" subtitle="Receivables over 90 days, from group total to invoice" />

      <nav aria-label="Trace path" className="mb-3 flex flex-wrap items-center gap-1 text-[12px]">
        <span className="rounded-full bg-ink px-2.5 py-1 font-extrabold text-canvas">
          Group <span className="num">{compact(t.over90, 2)}</span>
        </span>
        <ChevronRight className="size-3 text-ink-faint" aria-hidden />
        <span className="rounded-full border border-hairline bg-paper-3 px-2.5 py-1 font-extrabold">{coName}</span>
        {d ? (
          <>
            <ChevronRight className="size-3 text-ink-faint" aria-hidden />
            <span className="rounded-full border border-hairline bg-paper-3 px-2.5 py-1 font-extrabold">{d.name}</span>
            <ChevronRight className="size-3 text-ink-faint" aria-hidden />
            <span className="rounded-full border border-dashed border-hairline-strong px-2.5 py-1 text-ink-muted">
              <span className="num">{invoices.length}</span> invoices
            </span>
          </>
        ) : null}
      </nav>

      <div className="grid grid-cols-1 gap-2.5 @min-[54rem]:grid-cols-3">
        <div className="rounded-none border border-hairline bg-paper-3 p-3">
          <p className="text-[11px] font-extrabold text-ink-faint">1. Company</p>
          <ul className="mt-1.5">
            {companies.map((c) => (
              <li key={c.entity.id}>
                <button
                  type="button"
                  onClick={() => {
                    setCo(c.entity.id);
                    setDn(0);
                  }}
                  aria-pressed={co === c.entity.id}
                  className={`flex w-full items-baseline justify-between gap-2 rounded-none px-2 py-1.5 text-left text-[12px] ${co === c.entity.id ? "bg-ink text-canvas" : "hover:bg-paper-2"}`}
                >
                  <span className="truncate">{c.entity.name}</span>
                  <span className="num shrink-0">{compact(c.over90, 2)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-none border border-hairline bg-paper-3 p-3">
          <p className="text-[11px] font-extrabold text-ink-faint">2. Customer</p>
          <ul className="mt-1.5">
            {coDebtors.map((x, i) => (
              <li key={x.name}>
                <button
                  type="button"
                  onClick={() => setDn(i)}
                  aria-pressed={dn === i}
                  className={`w-full rounded-none px-2 py-1.5 text-left text-[12px] ${dn === i ? "bg-ink text-canvas" : "hover:bg-paper-2"}`}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate">{x.name}</span>
                    <span className="num shrink-0">{compact(x.amount, 2)}</span>
                  </span>
                  <span className={`num block text-[11px] ${dn === i ? "text-ink-inverse-muted" : "text-ink-faint"}`}>oldest {x.daysOutstanding}+ days</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-none border border-hairline bg-paper-3 p-3">
          <p className="text-[11px] font-extrabold text-ink-faint">3. Invoices</p>
          <div className="mt-1.5">
            <MovementList items={invoices} overdue />
          </div>
          <p className="num mt-1 flex justify-between border-t border-ink/70 pt-1.5 text-[12px] font-extrabold">
            <span className="font-sans">Total</span>
            <span>{d ? compact(d.amount, 2) : ""}</span>
          </p>
        </div>
      </div>
      {invoices[0] && d ? (
        <div className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-2 rounded-none border border-hairline bg-paper-3 p-3 text-[11px] @min-[54rem]:grid-cols-[auto_1fr_1fr_1fr_1fr]">
          <p className="text-[11px] font-extrabold text-ink-faint @min-[54rem]:row-span-2 @min-[54rem]:self-center">
            4. Source
            <br />
            document
          </p>
          {[
            ["Reference", invoices[0].ref],
            ["Issued", dateShort(invoices[0].date, true)],
            ["Captured from", `${invoices[0].source}, ${coName}`],
            ["Amount", `AED ${amount(invoices[0].amount)}`],
            ["Customer", d.name],
            ["Outstanding", `${invoices[0].daysOutstanding ?? 0} days`],
            ["Last pulled", LAST_PULLED],
            ["Access", "Read-only"],
          ].map(([k, v]) => (
            <p key={k}>
              <span className="block text-ink-faint">{k}</span>
              <span className={`${k === "Customer" || k === "Access" ? "" : "num"} font-medium text-ink`}>{v}</span>
            </p>
          ))}
        </div>
      ) : null}
      <p className="mt-2 text-[11px] text-ink-faint">Each invoice shows its reference and the source it was captured from. Totals at every level add up exactly.</p>
    </div>
  );
}
