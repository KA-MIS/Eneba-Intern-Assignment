
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Wait until the user pauses typing.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  // Fetch matching products from PHP.
  useEffect(() => {
    const controller = new AbortController();

    if (!debouncedQuery) {
      setResults([]);
      setLoading(false);
      return () => controller.abort();
    }

    setLoading(true);

    getProducts(
      {
        search: debouncedQuery,
        limit: 6,
      },
      controller.signal
    )
      .then((products) => {
        if (!controller.signal.aborted) {
          setResults(products);
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error("Search failed:", error);
          setResults([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  // Close suggestions when clicking outside.
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const showSuggestions = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <form role="search" onSubmit={handleSearch}>
        <label htmlFor="marketplace-search" className="sr-only">
          Search games
        </label>

        <div className="relative">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            id="marketplace-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setResults([]);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder="Search for games, top-ups and more"
            maxLength={120}
            autoComplete="off"
            className="h-12 w-full border border-white/80 bg-[#4219A8] pl-12 pr-4 text-sm font-medium text-white placeholder:text-[#C2A9F5] outline-none transition-colors focus:border-[#FFDD00] focus:ring-1 focus:ring-[#FFDD00]"
          />
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full z-[100] mt-1 max-h-[440px] overflow-y-auto border border-[#62439C] bg-[#32147D] shadow-2xl">
          <div className="px-4 py-3 text-xs font-semibold uppercase text-[#C2A9F5]">
            Search suggestions
          </div>

          {loading ? (
            <p className="px-4 py-5 text-sm text-white/70">
              Searching...
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-5 text-sm text-white/70">
              No matching games found.
            </p>
          ) : (
            results.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-white/10 px-4 py-2 hover:bg-[#4219A8]"
              >
                <img
                  src={product.imageUrl || "/images/placeholder.jpg"}
                  alt=""
                  className="h-16 w-12 shrink-0 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-white">
                    {product.title}
                  </p>

                  <p className="mt-1 text-xs text-[#C2A9F5]">
                    {product.platform} · {product.region}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-bold text-[#C6F135]">
                  €{product.lowestPrice.toFixed(2)}
                </span>
              </Link>
            ))
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate(
                `/search?q=${encodeURIComponent(query.trim())}`
              );
            }}
            className="w-full px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#4219A8]"
          >
            Show all results
          </button>
        </div>
      )}
    </div>
  );
}
