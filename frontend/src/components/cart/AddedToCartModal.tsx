
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface AddedToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
}

export function AddedToCartModal({
  isOpen,
  onClose,
  itemCount,
}: AddedToCartModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab") {
        const dialog = closeButtonRef.current?.closest(
          '[role="dialog"]'
        );

        if (!dialog) return;

        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href]'
          )
        );

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center
        justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
        aria-describedby="cart-modal-description"
        className="relative w-full max-w-[500px]
          bg-[#4219A8] px-8 py-10 text-center
          shadow-2xl"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded
            p-1 text-white hover:bg-white/10
            focus-visible:outline-2 focus-visible:outline-white"
        >
          ✕
        </button>

        <svg
          className="mx-auto mb-5 h-24 w-24"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 15 H24 L35 67 H76 L88 32"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="42" cy="82" r="6" stroke="white" strokeWidth="5" />
          <circle cx="72" cy="82" r="6" stroke="white" strokeWidth="5" />
          <path
            d="M48 38 L59 49 L78 27"
            stroke="#35F1A0"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h2
          id="cart-modal-title"
          className="text-2xl font-bold text-white"
        >
          Added to cart
        </h2>

        <p
          id="cart-modal-description"
          className="mt-2 text-sm text-[#D1BFFF]"
        >
          You have{" "}
          <strong className="text-white">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </strong>{" "}
          in your cart
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#FFDD00] px-4 py-3
              text-sm font-bold text-black
              hover:bg-yellow-300"
          >
            Continue shopping
          </button>

          <Link
            to="/cart"
            onClick={onClose}
            className="flex items-center justify-center
              border border-white px-4 py-3
              text-sm font-bold text-white
              hover:bg-white/10"
          >
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
}
