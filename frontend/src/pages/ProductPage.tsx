
import { useParams, Link } from "react-router-dom";
import { demoProductDetails } from "../data/demoProductDetails";

import { useEffect } from "react";
import { rememberViewedProduct } from "../components/home/RecentlyViewed";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  const product = demoProductDetails.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="font-display text-3xl font-bold">
          Product not found
        </h1>
        <Link to="/store" className="mt-5 inline-block text-lime">
          Back to Store
        </Link>
      </main>
    );
  }

  const formatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: product.currency,
  });

  const offers = [...product.offers]
    .filter((offer) => offer.available)
    .sort((a, b) => a.price - b.price);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <Link to="/store" className="text-ink-secondary hover:text-lime">
          Store
        </Link>
        <span className="mx-3 text-ink-muted">/</span>
        <span className="text-lime">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[300px_1fr]">
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded-card
            border border-line bg-elevated">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <h1 className="font-display text-4xl font-bold text-white">
            {product.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {[product.platform, product.region].map((value) => (
              <span
                key={value}
                className="rounded-lg border border-line
                  bg-elevated px-3 py-2 text-xs text-ink-secondary"
              >
                {value}
              </span>
            ))}
          </div>

          <p className="mt-7 max-w-2xl leading-relaxed text-ink-secondary">
            {product.description}
          </p>

          <div className="mt-8 rounded-card border border-line
            bg-surface p-6">
            <p className="text-sm text-ink-secondary">
              Starting from
            </p>

            <p className="mt-2 font-display text-4xl font-bold text-lime">
              {offers.length > 0
                ? formatter.format(offers[0].price)
                : "Unavailable"}
            </p>

            <a
              href="#seller-offers"
              className="mt-5 inline-flex rounded-xl bg-lime
                px-6 py-3 font-semibold text-base
                hover:bg-lime-hover"
            >
              View seller offers
            </a>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-ink-secondary">
            <p>Publisher: {product.publisher}</p>
            <p>Release date: {product.releaseDate}</p>
            <p>Delivery: Digital key</p>
          </div>
        </div>
      </div>

      <section id="seller-offers" className="mt-16 scroll-mt-24">
        <h2 className="font-display text-3xl font-bold">
          Available offers
        </h2>

        <p className="mt-2 text-ink-secondary">
          Compare sellers and choose your preferred offer.
        </p>

        <div className="mt-6 space-y-3">
          {offers.length === 0 ? (
            <p className="rounded-card border border-line
              bg-surface p-6 text-ink-secondary">
              No offers are currently available.
            </p>
          ) : (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="flex flex-wrap items-center
                  justify-between gap-4 rounded-card
                  border border-line bg-surface p-5"
              >
                <div>
                  <h3 className="font-semibold text-white">
                    {offer.sellerName}
                  </h3>
                  <p className="mt-1 text-sm text-ink-secondary">
                    {offer.positiveRating}% positive feedback
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <span className="text-xl font-bold text-lime">
                    {formatter.format(offer.price)}
                  </span>

                  <button
                    type="button"
                    disabled
                    title="Cart integration coming soon"
                    className="rounded-xl bg-lime px-5 py-3
                      text-sm font-semibold text-base
                      disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
