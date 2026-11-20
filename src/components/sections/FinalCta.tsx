import { Container } from "../ui/Container";
import { Eyebrow } from "../ui/Eyebrow";
import { BookingForm } from "./BookingForm";

const PROMISES = [
  { k: "One view", v: "Every company and every movement, in one place." },
  { k: "Nothing changes", v: "Read-only. Your sources and teams stay as they are." },
  { k: "Four weeks", v: "From scope to live, starting with 2–3 companies." },
];

export function FinalCta() {
  return (
    <section id="book" className="relative overflow-hidden bg-obsidian py-24 text-ink-inverse sm:py-28 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(14,159,110,0.12),transparent_65%)]" />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow tone="inverse">Book a walkthrough</Eyebrow>
            <h2 className="display mt-6 text-[clamp(3rem,6.4vw,5.75rem)]">
              One view.
              <br />
              Nothing changes.
              <br />
              <em className="italic text-emerald">Four weeks.</em>
            </h2>
            <dl className="mt-10 border-t border-obsidian-hairline">
              {PROMISES.map((p) => (
                <div key={p.k} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-obsidian-hairline py-4 text-[0.9375rem]">
                  <dt className="font-semibold text-ink-inverse">{p.k}</dt>
                  <dd className="text-ink-inverse-muted">{p.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative lg:col-span-7">
            <BookingForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
