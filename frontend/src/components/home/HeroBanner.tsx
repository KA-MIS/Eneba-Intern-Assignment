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
  const [activeId, setActiveId] = useState("");
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
          throw new Error("Failed to load banners");
        }

        const result: { data?: Banner[] } =
          await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid response");
        }

        if (!controller.signal.aborted) {
          const sorted = [...result.data].sort(
            (a, b) => a.sort_order - b.sort_order
          );

          setBanners(sorted);
          setActiveId(
            sorted.find((item) => item.id === "main")?.id ??
            sorted[0]?.id ??
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
        className="h-[380px] animate-pulse bg-[#251547]"
      />
    );
  }

  if (error || banners.length === 0) {
    return (
      <section className="bg-[#251547] p-8 text-center text-white">
        {error || "No promotions available."}
      </section>
    );
  }

  return (
    <section
      aria-label="Featured promotions"
      className="w-full bg-[#32117C]"
    >
      <div className="flex h-[230px] w-full gap-[3px] overflow-hidden sm:h-[310px] lg:h-[380px]">

        {banners.map((banner) => {
          const active = banner.id === activeId;

          return (
            <div
              key={banner.id}
              className="relative h-full min-w-0 overflow-hidden transition-[flex] duration-500 ease-in-out"
              style={{
                flex: active ? "7 1 0%" : "1 1 0%",
              }}
            >
              {active ? (
                <Link
                  to={banner.destination_path}
                  aria-label={`Open ${banner.label}`}
                  className="group relative block h-full w-full overflow-hidden"
                >
                  <img
                    src={banner.image_full}
                    alt={banner.label}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
                  />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveId(banner.id)}
                  aria-label={`Show ${banner.label}`}
                  className="group relative block h-full w-full overflow-hidden bg-[#251547] focus-visible:outline-2 focus-visible:outline-[#C6F135]"
                >
                  <img
                    src={banner.image_small}
                    alt={banner.label}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              )}
            </div>
          );
        })}

      </div>
    </section>
  );
}