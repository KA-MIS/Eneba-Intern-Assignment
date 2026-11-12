
import { ProductGrid } from "../components/products/ProductGrid";
import { demoProducts } from "../data/demoProducts";

export function StorePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase
          tracking-widest text-lime">
          Digital marketplace
        </p>

        <h1 className="font-display text-4xl font-bold text-white">
          Game Store
        </h1>

        <p className="mt-3 text-ink-secondary">
          Discover games across your favorite platforms.
        </p>
      </div>

      <ProductGrid products={demoProducts} />
    </main>
  );
}
