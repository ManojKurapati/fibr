import { Check, KeyRound, Lock, Scale, UserRound, X } from "lucide-react";
import { SOURCES } from "@/data/content";
import { getEntity, summarise } from "@/lib/aggregate";
import { amount } from "@/lib/format";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

const tie = summarise(getEntity("tradA"));

function ReadOnlyProof() {
  return (
    <ul className="divide-y divide-hairline rounded-[14px] border border-hairline bg-surface text-[0.8125rem]">
      {SOURCES.map((s) => (
        <li key={s} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
          <span className="font-medium">{s}</span>
          <span className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em]">
            <span className="flex items-center gap-1 text-emerald-ink">
              <Check className="size-3" strokeWidth={3} aria-hidden /> Read
            </span>
            <span className="flex items-center gap-1 text-ink-faint line-through decoration-ink-faint/60">
              <X className="size-3" strokeWidth={3} aria-hidden /> Write
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function SignInProof() {
  return (
    <div className="rounded-[14px] border border-hairline bg-surface p-4">
      <div className="flex items-center gap-3 rounded-[10px] border border-hairline-strong px-3.5 py-3">
        <UserRound className="size-5 text-ink" aria-hidden />
        <span className="text-[0.875rem] font-semibold">Sign in with Microsoft</span>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-[10px] bg-app px-3.5 py-3">
        <span className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
          <KeyRound className="size-4 text-ink" aria-hidden /> Multi-factor authentication
        </span>
        <span className="rounded-full bg-emerald-soft px-2 py-0.5 text-[0.6875rem] font-semibold text-emerald-ink">Required</span>
      </div>
      <div className="mt-2 flex gap-1.5 px-1" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="num grid h-9 flex-1 place-items-center rounded-[8px] border border-hairline text-[0.9375rem]">
            {i < 4 ? "•" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function ReconcileProof() {
  const rows = [
    { label: "Signed FY2025 accounts", v: tie.entity.fy2025Revenue },
    { label: "fibr, from the ledger", v: tie.entity.fy2025Revenue },
  ];
  return (
    <div className="rounded-[14px] border border-hairline bg-surface p-4 text-[0.8125rem]">
      <p className="text-[0.75rem] text-ink-muted">
        Revenue tie-out · <span className="font-medium text-ink">{tie.entity.name}</span> (illustrative)
      </p>
      <div className="mt-3 divide-y divide-hairline border-y border-hairline">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3 py-2.5">
            <span className="text-ink-muted">{r.label}</span>
            <span className="num">{amount(r.v)}</span>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-3 py-2.5 font-semibold">
          <span>Difference</span>
          <span className="num flex items-center gap-1.5 text-emerald-ink">
            0 <Check className="size-3.5" strokeWidth={3} aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}

const PILLARS = [
  {
    Icon: Lock,
    title: "Read-only by design",
    body: "fibr reads Tally, Business Central, QuickBooks Online, Zoho Books and Shopify. It never writes, posts or changes a single entry.",
    Proof: ReadOnlyProof,
  },
  {
    Icon: KeyRound,
    title: "Microsoft sign-in with MFA",
    body: "Everyone signs in with their Microsoft account and multi-factor authentication. No new passwords to manage.",
    Proof: SignInProof,
  },
  {
    Icon: Scale,
    title: "Reconciled to your signed accounts",
    body: "Before you rely on a number, every company is tied back to its last signed accounts. Zero migration, zero re-keying.",
    Proof: ReconcileProof,
  },
];

export function SecurityPillars() {
  return (
    <section id="security" className="py-24 sm:py-28 lg:py-36">
      <Container>
        <SectionHeading
          align="split"
          eyebrow="Security & reconciliation"
          title={
            <>
              Nothing changes
              <br />
              <em className="italic">in your books.</em>
            </>
          }
          lede="Your finance teams keep their systems, their processes and their month-end. fibr sits on top, looking, never touching."
        />
        <div className="mt-14 grid border-t border-hairline lg:mt-20 lg:grid-cols-3">
          {PILLARS.map(({ Icon, title, body, Proof }, i) => (
            <article key={title} className={`flex flex-col gap-8 py-10 lg:px-8 lg:py-12 ${i ? "border-t border-hairline lg:border-l lg:border-t-0" : "lg:pl-0"} ${i === 2 ? "lg:pr-0" : ""}`}>
              <div>
                <span className="grid size-10 place-items-center rounded-full bg-ink text-canvas" aria-hidden>
                  <Icon className="size-[18px]" />
                </span>
                <h3 className="mt-6 font-display text-[2rem] leading-[1.02] tracking-[-0.025em]">{title}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink-muted">{body}</p>
              </div>
              <div className="mt-auto">
                <Proof />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
