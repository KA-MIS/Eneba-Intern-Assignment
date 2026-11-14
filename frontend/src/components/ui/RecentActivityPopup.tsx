import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag } from "lucide-react";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

const INTERVAL_MS = 10000;
const DISPLAY_MS = 5000;

export function RecentActivityPopup() {
  const [product, setProduct] = useState<Product | null>(null);
  const [visible, setVisible] = useState(false);
  const lastProductId = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;
    let busy = false;

    async function showRandomProduct() {
      if (busy || document.hidden) return;
      busy = true;

      try {
        const products = await getProducts({
          category: "game",
          sort: "random",
          limit: 10,
        });

        if (!active || products.length === 0) return;

        const candidates = products.filter(
          (item) =>
            item.id !== lastProductId.current &&
            item.imageUrl &&
            item.slug
        );

        if (candidates.length === 0) return;

        const selected =
          candidates[Math.floor(Math.random() * candidates.length)];

        lastProductId.current = selected.id;
        setProduct(selected);
        setVisible(true);

        if (hideTimer) clearTimeout(hideTimer);

        hideTimer = setTimeout(() => {
          if (active) setVisible(false);
        }, DISPLAY_MS);
      } catch (error) {
        console.error("Activity popup:", error);
      } finally {
        busy = false;
      }
    }

    interval = setInterval(() => {
      void showRandomProduct();
    }, INTERVAL_MS);

    return () => {
      active = false;
      if (interval) clearInterval(interval);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  if (!product || !visible) return null;

  return (
    <aside
      aria-label="Featured product"
      className="fixed bottom-5 left-5 z-[100] w-[calc(100vw-40px)] max-w-[370px] animate-in slide-in-from-left-5 fade-in duration-300"
    >
      <div className="relative flex overflow-hidden rounded-xl border border-[#493176] bg-[#1A0E33] shadow-[0_15px_50px_rgba(0,0,0,0.45)]">
        <Link
          to={`/product/${product.slug}`}
          onClick={() => setVisible(false)}
          className="flex min-w-0 flex-1 items-center gap-3 p-3 pr-9"
        >
          <img
            src={product.imageUrl}
            alt=""
            className="h-[90px] w-[66px] shrink-0 rounded-md object-cover"
          />

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-[#C6F135]">
              <ShoppingBag size={14} />
              Popular right now
            </div>

            <p className="line-clamp-2 text-sm font-semibold leading-snug text-white">
              {product.title}
            </p>

            <p className="mt-2 text-xs text-[#B8AEDB]">
              From €{product.lowestPrice.toFixed(2)}
            </p>

            <p className="mt-1 text-[11px] text-[#9386B5]">
              Explore this product
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close notification"
          className="absolute right-2 top-2 rounded-md p-1 text-[#B8AEDB] transition hover:bg-white/10 hover:text-white"
        >
          <X size={17} />
        </button>
      </div>
    </aside>
  );
}