
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function CartPage() {
  const { items, removeItem, clearCart, itemCount, subtotal } =
    useCart();

  return (
    <main className="min-h-screen bg-[#4519AC] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* PAGE TITLE */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">
              My shopping cart
            </h1>

            <p className="mt-2 text-sm text-white/70">
              Review your selected digital products.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-sm text-white/70 underline underline-offset-4 hover:text-white"
            >
              Clear cart
            </button>
          )}
        </div>

        {/* EMPTY CART */}
        {items.length === 0 ? (
          <section className="mx-auto max-w-2xl bg-[#321477] px-6 py-16 text-center">
            <div
              aria-hidden="true"
              className="mb-5 text-5xl text-[#C6F135]"
            >
              ⓘ
            </div>

            <h2 className="font-display text-2xl font-bold">
              Your shopping cart is empty
            </h2>

            <p className="mt-3 text-sm text-white/65">
              It seems you haven't chosen any products yet.
            </p>

            <Link
              to="/store"
              className="mt-8 inline-flex items-center justify-center bg-[#C6F135] px-8 py-3 text-sm font-bold text-[#211342] transition-colors hover:bg-[#D4FF3F]"
            >
              Explore games
            </Link>
          </section>
        ) : (
          /* CART CONTENT */
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            {/* LEFT COLUMN */}
            <div className="min-w-0 space-y-4">
              <section className="bg-[#321477] p-4 sm:p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold">
                    My cart
                  </h2>

                  <span className="text-sm text-white/70">
                    {itemCount}{" "}
                    {itemCount === 1 ? "product" : "products"}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <article
                      key={item.offerId}
                      className="flex gap-4 bg-[#211342] p-3 sm:p-4"
                    >
                      {/* PRODUCT IMAGE */}
                      <Link
                        to={`/product/${encodeURIComponent(item.slug)}`}
                        className="h-28 w-20 shrink-0 overflow-hidden bg-[#170C32] sm:h-32 sm:w-24"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      {/* PRODUCT DETAILS */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="mb-1 text-xs text-white/60">
                              Sold by{" "}
                              <span className="font-semibold text-[#C6F135]">
                                {item.seller}
                              </span>
                            </p>

                            <Link
                              to={`/product/${encodeURIComponent(item.slug)}`}
                              className="font-semibold text-white hover:text-[#C6F135]"
                            >
                              {item.title}
                            </Link>

                            <p className="mt-2 text-xs font-bold text-[#35D0F1]">
                              {item.platform} · {item.region}
                            </p>
                          </div>

                          {/* REMOVE BUTTON */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.offerId)}
                            aria-label={`Remove ${item.title}`}
                            title="Remove product"
                            className="shrink-0 p-1 text-white/60 hover:text-red-300"
                          >
                            <svg
                              width="19"
                              height="19"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v7M14 10v7" />
                            </svg>
                          </button>
                        </div>

                        {/* QUANTITY AND PRICE */}
                        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                          <span className="text-xs text-white/60">
                            Quantity: {item.quantity}
                          </span>

                          <span className="text-xl font-bold">
                            {euro.format(
                              item.price * item.quantity
                            )}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* SHOPPING LINKS */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/store"
                  className="text-sm font-semibold text-[#C6F135] hover:underline"
                >
                  ← Continue shopping
                </Link>

                <Link
                  to="/gift-cards"
                  className="text-sm text-white/75 hover:text-white"
                >
                  Browse gift cards →
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN - ORDER SUMMARY */}
            <aside className="bg-[#321477] p-5 lg:sticky lg:top-24">
              <h2 className="mb-5 font-display text-lg font-bold">
                Order summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-white/70">
                    Products ({itemCount})
                  </span>

                  <span>{euro.format(subtotal)}</span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-white/70">
                    Service fee
                  </span>

                  <span className="text-white/60">
                    Not calculated
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-white/15" />

              <div className="flex items-center justify-between gap-3">
                <span className="font-bold">
                  Subtotal
                </span>

                <span className="text-2xl font-bold">
                  {euro.format(subtotal)}
                </span>
              </div>

              <p className="mt-2 text-xs text-white/60">
                Final total and availability must be confirmed
                before payment.
              </p>

{/* CHECKOUT NAVIGATION */}
<Link
  to="/checkout"
  className="mt-6 flex w-full items-center justify-center bg-[#C6F135] px-4 py-3 text-sm font-bold text-[#211342] transition hover:bg-[#D4FF3F]"
>
  Proceed to checkout
</Link>

              <p className="mt-3 text-center text-xs text-white/60">
                Demo cart — no payment will be processed.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
