
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "../components/products/ProductGrid";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    if (!query) {
      setProducts([]);
      setError(null);
      setLoading(false);
      return () => controller.abort();
    }

    setLoading(true);
    setError(null);
    setProducts([]);

    getProducts({ search: query, limit: 50 }, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setProducts(data);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Search failed"
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [query]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-white">
        Search Results
      </h1>

      <p className="mb-8 mt-2 text-ink-secondary">
        {query
          ? `Results for "${query}"`
          : "Enter a game name to search."}
      </p>

      {loading ? (
        <p className="text-ink-secondary">Searching games...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
