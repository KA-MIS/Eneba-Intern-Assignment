
import { useCallback, useEffect, useState } from "react";
import {
  Wallet,
  PlusCircle,
  History,
  LoaderCircle,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

type WalletTransaction = {
  id: string;
  amount: number;
  transaction_type:
    | "demo_topup"
    | "demo_purchase"
    | "demo_refund";
  description: string;
  created_at: string;
};

const topupAmounts = [5, 10, 20, 50, 100];

export function WalletPage() {
  const { user } = useAuth();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<
    WalletTransaction[]
  >([]);

  const [selectedAmount, setSelectedAmount] = useState(20);
  const [loading, setLoading] = useState(true);
  const [addingFunds, setAddingFunds] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadWallet = useCallback(async () => {
    if (!user) {
      setBalance(0);
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const [walletResult, transactionsResult] =
      await Promise.all([
        supabase
          .from("demo_wallets")
          .select("balance")
          .eq("user_id", user.id)
          .maybeSingle(),

        supabase
          .from("demo_wallet_transactions")
          .select(
            "id, amount, transaction_type, description, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(30),
      ]);

    if (walletResult.error) {
      setError(walletResult.error.message);
    } else if (transactionsResult.error) {
      setError(transactionsResult.error.message);
    } else {
      setBalance(Number(walletResult.data?.balance ?? 0));
      setTransactions(
        (transactionsResult.data ?? []) as WalletTransaction[]
      );
    }

    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    void loadWallet();
  }, [loadWallet]);

  async function handleTopup() {
    if (!user || addingFunds) return;

    setAddingFunds(true);
    setError("");
    setMessage("");

    try {
      const { error: rpcError } = await supabase.rpc(
        "add_demo_funds",
        {
          p_amount: selectedAmount,
        }
      );

      if (rpcError) throw rpcError;

      setMessage(
        `€${selectedAmount.toFixed(2)} added to your demo wallet.`
      );

      await loadWallet();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not add demo funds."
      );
    } finally {
      setAddingFunds(false);
    }
  }

  function formatMoney(amount: number) {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }

  return (
    <main className="mx-auto max-w-[1100px] text-[#211047]">
      <p className="text-xs text-[#82779B]">
        My account · Balance
      </p>

      <h1 className="mb-6 mt-6 text-sm font-bold uppercase tracking-wider">
        Demo wallet
      </h1>

      <section className="rounded-xl bg-[#4219A8] p-7 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#D9CBFF]">
            Available demo balance
          </span>

          <Wallet size={25} className="text-[#C6F135]" />
        </div>

        {loading ? (
          <LoaderCircle
            size={28}
            className="mt-5 animate-spin"
          />
        ) : (
          <p className="mt-4 text-4xl font-bold">
            {formatMoney(balance)}
          </p>
        )}

        <p className="mt-3 text-xs text-[#D9CBFF]">
          Simulation funds · No real monetary value
        </p>
      </section>

      <section className="mt-6 bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <PlusCircle
            size={21}
            className="text-[#4219A8]"
          />

          <h2 className="text-sm font-bold uppercase">
            Add demo funds
          </h2>
        </div>

        <p className="mt-3 text-sm text-[#82779B]">
          Choose an amount to add to your simulated wallet.
          No payment is required.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {topupAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setSelectedAmount(amount)}
              className={`rounded-lg border px-5 py-3 text-sm font-bold transition ${
                selectedAmount === amount
                  ? "border-[#4219A8] bg-[#F0E9FF] text-[#4219A8]"
                  : "border-[#DDD5EA] bg-white hover:bg-[#FAF9FD]"
              }`}
            >
              €{amount}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => void handleTopup()}
          disabled={addingFunds || loading}
          className="mt-6 rounded-md bg-[#C6F135] px-7 py-3 text-sm font-bold text-[#211047] hover:bg-[#D4FF3F] disabled:opacity-50"
        >
          {addingFunds
            ? "Adding funds..."
            : `Add €${selectedAmount} (Demo)`}
        </button>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="mt-4 text-sm text-green-700">
            {message}
          </p>
        )}
      </section>

      <section className="mt-6 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#F0EDF5] p-7">
          <History size={21} className="text-[#4219A8]" />

          <h2 className="text-sm font-bold uppercase">
            Transaction history
          </h2>
        </div>

        {loading ? (
          <p className="p-7 text-sm text-[#82779B]">
            Loading transactions...
          </p>
        ) : transactions.length === 0 ? (
          <p className="p-7 text-sm text-[#82779B]">
            No transactions yet.
          </p>
        ) : (
          <div className="divide-y divide-[#F0EDF5]">
            {transactions.map((transaction) => {
              const positive = transaction.amount > 0;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 px-7 py-5"
                >
                  <div className="flex items-center gap-3">
                    {positive ? (
                      <ArrowDownLeft
                        size={20}
                        className="text-green-600"
                      />
                    ) : (
                      <ArrowUpRight
                        size={20}
                        className="text-red-600"
                      />
                    )}

                    <div>
                      <p className="text-sm font-semibold">
                        {transaction.description}
                      </p>

                      <p className="mt-1 text-xs text-[#82779B]">
                        {new Date(
                          transaction.created_at
                        ).toLocaleString("en-GB")}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-bold ${
                      positive
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {formatMoney(transaction.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
