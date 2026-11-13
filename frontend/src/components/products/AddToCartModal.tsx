
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

type ModalStatus = "loading" | "success" | "error";

interface AddToCartModalProps {
  status: ModalStatus;
  itemCount: number;
  errorMessage?: string;
  onClose: () => void;
}

export function AddToCartModal({
  status,
  itemCount,
  errorMessage,
  onClose,
}: AddToCartModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && status !== "loading") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [status, onClose]);

  function handleViewCart() {
    onClose();
    navigate("/cart");
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center
        justify-center bg-black/75 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          status !== "loading"
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-cart-title"
        aria-describedby="add-to-cart-description"
        className="w-full max-w-[390px] overflow-hidden
          border border-[#6536C7] bg-[#4519AC]
          px-7 py-8 text-center text-white
          shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      >
        <div className="mb-5 flex justify-center">
          <div className="relative h-20 w-20">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              className="h-full w-full"
              aria-hidden="true"
            >
              <path
                d="M14 18H25L37 63H77L88 31"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M41 63L35 72H79"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="44"
                cy="84"
                r="5"
                stroke="white"
                strokeWidth="4"
              />
              <circle
                cx="75"
                cy="84"
                r="5"
                stroke="white"
                strokeWidth="4"
              />

              {status === "success" && (
                <path
                  d="M49 37L58 46L75 25"
                  stroke="#C6F135"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {status === "error" && (
                <path
                  d="M51 28L70 47M70 28L51 47"
                  stroke="#FF8A9B"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </div>
        </div>

        <h2
          id="add-to-cart-title"
          className="text-xl font-extrabold"
        >
          {status === "loading"
            ? "Adding to cart"
            : status === "success"
              ? "Added to cart"
              : "Couldn't add to cart"}
        </h2>

        {status === "loading" ? (
          <>
            <p
              id="add-to-cart-description"
              className="mt-2 text-sm text-white/70"
            >
              Checking available seller offers...
            </p>

            <div className="mt-6 flex justify-center">
              <div
                role="status"
                aria-label="Adding product"
                className="h-14 w-14 animate-spin rounded-full
                  border-[5px] border-white/30
                  border-t-[#C6F135]"
              />
            </div>
          </>
        ) : status === "success" ? (
          <>
            <p
              id="add-to-cart-description"
              className="mt-2 text-sm text-white/75"
            >
              You have{" "}
              <strong className="text-white">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </strong>{" "}
              in your cart
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 bg-[#FFE500] px-3
                  text-xs font-extrabold text-black
                  transition-colors hover:bg-[#FFF04D]"
              >
                Continue shopping
              </button>

              <button
                type="button"
                onClick={handleViewCart}
                className="min-h-11 border border-white
                  px-3 text-xs font-extrabold text-white
                  transition-colors hover:bg-white/10"
              >
                View cart
              </button>
            </div>
          </>
        ) : (
          <>
            <p
              id="add-to-cart-description"
              role="alert"
              className="mt-3 text-sm text-white/80"
            >
              {errorMessage || "Please try again."}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 min-h-11 w-full bg-[#C6F135]
                px-4 font-bold text-[#0E0620]"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
