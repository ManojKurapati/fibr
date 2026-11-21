import { BEFORE_AFTER } from "@/data/content";

/** The status quo against the pipeline, set as a board: one row per problem. */
export function BeforeAfter() {
  return (
    <section aria-labelledby="before-after" className="py-[var(--section-gap)]">
      <div className="container">
        <h2 id="before-after">Month-end, or this morning.</h2>
        <div className="clay mt-[var(--space-2xl)] px-[var(--space-xl)] py-[var(--space-lg)] max-sm:px-[var(--space-md)]">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-rule text-sm text-muted">
              <th scope="col" className="w-[30%] pb-[var(--space-sm)] font-medium max-md:hidden">
                The problem
              </th>
              <th scope="col" className="pb-[var(--space-sm)] font-medium">
                By hand
              </th>
              <th scope="col" className="pb-[var(--space-sm)] font-medium">
                With fibr
              </th>
            </tr>
          </thead>
          <tbody>
            {BEFORE_AFTER.map((r) => (
              <tr key={r.problem} className="border-b border-rule align-top last:border-b-0">
                <th scope="row" className="py-[var(--space-xl)] pr-[var(--space-lg)] text-title font-extrabold leading-tight tracking-[-0.02em] max-md:hidden">
                  {r.problem}
                </th>
                <td className="py-[var(--space-xl)] pr-[var(--space-lg)] text-lead text-muted">
                  <span className="mb-[var(--space-2xs)] block font-extrabold text-ink md:hidden">{r.problem}</span>
                  {r.byHand}
                </td>
                <td className="py-[var(--space-xl)] text-title font-extrabold leading-tight tracking-[-0.02em] text-mint-ink">{r.withFibr}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
