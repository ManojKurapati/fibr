import { AlertTriangle, Banknote, CalendarClock, FileWarning, Landmark, TrendingDown } from "lucide-react";
import { exceptions, getEntity } from "@/lib/aggregate";
import type { ExceptionKind } from "@/lib/types";
import { ViewHeader } from "../GroupView";

const ICON: Record<ExceptionKind, typeof AlertTriangle> = {
  reconciliation: FileWarning,
  receivable: Banknote,
  vat: CalendarClock,
  facility: Landmark,
  margin: TrendingDown,
  utilisation: Landmark,
};
const LABEL: Record<ExceptionKind, string> = {
  reconciliation: "Reconciliation",
  receivable: "Receivables",
  vat: "VAT",
  facility: "Facilities",
  margin: "Margin",
  utilisation: "Facilities",
};

export function ExceptionsScreen() {
  const xs = exceptions();
  return (
    <div className="h-full overflow-y-auto px-4 pb-5 pt-1 @min-[54rem]:px-5">
      <ViewHeader title="Exceptions" subtitle={`${xs.length} items raised from the ledgers this morning`} />
      <ul className="grid gap-2 @min-[54rem]:grid-cols-2">
        {xs.map((x) => {
          const Icon = ICON[x.kind];
          return (
            <li key={x.id} className="flex gap-3 rounded-[14px] border border-hairline bg-white p-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-amber-soft text-amber-ink" aria-hidden>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  {LABEL[x.kind]} · {x.entityId ? getEntity(x.entityId).name : "Group"}
                </p>
                <p className="mt-0.5 text-[12px] font-semibold leading-snug">{x.title}</p>
                <p className="mt-0.5 text-[10.5px] leading-snug text-ink-muted">{x.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
