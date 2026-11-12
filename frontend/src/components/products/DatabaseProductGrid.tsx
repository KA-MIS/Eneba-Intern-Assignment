
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
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
      <div className="py-16 text-center text-white/60">
        Loading products from Supabase...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-white/60">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
