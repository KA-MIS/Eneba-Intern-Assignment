import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Banner = {
  id: string;
  label: string;
  image_full: string;
  image_small: string;
  destination_path: string;
  sort_order: number;
};

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

export function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeId, setActiveId] = useState("deals");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBanners() {
      try {
        const response = await fetch(
          `${API_URL}/api/homepage/banners`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load promotions");
        }

        const result: { data?: Banner[] } =
          await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid banner response");
        }

        if (!controller.signal.aborted) {
          setBanners(result.data);
          setActiveId(
            result.data.find((item) => item.id === "deals")?.id ??
            result.data[0]?.id ??
            ""
          );
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Promotions are temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadBanners();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section
        aria-label="Loading promotions"
        className="h-[240px] animate-pulse bg-[#4519AC] sm:h-[300px] lg:h-[380px]"
      />
    );
  }

  if (error || banners.length === 0) {
    return (
      <section className="bg-[#4519AC] px-5 py-8 text-center text-white">
        {error || "No promotions available."}
      </section>
    );
  }

  const activeBanner =
    banners.find((banner) => banner.id === activeId) ??
    banners[0];

  const sideBanners = banners.filter(
    (banner) => banner.id !== activeBanner.id
  );

  return (
    <section
      aria-label="Featured promotions"
      className="m-0 w-full bg-[#4519AC] p-0"
    >
      <div className="flex h-[240px] w-full gap-[2px] overflow-hidden sm:h-[300px] lg:h-[380px]">
        <Link
          to={activeBanner.destination_path}
          aria-label={`Open ${activeBanner.label}`}
          className="relative block h-full min-w-0 flex-[4] overflow-hidden"
        >
          <img
            src={activeBanner.image_full}
            alt={activeBanner.label}
            className="block h-full w-full object-cover"
          />
        </Link>

        <div className="flex h-full min-w-0 flex-1 gap-[2px]">
          {sideBanners.map((banner) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setActiveId(banner.id)}
              aria-label={`Show ${banner.label}`}
              className="relative h-full min-w-0 flex-1 overflow-hidden bg-[#251547] focus-visible:outline-2 focus-visible:outline-lime"
            >
              <img
                src={banner.image_small}
                alt=""
                className="block h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}