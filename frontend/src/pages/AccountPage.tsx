
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Pencil,
  ShieldCheck,
  ShoppingCart,
  Wallet,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

// ======================================
// TYPES
// ======================================

type RecentOrder = {
  id: string;
  order_number: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
};

// ======================================
// ACCOUNT OVERVIEW
// ======================================

export function AccountPage() {
  const { user } = useAuth();

  const [balance, setBalance] = useState(0);
  const [orders, setOrders] = useState<RecentOrder[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================
  // LOAD ACCOUNT DATA
  // ======================================

  useEffect(() => {
    let cancelled = false;

    async function loadAccountData() {
      setLoading(true);
      setError("");
      setBalance(0);
      setOrders([]);

      if (!user) {
        setLoading(false);
        return;
      }

      const [walletResult, ordersResult] =
        await Promise.all([
          supabase
            .from("demo_wallets")
            .select("balance")
            .eq("user_id", user.id)
            .maybeSingle(),

          supabase
            .from("orders")
            .select(
              "id, order_number, total_amount, currency, status, created_at"
            )
            .eq("user_id", user.id)
            .order("created_at", {
              ascending: false,
            })
            .limit(3),
        ]);

      if (cancelled) return;

      const errors = [
        walletResult.error?.message,
        ordersResult.error?.message,
      ].filter(Boolean);

      if (errors.length > 0) {
        setError(errors.join(" | "));
      }

      if (!walletResult.error) {
        setBalance(
          Number(walletResult.data?.balance ?? 0)
        );
      }

      if (!ordersResult.error) {
        setOrders(
          (ordersResult.data ?? []) as RecentOrder[]
        );
      }

      setLoading(false);
    }

    void loadAccountData();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // ======================================
  // HELPERS
  // ======================================

  function formatMoney(
    amount: number,
    currency = "EUR"
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

  function getStatusStyle(status: string) {
    switch (status.toLowerCase()) {
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

  if (!user) return null;

  const email = user.email || "";

  const username =
    user.user_metadata?.username ||
    email.split("@")[0] ||
    "User";

  const memberSince = new Date(
    user.created_at
  ).toLocaleDateString("en-GB");

  // ======================================
  // RENDER
  // ======================================

  return (
    <main className="text-[#211047]">
      <p className="text-xs text-[#82779B]">
        My account · Overview
      </p>

      <h1 className="mb-6 mt-6 text-sm font-bold uppercase tracking-wider">
        Overview
      </h1>

      {error && (
        <p
          role="alert"
          className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          Some account information could not be loaded:
          {" "}
          {error}
        </p>
      )}

      <div className="grid max-w-[1180px] items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
        {/* ======================================
            LEFT COLUMN
        ====================================== */}
        <div className="min-w-0 space-y-5">
          {/* PROFILE */}
          <section className="bg-white shadow-sm">
            <h2 className="border-b border-[#F0EDF5] px-7 py-6 text-sm font-bold uppercase tracking-wide">
              Profile
            </h2>

            <div className="flex items-center justify-between gap-4 px-7 py-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#32147D] text-[#C6F135]">
                  {email.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {username}
                  </p>

                  <p className="truncate text-xs text-[#786B96]">
                    {email}
                  </p>
                </div>
              </div>

              <Link
                to="/account/settings"
                aria-label="Edit profile"
                className="rounded p-2 text-[#786B96] hover:bg-[#F5F4FA] hover:text-[#4219A8]"
              >
                <Pencil size={17} />
              </Link>
            </div>

            <div className="border-t border-[#F0EDF5] px-7 py-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold">
                  Account information
                </p>

                <Link
                  to="/account/settings"
                  className="text-xs font-semibold text-[#4219A8] hover:underline"
                >
                  Manage profile
                </Link>
              </div>

              <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
                <div>
                  <p className="text-[#82779B]">
                    Member since
                  </p>

                  <p className="mt-1 font-semibold">
                    {memberSince}
                  </p>
                </div>

                <div>
                  <p className="text-[#82779B]">
                    Email verification
                  </p>

                  <p className="mt-1 flex items-center gap-1 font-semibold">
                    <ShieldCheck
                      size={14}
                      className={
                        user.email_confirmed_at
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }
                    />

                    {user.email_confirmed_at
                      ? "Verified"
                      : "Not verified"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================
              BALANCE
          ====================================== */}
          <section className="bg-white shadow-sm">
            <div className="border-b border-[#F0EDF5] px-6 py-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xs font-bold uppercase">
                    Total balance
                  </h2>

                  {loading ? (
                    <LoaderCircle
                      size={25}
                      className="mt-4 animate-spin text-[#4219A8]"
                    />
                  ) : (
                    <p className="mt-2 text-3xl font-bold text-[#00BF8F]">
                      {formatMoney(balance)}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-[#82779B]">
                    Demo wallet · No real monetary value
                  </p>
                </div>

                <Link
                  to="/account/balance"
                  className="border border-[#6236DC] px-5 py-3 text-xs font-semibold text-[#4219A8] hover:bg-[#F4EFFF]"
                >
                  Wallet overview
                </Link>
              </div>
            </div>

            {/* GIFT CARD BALANCE */}
            <div className="border-b border-[#F0EDF5] px-6 py-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase">
                    Gift card balance
                  </h3>

                  <p className="mt-2 text-xs text-[#82779B]">
                    Gift card redemption is not implemented yet
                  </p>
                </div>

                <p className="text-xl font-medium text-[#4219A8]">
                  €0.00
                </p>
              </div>

              {/* DEMO WALLET STATUS */}
              <div className="mt-5 flex flex-col gap-4 bg-[#F0E9FF] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Wallet
                    size={20}
                    className="mt-0.5 shrink-0 text-[#4219A8]"
                  />

                  <div>
                    <p className="text-sm font-bold">
                      Demo wallet active
                    </p>

                    <p className="mt-2 max-w-sm text-xs leading-5 text-[#786B96]">
                      Your demo balance is stored securely
                      in Supabase. You can add simulated
                      funds and view transaction history.
                    </p>
                  </div>
                </div>

                <Link
                  to="/account/balance"
                  className="shrink-0 bg-[#C6F135] px-5 py-3 text-center text-xs font-bold text-[#211047] hover:bg-[#D4FF3F]"
                >
                  Manage wallet
                </Link>
              </div>
            </div>

            {/* BONUS */}
            <div className="flex items-center justify-between gap-4 px-6 py-6">
              <div>
                <h3 className="text-xs font-bold uppercase">
                  Bonus
                </h3>

                <p className="mt-2 text-xs text-[#82779B]">
                  Rewards are not implemented yet
                </p>
              </div>

              <p className="text-xl font-medium text-[#4219A8]">
                €0.00
              </p>
            </div>
          </section>
        </div>

        {/* ======================================
            RIGHT COLUMN
        ====================================== */}
        <section className="min-w-0 bg-white shadow-sm">
          <h2 className="border-b border-[#F0EDF5] px-7 py-6 text-sm font-bold uppercase tracking-wide">
            Latest purchases
          </h2>

          <div className="px-7 py-7">
            {loading ? (
              <div
                role="status"
                className="flex min-h-[170px] items-center justify-center gap-3 text-sm text-[#82779B]"
              >
                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />

                Loading purchases...
              </div>
            ) : orders.length === 0 ? (
              <div className="flex min-h-[170px] flex-col items-center justify-center border border-dashed border-[#E3DDED] px-5 py-7 text-center">
                <ShoppingCart
                  size={32}
                  className="text-[#A99BBF]"
                />

                <p className="mt-4 text-sm font-semibold">
                  No purchases to display
                </p>

                <p className="mt-2 text-xs leading-5 text-[#82779B]">
                  Your orders will appear here
                  after your first purchase.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#F0EDF5] border border-[#E3DDED]">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/account/orders/${order.id}`}
                    className="block p-4 transition hover:bg-[#FAF9FD]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-bold">
                          {order.order_number}
                        </p>

                        <p className="mt-2 text-xs text-[#82779B]">
                          {new Date(
                            order.created_at
                          ).toLocaleDateString("en-GB")}
                        </p>
                      </div>

                      <ArrowRight
                        size={16}
                        className="shrink-0 text-[#4219A8]"
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-bold capitalize ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      <span className="text-sm font-bold">
                        {formatMoney(
                          Number(order.total_amount),
                          order.currency
                        )}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link
              to="/account/orders"
              className="mt-5 block w-full border border-[#6236DC] px-5 py-3 text-center text-xs font-semibold text-[#4219A8] hover:bg-[#F4EFFF]"
            >
              View all orders
            </Link>

            <Link
              to="/account/keys"
              className="mt-3 block text-center text-xs font-semibold text-[#4219A8] hover:underline"
            >
              View keys library
            </Link>

            <Link
              to="/store"
              className="mt-3 block text-center text-xs font-semibold text-[#4219A8] hover:underline"
            >
              Browse games
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
