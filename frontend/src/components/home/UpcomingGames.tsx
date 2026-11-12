
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../products/ProductCard";
import type { Product } from "../../types/product";

interface UpcomingGamesProps {
  products: Product[];
}

export function UpcomingGames({ products }: UpcomingGamesProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.firstElementChild as HTMLElement | null;
    const distance = (card?.offsetWidth ?? 220) + 16;

    slider.scrollBy({
      left: direction === "left" ? -distance * 2 : distance * 2,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-labelledby="upcoming-games-heading"
      className="w-full bg-[#4519AC] py-10"
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* HEADER */}
        <div className="mb-7 flex items-center gap-2">
          <h2
            id="upcoming-games-heading"
            className="font-display text-2xl font-bold text-white md:text-3xl"
          >
            Upcoming games
          </h2>

          <span
            title="Upcoming game releases"
            className="text-white/60"
          >
            ⓘ
          </span>
        </div>

        {/* PRODUCT SLIDER */}
        <div className="relative">
          <div
            ref={sliderRef}
            aria-label="Upcoming games"
            tabIndex={0}
            className="
              flex gap-4 overflow-x-auto
              scroll-smooth pb-3
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {products.map((product) => (
              <div
                key={product.slug}
                className="
                  w-[220px] shrink-0
                  sm:w-[230px] lg:w-[235px]
                "
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* LEFT ARROW */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous upcoming games"
            className="
              absolute left-2 top-[190px] z-20
              flex h-10 w-10 items-center
              justify-center rounded-full
              bg-[#211342] text-2xl text-white
              shadow-lg hover:bg-[#321477]
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
            aria-label="Next upcoming games"
            className="
              absolute right-2 top-[190px] z-20
              flex h-10 w-10 items-center
              justify-center rounded-full
              bg-[#211342] text-2xl text-white
              shadow-lg hover:bg-[#321477]
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* SHOW ALL */}
        <div className="mt-7 flex justify-center">
          <Link
            to="/new"
            className="
              flex min-w-[200px]
              items-center justify-center
              border border-white px-8 py-2.5
              text-sm font-bold text-white
              transition-colors
              hover:bg-white hover:text-[#211342]
            "
          >
            Show all
          </Link>
        </div>
      </div>
    </section>
  );
}
