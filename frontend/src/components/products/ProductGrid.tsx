
import type { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-card border border-line
        bg-surface p-10 text-center text-ink-secondary">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4
      sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
