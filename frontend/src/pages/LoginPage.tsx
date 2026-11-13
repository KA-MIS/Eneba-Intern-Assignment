
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <main className="min-h-screen bg-[#0E0620]" />;
  }

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await signIn(email.trim(), password);

      if (result.error) {
        setError(result.error);
      } else {
        navigate("/");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[75vh] bg-[#0E0620] px-5 py-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <section>
          <p className="mb-4 font-semibold text-[#C6F135]">
            DIGITAL MARKETPLACE
          </p>
          <h1 className="text-4xl font-bold md:text-6xl">
            Hi! It's nice
            <br />
            to see you!
          </h1>
          <p className="mt-6 max-w-md text-lg text-[#B8AEDB]">
            Log in to manage your account, explore games and
            keep track of your purchases.
          </p>
        </section>

        <section className="rounded-2xl border border-[#2E1E52] bg-[#1A0E33] p-8 shadow-2xl">
          <h2 className="mb-2 text-3xl font-bold">Log in</h2>
          <p className="mb-8 text-[#B8AEDB]">
            Welcome back! Enter your details below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#49336D] bg-[#0E0620] px-4 py-3 text-white outline-none focus:border-[#C6F135]"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-[#49336D] bg-[#0E0620] px-4 py-3 text-white outline-none focus:border-[#C6F135]"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#C6F135] py-3 font-bold text-[#0E0620] transition hover:bg-[#D4FF3F] disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#B8AEDB]">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#C6F135] hover:underline">
              Register
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
