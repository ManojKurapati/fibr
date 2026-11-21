import { SOURCES, TRUST } from "@/data/content";
import { ENTITIES } from "@/data/mockGroup";

const CAPTURES: Record<(typeof SOURCES)[number], string> = {
  Tally: "Invoices, receipts, payments",
  "Business Central": "Invoices, receipts, payments",
  "QuickBooks Online": "Invoices, receipts, payments",
  "Zoho Books": "Invoices, receipts, payments",
  Shopify: "Web orders",
};

/** Sources as clay tiles, with the security facts in one clay card beside them. */
export function Sources() {
  return (
    <section id="sources" aria-labelledby="sources-head" className="py-[var(--section-gap)]">
      <div className="container">
        <div className="grid gap-[var(--space-md)] lg:grid-cols-12 lg:items-end">
          <h2 id="sources-head" className="lg:col-span-7">
            Five sources, read-only.
          </h2>
          <p className="lead text-muted lg:col-span-5">fibr reads every company&apos;s books. It never writes or posts.</p>
        </div>
        <div className="mt-[var(--space-2xl)] grid gap-[var(--gap-columns)] lg:grid-cols-12">
          <ul className="grid grid-cols-1 gap-[var(--space-lg)] sm:grid-cols-2 lg:col-span-8">
            {SOURCES.map((s, i) => {
              const n = ENTITIES.filter((e) => e.ledgers.includes(s)).length;
              return (
                <li
                  key={s}
                  className={`clay flex min-h-[10rem] min-w-0 flex-col justify-between p-[var(--space-lg)] ${i === SOURCES.length - 1 ? "sm:col-span-2" : ""}`}
                >
                  <span className="text-title font-extrabold leading-tight tracking-[-0.02em]">{s}</span>
                  <span className="mt-[var(--space-lg)] text-muted">
                    {CAPTURES[s]}
                    <span className="block text-sm">
                      {n} demo {n === 1 ? "company" : "companies"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          <dl className="clay h-fit bg-sky px-[var(--space-lg)] py-[var(--space-xs)] lg:col-span-4">
            {TRUST.map((t, i) => (
              <div key={t.title} className={`py-[var(--space-lg)] ${i ? "border-t border-ink-rule" : ""}`}>
                <dt className="text-title font-extrabold tracking-[-0.02em]">{t.title}</dt>
                <dd className="m-0 mt-[var(--space-2xs)] text-ink-2">{t.line}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
