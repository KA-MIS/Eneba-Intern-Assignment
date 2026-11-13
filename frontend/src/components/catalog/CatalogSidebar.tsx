import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import type { ProductCategory, Region } from "../../types/product";

export interface CatalogFilterValues {
  minPrice: string;
  maxPrice: string;
  region: string;
  platform: string;
  brand: string;
  genre: string;
  os: string;
}

interface CatalogSidebarProps {
  category: ProductCategory;
  filters: CatalogFilterValues;
  onChange: (filters: CatalogFilterValues) => void;
  onClear: () => void;
  brands?: string[];
  genreCounts?: Record<string, number>;
}

const inputStyle =
  "w-full min-w-0 border border-[#6541B7] bg-[#351187] " +
  "px-3 py-2 text-sm text-white outline-none " +
  "focus:border-[#C6F135]";

const regions: { value: Region | ""; label: string }[] = [
  { value: "", label: "All regions" },
  { value: "GLOBAL", label: "Global" },
  { value: "EUROPE", label: "Europe" },
  { value: "US", label: "United States" },
];

const platforms = ["PC", "PS5", "Xbox", "Switch"];
const genres = ["Action", "Adventure", "Indie", "RPG", "Simulation", "Strategy", "Casual", "Early Access", "Sports", "Racing", "Massively Multiplayer", "Free To Play"];
const operatingSystems = ["Windows", "Mac", "Linux"];

export function CatalogSidebar({
  category,
  filters,
  onChange,
  onClear,
  brands = [],
  genreCounts = {},
}: CatalogSidebarProps) {
  const [genreSearch, setGenreSearch] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [genresOpen, setGenresOpen] = useState(true);
  const selectedGenres = filters.genre ? filters.genre.split(",").filter(Boolean) : [];
  const filteredGenres = useMemo(
    () => genres.filter((genre) => genre.toLowerCase().includes(genreSearch.trim().toLowerCase())),
    [genreSearch]
  );
  const visibleGenres = expanded || genreSearch ? filteredGenres : filteredGenres.slice(0, 7);

  function toggleGenre(genre: string) {
    const next = selectedGenres.includes(genre)
      ? selectedGenres.filter((item) => item !== genre)
      : [...selectedGenres, genre];
    update("genre", next.join(","));
  }

  function update(
    field: keyof CatalogFilterValues,
    value: string
  ) {
    onChange({ ...filters, [field]: value });
  }

  const isGiftCard = category === "gift_card";

  return (
    <aside
      aria-label="Catalog filters"
      className="w-full shrink-0 bg-[#5120BC] text-white lg:w-[220px]"
    >
      <div className="border-b border-white/15 p-4">
        <h2 className="mb-4 text-sm font-bold">
          Price range (EUR)
        </h2>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            placeholder="Min"
            aria-label="Minimum price"
            className={inputStyle}
          />

          <span>-</span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            placeholder="Max"
            aria-label="Maximum price"
            className={inputStyle}
          />
        </div>
      </div>

      <div className="border-b border-white/15 p-4">
        <h2 className="mb-4 text-sm font-bold">Region</h2>

        <select
          value={filters.region}
          onChange={(e) => update("region", e.target.value)}
          aria-label="Filter by region"
          className={inputStyle}
        >
          {regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
      </div>

      {isGiftCard ? (
        <div className="border-b border-white/15 p-4">
          <h2 className="mb-4 text-sm font-bold">
            Gift Card Brands
          </h2>

          <div className="space-y-3">
            {["", ...brands].map((brand) => (
              <label
                key={brand}
                className="flex cursor-pointer items-center gap-3 text-sm"
              >
                <input
                  type="radio"
                  name="gift-card-brand"
                  checked={filters.brand === brand}
                  onChange={() => update("brand", brand)}
                  className="accent-[#C6F135]"
                />

                <span>{brand || "All brands"}</span>
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-b border-white/15 p-4">
          <h2 className="mb-4 text-sm font-bold">
            Platforms
          </h2>

          <div className="space-y-3">
            {["", ...platforms].map((platform) => (
              <label
                key={platform}
                className="flex cursor-pointer items-center gap-3 text-sm"
              >
                <input
                  type="radio"
                  name="game-platform"
                  checked={filters.platform === platform}
                  onChange={() => update("platform", platform)}
                  className="accent-[#C6F135]"
                />

                <span>{platform || "All platforms"}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {!isGiftCard && (
        <>
          <div className="border-b border-white/15 p-4">
            <button
              type="button"
              onClick={() => setGenresOpen((value) => !value)}
              aria-expanded={genresOpen}
              className="mb-4 flex w-full items-center justify-between text-left text-sm font-bold"
            >
              Genres {genresOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {genresOpen && (
              <>
                <div className="relative mb-4">
                  <input
                    type="search"
                    value={genreSearch}
                    onChange={(event) => setGenreSearch(event.target.value)}
                    placeholder="Search genres"
                    aria-label="Search genres"
                    className={`${inputStyle} pr-9`}
                  />
                  <Search size={17} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70" />
                </div>
                <div className="space-y-3">
                  {visibleGenres.map((genre) => (
                    <label key={genre} className="flex cursor-pointer items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => toggleGenre(genre)}
                        className="h-4 w-4 shrink-0 accent-[#C6F135]"
                      />
                      <span className="min-w-0 flex-1 break-words">{genre}</span>
                      <span className="text-xs text-white/65">{genreCounts[genre] ?? "–"}</span>
                    </label>
                  ))}
                  {filteredGenres.length === 0 && (
                    <p className="text-xs text-white/65">No genres found.</p>
                  )}
                </div>
                {!genreSearch && filteredGenres.length > 7 && (
                  <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    className="mt-4 flex items-center gap-1 text-sm font-bold text-[#C6F135]"
                  >
                    {expanded ? "Show less" : `${filteredGenres.length - 7} more`}
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                )}
              </>
            )}
          </div>
          <div className="border-b border-white/15 p-4">
            <h2 className="mb-4 text-sm font-bold">Operating system</h2>
            <select value={filters.os} onChange={(e) => update("os", e.target.value)} aria-label="Filter by operating system" className={inputStyle}>
              <option value="">All operating systems</option>
              {operatingSystems.map((os) => <option key={os} value={os}>{os}</option>)}
            </select>
          </div>
        </>
      )}

      <div className="p-4">
        <button
          type="button"
          onClick={onClear}
          className="w-full border border-[#C6F135] px-4 py-2.5 text-sm font-bold text-[#C6F135] transition hover:bg-[#C6F135] hover:text-[#211342]"
        >
          Clear all filters
        </button>
      </div>
    </aside>
  );
}
