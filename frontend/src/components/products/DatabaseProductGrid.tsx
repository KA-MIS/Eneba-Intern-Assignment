
import { useEffect, useState } from "react";
import { ProductGrid } from "./ProductGrid";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

export default function DatabaseProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const data = await getProducts();

        if (active) {
          setProducts(data);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load products"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-ink-secondary">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-red-400">
        Failed to load products: {error}
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
