
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { SearchBar } from "../ui/SearchBar";
import { CategoriesSidebar } from "./CategoriesSidebar";
import { MiniCart } from "./MiniCart";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const accountRef = useRef<HTMLDivElement>(null);

  const { user, loading, signOut } = useAuth();

  const categories = [
    { label: "Cheap Games", path: "/deals" },
    { label: "Software", path: "/software" },
    { label: "eGift Cards", path: "/gift-cards" },
    { label: "Eneba Gift Cards", path: "/gift-cards" },
    { label: "FM27", path: "/search?q=FM27" },
    { label: "GTA 6", path: "/search?q=GTA%206" },
  ];

  const accountLinks = [
    { label: "My Account", path: "/account" },
    { label: "My Orders", path: "/account/orders" },
    { label: "Keys Library", path: "/account/keys" },
    { label: "Settings", path: "/account/settings" },
  ];

  const openCategories = () => {
    setMobileMenuOpen(false);
    setCategoriesOpen(true);
  };

  // Close account menu when clicking outside
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    setLogoutError("");

    const result = await signOut();

    if (result.error) {
      setLogoutError(result.error);
      return;
    }

    setAccountOpen(false);
    setMobileMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full text-white">
        {/* TOP HEADER */}
        <div className="bg-[#4219A8]">
          <div
            className="
              mx-auto flex h-[92px] max-w-[1120px]
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

              {/* MINI CART */}
              <MiniCart />

              {/* ACCOUNT - DESKTOP */}
              <div
                ref={accountRef}
                className="relative hidden sm:block"
              >
                {loading ? (
                  <div className="h-8 w-24 animate-pulse rounded bg-white/10" />
                ) : user ? (
                  <>
                    {/* LOGGED-IN USER BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen((open) => !open);
                        setLogoutError("");
                      }}
                      aria-expanded={accountOpen}
                      aria-haspopup="true"
                      className="
                        flex items-center gap-2
                        text-sm font-semibold text-white
                        transition-colors hover:text-[#C6F135]
                      "
                    >
                      <span
                        className="
                          flex h-9 w-9 items-center
                          justify-center rounded-full
                          bg-[#251547] text-[#C6F135]
                        "
                      >
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </span>

                      <span className="max-w-28 truncate">
                        {user.email?.split("@")[0] || "My account"}
                      </span>

                      <span aria-hidden="true">
                        {accountOpen ? "⌃" : "⌄"}
                      </span>
                    </button>

                    {/* ACCOUNT DROPDOWN */}
                    {accountOpen && (
                      <div
                        className="
                          absolute right-0 top-full z-[100]
                          mt-3 w-72 rounded-xl
                          border border-[#49336D]
                          bg-[#1A0E33] p-2 shadow-2xl
                        "
                      >
                        {/* USER INFO */}
                        <div className="border-b border-[#49336D] px-3 py-4">
                          <p className="text-xs text-[#B8AEDB]">
                            Signed in as
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold">
                            {user.email}
                          </p>
                        </div>

                        {/* ACCOUNT LINKS */}
                        <div className="py-2">
                          {accountLinks.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setAccountOpen(false)}
                              className="
                                block rounded-lg px-3 py-3
                                text-sm text-white
                                transition-colors
                                hover:bg-[#251547]
                                hover:text-[#C6F135]
                              "
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>

                        {/* LOGOUT */}
                        <div className="border-t border-[#49336D] pt-2">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="
                              w-full rounded-lg px-3 py-3
                              text-left text-sm text-red-300
                              transition-colors
                              hover:bg-[#251547]
                            "
                          >
                            Log out
                          </button>

                          {logoutError && (
                            <p
                              role="alert"
                              className="px-3 py-2 text-xs text-red-300"
                            >
                              {logoutError}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* NOT LOGGED IN */
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <svg
                      className="h-6 w-6 shrink-0 text-white"
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

                    <Link
                      to="/login"
                      className="whitespace-nowrap text-white transition-colors hover:text-[#FFDD00]"
                    >
                      Log in
                    </Link>

                    <span className="text-white/50">|</span>

                    <Link
                      to="/register"
                      className="whitespace-nowrap text-white transition-colors hover:text-[#FFDD00]"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* MOBILE MENU BUTTON */}
              <button
                type="button"
                aria-label="Toggle navigation"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() =>
                  setMobileMenuOpen((open) => !open)
                }
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
              mx-auto flex h-[46px] max-w-[1120px]
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
              <span
                aria-hidden="true"
                className="text-xl"
              >
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
            {/* CATEGORIES */}
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

            {/* CATEGORY LINKS */}
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

            {/* MOBILE ACCOUNT */}
            {loading ? (
              <p className="px-3 py-3 text-sm text-[#B8AEDB]">
                Loading account...
              </p>
            ) : user ? (
              <>
                <p className="truncate px-3 py-3 text-sm text-[#C6F135]">
                  {user.email}
                </p>

                {accountLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="
                      rounded px-3 py-3 text-sm
                      text-white hover:bg-white/10
                    "
                  >
                    {item.label}
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    rounded px-3 py-3 text-left
                    text-sm text-red-300 hover:bg-white/10
                  "
                >
                  Log out
                </button>

                {logoutError && (
                  <p role="alert" className="px-3 text-xs text-red-300">
                    {logoutError}
                  </p>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    rounded px-3 py-3 text-sm
                    text-white hover:text-[#FFDD00]
                  "
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    rounded px-3 py-3 text-sm
                    text-white hover:text-[#FFDD00]
                  "
                >
                  Register
                </Link>
              </>
            )}
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
