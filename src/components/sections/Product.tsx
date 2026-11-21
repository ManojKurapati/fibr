import { ProductDemo } from "../product/ProductDemo";

/** The product at work: the switcher is the section. */
export function Product() {
  return (
    <section id="product" aria-labelledby="product-head" className="border-y-2 border-ink bg-paper-2 py-[var(--section-gap-s)]">
      <div className="container">
        <div className="grid gap-[var(--space-md)] lg:grid-cols-12 lg:items-end">
          <h2 id="product-head" className="lg:col-span-7">
            Open any number to its invoice.
          </h2>
          <p className="lead lg:col-span-5">The demo below runs on an illustrative group of ten companies.</p>
        </div>
        <div className="mt-[var(--space-2xl)]">
          <ProductDemo />
        </div>
      </div>
    </section>
  );
}
