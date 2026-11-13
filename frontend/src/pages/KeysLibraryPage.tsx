
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  KeyRound,
  Gamepad2,
  Copy,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

import { getProducts } from "../services/productService";
import type { Product } from "../types/product";

// ======================================
// TYPES
// ======================================

type GameKey = {
  id: string;
  key_code: string;
  product_name: string;
  platform: string | null;
  order_number: string;
};

type KeyRecord = {
  id: string;
  key_code: string;
  order_items: {
    product_name: string;
    platform: string | null;
    orders: {
      order_number: string;
    } | null;
  } | null;
};

// ======================================
// KEYS LIBRARY
// ======================================

export function KeysLibraryPage() {
  const { user } = useAuth();

  const [keys, setKeys] = useState<GameKey[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ======================================
  // LOAD GAME KEYS
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function loadKeys() {
      setLoading(true);
      setError("");
      setKeys([]);
      setVisibleKeys([]);

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("game_keys")
        .select(`
          id,
          key_code,
          order_items!inner (
            product_name,
            platform,
            orders!inner (
              order_number,
              user_id,
              status
            )
          )
        `)
        .eq("order_items.orders.user_id", user.id)
        .eq("order_items.orders.status", "paid");

      if (cancelled) return;

      if (queryError) {
        setError(queryError.message);
      } else {
        const records = (data ?? []) as unknown as KeyRecord[];

        const formattedKeys: GameKey[] = records
          .filter(
            (record) =>
              record.order_items !== null &&
              record.order_items.orders !== null
          )
          .map((record) => ({
            id: record.id,
            key_code: record.key_code,
            product_name: record.order_items!.product_name,
            platform: record.order_items!.platform,
            order_number:
              record.order_items!.orders!.order_number,
          }));

        setKeys(formattedKeys);
      }

      setLoading(false);
    }

    void loadKeys();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // ======================================
  // LOAD PRODUCTS FROM EXISTING API
  // ======================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      const categories = ["game", "gift_card"] as const;

      const results = await Promise.allSettled(
        categories.map((category) =>
          getProducts({ category, limit: 100 }, controller.signal)
        )
      );

      if (controller.signal.aborted) return;

      const loadedProducts = results.flatMap((result) =>
        result.status === "fulfilled" ? result.value : []
      );

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
            `Could not load ${categories[index]} product images:`,
            result.reason
          );
        }
      });

      setProducts(loadedProducts);
    }

    void loadProducts();

    return () => controller.abort();
  }, []);

  // ======================================
  // FIND PRODUCT IMAGE
  // ======================================

  function getProductImage(productName: string): string {
    const normalize = (value: string) =>
      value.trim().toLowerCase();

    const product = products.find(
      (item) =>
        normalize(item.title) === normalize(productName)
    );

    return product?.imageUrl ?? "";
  }

  // ======================================
  // REVEAL / HIDE
  // ======================================

  function toggleVisibility(id: string) {
    setVisibleKeys((current) =>
      current.includes(id)
        ? current.filter((keyId) => keyId !== id)
        : [...current, id]
    );
  }

  // ======================================
  // COPY
  // ======================================

  async function copyKey(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(id);
    } catch {
      setError(
        "Could not copy the key. Please copy it manually."
      );
    }
  }

  // ======================================
  // RENDER
  // ======================================

  return (
    <main className="mx-auto max-w-[1180px] text-[#211047]">
      <p className="text-xs text-[#82779B]">
        My account · Keys library
      </p>

      <h1 className="mb-6 mt-6 text-sm font-bold uppercase tracking-wider">
        Keys library
      </h1>

      <section className="bg-white shadow-sm">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 border-b border-[#F0EDF5] px-7 py-6">
          <div className="flex items-center gap-3">
            <KeyRound
              size={20}
              className="text-[#4219A8]"
            />

            <h2 className="text-sm font-bold uppercase">
              My digital keys
            </h2>
          </div>

          <span className="text-xs text-[#82779B]">
            {keys.length} keys
          </span>
        </div>

        {/* LOADING */}
        {loading ? (
          <div
            role="status"
            className="flex items-center justify-center gap-3 p-12 text-sm text-[#82779B]"
          >
            <LoaderCircle
              size={20}
              className="animate-spin"
            />
            Loading keys...
          </div>
        ) : error ? (
          <p role="alert" className="p-8 text-sm text-red-600">
            {error}
          </p>
        ) : keys.length === 0 ? (
          /* EMPTY LIBRARY */
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Gamepad2
              size={44}
              className="text-[#A99BBF]"
            />

            <h3 className="mt-5 text-lg font-bold">
              Your library is empty
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#82779B]">
              Your demo activation keys will appear here
              when assigned to paid orders.
            </p>

            <Link
              to="/account/orders"
              className="mt-6 rounded-md bg-[#C6F135] px-6 py-3 text-sm font-bold text-[#211047]"
            >
              View orders
            </Link>
          </div>
        ) : (
          /* DIGITAL KEYS */
          <div className="divide-y divide-[#F0EDF5]">
            {keys.map((gameKey) => {
              const isVisible = visibleKeys.includes(
                gameKey.id
              );

              const imageUrl = getProductImage(
                gameKey.product_name
              );

              return (
                <article
                  key={gameKey.id}
                  className="p-7"
                >
                  {/* PRODUCT INFO */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-28 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F0E9FF]">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${gameKey.product_name} cover`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <Gamepad2
                          size={28}
                          className="text-[#4219A8]"
                        />
                      )}
                    </div>

                    <div className="pt-2">
                      <h3 className="text-base font-bold">
                        {gameKey.product_name}
                      </h3>

                      <p className="mt-2 text-xs text-[#82779B]">
                        {gameKey.platform ||
                          "Digital product"}
                        {" · "}
                        {gameKey.order_number}
                      </p>
                    </div>
                  </div>

                  {/* ACTIVATION KEY */}
                  <div className="mt-5 rounded-lg border border-[#E8E1F1] bg-[#FAF9FD] p-4">
                    <p className="mb-3 text-xs font-bold uppercase text-[#82779B]">
                      Activation key (demo)
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <code className="break-all font-mono text-sm font-bold">
                        {isVisible
                          ? gameKey.key_code
                          : "•••••-•••••-•••••-•••••"}
                      </code>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            toggleVisibility(gameKey.id)
                          }
                          className="flex items-center gap-2 rounded-md border border-[#DDD5EA] bg-white px-3 py-2 text-xs font-bold hover:bg-[#F0E9FF]"
                        >
                          {isVisible ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}

                          {isVisible
                            ? "Hide"
                            : "Reveal"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void copyKey(
                              gameKey.id,
                              gameKey.key_code
                            )
                          }
                          className="flex items-center gap-2 rounded-md bg-[#4219A8] px-3 py-2 text-xs font-bold text-white hover:bg-[#32147D]"
                        >
                          {copiedKey === gameKey.id ? (
                            <Check size={15} />
                          ) : (
                            <Copy size={15} />
                          )}

                          {copiedKey === gameKey.id
                            ? "Copied"
                            : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* SECURITY NOTICE */}
      <div className="mt-5 flex items-start gap-3 bg-white p-6 shadow-sm">
        <ShieldCheck
          size={22}
          className="shrink-0 text-[#4219A8]"
        />

        <p className="text-xs leading-6 text-[#82779B]">
          These are demonstration keys for testing.
          They cannot activate real games.
          Access is restricted using Supabase RLS.
        </p>
      </div>
    </main>
  );
}
