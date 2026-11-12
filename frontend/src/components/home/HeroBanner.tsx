
import { useState } from "react";
import { Link } from "react-router-dom";

export interface HeroBannerData {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
}

interface HeroBannerProps {
  data: HeroBannerData;
}

const banners = [
  {
    id: "main",
    full: "/images/banners/main-banner.jpg",
    small: "/images/banners/main-banner-small.jpg",
    path: "/gift-cards",
    label: "Gift Cards",
  },
  {
    id: "deals",
    full: "/images/banners/game-deals.jpg",
    small: "/images/banners/game-deals-small.jpg",
    path: "/deals",
    label: "Game Deals",
  },
  {
    id: "new",
    full: "/images/banners/new-releases-small.jpg",
    small: "/images/banners/new-releases-small.jpg",
    path: "/new",
    label: "New Releases",
  },
  {
    id: "software",
    full: "/images/banners/software-small.jpg",
    small: "/images/banners/software-small.jpg",
    path: "/software",
    label: "Software",
  },
] as const;

export function HeroBanner({ data: _data }: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(1);

  const activeBanner = banners[activeIndex];

  const sideBanners = banners.filter(
    (_, index) => index !== activeIndex
  );

  return (
    <section
      aria-label="Featured promotions"
      className="m-0 w-full bg-[#4519AC] p-0"
    >
      <div
        className="flex h-[240px] w-full gap-[2px]
          overflow-hidden sm:h-[300px] lg:h-[380px]"
      >
        {/* MAIN BANNER */}
        <Link
          to={activeBanner.path}
          aria-label={`Open ${activeBanner.label}`}
          className="relative block h-full min-w-0
            flex-[4] overflow-hidden"
        >
          <img
            src={activeBanner.full}
            alt={activeBanner.label}
            className="block h-full w-full object-cover"
          />
        </Link>

        {/* SMALL BANNERS */}
        <div className="flex h-full min-w-0 flex-1 gap-[2px]">
          {sideBanners.map((banner) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => {
                const index = banners.findIndex(
                  (item) => item.id === banner.id
                );

                if (index >= 0) {
                  setActiveIndex(index);
                }
              }}
              aria-label={`Show ${banner.label}`}
              className="relative h-full min-w-0 flex-1
                overflow-hidden bg-[#251547]
                focus-visible:outline-2
                focus-visible:outline-lime"
            >
              <img
                src={banner.small}
                alt=""
                className="block h-full w-full object-cover
                  transition-transform duration-300
                  hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
