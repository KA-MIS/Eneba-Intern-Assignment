
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductGrid } from "../products/ProductGrid";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

export function RecommendedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const result = await getProducts(
          { limit: 5, sort: "random" },
          controller.signal
        );

        if (!controller.signal.aborted) {
          setProducts(result);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();
    return () => controller.abort();
  }, []);

  return (
    <section
      aria-labelledby="recommended-heading"
      className="w-full bg-[#4519AC] py-8"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center gap-2">
          <h2
            id="recommended-heading"
            className="font-display text-2xl font-bold text-white md:text-3xl"
          >
            Discover games
          </h2>
          <span
            className="text-white/60"
            title="Random selection from available games"
          >
            ⓘ
          </span>
        </div>

        {loading && (
          <p className="py-8 text-white/70">
            Loading recommendations...
          </p>
        )}

        {error && (
          <p role="alert" className="py-8 text-red-200">
            Unable to load recommendations.
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="py-8 text-white/70">
            No games available yet.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <ProductGrid products={products} />
        )}

        <div className="mt-7 flex justify-center">
          <Link
            to="/store"
            className="flex min-w-[200px] items-center
              justify-center border border-white px-8
              py-2.5 text-sm font-bold text-white
              hover:bg-white hover:text-[#211342]"
          >
            See all
          </Link>
        </div>
      </div>
    </section>
  );
}
