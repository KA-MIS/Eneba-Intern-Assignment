
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  ShoppingBag,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

type CheckoutResponse = {
  data?: {
    orderId: string;
    orderNumber: string;
    total: number;
    alreadyProcessed: boolean;
  };
  error?: string;
};

export function CheckoutPage() {
  const navigate = useNavigate();

  const {
    items,
    subtotal,
    itemCount,
    clearCart,
  } = useCart();

  const { user, loading: authLoading } = useAuth();

  const [balance, setBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Keep the same request ID when retrying the same cart.
  const checkoutRequest = useRef<{
    fingerprint: string;
    requestId: string;
  } | null>(null);

  // Prevent rapid duplicate submissions.
  const paymentInProgress = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadBalance() {
      setWalletLoading(true);
      setWalletError("");
      setBalance(0);

      if (!user) {
        setWalletLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("demo_wallets")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setWalletError(error.message);
      } else {
        setBalance(Number(data?.balance ?? 0));
      }

      setWalletLoading(false);
    }

    void loadBalance();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const insufficientFunds = balance < subtotal;

  const canPay =
    !!user &&
    !authLoading &&
    !walletLoading &&
    !walletError &&
    !paymentLoading &&
    !insufficientFunds &&
    items.length > 0;

  async function handlePayment() {
    if (!canPay || paymentInProgress.current) {
      return;
    }

    paymentInProgress.current = true;
    setPaymentLoading(true);
    setPaymentError("");

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session?.access_token) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      const fingerprint = JSON.stringify({
        userId: user?.id,
        offerIds: items
          .map((item) => item.offerId)
          .sort(),
      });

      if (
        !checkoutRequest.current ||
        checkoutRequest.current.fingerprint !== fingerprint
      ) {
        checkoutRequest.current = {
          fingerprint,
          requestId: crypto.randomUUID(),
        };
      }

      const response = await fetch(
        `${API_URL}/api/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.session.access_token}`,
          },
          body: JSON.stringify({
            requestId: checkoutRequest.current.requestId,
            items: items.map((item) => ({
              offerId: item.offerId,
              quantity: 1,
            })),
          }),
        }
      );

      const result: CheckoutResponse = await response.json();

      if (!response.ok || !result.data?.orderId) {
        throw new Error(
          result.error || "Payment could not be completed."
        );
      }

      const orderId = result.data.orderId;

      clearCart();

      navigate(`/account/orders/${orderId}`, {
        replace: true,
      });

    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Something went wrong during checkout."
      );
    } finally {
      paymentInProgress.current = false;
      setPaymentLoading(false);
    }
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#4519AC] text-white">
        <LoaderCircle
          className="animate-spin"
          size={30}
        />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#4519AC] px-4 py-20 text-white">
        <div className="mx-auto max-w-xl bg-[#321477] p-10 text-center">
          <ShoppingBag
            size={42}
            className="mx-auto text-[#C6F135]"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm text-white/70">
            Add some games before proceeding to checkout.
          </p>

          <Link
            to="/store"
            className="mt-7 inline-block bg-[#C6F135] px-6 py-3 text-sm font-bold text-[#211342]"
          >
            Explore games
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#4519AC] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/cart"
          className="text-sm font-semibold text-[#C6F135] hover:underline"
        >
          ← Back to cart
        </Link>

        <h1 className="mt-7 font-display text-3xl font-bold">
          Secure checkout
        </h1>

        <p className="mt-2 text-sm text-white/70">
          Demo checkout · No real payment will be processed
        </p>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            {/* ACCOUNT */}
            <section className="bg-[#321477] p-6">
              <h2 className="text-lg font-bold">
                Your account
              </h2>

              {user ? (
                <p className="mt-3 text-sm text-white/75">
                  Signed in as{" "}
                  <span className="font-bold text-white">
                    {user.email}
                  </span>
                </p>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-amber-200">
                    Sign in to continue with your purchase.
                  </p>

                  <Link
                    to="/login"
                    className="mt-4 inline-block bg-[#C6F135] px-5 py-3 text-sm font-bold text-[#211342]"
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </section>

            {/* PAYMENT METHOD */}
            <section className="bg-[#321477] p-6">
              <div className="flex items-center gap-3">
                <Wallet
                  size={23}
                  className="text-[#C6F135]"
                />

                <h2 className="text-lg font-bold">
                  Payment method
                </h2>
              </div>

              <div className="mt-5 border border-white/20 bg-[#211342] p-5">
                <p className="text-sm font-bold">
                  Demo Wallet
                </p>

                {walletLoading ? (
                  <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                    Loading balance...
                  </div>
                ) : walletError ? (
                  <p
                    role="alert"
                    className="mt-3 text-sm text-red-200"
                  >
                    {walletError}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-white/70">
                    Available balance:{" "}
                    <span className="font-bold text-[#C6F135]">
                      {euro.format(balance)}
                    </span>
                  </p>
                )}

                {user &&
                  !walletLoading &&
                  !walletError &&
                  insufficientFunds && (
                    <div className="mt-4 flex items-start gap-2 text-sm text-amber-200">
                      <AlertCircle
                        size={18}
                        className="shrink-0"
                      />
                      <p>
                        Insufficient demo funds. Add more
                        funds to your wallet.
                      </p>
                    </div>
                  )}

                <Link
                  to="/account/balance"
                  className="mt-4 inline-block text-sm font-semibold text-[#C6F135] hover:underline"
                >
                  Manage demo wallet
                </Link>
              </div>
            </section>

            {/* PRODUCTS */}
            <section className="bg-[#321477] p-6">
              <h2 className="text-lg font-bold">
                Your products ({itemCount})
              </h2>

              <div className="mt-5 divide-y divide-white/15">
                {items.map((item) => (
                  <div
                    key={item.offerId}
                    className="flex items-center gap-4 py-4"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-20 w-14 shrink-0 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs text-white/65">
                        {item.platform} · {item.region}
                      </p>

                      <p className="mt-1 text-xs text-white/65">
                        Seller: {item.seller}
                      </p>
                    </div>

                    <span className="text-sm font-bold">
                      {euro.format(
                        item.price * item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ORDER SUMMARY */}
          <aside className="bg-[#321477] p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-bold">
              Order summary
            </h2>

            <div className="mt-6 flex justify-between gap-3 text-sm">
              <span className="text-white/70">
                Products ({itemCount})
              </span>

              <span>{euro.format(subtotal)}</span>
            </div>

            <div className="mt-4 flex justify-between gap-3 text-sm">
              <span className="text-white/70">
                Service fee
              </span>

              <span className="text-white/60">
                €0.00 (Demo)
              </span>
            </div>

            <div className="my-5 border-t border-white/20" />

            <div className="flex justify-between gap-3">
              <span className="font-bold">
                Total (estimated)
              </span>

              <span className="text-2xl font-bold">
                {euro.format(subtotal)}
              </span>
            </div>

            {paymentError && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2 border border-red-400/40 bg-red-950/40 p-3 text-sm text-red-100"
              >
                <AlertCircle
                  size={18}
                  className="shrink-0"
                />

                <p>{paymentError}</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => void handlePayment()}
              disabled={!canPay}
              className={`mt-6 flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#211342] transition ${
                canPay
                  ? "bg-[#C6F135] hover:bg-[#D4FF3F]"
                  : "cursor-not-allowed bg-[#C6F135] opacity-60"
              }`}
            >
              {paymentLoading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Processing demo payment...
                </>
              ) : (
                "Pay with Demo Wallet"
              )}
            </button>

            <div className="mt-4 flex items-start gap-2 text-xs text-white/65">
              <ShieldCheck
                size={17}
                className="shrink-0 text-[#C6F135]"
              />

              <p>
                This is a demo payment. No real money
                will be charged. Final prices are
                verified by the server.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
