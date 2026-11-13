import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProductDetails } from "../services/productService";
import { useCart } from "../context/CartContext";
import { AddToCartModal } from "../components/products/AddToCartModal";

import type {
  ProductDetails,
  SellerOffer,
} from "../types/product";

type ModalStatus = "loading" | "success" | "error";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  const { items, addItem, itemCount } = useCart();

  const [product, setProduct] =
    useState<ProductDetails | null>(null);

  const [gallery, setGallery] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const steamAppId = product?.steamAppId?.toString() ?? null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalStatus, setModalStatus] =
    useState<ModalStatus | null>(null);

  const [modalError, setModalError] = useState("");

  const [addingOfferId, setAddingOfferId] =
    useState<string | null>(null);

  const addingRef = useRef(false);

  // ======================================
  // LOAD STEAM SCREENSHOTS
  // ======================================

  useEffect(() => {
    setGallery([]);
    setSelectedImage(0);
    setGalleryOpen(false);

    if (!steamAppId) return;

    const controller = new AbortController();

    async function loadGallery() {
      try {
        const response = await fetch(
          `${API_URL}/api/steam-gallery?appId=${encodeURIComponent(steamAppId!)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Gallery unavailable");
        }

        const payload: {
          data?: {
            screenshots?: string[];
          };
        } = await response.json();

        if (!controller.signal.aborted) {
          setGallery(
            (payload.data?.screenshots ?? []).slice(0, 6)
          );
        }
      } catch (error) {
        if (
          !controller.signal.aborted &&
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          setGallery([]);
        }
      }
    }

    void loadGallery();

    return () => controller.abort();
  }, [steamAppId]);

  // ======================================
  // LOAD PRODUCT DETAILS
  // ======================================

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setProduct(null);

    getProductDetails(slug, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setProduct(result);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("Could not load product details.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [slug]);

  // ======================================
  // ADD TO CART
  // ======================================

  async function handleAddToCart(offer: SellerOffer) {
    if (!product || addingRef.current) return;

    const alreadyAdded = items.some(
      (item) => item.offerId === offer.id
    );

    if (alreadyAdded) {
      setModalStatus("success");
      return;
    }

    addingRef.current = true;
    setAddingOfferId(offer.id);
    setModalError("");
    setModalStatus("loading");

    try {
      const latestProduct = await getProductDetails(
        product.slug
      );

      if (!latestProduct) {
        throw new Error("Product no longer exists.");
      }

      const latestOffer = latestProduct.offers.find(
        (candidate) => candidate.id === offer.id
      );

      if (
        !latestOffer ||
        !latestOffer.available ||
        !Number.isFinite(Number(latestOffer.price)) ||
        Number(latestOffer.price) < 0
      ) {
        throw new Error(
          "This seller offer is no longer available."
        );
      }

      addItem({
        offerId: latestOffer.id,
        productId: latestProduct.id,
        slug: latestProduct.slug,
        title: latestProduct.title,
        imageUrl: latestProduct.imageUrl,
        platform: latestProduct.platform,
        region: latestProduct.region,
        seller: latestOffer.sellerName,
        price: Number(latestOffer.price),
        currency: latestOffer.currency,
      });

      setModalStatus("success");
    } catch (caughtError) {
      setModalError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not add product to cart."
      );

      setModalStatus("error");
    } finally {
      addingRef.current = false;
      setAddingOfferId(null);
    }
  }

  // ======================================
  // GALLERY NAVIGATION
  // ======================================

  function closeGallery() {
    setGalleryOpen(false);
  }

  function previousImage() {
    setSelectedImage(
      (current) =>
        (current - 1 + gallery.length) % gallery.length
    );
  }

  function nextImage() {
    setSelectedImage(
      (current) => (current + 1) % gallery.length
    );
  }

  useEffect(() => {
    if (!galleryOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [galleryOpen, gallery.length]);

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <p className="text-ink-secondary">
          Loading product...
        </p>
      </main>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <h1
          className="font-display text-3xl
            font-bold text-white"
        >
          Something went wrong
        </h1>

        <p className="mt-3 text-ink-secondary">
          {error}
        </p>

        <Link
          to="/store"
          className="mt-5 inline-block text-lime"
        >
          Back to Store
        </Link>
      </main>
    );
  }

  // ======================================
  // PRODUCT NOT FOUND
  // ======================================

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <h1
          className="font-display text-3xl
            font-bold text-white"
        >
          Product not found
        </h1>

        <Link
          to="/store"
          className="mt-5 inline-block text-lime"
        >
          Back to Store
        </Link>
      </main>
    );
  }

  // ======================================
  // FORMATTERS
  // ======================================

  const formatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: product.currency,
  });

  const offers = [...product.offers]
    .filter(
      (offer) =>
        offer.available &&
        Number.isFinite(Number(offer.price)) &&
        Number(offer.price) >= 0
    )
    .sort(
      (a, b) =>
        Number(a.price) - Number(b.price)
    );

  // ======================================
  // MAIN PAGE
  // ======================================

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-10">

        {/* BREADCRUMB */}

        <nav
          aria-label="Breadcrumb"
          className="mb-8 text-sm"
        >
          <Link
            to="/store"
            className="text-ink-secondary hover:text-lime"
          >
            Store
          </Link>

          <span className="mx-3 text-ink-muted">
            /
          </span>

          <span className="text-lime">
            {product.title}
          </span>
        </nav>

        {/* PRODUCT DETAILS */}

        <div
          className="grid grid-cols-1 gap-10
            md:grid-cols-[300px_1fr]"
        >
          <div>
            <div
              className="aspect-[3/4] overflow-hidden
                rounded-card border border-line
                bg-elevated"
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-ink-muted">
                  No cover available
                </div>
              )}
            </div>
          </div>

          <div>
            <h1
              className="font-display text-4xl
                font-bold text-white"
            >
              {product.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              {[product.platform, product.region].map(
                (value) => (
                  <span
                    key={value}
                    className="rounded-lg border
                      border-line bg-elevated
                      px-3 py-2 text-xs
                      text-ink-secondary"
                  >
                    {value}
                  </span>
                )
              )}
            </div>

            <p
              className="mt-7 max-w-2xl
                leading-relaxed text-ink-secondary"
            >
              {product.description}
            </p>

            {/* PRICE CARD */}

            <div
              className="mt-8 rounded-card border
                border-line bg-surface p-6"
            >
              <p className="text-sm text-ink-secondary">
                Starting from
              </p>

              <p
                className="mt-2 font-display
                  text-4xl font-bold text-lime"
              >
                {offers.length > 0
                  ? formatter.format(
                      Number(offers[0].price)
                    )
                  : "Unavailable"}
              </p>

              <a
                href="#seller-offers"
                className="mt-5 inline-flex rounded-xl
                  bg-lime px-6 py-3 text-base
                  font-semibold text-base
                  hover:bg-lime-hover"
              >
                View seller offers
              </a>
            </div>

            {/* PRODUCT METADATA */}

            <div
              className="mt-8 grid gap-3
                text-sm text-ink-secondary"
            >
              <p>
                Publisher:{" "}
                {product.publisher || "Unknown"}
              </p>

              <p>
                Release date:{" "}
                {product.releaseDate || "Unknown"}
              </p>

              <p>Delivery: Digital key</p>
            </div>
          </div>
        </div>

        {/* STEAM SCREENSHOTS */}

        {gallery.length > 0 && (
          <section
            className="mt-10"
            aria-label="Game screenshots"
          >
            <h2
              className="mb-4 font-display text-2xl
                font-bold text-white"
            >
              Screenshots
            </h2>

            <div
              className="grid grid-cols-2 gap-3
                sm:grid-cols-3 lg:grid-cols-6"
            >
              {gallery.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  onClick={() => {
                    setSelectedImage(index);
                    setGalleryOpen(true);
                  }}
                  className="overflow-hidden rounded-lg
                    border border-line bg-elevated
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-lime"
                  aria-label={`Open screenshot ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${product.title} screenshot ${index + 1}`}
                    loading="lazy"
                    className="aspect-video w-full
                      object-cover transition-transform
                      hover:scale-105"
                  />
                </button>
              ))}
            </div>

            <p className="mt-2 text-xs text-ink-muted">
              Images provided by Steam. Demo marketplace.
            </p>
          </section>
        )}

        {/* FULLSCREEN GALLERY */}

        {galleryOpen && gallery[selectedImage] && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Screenshot viewer"
            className="fixed inset-0 z-50 flex
              items-center justify-center
              bg-black/95 p-4"
            onClick={closeGallery}
          >
            <div
              className="relative w-full max-w-6xl"
              onClick={(event) => event.stopPropagation()}
            >
              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={closeGallery}
                className="absolute -top-12 right-0
                  rounded-lg border border-white/20
                  bg-black/70 px-4 py-2
                  text-xl text-white
                  transition hover:bg-white/20"
                aria-label="Close viewer"
                title="Close"
              >
                ✕
              </button>

              {/* MAIN IMAGE */}

              <img
                src={gallery[selectedImage]}
                alt={`${product.title} screenshot ${selectedImage + 1}`}
                className="max-h-[75vh] w-full
                  rounded-lg object-contain"
              />

              {/* NAVIGATION */}

              <div
                className="mt-5 flex flex-wrap
                  items-center justify-center
                  gap-5 text-white"
              >
                <button
                  type="button"
                  onClick={previousImage}
                  className="rounded-lg border
                    border-white/20 px-4 py-2
                    transition hover:border-lime
                    hover:text-lime"
                  aria-label="Previous screenshot"
                >
                  ← Previous
                </button>

                <span
                  className="min-w-16 text-center
                    font-semibold tabular-nums"
                >
                  {selectedImage + 1} / {gallery.length}
                </span>

                <button
                  type="button"
                  onClick={nextImage}
                  className="rounded-lg border
                    border-white/20 px-4 py-2
                    transition hover:border-lime
                    hover:text-lime"
                  aria-label="Next screenshot"
                >
                  Next →
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-white/50">
                Use ← and → keys to navigate · ESC to close
              </p>
            </div>
          </div>
        )}

        {/* SELLER OFFERS */}

        <section
          id="seller-offers"
          className="mt-16 scroll-mt-24"
        >
          <h2
            className="font-display text-3xl
              font-bold text-white"
          >
            Available offers
          </h2>

          <p className="mt-2 text-ink-secondary">
            Compare sellers and choose your
            preferred offer.
          </p>

          <div className="mt-6 space-y-3">
            {offers.length === 0 ? (
              <p
                className="rounded-card border
                  border-line bg-surface
                  p-6 text-ink-secondary"
              >
                No offers are currently available.
              </p>
            ) : (
              offers.map((offer) => {
                const inCart = items.some(
                  (item) =>
                    item.offerId === offer.id
                );

                const isThisOfferLoading =
                  addingOfferId === offer.id;

                return (
                  <div
                    key={offer.id}
                    className="flex flex-wrap
                      items-center justify-between
                      gap-4 rounded-card border
                      border-line bg-surface p-5"
                  >
                    <div>
                      <h3
                        className="font-semibold
                          text-white"
                      >
                        {offer.sellerName}
                      </h3>

                      <p
                        className="mt-1 text-sm
                          text-ink-secondary"
                      >
                        {offer.positiveRating === null
                          ? "No rating yet"
                          : `${offer.positiveRating}% positive feedback`}
                      </p>
                    </div>

                    <div
                      className="flex items-center
                        gap-5"
                    >
                      <span
                        className="text-xl
                          font-bold text-lime"
                      >
                        {formatter.format(
                          Number(offer.price)
                        )}
                      </span>

                      <button
                        type="button"
                        disabled={
                          addingOfferId !== null
                        }
                        onClick={() =>
                          void handleAddToCart(offer)
                        }
                        className="rounded-xl
                          bg-lime px-5 py-3
                          text-sm font-semibold
                          text-base hover:bg-lime-hover
                          disabled:cursor-not-allowed
                          disabled:opacity-50"
                      >
                        {isThisOfferLoading
                          ? "Adding..."
                          : inCart
                            ? "In cart ✓"
                            : "Add to cart"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* SHARED ADD TO CART POPUP */}

      {modalStatus !== null && (
        <AddToCartModal
          status={modalStatus}
          itemCount={itemCount}
          errorMessage={modalError}
          onClose={() => {
            if (modalStatus !== "loading") {
              setModalStatus(null);
            }
          }}
        />
      )}
    </>
  );
}