import { MapPin } from "lucide-react";
import { ENTITIES } from "@/data/mockGroup";
import { exceptions, summaries } from "@/lib/aggregate";
import { Container } from "../ui/Container";
import { CtaButton } from "../ui/CtaButton";
import { SectionHeading } from "../ui/SectionHeading";

const S = summaries();
const auditCount = S.filter((s) => s.auditRequired).length;
const qfzpCount = ENTITIES.filter((e) => e.qfzp).length;
const vatItem = exceptions().find((x) => x.kind === "vat");

const FACTS = [
  {
    figure: "9%",
    title: "Corporate tax, entity by entity",
    body: "UAE corporate tax is 9% on taxable income above AED 375,000, and each company files its own return.",
    inFibr: "Every company's profit in one consistent format, side by side.",
  },
  {
    figure: "50m",
    unit: "AED",
    title: "Audited statements above AED 50m",
    body: "Companies with revenue above AED 50m need audited financial statements.",
    inFibr: `${auditCount} of ${ENTITIES.length} demo companies flagged from last year's revenue, with every figure traceable to its invoices for the auditor.`,
  },
  {
    figure: "QFZP",
    title: "Qualifying Free Zone Persons",
    body: "Qualifying Free Zone Persons also need audited statements, from 1 January 2025.",
    inFibr: `Free-zone status recorded per company: ${qfzpCount} in the demo group.`,
  },
  {
    figure: "5%",
    title: "VAT, tracked per company",
    body: "5% VAT is returned company by company, each on its own filing cycle.",
    inFibr: vatItem ? `${vatItem.title}: raised as one exception, not seven reminders.` : "Every return date in one place.",
  },
];

export function WhyNowUAE() {
  return (
    <section id="uae" className="relative overflow-hidden bg-obsidian py-24 text-ink-inverse sm:py-28 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(194,120,3,0.10),transparent_65%)]" />
      <Container className="relative">
        <SectionHeading
          tone="dark"
          align="split"
          eyebrow="Why now · UAE corporate tax & audit readiness"
          title={
            <>
              The tax year now runs
              <br />
              <em className="italic">company by company.</em>
            </>
          }
          lede="Corporate tax, audit thresholds and VAT all work at the level of each company. Groups that see every company clearly, every day, are the ones ready for them."
        />

        <dl className="mt-14 border-t border-obsidian-hairline lg:mt-20">
          {FACTS.map((f) => (
            <div key={f.title} className="grid gap-4 border-b border-obsidian-hairline py-8 sm:grid-cols-12 sm:gap-8 lg:py-10">
              <dt className="sm:col-span-4 lg:col-span-4">
                <span className="num flex items-start gap-2 text-[clamp(3rem,6.5vw,5.5rem)] font-medium leading-[0.9] tracking-[-0.06em] text-ink-inverse">
                  {"unit" in f && f.unit ? <span className="mt-[0.35em] text-[0.22em] tracking-normal text-ink-inverse-muted">{f.unit}</span> : null}
                  {f.figure}
                </span>
              </dt>
              <dd className="sm:col-span-8 lg:col-span-5">
                <p className="text-[1.125rem] font-semibold tracking-[-0.01em] text-ink-inverse">{f.title}</p>
                <p className="mt-2 text-[1rem] leading-relaxed text-ink-inverse-muted">{f.body}</p>
              </dd>
              <dd className="sm:col-span-8 sm:col-start-5 lg:col-span-3 lg:col-start-auto">
                <p className="eyebrow text-emerald">In fibr</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-inverse">{f.inFibr}</p>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex flex-col gap-8 rounded-[24px] border border-obsidian-hairline bg-obsidian-raised p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/5 text-emerald ring-1 ring-white/10" aria-hidden>
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="text-[1.25rem] font-semibold tracking-[-0.01em]">Hosted on Microsoft Azure UAE North, in Dubai.</p>
              <p className="mt-1 text-[0.9375rem] text-ink-inverse-muted">
                Microsoft&apos;s UAE North region · <span className="num text-ink-inverse">25.2048° N, 55.2708° E</span>
              </p>
            </div>
          </div>
          <CtaButton variant="inverse" className="self-start lg:self-auto" />
        </div>

        <p className="mt-6 text-[0.8125rem] text-ink-inverse-muted">
          This is a summary of the rules, not tax advice. Confirm your group&apos;s obligations with your tax adviser.
        </p>
      </Container>
    </section>
  );
}
