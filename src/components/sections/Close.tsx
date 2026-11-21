import { COMMERCIAL_LINE } from "@/data/content";
import { BookingForm } from "./BookingForm";

/** The close is the job: book the walkthrough, with the commercial terms beside the form. */
export function Close() {
  return (
    <section id="book" aria-labelledby="book-head" className="py-[var(--section-gap-s)]">
      <div className="container">
      <div className="clay grid gap-[var(--space-2xl)] p-[var(--space-2xl)] max-sm:p-[var(--space-lg)] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="book-head">Book a 45-minute walkthrough.</h2>
          <dl className="mt-[var(--space-xl)]">
            <div className="border-b border-rule py-[var(--space-md)] last:border-b-0">
              <dt className="text-sm font-medium text-muted">The walkthrough</dt>
              <dd className="m-0 mt-[var(--space-2xs)]">Your group&apos;s questions, on the demo.</dd>
            </div>
            <div className="border-b border-rule py-[var(--space-md)] last:border-b-0">
              <dt className="text-sm font-medium text-muted">Pricing</dt>
              <dd className="m-0 mt-[var(--space-2xs)]">{COMMERCIAL_LINE}</dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-7">
          <BookingForm />
        </div>
      </div>
      </div>
    </section>
  );
}
