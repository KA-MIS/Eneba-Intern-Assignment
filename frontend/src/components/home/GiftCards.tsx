
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

const BRANDS = [
  "Amazon",
  "Netflix",
  "Spotify",
  "Discord",
] as const;

type Brand = (typeof BRANDS)[number];

interface BrandCard {
  brand: Brand;
  imageUrl: string;
}

function getBrand(title: string): Brand | null {
  const normalized = title.trim().toLowerCase();

  for (const brand of BRANDS) {
    if (normalized.startsWith(brand.toLowerCase())) {
      return brand;
    }
  }

  return null;
}

export function GiftCards() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [cards, setCards] = useState<BrandCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBrands() {
      try {
        setLoading(true);
        setError(null);

        const products: Product[] = await getProducts(
          {
            category: "gift_card",
            sort: "title_asc",
            limit: 100,
          },
          controller.signal
        );

        if (controller.signal.aborted) return;

        const uniqueBrands = new Map<Brand, BrandCard>();

        for (const product of products) {
          const brand = getBrand(product.title);

          if (
            brand &&
            product.imageUrl &&
            !uniqueBrands.has(brand)
          ) {
            uniqueBrands.set(brand, {
              brand,
              imageUrl: product.imageUrl,
            });
          }
        }

        setCards(
          BRANDS.flatMap((brand) => {
            const card = uniqueBrands.get(brand);
            return card ? [card] : [];
          })
        );
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load gift card brands."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadBrands();

    return () => controller.abort();
  }, []);

  function scroll(direction: "left" | "right") {
    const slider = sliderRef.current;

    if (!slider) return;

    const card = slider.firstElementChild as HTMLElement | null;

    if (!card) return;

    const gap =
      parseFloat(window.getComputedStyle(slider).columnGap) || 16;

    const distance = card.offsetWidth + gap;

    slider.scrollBy({
      left: direction === "left" ? -distance * 2 : distance * 2,
      behavior: "smooth",
    });
  }

  return (
    <section
      aria-labelledby="gift-brands-heading"
      className="w-full bg-[#321477] py-10"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center gap-3">
          <h2
            id="gift-brands-heading"
            className="font-display text-2xl font-bold text-white md:text-3xl"
          >
            Explore eGift Cards
          </h2>

          <span
            title="Browse gift cards by brand"
            className="text-white/60"
          >
            ⓘ
          </span>
        </div>

        {loading && (
          <p className="py-10 text-white/70">
            Loading gift card brands...
          </p>
        )}

        {!loading && error && (
          <p role="alert" className="py-10 text-red-200">
            {error}
          </p>
        )}

        {!loading && !error && cards.length === 0 && (
          <p className="py-10 text-white/70">
            No gift card brands are available yet.
          </p>
        )}

        {!loading && !error && cards.length > 0 && (
          <div className="relative">
            <div
              ref={sliderRef}
              aria-label="Gift card brands"
              tabIndex={0}
              className="
                flex snap-x snap-mandatory gap-4
                overflow-x-auto scroll-smooth pb-2
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                focus-visible:outline-2
                focus-visible:outline-[#C6F135]
              "
            >
              {cards.map((card) => (
                <Link
                  key={card.brand}
                  to={`/gift-cards?brand=${encodeURIComponent(
                    card.brand
                  )}`}
                  aria-label={`Browse ${card.brand} gift cards`}
                  className="
                    group block w-[65%] shrink-0 snap-start
                    overflow-hidden bg-[#211342]
                    transition-transform duration-200
                    hover:-translate-y-1
                    focus-visible:outline-2
                    focus-visible:outline-[#C6F135]
                    sm:w-[calc((100%-16px)/2)]
                    md:w-[calc((100%-32px)/3)]
                    lg:w-[calc((100%-80px)/6)]
                  "
                >
                  <div className="aspect-[5/7] w-full overflow-hidden">
                    <img
                      src={card.imageUrl}
                      alt={`${card.brand} gift cards`}
                      loading="lazy"
                      className="
                        h-full w-full object-cover
                        transition-transform duration-300
                        group-hover:scale-105
                      "
                    />
                  </div>
                </Link>
              ))}
            </div>

            {cards.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  aria-label="Previous brands"
                  className="
                    absolute -left-4 top-1/2 z-20
                    flex h-10 w-10 -translate-y-1/2
                    items-center justify-center rounded-full
                    bg-[#211342] text-2xl text-white
                    shadow-lg transition
                    hover:bg-[#4519AC]
                    focus-visible:outline-2
                    focus-visible:outline-[#C6F135]
                  "
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={() => scroll("right")}
                  aria-label="Next brands"
                  className="
                    absolute -right-4 top-1/2 z-20
                    flex h-10 w-10 -translate-y-1/2
                    items-center justify-center rounded-full
                    bg-[#211342] text-2xl text-white
                    shadow-lg transition
                    hover:bg-[#4519AC]
                    focus-visible:outline-2
                    focus-visible:outline-[#C6F135]
                  "
                >
                  ›
                </button>
              </>
            )}
          </div>
        )}

        <div className="mt-9 flex justify-center">
          <Link
            to="/gift-cards"
            className="
              flex min-w-[200px] items-center
              justify-center border border-white
              px-8 py-2.5 text-sm font-bold
              text-white transition-colors
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
