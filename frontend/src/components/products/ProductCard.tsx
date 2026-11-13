
import { useState } from "react";
import { Link } from "react-router-dom";

import type { Product } from "../../types/product";
import { getProductDetails } from "../../services/productService";
import { useCart } from "../../context/CartContext";
import { AddToCartModal } from "./AddToCartModal";

interface ProductCardProps {
  product: Product;
}

type ModalStatus = "loading" | "success" | "error";

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items, itemCount } = useCart();

  const [modalStatus, setModalStatus] =
    useState<ModalStatus | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const alreadyInCart = items.some(
    (item) => item.productId === product.id
  );

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

  const productUrl =
    `/product/${encodeURIComponent(product.slug)}`;

  async function handleAddToCart() {
    if (isAdding) return;

    if (alreadyInCart) {
      setModalStatus("success");
      return;
    }

    setIsAdding(true);
    setErrorMessage("");
    setModalStatus("loading");

    try {
      const details = await getProductDetails(product.slug);

      if (!details) {
        throw new Error("Product not found.");
      }

      const availableOffers = details.offers.filter(
        (offer) =>
          offer.available &&
          Number.isFinite(Number(offer.price)) &&
          Number(offer.price) >= 0
      );

      if (availableOffers.length === 0) {
        throw new Error("No available seller offers.");
      }

      const cheapestOffer = availableOffers.reduce(
        (cheapest, current) =>
          Number(current.price) < Number(cheapest.price)
            ? current
            : cheapest
      );

      addItem({
        offerId: cheapestOffer.id,
        productId: details.id,
        slug: details.slug,
        title: details.title,
        imageUrl: details.imageUrl,
        platform: details.platform,
        region: details.region,
        seller: cheapestOffer.sellerName,
        price: Number(cheapestOffer.price),
        currency: cheapestOffer.currency,
      });

      setModalStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not add product to cart."
      );

      setModalStatus("error");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <>
      <article
        className="group relative h-[430px] w-full min-w-0
          hover:z-30 focus-within:z-30"
      >
        <div
          className="absolute inset-0 flex flex-col overflow-hidden
            rounded-xl border border-line bg-surface
            transition-[border-color,box-shadow]
            duration-200 ease-out
            group-hover:border-line-hover
            group-hover:shadow-card
            group-focus-within:border-lime"
        >
          {/* IMAGE */}
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
                className="h-full w-full object-cover
                  transition-transform duration-300
                  group-hover:scale-105"
              />
            </Link>

            {discount > 0 && (
              <span
                className="pointer-events-none absolute
                  left-3 top-3 rounded bg-magenta
                  px-2 py-1 text-xs font-bold text-white"
              >
                -{discount}%
              </span>
            )}

            {/* WISHLIST - NOT IMPLEMENTED YET */}
            <button
              type="button"
              disabled
              aria-label={`Add ${product.title} to wishlist`}
              title="Wishlist coming soon"
              className="absolute right-3 top-3 flex
                h-8 w-8 items-center justify-center
                rounded-full bg-black/50 text-white
                backdrop-blur-sm disabled:cursor-not-allowed
                disabled:opacity-60"
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

            <p
              className="mt-1 text-[13px] font-bold
                uppercase text-cyan"
            >
              {product.region}
            </p>

            <div className="mt-auto">
              {discount > 0 && (
                <div
                  className="mb-1 flex flex-wrap items-center
                    gap-2 text-[13px] text-ink-secondary"
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

              <p className="mt-1 text-xs text-ink-secondary">
                From available sellers
              </p>
            </div>
          </div>

          {/* HOVER ACTIONS */}
          <div
            className="grid shrink-0 grid-rows-[0fr]
              opacity-0 transition-[grid-template-rows,opacity]
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
                  onClick={() => void handleAddToCart()}
                  disabled={isAdding}
                  className="flex w-full items-center
                    justify-center rounded bg-lime
                    px-4 py-2.5 text-sm font-bold
                    text-base transition-colors
                    hover:bg-lime-hover
                    disabled:cursor-wait
                    disabled:opacity-70"
                >
                  {isAdding
                    ? "Adding..."
                    : alreadyInCart
                      ? "In cart ✓"
                      : "Add to cart"}
                </button>

                <Link
                  to={`${productUrl}#seller-offers`}
                  className="flex w-full items-center
                    justify-center rounded border-2
                    border-[#3b2b5c] px-4 py-2
                    text-sm font-bold text-white
                    hover:border-white hover:bg-white/5
                    focus-visible:outline-2
                    focus-visible:outline-lime"
                >
                  View offers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {modalStatus !== null && (
        <AddToCartModal
          status={modalStatus}
          itemCount={itemCount}
          errorMessage={errorMessage}
          onClose={() => setModalStatus(null)}
        />
      )}
    </>
  );
}
