import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { useCart } from "../../context/CartContext";
import { AddedToCartModal } from "../cart/AddedToCartModal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const offerId = `demo-${product.slug}`;
  const isInCart = items.some((item) => item.offerId === offerId);

  const handleAddToCart = () => {
    addItem({
      offerId,
      productId: product.slug,
      slug: product.slug,
      title: product.title,
      imageUrl: product.imageUrl,
      platform: product.platform,
      region: product.region,
      seller: "Demo seller",
      price: product.lowestPrice,
      currency: product.currency,
    });

    setIsModalOpen(true);
  };

  const discount =
    product.originalPrice !== null &&
    product.originalPrice > product.lowestPrice
      ? Math.round(
          (1 - product.lowestPrice / product.originalPrice) * 100
        )
      : 0;

  const formatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: product.currency,
  });

  const productUrl = `/product/${encodeURIComponent(product.slug)}`;

  return (
    <>
      <article
        className="group relative h-[430px] w-full min-w-0
          hover:z-30 focus-within:z-30"
      >
        {/* MAIN CARD - fixed height */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden
            rounded-xl border border-line bg-surface
            transition-[border-color,box-shadow] duration-200 ease-out
            group-hover:border-line-hover group-hover:shadow-card
            group-focus-within:border-lime"
        >
          {/* IMAGE - shrinks on hover */}
          <div
            className="relative h-[190px] w-full shrink-0
              overflow-hidden rounded-t-xl bg-elevated
              transition-[height] duration-200 ease-out
              group-hover:h-[115px]
              group-focus-within:h-[115px]"
          >
            <Link
              to={productUrl}
              aria-label={`View ${product.title}`}
              className="block h-full w-full overflow-hidden"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* DISCOUNT */}
            {discount > 0 && (
              <span
                className="pointer-events-none absolute left-3 top-3
                  rounded bg-magenta px-2 py-1
                  text-xs font-bold text-white"
              >
                -{discount}%
              </span>
            )}

            {/* WISHLIST */}
            <button
              type="button"
              disabled
              aria-label={`Add ${product.title} to wishlist`}
              title="Wishlist coming soon"
              className="absolute right-3 top-3 flex h-8 w-8
                items-center justify-center rounded-full
                bg-black/50 text-white backdrop-blur-sm
                disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* CASHBACK BADGE */}
            <div
              className="pointer-events-none absolute bottom-0 left-0
                bg-cyan px-3 py-1.5 text-xs font-bold text-base"
            >
              CASHBACK
            </div>
          </div>

          {/* PLATFORM */}
          <div
            className="flex h-[36px] shrink-0 items-center
              bg-[#211342] px-4"
          >
            <span className="text-xs font-semibold text-white">
              {product.platform} Store
            </span>
          </div>

          {/* PRODUCT INFORMATION */}
          <div
            className="flex min-h-0 flex-1 flex-col
              gap-1 px-4 pt-3 pb-2"
          >
            <Link
              to={productUrl}
              className="line-clamp-2 text-[15px] font-bold
                leading-snug text-white hover:text-lime"
            >
              {product.title}
            </Link>

            <p className="mt-1 text-[13px] font-bold uppercase text-cyan">
              {product.region}
            </p>

            {/* PRICE */}
            <div className="mt-auto">
              {discount > 0 && (
                <div
                  className="mb-1 flex flex-wrap items-center gap-2
                    text-[13px] text-ink-secondary"
                >
                  <span>From</span>
                  <span className="line-through">
                    {formatter.format(product.originalPrice!)}
                  </span>
                  <span className="font-bold text-lime">
                    -{discount}%
                  </span>
                </div>
              )}

              <p className="text-2xl font-bold text-white">
                {formatter.format(product.lowestPrice)}
              </p>

              <p className="mt-1 text-[13px] font-bold text-lime">
                Demo cashback: {formatter.format(product.lowestPrice * 0.11)}
              </p>
            </div>
          </div>

          {/* HOVER ACTIONS - inside fixed card */}
          <div
            className="grid shrink-0 grid-rows-[0fr] opacity-0
              transition-[grid-template-rows,opacity]
              duration-200 ease-out
              group-hover:grid-rows-[1fr]
              group-hover:opacity-100
              group-focus-within:grid-rows-[1fr]
              group-focus-within:opacity-100"
          >
            <div className="min-h-0 overflow-hidden">
              <div
                className="flex flex-col gap-2 border-t
                  border-line bg-surface p-4"
              >
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  title={isInCart ? "Already in cart" : "Add to cart"}
                  className="w-full rounded bg-lime px-4 py-2.5
                    text-sm font-bold text-base
                    transition-colors hover:bg-lime-hover
                    disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isInCart ? "In cart" : "Add to cart"}
                </button>

                <Link
                  to={`${productUrl}#seller-offers`}
                  className="flex w-full items-center justify-center
                    rounded border-2 border-[#3b2b5c]
                    px-4 py-2 text-sm font-bold text-white
                    hover:border-white hover:bg-white/5
                    focus-visible:outline-2 focus-visible:outline-lime"
                >
                  View offers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* MODAL - Renders outside the card to avoid overflow issues */}
      <AddedToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.lowestPrice,
          currency: product.currency,
        }}
      />
    </>
  );
}