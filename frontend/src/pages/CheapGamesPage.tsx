
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/products/ProductCard";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";

const PAGE_SIZE = 10;

export function CheapGamesPage() {
  const [games, setGames] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGames() {
      try {
        setLoading(true);
        setError(null);

        const products = await getProducts(
          {
            maxPrice: 15,
            sort: "price_asc",
            limit: 100,
          },
          controller.signal
        );

        if (!controller.signal.aborted) {
          setGames(
            products.filter(
              (product) => product.lowestPrice < 15
            )
          );
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load games."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadGames();

    return () => controller.abort();
  }, []);

  const visibleGames = games.slice(0, visibleCount);

  const scrollToGames = () => {
    document.getElementById("cheap-games")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-[#4114A0] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#280B67] via-[#351087] to-[#4114A0]">
        <div className="pointer-events-none absolute -right-24 -top-40 h-[420px] w-[550px] rotate-[-25deg] rounded-[130px] bg-[#210852]/60" />

        <div className="relative mx-auto grid min-h-[350px] max-w-[1200px] grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 lg:px-8">
          <div className="max-w-[510px]">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Great games for{" "}
              <span className="text-[#FFDD00]">
                under €15
              </span>
            </h1>

            <p className="mt-5 max-w-[460px] text-sm leading-6 text-white/90">
              Discover affordable games with real prices
              and seller offers from our marketplace.
            </p>

            <button
              type="button"
              onClick={scrollToGames}
              className="mt-6 min-w-[170px] bg-[#FFDD00] px-7 py-3 text-sm font-extrabold text-[#201044] transition hover:bg-[#FFE84D]"
            >
              Explore deals
            </button>
          </div>

          {/* REAL DATABASE PRODUCT IMAGES */}
          <div className="relative flex min-h-[220px] items-center justify-center">
            <div className="absolute h-[220px] w-[320px] rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative grid w-full max-w-[440px] grid-cols-4 gap-2">
              {games.slice(0, 4).map((game, index) => (
                <div
                  key={game.id}
                  className="overflow-hidden rounded-md border border-white/20 bg-[#1C0C42] shadow-2xl"
                  style={{
                    transform: `translateY(${
                      index % 2 === 0 ? -12 : 12
                    }px) rotate(${
                      index % 2 === 0 ? -5 : 5
                    }deg)`,
                  }}
                >
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="aspect-[3/4] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        id="cheap-games"
        className="mx-auto max-w-[1200px] px-5 pb-24 pt-12 lg:px-8"
      >
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold tracking-tight md:text-2xl">
            Affordable games
          </h2>

          <Link
            to="/store"
            className="text-sm font-semibold text-white/80 hover:text-[#FFDD00]"
          >
            Explore all games →
          </Link>
        </div>

        {loading && (
          <p className="py-12 text-center text-white/70">
            Loading games...
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-400/40 bg-red-950/30 p-5 text-red-100"
          >
            Failed to load games: {error}
          </div>
        )}

        {!loading && !error && games.length === 0 && (
          <p className="py-12 text-center text-white/70">
            No games under €15 are currently available.
          </p>
        )}

        {!loading && !error && games.length > 0 && (
          <>
            <p className="mb-6 text-sm text-white/70">
              {games.length} affordable games available
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {visibleGames.map((game) => (
                <div key={game.id} className="min-w-0">
                  <ProductCard product={game} />
                </div>
              ))}
            </div>

            {visibleCount < games.length && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount(
                      (count) => count + PAGE_SIZE
                    )
                  }
                  className="border border-white/60 px-10 py-3 text-sm font-bold transition hover:bg-white/10"
                >
                  Load more games
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
