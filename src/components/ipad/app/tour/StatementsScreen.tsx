import { consolidated, type StatementColumn } from "@/lib/aggregate";
import { compact } from "@/lib/format";
import { ViewHeader } from "../GroupView";

const c = consolidated();
const cols: StatementColumn[] = [...c.columns, c.eliminations, c.group];
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
      <p className="mt-2 text-[10px] text-ink-faint">
        Eliminations remove <span className="num">AED {compact(c.intercompanyTotal, 1)}</span> of intercompany rent, materials and packaging. No effect on group profit.
      </p>
    </div>
  );
}
