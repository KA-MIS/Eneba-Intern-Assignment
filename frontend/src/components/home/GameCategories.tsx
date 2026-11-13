import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { Link } from "react-router-dom";
import {
  Swords,
  Map,
  Gamepad2,
  Shield,
  Ghost,
  CircleDot,
  Flag,
  Zap,
  Car,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const categories = [
  { name: "Action", icon: Zap },
  { name: "Adventure", icon: Map },
  { name: "Simulation", icon: Car },
  { name: "Strategy", icon: Flag },
  { name: "RPG", icon: Shield },
  { name: "Indie", icon: Ghost },
  { name: "Sports", icon: CircleDot },
  { name: "Racing", icon: Flag },
  { name: "Casual", icon: Gamepad2 },
  { name: "Massively Multiplayer", icon: Swords },
  { name: "Early Access", icon: Zap },
  { name: "Free To Play", icon: Gamepad2 },
];

export function GameCategories() {
  const [expanded, setExpanded] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const controller = new AbortController();
    async function loadCounts() {
      try {
        const all = [];
        for (let page = 1; page <= 100; page++) {
          const batch = await getProducts({ category: "game", limit: 100, page }, controller.signal);
          all.push(...batch);
          if (batch.length < 100) break;
        }
        if (controller.signal.aborted) return;
        const next: Record<string, number> = {};
        for (const product of all) {
          for (const genre of product.genres ?? []) {
            next[genre] = (next[genre] ?? 0) + 1;
          }
        }
        setCounts(next);
      } catch (error) {
        if (!controller.signal.aborted) console.error("Failed to load genre counts", error);
      }
    }
    void loadCounts();
    return () => controller.abort();
  }, []);

  const visibleCategories = expanded
    ? categories
    : categories.slice(0, 7);

  return (
    <section
      aria-labelledby="game-categories-heading"
      className="w-full bg-[#321477] py-12"
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* HEADER */}
        <h2
          id="game-categories-heading"
          className="mb-8 font-display text-2xl font-bold text-white md:text-3xl"
        >
          Categories
        </h2>

        {/* CATEGORY GRID */}
        <div
          className="
            grid grid-cols-2 gap-4
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-7
          "
        >
          {visibleCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                to={`/store?genre=${encodeURIComponent(category.name)}`}
                className="
                  group flex min-h-[140px]
                  flex-col items-center justify-between
                  bg-[#5424D0] px-3 py-4
                  text-center text-white
                  transition-colors duration-200
                  hover:bg-[#6634E8]
                  focus-visible:outline-2
                  focus-visible:outline-white
                "
              >
                {/* CATEGORY COUNT */}
                <span className="text-[13px] font-bold">
                  {counts[category.name] ?? "–"}
                </span>

                {/* ICON */}
                <Icon
                  size={38}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="
                    transition-transform duration-200
                    group-hover:scale-110
                  "
                />

                {/* CATEGORY NAME */}
                <span className="text-[13px] font-bold">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* LOAD MORE / LESS */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((previous) => !previous)}
            aria-expanded={expanded}
            className="
              flex min-w-[195px]
              items-center justify-center gap-2
              border border-white
              px-8 py-2.5
              text-sm font-bold text-white
              transition-colors
              hover:bg-white hover:text-[#211342]
              focus-visible:outline-2
              focus-visible:outline-white
            "
          >
            {expanded ? (
              <>
                Show less
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                Load more
                <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
