
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  PackageOpen,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

type Order = {
  id: string;
  order_number: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  platform: string | null;
  quantity: number;
  unit_price: number;
};

export function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrder() {
      setLoading(true);
      setError("");
      setOrder(null);
      setItems([]);

      if (!user || !orderId) {
        setLoading(false);
        return;
      }

      const { data: orderData, error: orderError } =
        await supabase
          .from("orders")
          .select(
            "id, order_number, total_amount, currency, status, created_at"
          )
          .eq("id", orderId)
          .eq("user_id", user.id)
          .maybeSingle();

      if (cancelled) return;

      if (orderError) {
        setError(orderError.message);
        setLoading(false);
        return;
      }

      if (!orderData) {
        setError("Order not found.");
        setLoading(false);
        return;
      }

      const { data: itemsData, error: itemsError } =
        await supabase
          .from("order_items")
          .select(
            "id, product_name, platform, quantity, unit_price"
          )
          .eq("order_id", orderData.id);

      if (cancelled) return;

      if (itemsError) {
        setError(itemsError.message);
      } else {
        setOrder(orderData as Order);
        setItems((itemsData ?? []) as OrderItem[]);
      }

      setLoading(false);
    }

    void loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId, user?.id]);

  function formatPrice(value: number, currency: string) {
    try {
      return new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency,
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${currency}`;
    }
  }

  if (loading) {
    return (
      <main className="p-8 text-sm text-[#786B96]">
        Loading order details...
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-[1100px] bg-white p-8">
        <h1 className="text-lg font-bold text-[#211047]">
          Order unavailable
        </h1>

        <p role="alert" className="mt-3 text-sm text-red-600">
          {error || "Order not found."}
        </p>

        <Link
          to="/account/orders"
          className="mt-6 inline-block text-sm font-bold text-[#4219A8]"
        >
          Back to orders
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] text-[#211047]">
      <Link
        to="/account/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#4219A8]"
      >
        <ArrowLeft size={17} />
        Back to orders
      </Link>

      <section className="bg-white shadow-sm">
        <div className="border-b border-[#F0EDF5] p-7">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-[#4219A8]" />

            <h1 className="text-xl font-bold">
              Order {order.order_number}
            </h1>
          </div>

          <p className="mt-3 text-sm text-[#82779B]">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString(
              "en-GB"
            )}
          </p>

          <p className="mt-3 text-sm">
            Status:{" "}
            <span className="font-bold capitalize">
              {order.status}
            </span>
          </p>
        </div>

        <div className="p-7">
          <h2 className="mb-5 text-sm font-bold uppercase">
            Purchased products
          </h2>

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <PackageOpen
                size={38}
                className="text-[#A99BBF]"
              />

              <p className="text-sm text-[#82779B]">
                No products are attached to this order.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EDF5]">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-3 py-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="text-sm font-bold">
                      {item.product_name}
                    </h3>

                    <p className="mt-1 text-xs text-[#82779B]">
                      {item.platform || "Digital product"}
                    </p>

                    <p className="mt-1 text-xs text-[#82779B]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <span className="text-sm font-bold">
                    {formatPrice(
                      item.unit_price * item.quantity,
                      order.currency
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#F0EDF5] bg-[#FAF9FD] px-7 py-6">
          <span className="text-sm font-bold">
            Order total
          </span>

          <span className="text-xl font-bold">
            {formatPrice(
              order.total_amount,
              order.currency
            )}
          </span>
        </div>
      </section>
    </main>
  );
}
