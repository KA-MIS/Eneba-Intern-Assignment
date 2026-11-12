
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function CartPage() {
  const { items, removeItem, itemCount, subtotal } = useCart();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-white">
          Shopping Cart
        </h1>
        <p className="mt-2 text-ink-secondary">
          Review your selected games before checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <section className="flex flex-col items-center justify-center
          rounded-xl border border-line bg-surface px-6 py-20
          text-center">
          <div className="mb-6 text-6xl" aria-hidden="true">
            🛒
          </div>

          <h2 className="font-display text-2xl font-bold text-white">
            Your cart is empty
          </h2>

          <p className="mt-3 max-w-md text-ink-secondary">
            Looks like you haven't added any games yet.
            Explore our store and find your next adventure.
          </p>

          <Link
            to="/store"
            className="mt-8 rounded-xl bg-lime px-8 py-3
              font-bold text-base transition-colors
              hover:bg-lime-hover"
          >
            Browse games
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Your items
              </h2>
              <span className="text-sm text-ink-secondary">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            {items.map((item) => (
              <article
                key={item.offerId}
                className="flex gap-4 rounded-xl border
                  border-line bg-surface p-4 sm:gap-6 sm:p-5"
              >
                <Link
                  to={`/product/${encodeURIComponent(item.slug)}`}
                  className="h-32 w-24 shrink-0 overflow-hidden
                    rounded-lg bg-elevated"
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
                    className="font-semibold text-white hover:text-lime"
                  >
                    {item.title}
                  </Link>

                  <p className="mt-2 text-xs font-semibold text-cyan">
                    {item.platform} / {item.region}
                  </p>

                  <p className="mt-2 text-sm text-ink-secondary">
                    Sold by{" "}
                    <span className="text-white">
                      {item.seller}
                    </span>
                  </p>

                  <div className="mt-auto flex items-end justify-between gap-3">
                    <p className="text-xl font-bold text-lime">
                      {euro.format(item.price)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.offerId)}
                      className="rounded-lg border border-line px-3 py-2
                        text-sm text-ink-secondary transition-colors
                        hover:border-danger hover:text-danger"
                      >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <Link
              to="/store"
              className="inline-flex items-center gap-2
                text-sm font-semibold text-lime hover:underline"
            >
              ← Continue shopping
            </Link>
          </section>

          <aside className="rounded-xl border border-line
            bg-surface p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl font-bold text-white">
              Order summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-ink-secondary">Subtotal</span>
                <span className="text-white">
                  {euro.format(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-ink-secondary">Service fee</span>
                <span className="text-white">
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t border-line pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    Subtotal
                  </span>
                  <span className="text-2xl font-bold text-lime">
                    {euro.format(subtotal)}
                  </span>
                </div>

                <p className="mt-2 text-xs text-ink-muted">
                  Final total will be confirmed at checkout.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled
              title="Checkout integration coming soon"
              className="mt-6 w-full rounded-xl bg-lime
                px-5 py-3 font-bold text-base
                disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proceed to checkout
            </button>

            <p className="mt-4 text-center text-xs text-ink-muted">
              Demo checkout — no payment will be processed.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
