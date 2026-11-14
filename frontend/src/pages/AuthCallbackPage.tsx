import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export function AuthCallbackPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function completeVerification() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (params.get("error")) {
        setError(params.get("error_description") || "Verification failed.");
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError && active) {
          setError(exchangeError.message);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (active && data.session) navigate("/account", { replace: true });
    }

    void completeVerification();
    return () => { active = false; };
  }, [navigate]);

  if (user) return <Navigate to="/account" replace />;

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#0E0620] px-5 text-white">
      <section className="rounded-2xl border border-[#2E1E52] bg-[#1A0E33] p-10 text-center">
        <h1 className="mb-3 text-3xl font-bold">
          {error ? "Verification failed" : "Verifying your email..."}
        </h1>
        <p className="text-[#B8AEDB]">
          {error || (loading ? "Checking your session..." : "Completing secure sign-in...")}
        </p>
        {error && <a className="mt-5 inline-block text-[#C6F135]" href="/login">Go to login</a>}
      </section>
    </main>
  );
}
