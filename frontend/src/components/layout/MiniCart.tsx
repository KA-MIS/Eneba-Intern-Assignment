
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function MiniCart() {
  const { items, itemCount, subtotal, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Shopping cart, ${itemCount} items`}
        aria-expanded={open}
        aria-controls="navbar-mini-cart"
        className="relative p-1 text-white transition-colors hover:text-[#C6F135]"
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
          <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E43B9B] px-1 text-[10px] font-bold text-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      {open && (
        <div
          id="navbar-mini-cart"
          role="region"
          aria-label="Shopping cart preview"
          className="absolute right-[-56px] top-[calc(100%+20px)] z-[100] w-[min(360px,calc(100vw-24px))] border border-white/10 bg-[#5120BC] shadow-2xl sm:right-0"
        >
          <div className="flex items-center justify-between border-b border-white/15 px-5 py-4">
            <h2 className="font-display text-lg font-bold text-white">
              My shopping cart
            </h2>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close shopping cart"
              className="p-1 text-xl text-white hover:text-[#C6F135]"
            >
              ×
            </button>
          </div>

          {items.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div
                aria-hidden="true"
                className="mb-4 text-5xl text-white/60"
              >
                ⓘ
              </div>

              <h3 className="text-base font-bold text-white">
                Your shopping cart is empty
              </h3>

              <p className="mt-3 text-xs text-white/65">
                It seems you haven't chosen any products yet.
              </p>

              <Link
                to="/store"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex bg-[#C6F135] px-6 py-2.5 text-sm font-bold text-[#211342] hover:bg-[#D4FF3F]"
              >
                Browse games
              </Link>
            </div>
          ) : (
            <>
              <div className="max-h-[340px] space-y-2 overflow-y-auto p-3">
                {items.map((item) => (
                  <div
                    key={item.offerId}
                    className="flex gap-3 bg-[#211342] p-3"
                  >
                    <Link
                      to={`/product/${encodeURIComponent(item.slug)}`}
                      onClick={() => setOpen(false)}
                      className="h-20 w-14 shrink-0 overflow-hidden"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        to={`/product/${encodeURIComponent(item.slug)}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm font-bold text-white hover:text-[#C6F135]"
                      >
                        {item.title}
                      </Link>

                      <p className="mt-1 text-xs text-white/60">
                        {item.platform} · {item.region}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <span className="text-sm font-bold text-[#C6F135]">
                          {euro.format(item.price * item.quantity)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(item.offerId)}
                          aria-label={`Remove ${item.title}`}
                          className="text-xs text-white/60 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/15 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-white/70">
                    Subtotal ({itemCount})
                  </span>

                  <span className="text-lg font-bold text-white">
                    {euro.format(subtotal)}
                  </span>
                </div>

                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center bg-[#C6F135] px-4 py-3 text-sm font-bold text-[#211342] hover:bg-[#D4FF3F]"
                >
                  View shopping cart
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
