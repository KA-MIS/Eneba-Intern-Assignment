
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../products/ProductCard";
import type { Product } from "../../types/product";

const gamesUnder10: Product[] = [
  {
    id: "under10-gta-v-premium",
    slug: "gta-v-premium-online-edition",
    title: "Grand Theft Auto V: Premium Online Edition",
    platform: "PC",
    region: "GLOBAL",
    imageUrl: "/images/gta-v-premium.jpg",
    lowestPrice: 9.12,
    originalPrice: 29.98,
    currency: "EUR",
  },
  {
    id: "under10-project-zomboid",
    slug: "project-zomboid",
    title: "Project Zomboid Steam Gift GLOBAL",
    platform: "PC",
    region: "GLOBAL",
    imageUrl: "/images/project-zomboid.jpg",
    lowestPrice: 8.89,
    originalPrice: 19.50,
    currency: "EUR",
  },
  {
    id: "under10-gta-v-enhanced",
    slug: "gta-v-enhanced",
    title: "Grand Theft Auto V Enhanced (PC)",
    platform: "PC",
    region: "GLOBAL",
    imageUrl: "/images/gta-v-enhanced.jpg",
    lowestPrice: 9.07,
    originalPrice: null,
    currency: "EUR",
  },
  {
    id: "under10-gta-v-rockstar",
    slug: "gta-v-rockstar",
    title: "Grand Theft Auto V Rockstar Games Launcher Key",
    platform: "PC",
    region: "GLOBAL",
    imageUrl: "/images/gta-v-rockstar.jpg",
    lowestPrice: 9.12,
    originalPrice: 29.99,
    currency: "EUR",
  },
  {
    id: "under10-human-fall-flat",
    slug: "human-fall-flat",
    title: "Human: Fall Flat Steam Key GLOBAL",
    platform: "PC",
    region: "GLOBAL",
    imageUrl: "/images/human-fall-flat.jpg",
    lowestPrice: 1.06,
    originalPrice: 19.99,
    currency: "EUR",
  },
];

export function GamesUnder10() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

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
        direction === "right"
          ? element.clientWidth * 0.8
          : -element.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-[#4114A0] py-12 text-white">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        {/* HEADING */}
        <h2 className="mb-8 text-xl font-extrabold">
          Games Under €10
        </h2>

        {/* CAROUSEL */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={updateProgress}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {gamesUnder10.map((game) => (
              <div
                key={game.id}
                className="w-[220px] shrink-0 snap-start sm:w-[225px]"
              >
                <ProductCard product={game} />
              </div>
            ))}
          </div>

          {/* LEFT ARROW */}
          
<button
  type="button"
  onClick={() => scroll("left")}
  aria-label="Previous games"
  className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/95 text-[#211342] shadow-lg transition hover:bg-white"
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


          {/* RIGHT ARROW */}
          
<button
  type="button"
  onClick={() => scroll("right")}
  aria-label="Next games"
  className="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/95 text-[#211342] shadow-lg transition hover:bg-white"
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

        {/* PROGRESS BAR */}
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

        {/* SHOW ALL */}
        <div className="mt-5 flex justify-center">
          <Link
            to="/store?maxPrice=10"
            className="min-w-[180px] border border-white/80 px-8 py-2 text-center text-sm font-bold transition hover:bg-white/10"
          >
            Show all
          </Link>
        </div>
      </div>
    </section>
  );
}
