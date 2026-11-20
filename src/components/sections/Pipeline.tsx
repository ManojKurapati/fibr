import { ArrowDown, ArrowRight, Check, ChevronRight } from "lucide-react";
import { PIPELINE_STAGES } from "@/data/content";
import { ENTITIES, LAST_PULLED, PNL_PERIOD } from "@/data/mockGroup";
import { debtorsOver90, exceptions, groupTotals } from "@/lib/aggregate";
import { amount, compact } from "@/lib/format";
import { captureBySource, groupCapture, overdueInvoices } from "@/lib/movements";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

const bySource = captureBySource().sort((a, b) => b.movements - a.movements);
const cap = groupCapture();
const t = groupTotals();
const xs = exceptions();
const topDebtor = debtorsOver90()[0];
const topInvoice = topDebtor ? overdueInvoices(topDebtor.entityId, topDebtor, 0)[0] : undefined;

function Stage({ i, children }: { i: number; children: React.ReactNode }) {
  const s = PIPELINE_STAGES[i]!;
  return (
    <li className="relative flex flex-col rounded-[20px] border border-hairline bg-surface p-5 sm:p-6">
      <p className="flex items-baseline gap-2.5">
        <span className="num text-[0.75rem] text-ink-faint">{s.n}</span>
        <span className="font-display text-[1.875rem] leading-none tracking-[-0.025em]">{s.title}</span>
      </p>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">{s.body}</p>
      <div className="mt-6 flex-1">{children}</div>
      {i < 3 ? (
        <>
          <span aria-hidden className="absolute -right-[19px] top-1/2 z-10 hidden size-[26px] -translate-y-1/2 place-items-center rounded-full border border-hairline bg-canvas text-ink-muted lg:grid">
            <ArrowRight className="size-3.5" />
          </span>
          <span aria-hidden className="absolute -bottom-[19px] left-1/2 z-10 grid size-[26px] -translate-x-1/2 place-items-center rounded-full border border-hairline bg-canvas text-ink-muted lg:hidden">
            <ArrowDown className="size-3.5" />
          </span>
        </>
      ) : null}
    </li>
  );
}

export function Pipeline() {
  const rows = [
    { label: "Sales invoices", v: cap.salesInvoices },
    { label: "Receipts", v: cap.receipts },
    { label: "Purchase invoices", v: cap.purchaseInvoices },
    { label: "Payments", v: cap.payments },
    { label: "Web orders", v: cap.webOrders },
  ];
  return (
    <section id="pipeline" className="border-t border-hairline bg-[#f2f0eb] py-24 sm:py-28 lg:py-36">
      <Container>
        <SectionHeading
          align="split"
          eyebrow="The pipeline"
          title={
            <>
              Every movement,
              <br />
              <em className="italic">captured.</em>
            </>
          }
          lede="fibr connects to each company's sources read-only and carries every transaction, invoice and receipt through one pipeline into one view of the group."
        />

        <ol className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-4 lg:gap-4">
          <Stage i={0}>
            <ul className="divide-y divide-hairline border-y border-hairline">
              {bySource.map((s) => (
                <li key={s.source} className="flex items-baseline justify-between gap-3 py-2.5 text-[0.8125rem]">
                  <span>
                    <span className="font-semibold">{s.source}</span>
                    <span className="block text-[0.75rem] text-ink-faint">
                      <span className="num">{s.companies}</span> {s.companies === 1 ? "company" : "companies"}
                    </span>
                  </span>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-emerald-ink">Read-only</span>
                </li>
              ))}
            </ul>
          </Stage>

          <Stage i={1}>
            <p className="text-[0.75rem] text-ink-muted">Movements captured · {PNL_PERIOD}</p>
            <p className="num mt-1 text-[2.5rem] font-semibold leading-none tracking-[-0.045em]">{amount(cap.total)}</p>
            <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
              {rows.map((r) => (
                <li key={r.label} className="flex items-baseline justify-between gap-3 py-2 text-[0.8125rem]">
                  <span className="text-ink-muted">{r.label}</span>
                  <span className="num">{amount(r.v)}</span>
                </li>
              ))}
            </ul>
          </Stage>

          <Stage i={2}>
            <ul className="space-y-3 text-[0.8125rem]">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-soft text-emerald-ink" aria-hidden>
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span>
                  <span className="num font-semibold">
                    {ENTITIES.length} of {ENTITIES.length}
                  </span>{" "}
                  companies tied to their last signed accounts
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-amber-soft text-[0.6875rem] font-bold text-amber-ink" aria-hidden>
                  !
                </span>
                <span>
                  <span className="num font-semibold">{xs.length}</span> exceptions raised for attention
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#ecebe6] text-ink-muted" aria-hidden>
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span>
                  Last pulled: <span className="num font-semibold">{LAST_PULLED}</span>
                </span>
              </li>
            </ul>
          </Stage>

          <Stage i={3}>
            <p className="text-[0.75rem] text-ink-muted">Trace any number to source</p>
            <ol className="mt-3 space-y-1.5 text-[0.8125rem]">
              <li className="flex items-baseline justify-between gap-2 rounded-[10px] bg-ink px-3 py-2 text-canvas">
                <span>Over 90 days · group</span>
                <span className="num">{compact(t.over90, 2)}</span>
              </li>
              {topDebtor ? (
                <li className="flex items-baseline justify-between gap-2 rounded-[10px] border border-hairline px-3 py-2">
                  <span className="flex min-w-0 items-center gap-1 truncate">
                    <ChevronRight className="size-3 shrink-0 text-ink-faint" aria-hidden />
                    <span className="truncate">{topDebtor.entityName}</span>
                  </span>
                  <span className="num shrink-0">{compact(topDebtor.amount, 2)}</span>
                </li>
              ) : null}
              {topInvoice ? (
                <li className="flex items-baseline justify-between gap-2 rounded-[10px] border border-dashed border-hairline-strong px-3 py-2">
                  <span className="flex min-w-0 items-center gap-1 pl-3">
                    <ChevronRight className="size-3 shrink-0 text-ink-faint" aria-hidden />
                    <span className="num truncate">{topInvoice.ref}</span>
                  </span>
                  <span className="num shrink-0 text-amber-ink">{topInvoice.daysOutstanding}d</span>
                </li>
              ) : null}
            </ol>
            <p className="mt-3 text-[0.75rem] text-ink-faint">From the group total to the invoice, with its source system.</p>
          </Stage>
        </ol>
        <p className="mt-6 text-[0.8125rem] text-ink-muted">Counts from the illustrative demo group used throughout this page.</p>
      </Container>
    </section>
  );
}
