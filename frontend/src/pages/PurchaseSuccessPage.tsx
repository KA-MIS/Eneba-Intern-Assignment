import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Copy, Gamepad2, LoaderCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { getProducts } from "../services/productService";

type PurchasedItem = {
  id: string;
  product_name: string;
  platform: string | null;
  key_code: string | null;
  image_url: string;
};

export function PurchaseSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<PurchasedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPurchase() {
      if (authLoading) return;
      setLoading(true);
      setError("");
      setItems([]);

      if (!user || !orderId) {
        setError("Sign in to view your purchase.");
        setLoading(false);
        return;
      }

      // Only the signed-in purchaser may access this paid order.
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("id")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .eq("status", "paid")
        .maybeSingle();

      if (cancelled) return;
      if (orderError || !order) {
        setError(orderError?.message || "Paid order not found.");
        setLoading(false);
        return;
      }

      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("id, product_name, platform")
        .eq("order_id", order.id);

      if (cancelled) return;
      if (itemsError) {
        setError(itemsError.message);
        setLoading(false);
        return;
      }

      const rows = orderItems ?? [];
      if (rows.length === 0) {
        setError("No products were found for this order.");
        setLoading(false);
        return;
      }

      // Game keys are protected by the existing Supabase RLS policies.
      const { data: keys, error: keysError } = await supabase
        .from("game_keys")
        .select("order_item_id, key_code")
        .in("order_item_id", rows.map((item) => item.id));

      if (cancelled) return;
      if (keysError) {
        setError(keysError.message);
        setLoading(false);
        return;
      }

      const keyByItem = new Map(
        (keys ?? []).map((key) => [key.order_item_id, key.key_code])
      );

      const purchased: PurchasedItem[] = rows.map((item) => ({
        id: item.id,
        product_name: item.product_name,
        platform: item.platform,
        key_code: keyByItem.get(item.id) ?? null,
        image_url: "",
      }));
      setItems(purchased);
      setLoading(false);

      // Optional product artwork; failure never hides purchased keys.
      try {
        const results = await Promise.allSettled([
          getProducts({ category: "game", limit: 100 }),
          getProducts({ category: "gift_card", limit: 100 }),
        ]);
        if (cancelled) return;
        const products = results.flatMap((result) =>
          result.status === "fulfilled" ? result.value : []
        );
        const normalize = (value: string) => value.trim().toLowerCase();
        setItems(purchased.map((item) => ({
          ...item,
          image_url: products.find((product) =>
            normalize(product.title) === normalize(item.product_name)
          )?.imageUrl ?? "",
        })));
      } catch {
        // The game name and key remain visible without artwork.
      }
    }

    void loadPurchase();
    return () => { cancelled = true; };
  }, [orderId, user?.id, authLoading]);

  async function copyKey(id: string, key: string) {
    try {
      await navigator.clipboard.writeText(key);
      setCopied(id);
    } catch {
      setError("Unable to copy the key. Please select and copy it manually.");
    }
  }

  return (
    <main className="min-h-screen bg-[#4519AC] px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-9 text-center">
          <div className="mb-3 text-sm font-semibold text-[#C6F135]">
            Cart ✓　—　Payment ✓　—　Get your product
          </div>
          <h1 className="font-display text-3xl font-bold">Get your product</h1>
          <p className="mt-2 text-sm text-white/70">
            Purchase complete · Demo activation keys
          </p>
        </div>

        {loading || authLoading ? (
          <div role="status" className="flex justify-center gap-3 py-16">
            <LoaderCircle className="animate-spin" /> Loading your purchase...
          </div>
        ) : error && items.length === 0 ? (
          <div role="alert" className="bg-[#321477] p-8 text-center">{error}</div>
        ) : (
          <div className="space-y-5">
            {items.map((item) => (
              <section key={item.id} className="bg-[#321477] p-6 sm:p-8">
                <div className="flex items-center gap-5">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.product_name}
                      className="h-24 w-20 shrink-0 object-cover" />
                  ) : (
                    <div className="flex h-24 w-20 shrink-0 items-center justify-center bg-[#211342]">
                      <Gamepad2 size={30} />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold">{item.product_name}</h2>
                    {item.platform && (
                      <p className="mt-2 text-sm text-white/65">{item.platform}</p>
                    )}
                  </div>
                </div>

                <div className="mt-7 bg-[#211342] p-6 text-center">
                  <p className="mb-4 text-sm text-white/65">Digital product key (demo)</p>
                  {item.key_code ? (
                    <>
                      <code className="block break-all text-xl font-bold tracking-wide sm:text-2xl">
                        {item.key_code}
                      </code>
                      <button type="button"
                        onClick={() => void copyKey(item.id, item.key_code!)}
                        className="mt-6 inline-flex items-center gap-2 bg-[#C6F135] px-7 py-3 text-sm font-bold text-[#211342] hover:bg-[#D4FF3F]">
                        {copied === item.id ? <Check size={17} /> : <Copy size={17} />}
                        {copied === item.id ? "Copied!" : "Copy key"}
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-amber-200">
                      Key not available. Check your keys library.
                    </p>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}

        {error && items.length > 0 && (
          <p role="alert" className="mt-4 text-sm text-amber-200">{error}</p>
        )}

        <div className="mt-8 text-center text-sm text-white/70">
          You can always find your demo keys in your{" "}
          <Link to="/account/keys" className="font-bold text-[#C6F135] underline">
            Keys library
          </Link>.
        </div>
      </div>
    </main>
  );
}
