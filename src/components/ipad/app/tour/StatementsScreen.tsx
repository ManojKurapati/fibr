import { INTERCOMPANY } from "@/data/mockGroup";
import { consolidated, getEntity, type StatementColumn } from "@/lib/aggregate";
import { compact } from "@/lib/format";
import { ViewHeader } from "../GroupView";

const c = consolidated();
const cols: StatementColumn[] = [...c.columns, c.eliminations, c.group];
const maxNp = Math.max(...c.columns.map((x) => x.netProfit));
const LINES: { key: keyof StatementColumn; label: string; strong?: boolean; negate?: boolean }[] = [
  { key: "revenue", label: "Revenue" },
  { key: "cogs", label: "Cost of sales", negate: true },
  { key: "grossProfit", label: "Gross profit", strong: true },
  { key: "opex", label: "Operating expenses", negate: true },
  { key: "ebitda", label: "EBITDA", strong: true },
  { key: "depreciation", label: "Depreciation", negate: true },
  { key: "financeCost", label: "Finance cost", negate: true },
  { key: "netProfit", label: "Net profit", strong: true },
];

export function StatementsScreen() {
  return (
    <div className="h-full overflow-y-auto px-4 pb-5 pt-1 @min-[54rem]:px-5">
      <ViewHeader title="Group income statement" subtitle="Jan–Oct 2026 · AED m · by sector, intercompany eliminated" />
      <div className="overflow-x-auto rounded-[14px] border border-hairline bg-white">
        <table className="w-full min-w-[640px] border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-hairline bg-[#fbfaf8] text-[9.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
              <th scope="col" className="px-3 py-2 text-left font-semibold">
                AED m
              </th>
              {cols.map((col) => (
                <th key={col.key} scope="col" className={`px-2.5 py-2 text-right font-semibold ${col.key === "group" ? "bg-ink text-canvas" : col.key === "elim" ? "text-amber-ink" : ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LINES.map((l) => (
              <tr key={l.key} className={l.strong ? "border-y border-ink/70" : "border-b border-hairline"}>
                <th scope="row" className={`px-3 py-[7px] text-left ${l.strong ? "font-semibold" : "font-normal text-ink-muted"}`}>
                  {l.label}
                </th>
                {cols.map((col) => {
                  const raw = col[l.key] as number;
                  const v = l.negate ? -raw : raw;
                  return (
                    <td
                      key={col.key}
                      className={`num px-2.5 py-[7px] text-right ${l.strong ? "font-semibold" : ""} ${col.key === "group" ? "bg-[#f4f3ef]" : ""} ${v < 0 && !l.negate ? "text-amber-ink" : ""}`}
                    >
                      {raw === 0 ? "–" : compact(v, 1).replace("m", "")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2.5 grid gap-2.5 @min-[54rem]:grid-cols-2">
        <div className="rounded-[14px] border border-hairline bg-white p-3">
          <p className="text-[11.5px] font-semibold">Net profit by sector</p>
          <ul className="mt-2.5 space-y-2">
            {c.columns.map((col) => (
              <li key={col.key} className="grid grid-cols-[6.5rem_1fr_3.25rem] items-center gap-3 text-[10.5px]">
                <span className="text-ink-muted">{col.label}</span>
                <span className="h-2 rounded-full bg-[#ecebe6]">
                  <span className="block h-full rounded-full bg-ink" style={{ width: `${(col.netProfit / maxNp) * 100}%` }} />
                </span>
                <span className="num text-right">{compact(col.netProfit, 1)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[14px] border border-hairline bg-white p-3">
          <p className="flex items-baseline justify-between text-[11.5px] font-semibold">
            Intercompany eliminated
            <span className="num text-[10.5px] font-normal text-amber-ink">{compact(-c.intercompanyTotal, 1)}</span>
          </p>
          <ul className="mt-1.5">
            {INTERCOMPANY.map((x) => (
              <li key={`${x.from}-${x.to}`} className="flex items-baseline justify-between gap-2 border-t border-hairline py-[5px] text-[10.5px] first:border-t-0">
                <span className="truncate text-ink-muted">
                  <span className="text-ink">{getEntity(x.from).name}</span> → {getEntity(x.to).name} · {x.what}
                </span>
                <span className="num shrink-0">{compact(x.amount, 1)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-ink-faint">Eliminations have no effect on group profit: the seller&apos;s revenue and the buyer&apos;s cost cancel out.</p>
    </div>
  );
}
