
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { ProductCard } from "../components/products/ProductCard";
import {
  CatalogSidebar,
  type CatalogFilterValues,
} from "../components/catalog/CatalogSidebar";
import {
  getProducts,
  type ProductFilters,
} from "../services/productService";
import type { Product } from "../types/product";

const brands = ["Amazon", "Netflix", "Spotify", "Discord"];

const emptyFilters: CatalogFilterValues = {
  minPrice: "",
  maxPrice: "",
  region: "",
  platform: "",
  brand: "",
  genre: "",
  os: "",
};

type SortOption = NonNullable<ProductFilters["sort"]>;

export function GiftCardsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedBrand = searchParams.get("brand") ?? "";
  const validBrand = brands.includes(selectedBrand)
    ? selectedBrand
    : "";

  const [filters, setFilters] = useState<CatalogFilterValues>({
    ...emptyFilters,
    brand: validBrand,
  });

  const [sort, setSort] = useState<SortOption>("price_asc");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      brand: validBrand,
    }));
  }, [validBrand]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const data = await getProducts(
          {
            category: "gift_card",
            region: filters.region,
            sort,
            limit: 100,
          },
          controller.signal
        );

        if (!controller.signal.aborted) {
          setProducts(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load gift cards."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, [filters.region, sort]);

  const visibleProducts = useMemo(() => {
    const min =
      filters.minPrice === ""
        ? 0
        : Number(filters.minPrice);

    const max =
      filters.maxPrice === ""
        ? Infinity
        : Number(filters.maxPrice);

    return products.filter((product) => {
      const matchesBrand =
        !filters.brand ||
        product.title
          .toLowerCase()
          .startsWith(filters.brand.toLowerCase());

      const matchesPrice =
        product.lowestPrice >= min &&
        product.lowestPrice <= max;

      return matchesBrand && matchesPrice;
    });
  }, [products, filters]);

  const invalidPrice =
    (filters.minPrice !== "" &&
      (!Number.isFinite(Number(filters.minPrice)) ||
        Number(filters.minPrice) < 0)) ||
    (filters.maxPrice !== "" &&
      (!Number.isFinite(Number(filters.maxPrice)) ||
        Number(filters.maxPrice) < 0)) ||
    (filters.minPrice !== "" &&
      filters.maxPrice !== "" &&
      Number(filters.minPrice) > Number(filters.maxPrice));

  function updateFilters(next: CatalogFilterValues) {
    setFilters(next);

    if (next.brand !== filters.brand) {
      if (next.brand) {
        setSearchParams({ brand: next.brand });
      } else {
        setSearchParams({});
      }
    }
  }

  function clearFilters() {
    setFilters({ ...emptyFilters });
    setSort("price_asc");
    setSearchParams({});
  }

  return (
    <main className="min-h-screen bg-[#4114A0] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <nav className="mb-5 text-sm text-white/70">
          <Link to="/" className="hover:text-[#C6F135]">
            Home
          </Link>
          <span className="mx-2">â€º</span>
          <Link
            to="/gift-cards"
            className="hover:text-[#C6F135]"
          >
            Gift Cards
          </Link>

          {filters.brand && (
            <>
              <span className="mx-2">â€º</span>
              <span>{filters.brand}</span>
            </>
          )}
        </nav>

        <h1 className="mb-8 font-display text-3xl font-bold md:text-4xl">
          {filters.brand
            ? `${filters.brand} Gift Card Deals`
            : "Digital Gift Cards"}
        </h1>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <CatalogSidebar
            category="gift_card"
            filters={filters}
            onChange={updateFilters}
            onClear={clearFilters}
            brands={brands}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-semibold text-white/80">
                Results found:{" "}
                {loading || error || invalidPrice
                  ? "-"
                  : visibleProducts.length}
              </p>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as SortOption)
                }
                aria-label="Sort gift cards"
                className="rounded-full border border-[#6541B7] bg-[#291064] px-4 py-2.5 text-sm text-white"
              >
                <option value="price_asc">
                  Price: Low to High
                </option>
                <option value="price_desc">
                  Price: High to Low
                </option>
                <option value="title_asc">Name: A-Z</option>
                <option value="title_desc">Name: Z-A</option>
              </select>
            </div>

            {invalidPrice && (
              <p role="alert" className="mb-5 text-red-200">
                Please enter a valid price range.
              </p>
            )}

            {loading && (
              <p className="py-10 text-white/70">
                Loading gift cards...
              </p>
            )}

            {!loading && error && (
              <p role="alert" className="py-10 text-red-200">
                {error}
              </p>
            )}

            {!loading &&
              !error &&
              !invalidPrice &&
              visibleProducts.length === 0 && (
                <p className="py-10 text-white/70">
                  No gift cards match these filters.
                </p>
              )}

            {!loading &&
              !error &&
              !invalidPrice &&
              visibleProducts.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
}

