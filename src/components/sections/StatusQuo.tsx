import { PROBLEMS, SOURCES } from "@/data/content";
import { ENTITIES } from "@/data/mockGroup";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

/** Small illustrative vignettes. Labelled "e.g." because they are examples, not statistics. */
function LedgersVisual() {
  const exports: Record<string, string> = { Tally: "3 Oct", "Business Central": "18 Sep", "QuickBooks Online": "29 Sep", "Zoho Books": "7 Oct", Shopify: "22 Sep" };
  return (
    <ul className="grid gap-2 sm:grid-cols-2" aria-label="Example: the demo group's companies spread across five ledgers, each exported on a different date">
      {SOURCES.map((s, i) => {
        const cos = ENTITIES.filter((e) => e.ledgers.includes(s));
        return (
          <li
            key={s}
            className={`rounded-[12px] border border-hairline bg-canvas px-3.5 py-3 ${i === 4 ? "sm:col-span-2" : ""}`}
            style={{ transform: `rotate(${[-0.5, 0.4, 0.3, -0.35, 0.15][i]}deg)` }}
          >
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-[0.875rem] font-semibold tracking-[-0.01em]">{s}</span>
              <span className="num shrink-0 text-[0.75rem] text-ink-faint">export {exports[s]}</span>
            </span>
            <span className="mt-2 flex flex-wrap gap-1">
              {cos.map((c) => (
                <span key={c.id} className="rounded-full bg-white px-2 py-0.5 text-[0.6875rem] text-ink-muted ring-1 ring-hairline">
                  {c.name}
                </span>
              ))}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function ExcelVisual() {
  const cells = [
    ["", "A", "B", "C"],
    ["1", "Company", "Cash", "Debtors"],
    ["2", "Trading", "18,40…", "29,6…"],
    ["3", "Mfg.", "6,10…", "#REF!"],
    ["4", "Total", "=SUM(…", "#REF!"],
  ];
  return (
    <div aria-hidden className="overflow-hidden rounded-[10px] border border-hairline bg-white">
      <div className="flex items-center gap-2 border-b border-hairline bg-[#f1f0eb] px-3 py-1.5">
        <span className="size-2 rounded-full bg-[#d8d4ca]" />
        <span className="num truncate text-[0.6875rem] text-ink-muted">Group_pack_Oct_v7_FINAL_final.xlsx</span>
      </div>
      <div className="grid grid-cols-[1.5rem_1.3fr_1fr_1fr] text-[0.6875rem]">
        {cells.flat().map((c, i) => (
          <span
            key={i}
            className={`num truncate border-b border-r border-hairline px-2 py-1 ${i < 4 || i % 4 === 0 ? "bg-[#f7f6f2] text-ink-faint" : ""} ${c === "#REF!" ? "bg-amber-soft font-semibold text-amber-ink" : ""}`}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function QuestionVisual() {
  return (
    <ol aria-label="Example email thread" className="space-y-2 text-[0.8125rem]">
      <li className="flex items-baseline justify-between gap-3 rounded-[10px] bg-ink px-3 py-2 text-canvas">
        <span>“What&apos;s our cash across everything?”</span>
        <span className="num shrink-0 text-[0.6875rem] text-ink-inverse-muted">Sun 09:12</span>
      </li>
      <li className="flex items-baseline justify-between gap-3 rounded-[10px] border border-dashed border-hairline-strong px-3 py-2 text-ink-muted">
        <span>“Collecting from each company…”</span>
        <span className="num shrink-0 text-[0.6875rem]">Mon 11:40</span>
      </li>
      <li className="flex items-baseline justify-between gap-3 rounded-[10px] border border-hairline bg-white px-3 py-2">
        <span>“Attached, as at last Thursday.”</span>
        <span className="num shrink-0 text-[0.6875rem] text-ink-faint">Wed 16:05</span>
      </li>
    </ol>
  );
}

function StaleVisual() {
  return (
    <div aria-label="Example: month closes, the pack arrives two to four weeks later" className="relative pt-6">
      <div className="h-px w-full bg-hairline-strong" />
      <div className="absolute left-0 top-6 -translate-y-1/2">
        <span className="block size-2.5 rounded-full bg-ink" />
      </div>
      <div className="absolute left-[46%] right-0 top-6 h-[3px] -translate-y-1/2 rounded-full bg-amber/70" />
      <div className="absolute right-0 top-6 -translate-y-1/2">
        <span className="block size-2.5 rounded-full bg-amber" />
      </div>
      <div className="mt-3 flex justify-between text-[0.75rem]">
        <span>
          <span className="num block text-ink">31 Oct</span>
          <span className="text-ink-faint">Month closes</span>
        </span>
        <span className="text-right">
          <span className="num block text-amber-ink">14–28 Nov</span>
          <span className="text-ink-faint">Group pack lands</span>
        </span>
      </div>
    </div>
  );
}

const VISUALS = [LedgersVisual, ExcelVisual, QuestionVisual, StaleVisual];

export function StatusQuo() {
  return (
    <section id="problem" className="py-24 sm:py-28 lg:py-36">
      <Container>
        <SectionHeading
          align="split"
          eyebrow="The status quo"
          title={
            <>
              Ten companies.
              <br />
              <em className="italic">Ten versions of the truth.</em>
            </>
          }
          lede="Most UAE holding groups run each company on its own books. Seeing the group means waiting for someone to stitch it together."
        />

        <div className="mt-14 grid gap-3 lg:mt-20 lg:grid-cols-12 lg:gap-4">
          {PROBLEMS.map((p, i) => {
            const Visual = VISUALS[i]!;
            const layout = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"][i];
            const wide = false;
            return (
              <article
                key={p.n}
                className={`group flex flex-col justify-between gap-8 rounded-[20px] border border-hairline bg-surface p-6 sm:p-8 ${layout} ${wide ? "lg:flex-row lg:items-end lg:gap-16" : ""}`}
              >
                <div className={wide ? "lg:max-w-[28rem]" : ""}>
                  <div className="flex items-baseline gap-4">
                    <span className="num text-[2.75rem] font-medium leading-none tracking-[-0.06em] text-ink/15 sm:text-[3.25rem]">{p.n}</span>
                    <h3 className="font-display text-[2rem] leading-none tracking-[-0.025em] sm:text-[2.375rem]">{p.title}</h3>
                  </div>
                  <p className="mt-4 max-w-[34rem] text-[1rem] leading-relaxed text-ink-muted">{p.body}</p>
                </div>
                <div className={wide ? "lg:flex-1" : ""}>
                  <p className="eyebrow mb-3 text-ink-faint">E.g.</p>
                  <Visual />
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
