import { useEffect, useState } from "react";

import { ProductGrid } from "../components/products/ProductGrid";
import {
  CatalogSidebar,
  type CatalogFilterValues,
} from "../components/catalog/CatalogSidebar";
import {
  getProducts,
  type ProductFilters,
} from "../services/productService";
import { useSearchParams } from "react-router-dom";
import type { Product } from "../types/product";

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

export function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlGenre = searchParams.get("genre") ?? "";
  const [filters, setFilters] = useState<CatalogFilterValues>({
    ...emptyFilters, genre: urlGenre,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("title_asc");

  const [products, setProducts] = useState<Product[]>([]);
  const [genreCounts, setGenreCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFilters((previous) => previous.genre === urlGenre ? previous : { ...previous, genre: urlGenre });
  }, [urlGenre]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadGenreCounts() {
      try {
        const counts: Record<string, number> = {};
        // Count each available game once per genre, without the user's active filters.
        for (let currentPage = 1; currentPage <= 100; currentPage++) {
          const batch = await getProducts(
            { category: "game", limit: 100, page: currentPage },
            controller.signal
          );
          for (const product of batch) {
            for (const genre of new Set(product.genres ?? [])) {
              counts[genre] = (counts[genre] ?? 0) + 1;
            }
          }
          if (batch.length < 100) break;
        }
        if (!controller.signal.aborted) setGenreCounts(counts);
      } catch (error) {
        if (!controller.signal.aborted) console.error("Could not load genre counts", error);
      }
    }
    void loadGenreCounts();
    return () => controller.abort();
  }, []);


  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, filters.region, filters.platform, filters.genre, filters.os, filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  const invalidPrice =
    (filters.minPrice !== "" && (!/^\d{1,7}(\.\d{1,2})?$/.test(filters.minPrice))) ||
    (filters.maxPrice !== "" && (!/^\d{1,7}(\.\d{1,2})?$/.test(filters.maxPrice))) ||
    (filters.minPrice !== "" && filters.maxPrice !== "" && Number(filters.minPrice) > Number(filters.maxPrice));

  useEffect(() => {
    if (invalidPrice) {
      setProducts([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts({
          category: "game",
          search: debouncedSearch,
          sort,
          region: filters.region,
          platform: filters.platform,
          genre: filters.genre,
          os: filters.os,
          minPrice: filters.minPrice === "" ? undefined : Number(filters.minPrice),
          maxPrice: filters.maxPrice === "" ? undefined : Number(filters.maxPrice),
          limit: 40,
          page,
        }, controller.signal);
        if (!controller.signal.aborted) {
          setProducts(data);
          setHasMore(data.length === 40);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to load games.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadProducts();
    return () => controller.abort();
  }, [debouncedSearch, sort, filters.region, filters.platform, filters.genre, filters.os, filters.minPrice, filters.maxPrice, page, invalidPrice]);

  function changeFilters(next: CatalogFilterValues) {
    setFilters(next);
    if (next.genre !== urlGenre) {
      const params = new URLSearchParams(searchParams);
      if (next.genre) params.set("genre", next.genre);
      else params.delete("genre");
      setSearchParams(params);
    }
  }

  function clearFilters() {
    changeFilters({ ...emptyFilters });
    setPage(1);
    setSearch("");
    setDebouncedSearch("");
    setSort("title_asc");
  }

  return (
    <main className="min-h-screen bg-[#4114A0] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-8 font-display text-3xl font-bold md:text-4xl">
          Buy video game keys at great prices
        </h1>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <CatalogSidebar
            category="game"
            filters={filters}
            onChange={changeFilters}
            onClear={clearFilters}
            genreCounts={genreCounts}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search games..."
                aria-label="Search games"
                className="min-w-[180px] flex-1 rounded-full border border-[#6541B7] bg-[#291064] px-4 py-2.5 text-sm text-white outline-none focus:border-[#C6F135]"
              />

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as SortOption)
                }
                aria-label="Sort games"
                className="rounded-full border border-[#6541B7] bg-[#291064] px-4 py-2.5 text-sm text-white"
              >
                <option value="title_asc">Name: A-Z</option>
                <option value="title_desc">Name: Z-A</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <p className="mb-6 text-sm font-semibold text-white/80">
              Results on this page:{" "}
              {loading || error || invalidPrice
                ? "-"
                : products.length}
            </p>

            {invalidPrice && (
              <p role="alert" className="mb-5 text-red-200">
                Please enter a valid price range.
              </p>
            )}

            {loading && (
              <p className="py-10 text-white/70">
                Loading games...
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
              products.length === 0 && (
                <p className="py-10 text-white/70">
                  No games match these filters.
                </p>
              )}

            {!loading && !error && !invalidPrice && products.length > 0 && (
              <ProductGrid products={products} />
            )}
            {!loading && !error && !invalidPrice && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button type="button" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded border border-white/30 px-4 py-2 disabled:opacity-40">Previous</button>
                <span className="text-sm">Page {page}</span>
                <button type="button" disabled={!hasMore} onClick={() => setPage((p) => p + 1)}
                  className="rounded border border-white/30 px-4 py-2 disabled:opacity-40">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
