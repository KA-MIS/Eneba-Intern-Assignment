
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../products/ProductCard";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

export function GamesUnder10() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [games, setGames] = useState<Product[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGames() {
      try {
        const products = await getProducts(
          {
            maxPrice: 10,
            sort: "price_asc",
            limit: 100,
          },
          controller.signal
        );

        if (!controller.signal.aborted) {
          setGames(
            products.filter(
              (product) => product.lowestPrice < 10
            )
          );
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

    void loadGames();

    return () => controller.abort();
  }, []);

  const updateProgress = () => {
    const element = scrollRef.current;
    if (!element) return;

    const maxScroll =
      element.scrollWidth - element.clientWidth;

    setProgress(
      maxScroll > 0
        ? element.scrollLeft / maxScroll
        : 0
    );
  };

  const scroll = (direction: "left" | "right") => {
    const element = scrollRef.current;
    if (!element) return;

    element.scrollBy({
      left:
        (direction === "right" ? 1 : -1) *
        element.clientWidth *
        0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-[#4114A0] py-12 text-white">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        <h2 className="mb-8 text-xl font-extrabold">
          Games Under €10
        </h2>

        {loading && (
          <p className="py-10 text-white/70">
            Loading games...
          </p>
        )}

        {error && (
          <p role="alert" className="py-10 text-red-200">
            Unable to load games.
          </p>
        )}

        {!loading && !error && games.length === 0 && (
          <p className="py-10 text-white/70">
            No games under €10 are currently available.
          </p>
        )}

        {!loading && !error && games.length > 0 && (
          <>
            <div className="relative">
              <div
                ref={scrollRef}
                onScroll={updateProgress}
                aria-label="Games under 10 euros"
                tabIndex={0}
                className="flex snap-x snap-mandatory
                  gap-5 overflow-x-auto scroll-smooth
                  pb-3 [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden"
              >
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="w-[220px] shrink-0
                      snap-start sm:w-[225px]"
                  >
                    <ProductCard product={game} />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous games"
                className="absolute left-0 top-1/2 z-10
                  flex h-12 w-12 -translate-y-1/2
                  items-center justify-center
                  bg-white/95 text-[#211342]
                  shadow-lg transition hover:bg-white"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next games"
                className="absolute right-0 top-1/2 z-10
                  flex h-12 w-12 -translate-y-1/2
                  items-center justify-center
                  bg-white/95 text-[#211342]
                  shadow-lg transition hover:bg-white"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            <div className="mt-1 h-[5px] w-full bg-[#6233BF]">
              <div
                className="h-full bg-white transition-all"
                style={{
                  width: `${Math.max(
                    20,
                    progress * 100
                  )}%`,
                }}
              />
            </div>

            <div className="mt-5 flex justify-center">
              <Link
                to="/store?maxPrice=10"
                className="min-w-[180px] border
                  border-white/80 px-8 py-2
                  text-center text-sm font-bold
                  transition hover:bg-white/10"
              >
                Show all
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
