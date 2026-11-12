
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const giftCards = [
  { id: "itunes", name: "iTunes Gift Card", image: "/images/itunes.jpg" },
  { id: "razer", name: "Razer Gold Gift Card", image: "/images/razer-gold.jpg" },
  { id: "netflix", name: "Netflix Gift Card", image: "/images/netflix.jpg" },
  { id: "amazon", name: "Amazon Gift Card", image: "/images/amazon.jpg" },
  { id: "spotify", name: "Spotify Gift Card", image: "/images/spotify.jpg" },
  { id: "binance", name: "Binance Gift Card", image: "/images/binance.jpg" },
  { id: "googleplay", name: "Google Play Gift Card", image: "/images/google-play.jpg" },
  { id: "tinder", name: "Tinder Gift Card", image: "/images/tinder.jpg" },
  { id: "discord", name: "Discord Gift Card", image: "/images/discord.jpg" },
  { id: "airbnb", name: "Airbnb Gift Card", image: "/images/airbnb.jpg" },
  { id: "uber", name: "Uber Gift Card", image: "/images/uber.jpg" },
  { id: "ikea", name: "IKEA Gift Card", image: "/images/ikea.jpg" },
  { id: "ubereats", name: "Uber Eats Gift Card", image: "/images/uber-eats.jpg" },
  { id: "bitnovo", name: "Bitnovo Gift Card", image: "/images/bitnovo.jpg" },
  { id: "zalando", name: "Zalando Gift Card", image: "/images/zalando.jpg" },
] as const;

export function BestSellingGiftCards() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const maxScroll = slider.scrollWidth - slider.clientWidth;

    setCanScrollLeft(slider.scrollLeft > 2);
    setCanScrollRight(slider.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    updateScrollButtons();

    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(slider);

    // Detect changes to carousel content dimensions.
    Array.from(slider.children).forEach((child) => {
      observer.observe(child);
    });

    return () => observer.disconnect();
  }, [updateScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const card = slider.firstElementChild as HTMLElement | null;
    if (!card) return;

    const styles = window.getComputedStyle(slider);
    const gap = parseFloat(styles.columnGap) || 16;

    const distance = (card.offsetWidth + gap) * 2;

    slider.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-labelledby="gift-cards-heading"
      className="w-full bg-[#4519AC] py-10"
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* HEADER */}
        <div className="mb-7 flex items-center gap-2">
          <h2
            id="gift-cards-heading"
            className="font-display text-2xl font-bold text-white md:text-3xl"
          >
            Best selling eGift Cards
          </h2>

          <span
            title="Popular digital gift cards"
            className="text-white/60"
            aria-label="Popular digital gift cards"
          >
            ⓘ
          </span>
        </div>

        {/* CAROUSEL */}
        <div className="relative">
          <div
            ref={sliderRef}
            aria-label="Best selling gift cards"
            role="region"
            tabIndex={0}
            onScroll={updateScrollButtons}
            className="
              flex gap-4 overflow-x-auto
              scroll-smooth snap-x snap-mandatory
              pb-3
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              focus-visible:outline-2
              focus-visible:outline-lime
            "
          >
            {giftCards.map((card) => (
              <Link
                key={card.id}
                to="/gift-cards"
                aria-label={`Browse ${card.name}`}
                className="
                  block shrink-0 snap-start
                  w-[calc((100%-16px)/2)]
                  sm:w-[calc((100%-32px)/3)]
                  md:w-[calc((100%-48px)/4)]
                  lg:w-[calc((100%-80px)/6)]
                  overflow-hidden rounded-lg
                  bg-[#211342]
                  transition-shadow duration-200
                  hover:shadow-xl
                  focus-visible:outline-2
                  focus-visible:outline-lime
                "
              >
                <div className="aspect-[5/7] w-full overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.name}
                    loading="lazy"
                    decoding="async"
                    className="
                      h-full w-full object-cover
                      transition-transform duration-300
                      hover:scale-[1.04]
                    "
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* LEFT ARROW */}
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous gift cards"
            className="
              absolute left-2 top-1/2 z-20
              flex h-10 w-10 -translate-y-1/2
              items-center justify-center
              rounded-full bg-[#211342]
              text-2xl text-white shadow-lg
              transition-colors hover:bg-[#321477]
              focus-visible:outline-2
              focus-visible:outline-lime
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            ‹
          </button>

          {/* RIGHT ARROW */}
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next gift cards"
            className="
              absolute right-2 top-1/2 z-20
              flex h-10 w-10 -translate-y-1/2
              items-center justify-center
              rounded-full bg-[#211342]
              text-2xl text-white shadow-lg
              transition-colors hover:bg-[#321477]
              focus-visible:outline-2
              focus-visible:outline-lime
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            ›
          </button>
        </div>

        {/* SHOW ALL */}
        <div className="mt-7 flex justify-center">
          <Link
            to="/gift-cards"
            className="
              flex min-w-[200px]
              items-center justify-center
              border border-white
              px-8 py-2.5
              text-sm font-bold text-white
              transition-colors
              hover:bg-white hover:text-[#211342]
              focus-visible:outline-2
              focus-visible:outline-lime
            "
          >
            Show all
          </Link>
        </div>
      </div>
    </section>
  );
}
