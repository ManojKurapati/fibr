import type { Movement, MovementKind } from "@/lib/types";
import { amount, dateShort } from "@/lib/format";

const KIND_STYLE: Record<MovementKind, string> = {
  "Sales invoice": "bg-ink text-canvas",
  Receipt: "bg-emerald-soft text-emerald-ink",
  "Purchase invoice": "bg-[#e3e6eb] text-[#2f3a4c]",
  Payment: "bg-[#ecebe6] text-ink-muted",
  "Web order": "bg-white text-ink ring-1 ring-inset ring-hairline-strong",
};

/** Money in shows as positive, money out as negative. */
const SIGN: Record<MovementKind, 1 | -1> = { "Sales invoice": 1, Receipt: 1, "Web order": 1, "Purchase invoice": -1, Payment: -1 };

export function MovementList({ items, showSource = true, overdue = false }: { items: Movement[]; showSource?: boolean; overdue?: boolean }) {
  return (
    <ul>
      {items.map((m) => (
        <li key={m.id} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-2.5 border-t border-hairline py-2 first:border-t-0">
          <span className={`rounded-full px-1.5 py-px text-[9px] font-semibold leading-4 ${KIND_STYLE[m.kind]}`}>{m.kind}</span>
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-medium">{m.counterparty}</span>
            <span className="num block truncate text-[9.5px] text-ink-faint">
              {m.ref} · {dateShort(m.date)}
              {m.time ? ` ${m.time}` : ""}
              {showSource ? ` · ${m.source}` : ""}
            </span>
          </span>
          <span className="text-right">
            <span className={`num block text-[11px] ${overdue ? "font-semibold" : ""}`}>
              {overdue ? "" : SIGN[m.kind] < 0 ? "−" : "+"}
              {amount(m.amount)}
            </span>
            {overdue && m.daysOutstanding ? <span className="num block text-[9.5px] text-amber-ink">{m.daysOutstanding} days</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
