
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../products/ProductCard";
import type { Product } from "../../types/product";

interface BestSellingGiftCardProductsProps {
  products: Product[];
}

export function BestSellingGiftCardProducts({
  products,
}: BestSellingGiftCardProductsProps) {
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
      aria-labelledby="best-selling-gift-card-products"
      className="w-full bg-[#321477] py-10"
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* HEADER */}
        <div className="mb-7 flex items-center gap-2">
          <h2
            id="best-selling-gift-card-products"
            className="font-display text-2xl font-bold text-white md:text-3xl"
          >
            Best selling gift cards
          </h2>

          <span
            title="Popular gift card offers"
            className="text-white/60"
          >
            ⓘ
          </span>
        </div>

        {/* PRODUCT SLIDER */}
        <div className="relative">
          <div
            ref={sliderRef}
            aria-label="Best selling gift card products"
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
            aria-label="Previous gift cards"
            className="
              absolute left-2 top-[190px] z-20
              flex h-10 w-10 items-center
              justify-center rounded-full
              bg-[#211342] text-2xl text-white
              shadow-lg hover:bg-[#4519AC]
            "
          >
            {"<"}
          </button>

          {/* RIGHT ARROW */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next gift cards"
            className="
              absolute right-2 top-[190px] z-20
              flex h-10 w-10 items-center
              justify-center rounded-full
              bg-[#211342] text-2xl text-white
              shadow-lg hover:bg-[#4519AC]
            "
          >
            {">"}
          </button>
        </div>

        {/* SHOW ALL */}
        <div className="mt-7 flex justify-center">
          <Link
            to="/gift-cards"
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
