import { summaries } from "@/lib/aggregate";
import { compact, pct } from "@/lib/format";
import { ViewHeader } from "../GroupView";

const rows = summaries();
const COLS = ["Company", "Ledger", "Revenue YTD", "Gross margin", "EBITDA", "Cash today", "Over 90 days"];

export function SummaryScreen() {
  return (
    <div className="h-full overflow-y-auto px-4 pb-5 pt-1 @min-[54rem]:px-5">
      <ViewHeader title="Company summary" subtitle="One template, one definition of every number, every company" />
      <div className="overflow-x-auto clay-sm">
        <table className="w-full min-w-[620px] border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-hairline bg-paper text-left text-[11px] font-extrabold text-ink-faint">
              {COLS.map((c, i) => (
                <th key={c} scope="col" className={`px-3 py-2 font-extrabold ${i > 1 ? "text-right" : ""}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.entity.id} className="border-b border-hairline last:border-b-0">
                <th scope="row" className="px-3 py-[7px] text-left font-extrabold">
                  {s.entity.name}
                  <span className="block text-[11px] font-normal text-ink-faint">{s.entity.sector}</span>
                </th>
                <td className="px-3 py-[7px]">
                  <span className="rounded-full bg-paper-2 px-1.5 py-0.5 text-[11px] font-extrabold text-ink-muted">{s.entity.ledgers.join(" + ")}</span>
                </td>
                <td className="num px-3 py-[7px] text-right">{compact(s.revenue, 1)}</td>
                <td className="num px-3 py-[7px] text-right">{pct(s.grossMargin)}</td>
                <td className="num px-3 py-[7px] text-right">{compact(s.ebitda, 2)}</td>
                <td className="num px-3 py-[7px] text-right">{compact(s.cashToday, 2)}</td>
                <td className={`num px-3 py-[7px] text-right ${s.over90 >= 1_500_000 ? "font-extrabold text-amber-ink" : ""}`}>{compact(s.over90, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">All figures AED. Revenue and EBITDA Jan to Oct 2026.</p>
    </div>
  );
}
