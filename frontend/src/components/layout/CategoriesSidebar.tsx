
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

type CategoriesSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const categories = [
  { name: "All offers", path: "/store" },
  { name: "Mobile games", path: "/mobile-games", submenu: true },
  { name: "Games", path: "/store", submenu: true },
  { name: "Gaming eCards", path: "/gaming-ecards", submenu: true },
  { name: "eGift Cards", path: "/gift-cards", submenu: true },
  { name: "E-money cards", path: "/e-money", submenu: true },
  { name: "PSN", path: "/psn" },
  { name: "Xbox", path: "/xbox", submenu: true },
  { name: "Nintendo", path: "/nintendo", submenu: true },
  { name: "Software", path: "/software", submenu: true },
  { name: "Mobile recharges", path: "/mobile-recharges" },
  { name: "eSIM", path: "/esim", submenu: true },
  { name: "Gift Guide", path: "/gift-guide" },
];

export function CategoriesSidebar({
  isOpen,
  onClose,
}: CategoriesSidebarProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab") {
        const sidebar = document.getElementById("categories-sidebar");
        if (!sidebar) return;

        const focusable = Array.from(
          sidebar.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])'
          )
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* DARK OVERLAY */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`
          fixed inset-0 z-[100]
          bg-black/60
          transition-opacity duration-300
          ${
            isOpen
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* SIDEBAR */}
      <aside
        id="categories-sidebar"
        role="dialog"
        aria-modal={isOpen}
        aria-label="Product categories"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`
          fixed inset-y-0 left-0 z-[101]
          flex w-[340px] max-w-[90vw]
          flex-col bg-[#4519AC] text-white
          shadow-2xl
          transition-transform duration-300 ease-in-out
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* SIDEBAR HEADER */}
        <div
          className="
            flex h-[55px] shrink-0
            items-center justify-between
            border-b border-white/10 px-4
          "
        >
          {/* LOGO */}
          <Link
            to="/"
            onClick={onClose}
            aria-label="Home"
            className="flex items-center"
          >
            <img
              src="/images/Logo.png"
              alt="Marketplace logo"
              className="
                h-9 w-auto max-w-[150px]
                object-contain
              "
            />
          </Link>

          {/* CLOSE BUTTON */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close categories"
            className="
              flex h-9 w-9
              items-center justify-center
              rounded transition-colors
              hover:bg-white/10
              focus-visible:outline-2
              focus-visible:outline-white
            "
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CATEGORY LIST */}
        <nav
          aria-label="Categories"
          className="flex-1 overflow-y-auto py-2"
        >
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              onClick={onClose}
              className="
                flex min-h-[34px]
                items-center justify-between
                px-4 py-[7px]
                text-[14px] font-medium
                transition-colors
                hover:bg-white/10
                focus-visible:bg-white/10
                focus-visible:outline-2
                focus-visible:outline-white
              "
            >
              <span>{category.name}</span>

              {/* SUBCATEGORY ARROW */}
              {category.submenu && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
