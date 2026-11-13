
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ShoppingBag,
  PackageOpen,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

// ======================================
// TYPES
// ======================================

type Order = {
  id: string;
  order_number: string;
  total_amount: number;
  currency: string;
  status: "pending" | "paid" | "cancelled" | "refunded";
  created_at: string;
};

// ======================================
// ORDERS PAGE
// ======================================

export function OrdersPage() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================
  // FETCH ORDERS
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setLoading(true);
      setError("");
      setOrders([]);

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("orders")
        .select(
          "id, order_number, total_amount, currency, status, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (queryError) {
        setError(queryError.message);
      } else {
        setOrders((data ?? []) as Order[]);
      }

      setLoading(false);
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // ======================================
  // PRICE FORMAT
  // ======================================

  function formatPrice(
    amount: number,
    currency: string
  ) {
    try {
      return new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency,
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${currency}`;
    }
  }

  // ======================================
  // STATUS STYLES
  // ======================================

  function getStatusClass(status: Order["status"]) {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "cancelled":
        return "bg-gray-100 text-gray-700";

      case "refunded":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  // ======================================
  // RENDER
  // ======================================

  return (
    <main className="mx-auto max-w-[1180px] text-[#211047]">
      <p className="text-xs text-[#82779B]">
        My account · Orders
      </p>

      <h1 className="mb-6 mt-6 text-sm font-bold uppercase tracking-wider">
        My orders
      </h1>

      <section className="bg-white shadow-sm">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 border-b border-[#F0EDF5] px-6 py-6">
          <div className="flex items-center gap-3">
            <ShoppingBag
              size={20}
              className="text-[#4219A8]"
            />

            <h2 className="text-sm font-bold uppercase">
              Order history
            </h2>
          </div>

          <span className="text-xs text-[#82779B]">
            {orders.length} orders
          </span>
        </div>

        {/* LOADING */}
        {loading ? (
          <div
            role="status"
            className="flex items-center justify-center gap-3 p-12 text-sm text-[#786B96]"
          >
            <RefreshCw
              size={18}
              className="animate-spin"
            />
            Loading orders...
          </div>
        ) : error ? (
          /* ERROR */
          <div
            role="alert"
            className="p-8 text-center"
          >
            <p className="font-semibold text-red-600">
              Could not load orders
            </p>

            <p className="mt-2 text-sm text-[#786B96]">
              {error}
            </p>
          </div>
        ) : orders.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <PackageOpen
              size={42}
              className="text-[#A99BBF]"
            />

            <h3 className="mt-5 text-lg font-bold">
              No orders yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-[#82779B]">
              Your purchases will appear here once
              you complete your first order.
            </p>

            <Link
              to="/store"
              className="mt-6 rounded-md bg-[#C6F135] px-6 py-3 text-sm font-bold text-[#211047] transition hover:bg-[#D4FF3F]"
            >
              Explore games
            </Link>
          </div>
        ) : (
          /* ORDER LIST */
          <div className="divide-y divide-[#F0EDF5]">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="flex flex-col gap-4 px-6 py-5 transition hover:bg-[#FAF9FD] sm:flex-row sm:items-center sm:justify-between"
              >
                {/* ORDER INFO */}
                <div>
                  <p className="text-sm font-bold">
                    {order.order_number}
                  </p>

                  <p className="mt-1 text-xs text-[#82779B]">
                    {new Date(
                      order.created_at
                    ).toLocaleDateString("en-GB")}
                  </p>
                </div>

                {/* STATUS / PRICE */}
                <div className="flex items-center gap-5">
                  <span
                    className={`rounded px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                  <span className="min-w-[75px] text-right text-sm font-bold">
                    {formatPrice(
                      order.total_amount,
                      order.currency
                    )}
                  </span>

                  <ChevronRight
                    size={18}
                    className="text-[#82779B]"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
