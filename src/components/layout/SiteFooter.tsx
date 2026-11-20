import { COMMERCIAL_LINE } from "@/data/content";
import { Container } from "../ui/Container";
import { Wordmark } from "../ui/Wordmark";

export function SiteFooter() {
  return (
    <footer className="bg-obsidian pb-10 text-ink-inverse-muted">
      <Container>
        <div className="grid gap-10 border-t border-obsidian-hairline pt-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark tone="inverse" className="text-[2.25rem]" />
            <p className="mt-4 max-w-[24rem] text-[0.9375rem] leading-relaxed">
              Financial visibility for UAE holding groups. Every transaction, invoice and receipt, captured from every source, in one view of the group.
            </p>
          </div>
          <div className="text-[0.875rem] md:col-span-3">
            <p className="eyebrow text-ink-inverse">Product</p>
            <ul className="mt-4 space-y-2.5">
              <li><a className="hover:text-ink-inverse" href="#pipeline">The pipeline</a></li>
              <li><a className="hover:text-ink-inverse" href="#tour">Six moments</a></li>
              <li><a className="hover:text-ink-inverse" href="#security">Security</a></li>
              <li><a className="hover:text-ink-inverse" href="#pilot">4-week pilot</a></li>
              <li><a className="hover:text-ink-inverse" href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="text-[0.875rem] md:col-span-4">
            <p className="eyebrow text-ink-inverse">Facts</p>
            <ul className="mt-4 space-y-2.5">
              <li>Hosted on Microsoft Azure UAE North (Dubai)</li>
              <li>Read-only: Tally, Business Central, QuickBooks Online, Zoho Books, Shopify</li>
              <li>{COMMERCIAL_LINE}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-obsidian-hairline pt-6 text-[0.8125rem] sm:flex-row sm:justify-between">
          <p>
            © <span className="num">2026</span> fibr
          </p>
          <p>Demo figures are illustrative and do not describe a real group.</p>
        </div>
      </Container>
    </footer>
  );
}
