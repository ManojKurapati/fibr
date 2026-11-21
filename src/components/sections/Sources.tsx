import { SOURCES, TRUST } from "@/data/content";
import { ENTITIES } from "@/data/mockGroup";

const CAPTURES: Record<(typeof SOURCES)[number], string> = {
  Tally: "Invoices, receipts, payments",
  "Business Central": "Invoices, receipts, payments",
  "QuickBooks Online": "Invoices, receipts, payments",
  "Zoho Books": "Invoices, receipts, payments",
  Shopify: "Web orders",
};

/** Sources as a board of square cells joined edge to edge, with the trust facts beside them. */
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
        <div className="mt-[var(--space-2xl)] grid gap-[var(--space-2xl)] lg:grid-cols-12">
          <ul className="grid grid-cols-1 border-l-2 border-t-2 border-ink sm:grid-cols-2 lg:col-span-8">
            {SOURCES.map((s, i) => {
              const n = ENTITIES.filter((e) => e.ledgers.includes(s)).length;
              return (
                <li
                  key={s}
                  className={`flex min-h-[10rem] min-w-0 flex-col justify-between border-b-2 border-r-2 border-ink bg-paper-3 p-[var(--space-lg)] ${i === SOURCES.length - 1 ? "sm:col-span-2" : ""}`}
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
          <dl className="border-t-2 border-ink lg:col-span-4">
            {TRUST.map((t) => (
              <div key={t.title} className="border-b border-rule py-[var(--space-lg)]">
                <dt className="text-title font-extrabold tracking-[-0.02em]">{t.title}</dt>
                <dd className="m-0 mt-[var(--space-2xs)] text-muted">{t.line}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
