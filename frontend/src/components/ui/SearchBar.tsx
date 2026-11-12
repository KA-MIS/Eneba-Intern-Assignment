
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <form
      role="search"
      onSubmit={handleSearch}
      className="relative w-full"
    >
      <label htmlFor="marketplace-search" className="sr-only">
        Search games
      </label>

      <svg
        className="pointer-events-none absolute left-4
          top-1/2 h-5 w-5 -translate-y-1/2 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>

      <input
        id="marketplace-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for games, top-ups and more"
        maxLength={120}
        className="h-12 w-full border border-white/80
          bg-[#4219A8] pl-12 pr-4 text-sm
          font-medium text-white
          placeholder:text-[#C2A9F5]
          outline-none transition-colors
          focus:border-[#FFDD00]
          focus:ring-1 focus:ring-[#FFDD00]"
      />
    </form>
  );
}
