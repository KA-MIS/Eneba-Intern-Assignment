import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function VerifyEmailPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  if (loading) return <main className="min-h-screen bg-[#0E0620]" />;
  if (user) return <Navigate to="/account" replace />;

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#0E0620] px-5 py-16 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-[#2E1E52] bg-[#1A0E33] p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-[#C6F135] text-4xl">
          ✉️
        </div>
        <p className="mb-3 font-semibold uppercase tracking-widest text-[#C6F135]">
          One more step
        </p>
        <h1 className="mb-4 text-4xl font-bold">Check your email</h1>
        <p className="mb-5 text-[#B8AEDB]">
          We've sent you a verification link. Open your inbox and confirm your email to activate your account.
        </p>
        {email && (
          <p className="mb-6 break-all font-semibold text-white">{email}</p>
        )}
        <div className="mb-7 flex items-center justify-center gap-3 text-[#C6F135]">
          <span className="h-3 w-3 animate-ping rounded-full bg-[#C6F135]" />
          Waiting for verification...
        </div>
        <p className="mb-6 text-sm text-[#B8AEDB]">
          After confirmation, you'll be redirected to your account. If you confirm on another device, return here and log in.
        </p>
        <Link
          to="/login"
          className="inline-block rounded-lg bg-[#C6F135] px-8 py-3 font-bold text-[#0E0620] hover:bg-[#D4FF3F]"
        >
          Go to login
        </Link>
      </section>
    </main>
  );
}
