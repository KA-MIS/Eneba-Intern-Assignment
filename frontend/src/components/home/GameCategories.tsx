
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Swords,
  Map,
  Gamepad2,
  Crosshair,
  Shield,
  Ghost,
  Puzzle,
  CircleDot,
  Flag,
  Zap,
  Blocks,
  Waves,
  MousePointerClick,
  Music2,
  Lightbulb,
  Car,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

const categories = [
  { id: "action", name: "Action", count: 20370, icon: Zap },
  { id: "adventure", name: "Adventure", count: 19623, icon: Map },
  { id: "simulation", name: "Simulation", count: 15587, icon: Car },
  { id: "strategy", name: "Strategy", count: 14827, icon: Flag },
  { id: "rpg", name: "RPG", count: 5544, icon: Shield },
  { id: "indie", name: "Indie", count: 5374, icon: Ghost },
  { id: "fps-tps", name: "FPS / TPS", count: 2753, icon: Crosshair },
  { id: "puzzle", name: "Puzzle", count: 1525, icon: Puzzle },
  { id: "sport", name: "Sport", count: 1397, icon: CircleDot },
  { id: "racing", name: "Racing", count: 1199, icon: Flag },
  { id: "fighting", name: "Fighting", count: 799, icon: Swords },
  { id: "platform", name: "Platform", count: 676, icon: Blocks },
  { id: "hack-slash", name: "Hack & Slash", count: 597, icon: Waves },
  { id: "arcade", name: "Arcade", count: 472, icon: Gamepad2 },
  { id: "point-click", name: "Point & Click", count: 287, icon: MousePointerClick },
  { id: "mmo", name: "MMO", count: 210, icon: Swords },
  { id: "music", name: "Music", count: 74, icon: Music2 },
  { id: "educational", name: "Educational", count: 30, icon: Lightbulb },
];

export function GameCategories() {
  const [expanded, setExpanded] = useState(false);

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
                key={category.id}
                to={`/store?category=${encodeURIComponent(category.id)}`}
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
                  {category.count}
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
