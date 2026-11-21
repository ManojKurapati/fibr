import { Wordmark } from "../ui/Wordmark";

/** Colophon block: the wordmark, one paragraph of facts, the page's links. */
export function SiteFooter() {
  return (
    <footer className="on-ink bg-ink py-[var(--space-3xl)] text-paper-3">
      <div className="container grid gap-[var(--space-xl)] lg:grid-cols-12">
        <Wordmark className="text-[2.5rem] lg:col-span-3" />
        <p className="max-w-[60ch] text-paper-2 lg:col-span-6">
          Financial visibility for UAE holding groups. Hosted on Microsoft Azure UAE North in Dubai. Read-only on Tally, Business Central,
          QuickBooks Online, Zoho Books and Shopify. Demo figures are illustrative and describe no real group.
        </p>
        <nav aria-label="Footer" className="flex flex-col gap-[var(--space-xs)] lg:col-span-3 lg:items-end">
          <a href="#product" className="underline-offset-4 hover:underline">
            Product
          </a>
          <a href="#sources" className="underline-offset-4 hover:underline">
            Security
          </a>
          <a href="#rollout" className="underline-offset-4 hover:underline">
            Rollout
          </a>
          <a href="#book" className="underline-offset-4 hover:underline">
            Book a walkthrough
          </a>
        </nav>
        <p className="num text-sm text-paper-2 lg:col-span-12">© 2026 fibr</p>
      </div>
    </footer>
  );
}
