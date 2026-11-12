
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../products/ProductCard";
import type { Product } from "../../types/product";

const STORAGE_KEY = "marketplace_recently_viewed";
const MAX_PRODUCTS = 5;

function readRecentlyViewed(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item): item is Product =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          typeof item.slug === "string" &&
          typeof item.title === "string" &&
          typeof item.imageUrl === "string" &&
          typeof item.lowestPrice === "number"
      )
      .slice(0, MAX_PRODUCTS);
  } catch {
    return [];
  }
}

export function rememberViewedProduct(product: Product) {
  try {
    const existing = readRecentlyViewed();

    const updated = [
      product,
      ...existing.filter((item) => item.id !== product.id),
    ].slice(0, MAX_PRODUCTS);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("marketplace:recently-viewed-updated")
    );
  } catch {
    // Browsing still works if localStorage is unavailable.
  }
}

export function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const update = () => {
      setProducts(readRecentlyViewed());
    };

    update();

    window.addEventListener(
      "marketplace:recently-viewed-updated",
      update
    );

    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener(
        "marketplace:recently-viewed-updated",
        update
      );

      window.removeEventListener("storage", update);
    };
  }, []);

  // Don't show an empty section for new visitors.
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#4114A0] py-12 text-white">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-8 flex items-center gap-2">
          <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            Recently viewed
          </h2>

          <span
            title="Products you've recently opened"
            aria-label="Products you've recently opened"
            className="flex h-4 w-4 items-center justify-center rounded-full border border-white/60 text-[10px] text-white/70"
          >
            i
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <div key={product.id} className="min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/store"
            className="text-sm font-semibold text-white/80 transition hover:text-[#FFDD00]"
          >
            Explore more games →
          </Link>
        </div>
      </div>
    </section>
  );
}
