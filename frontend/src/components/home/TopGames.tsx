
import { useRef } from "react";
import { Link } from "react-router-dom";

import { ProductCard } from "../products/ProductCard";
import { demoProducts } from "../../data/demoProducts";

export function TopGames() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const topGames = demoProducts.slice(0, 10);

  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;

    if (!slider) return;

    const card = slider.firstElementChild as HTMLElement | null;

    if (!card) return;

    const gap = parseFloat(
      window.getComputedStyle(slider).columnGap
    ) || 16;

    const distance = (card.offsetWidth + gap) * 2;

    slider.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-labelledby="top-games-heading"
      className="w-full bg-[#321477] py-10"
    >
      <div className="mx-auto max-w-7xl px-4">

        {/* HEADER */}
        <div className="mb-7 flex items-center gap-2">
          <h2
            id="top-games-heading"
            className="font-display text-2xl font-bold text-white md:text-3xl"
          >
            Top games
          </h2>

          <span
            title="Popular games"
            className="text-white/60"
          >
            ⓘ
          </span>
        </div>

        {/* SLIDER */}
        <div className="relative">

          <div
            ref={sliderRef}
            aria-label="Top games"
            tabIndex={0}
            className="
              flex gap-4
              overflow-x-auto
              scroll-smooth
              scroll-snap-type-x-mandatory
              pb-4
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {topGames.map((product) => (
              <div
                key={product.id}
                className="
                  w-[75%]
                  shrink-0
                  snap-start
                  sm:w-[calc((100%-16px)/2)]
                  md:w-[calc((100%-32px)/3)]
                  lg:w-[calc((100%-64px)/5)]
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
            aria-label="Previous games"
            className="
              absolute left-2 top-1/2 z-40
              flex h-10 w-10
              -translate-y-1/2
              items-center justify-center
              rounded-full
              bg-[#211342] text-white
              shadow-lg
              transition-colors
              hover:bg-[#4519AC]
              focus-visible:outline-2
              focus-visible:outline-lime
            "
          >
            <span className="text-2xl">‹</span>
          </button>

          {/* RIGHT ARROW */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next games"
            className="
              absolute right-2 top-1/2 z-40
              flex h-10 w-10
              -translate-y-1/2
              items-center justify-center
              rounded-full
              bg-[#211342] text-white
              shadow-lg
              transition-colors
              hover:bg-[#4519AC]
              focus-visible:outline-2
              focus-visible:outline-lime
            "
          >
            <span className="text-2xl">›</span>
          </button>

        </div>

        {/* SHOW ALL */}
        <div className="mt-7 flex justify-center">
          <Link
            to="/store"
            className="
              flex min-w-[200px]
              items-center justify-center
              border border-white
              px-8 py-2.5
              text-sm font-bold text-white
              transition-colors
              hover:bg-white
              hover:text-[#211342]
            "
          >
            Show all
          </Link>
        </div>

      </div>
    </section>
  );
}
