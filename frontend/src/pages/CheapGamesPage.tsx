
import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/products/ProductCard";
import type { Product } from "../types/product";
import { GamesUnder10 } from "../components/deals/GamesUnder10";

const cheapGames: Product[] = [
  {
    id: "cheap-suicide-squad",
    slug: "suicide-squad-kill-the-justice-league",
    title: "Suicide Squad: Kill the Justice League (PC) Steam Key",
    platform: "PC",
    region: "GLOBAL",
    imageUrl: "/images/suicide-squad.jpg",
    lowestPrice: 2.10,
    originalPrice: 69.99,
    currency: "EUR",
  },
  {
    id: "cheap-bread-fred",
    slug: "bread-and-fred",
    title: "Bread & Fred (PC) Steam Key",
    platform: "PC",
    region: "EUROPE",
    imageUrl: "/images/bread-and-fred.jpg",
    lowestPrice: 2.09,
    originalPrice: 14.79,
    currency: "EUR",
  },
  {
    id: "cheap-assetto-corsa",
    slug: "assetto-corsa",
    title: "Assetto Corsa (PC) Steam Key",
    platform: "PC",
    region: "GLOBAL",
    imageUrl: "/images/assetto-corsa.jpg",
    lowestPrice: 4.19,
    originalPrice: 19.99,
    currency: "EUR",
  },
  {
    id: "cheap-shadow-of-war",
    slug: "middle-earth-shadow-of-war",
    title: "Middle-earth: Shadow of War Definitive Edition (PC)",
    platform: "PC",
    region: "GLOBAL",
    imageUrl: "/images/shadow-of-war.jpg",
    lowestPrice: 2.78,
    originalPrice: 39.99,
    currency: "EUR",
  },
  {
    id: "cheap-terraria",
    slug: "terraria",
    title: "Terraria Steam Gift GLOBAL",
    platform: "PC",
    region: "GLOBAL",
    imageUrl: "/images/terraria.jpg",
    lowestPrice: 2.00,
    originalPrice: 9.75,
    currency: "EUR",
  },
];

const categories = [
  "All games",
  "Action",
  "Adventure",
  "RPG",
  "Racing",
  "Strategy",
  "Indie",
];

export function CheapGamesPage() {
  const [activeCategory, setActiveCategory] =
    useState("All games");

  const [visibleCount, setVisibleCount] = useState(5);

  const scrollToGames = () => {
    document.getElementById("cheap-games")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const visibleGames = cheapGames.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-[#4114A0] text-white">
      {/* PROMOTIONAL HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#280B67] via-[#351087] to-[#4114A0]">
        {/* DECORATIVE BACKGROUND */}
        <div className="pointer-events-none absolute -right-24 -top-40 h-[420px] w-[550px] rotate-[-25deg] rounded-[130px] bg-[#210852]/60" />

        <div className="relative mx-auto grid min-h-[350px] max-w-[1200px] grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 lg:px-8">
          {/* HERO TEXT */}
          <div className="max-w-[510px]">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Games up to{" "}
              <span className="text-[#FFDD00]">
                90% off!*
              </span>
            </h1>

            <p className="mt-5 max-w-[460px] text-sm leading-6 text-white/90">
              Discover incredible gaming deals.
              Explore action, adventure, racing,
              strategy and more for less.
            </p>

            <button
              type="button"
              onClick={scrollToGames}
              className="mt-6 min-w-[170px] bg-[#FFDD00] px-7 py-3 text-sm font-extrabold text-[#201044] transition hover:bg-[#FFE84D]"
            >
              Save now
            </button>

            <p className="mt-5 text-xs italic text-white/75">
              *Discounts shown are demo examples compared
              with illustrative original prices.
            </p>
          </div>

          {/* HERO VISUAL */}
          <div className="relative flex min-h-[220px] items-center justify-center">
            <div className="absolute h-[220px] w-[320px] rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative grid w-full max-w-[440px] grid-cols-4 gap-2">
              {cheapGames.slice(0, 4).map((game, index) => (
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

      {/* PRODUCT SECTION */}
      <section
        id="cheap-games"
        className="mx-auto max-w-[1200px] px-5 pb-24 pt-12 lg:px-8"
      >
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold tracking-tight md:text-2xl">
            Cheap games everyone's playing
          </h2>

          <Link
            to="/store"
            className="text-sm font-semibold text-white/80 hover:text-[#FFDD00]"
          >
            Explore all games →
          </Link>
        </div>

        {/* CATEGORY NAVIGATION - VISUAL PREVIEW */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                activeCategory === category
                  ? "border-[#FFDD00] bg-[#FFDD00] text-[#201044]"
                  : "border-white/20 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* GAME CARDS */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {visibleGames.map((game) => (
            <div key={game.id} className="min-w-0">
              <ProductCard product={game} />
            </div>
          ))}
        </div>

        {/* LOAD MORE */}
        {visibleCount < cheapGames.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) => count + 5)
              }
              className="border border-white/60 px-10 py-3 text-sm font-bold transition hover:bg-white/10"
            >
              Load more games
            </button>
          </div>
        )}

        <p className="mt-10 text-xs text-white/60">
          Demo listings and prices. Product availability
          and seller offers must be verified before
          enabling purchases.
        </p>
      </section>
      <GamesUnder10 />
    </main>
  );
}
