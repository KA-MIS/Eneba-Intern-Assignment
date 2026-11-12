
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { SearchBar } from "../ui/SearchBar";
import { CategoriesSidebar } from "./CategoriesSidebar";

export function Navbar() {
  const { itemCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const categories = [
    { label: "Cheap Games", path: "/deals" },
    { label: "Software", path: "/software" },
    { label: "eGift Cards", path: "/gift-cards" },
    { label: "Eneba Gift Cards", path: "/gift-cards" },
    { label: "FM27", path: "/search?q=FM27" },
    { label: "GTA 6", path: "/search?q=GTA%206" },
  ];

  const openCategories = () => {
    setMobileMenuOpen(false);
    setCategoriesOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full text-white">
        {/* TOP HEADER */}
        <div className="bg-[#4219A8]">
          <div
            className="
              mx-auto flex h-[92px] max-w-7xl
              items-center gap-5 px-4
            "
          >
            {/* LOGO */}
            <Link
              to="/"
              aria-label="Home"
              className="flex shrink-0 items-center"
            >
              <img
                src="/images/Logo.png"
                alt="Store logo"
                className="h-12 w-auto max-w-[180px] object-contain"
              />
            </Link>

            {/* SEARCH */}
            <div className="hidden min-w-0 flex-1 md:block">
              <SearchBar />
            </div>

            {/* LANGUAGE / CURRENCY */}
            <div
              className="
                hidden shrink-0 items-center gap-2
                text-xs font-medium lg:flex
              "
            >
              <span aria-hidden="true">🌐</span>
              <span>English EU | EUR</span>
            </div>

            {/* ACTIONS */}
            <div className="ml-auto flex shrink-0 items-center gap-4">
              {/* WISHLIST */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                title="Wishlist"
                className="transition-colors hover:text-[#FFDD00]"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"
                  />
                </svg>
              </Link>

              {/* CART */}
              <Link
                to="/cart"
                aria-label={`Shopping cart, ${itemCount} items`}
                className="
                  relative transition-colors
                  hover:text-[#FFDD00]
                "
              >
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
                  />
                </svg>

                {itemCount > 0 && (
                  <span
                    className="
                      absolute -right-2 -top-2
                      flex h-[17px] min-w-[17px]
                      items-center justify-center
                      rounded-full bg-magenta px-1
                      text-[10px] font-bold text-white
                    "
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* ACCOUNT */}
              <Link
                to="/login"
                className="
                  hidden items-center gap-2
                  text-xs font-semibold
                  transition-colors
                  hover:text-[#FFDD00] sm:flex
                "
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 21v-2a8 8 0 0116 0v2"
                  />
                </svg>
                <span>Log in | Register</span>
              </Link>

              {/* MOBILE MENU */}
              <button
                type="button"
                aria-label="Toggle navigation"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="
                  rounded p-2 hover:bg-white/10
                  md:hidden
                "
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={
                      mobileMenuOpen
                        ? "M6 6l12 12M18 6L6 18"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div className="px-4 pb-4 md:hidden">
            <SearchBar />
          </div>
        </div>

        {/* SECOND NAVIGATION BAR */}
        <div className="hidden bg-[#32147D] md:block">
          <nav
            aria-label="Store navigation"
            className="
              mx-auto flex h-[46px] max-w-7xl
              items-center gap-6
              overflow-x-auto px-4
            "
          >
            {/* CATEGORIES BUTTON */}
            <button
              type="button"
              onClick={openCategories}
              aria-expanded={categoriesOpen}
              aria-controls="categories-sidebar"
              className="
                flex h-full shrink-0
                items-center gap-2
                whitespace-nowrap
                bg-[#211047] px-3
                text-sm font-semibold
                text-[#FFDD00]
                transition-colors
                hover:bg-[#170B34]
              "
            >
              <span aria-hidden="true" className="text-xl">
                ☰
              </span>
              Categories
            </button>

            {/* OTHER NAVIGATION LINKS */}
            {categories.map((category) => (
              <Link
                key={`${category.label}-${category.path}`}
                to={category.path}
                className="
                  shrink-0 whitespace-nowrap
                  text-sm font-medium text-white
                  transition-colors
                  hover:text-[#FFDD00]
                "
              >
                {category.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="
              flex flex-col gap-1
              bg-[#32147D] px-4 py-3
              md:hidden
            "
          >
            <button
              type="button"
              onClick={openCategories}
              aria-expanded={categoriesOpen}
              aria-controls="categories-sidebar"
              className="
                rounded px-3 py-3 text-left
                text-sm font-semibold
                text-[#FFDD00]
                hover:bg-white/10
              "
            >
              ☰ Categories
            </button>

            {categories.map((category) => (
              <Link
                key={`${category.label}-${category.path}`}
                to={category.path}
                onClick={() => setMobileMenuOpen(false)}
                className="
                  rounded px-3 py-3 text-sm
                  text-white hover:bg-white/10
                "
              >
                {category.label}
              </Link>
            ))}

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="
                rounded px-3 py-3 text-sm
                text-white hover:bg-white/10
                sm:hidden
              "
            >
              Log in | Register
            </Link>
          </nav>
        )}
      </header>

      {/* CATEGORIES SIDEBAR */}
      <CategoriesSidebar
        isOpen={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
      />
    </>
  );
}
