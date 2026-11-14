
import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { user, loading, signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <main className="min-h-screen bg-[#0E0620]" />;
  }

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await signUp(email.trim(), password);

      if (result.error) {
        setError(result.error);
      } else {
        navigate("/verify-email", {
          replace: true,
          state: { email: email.trim() },
        });
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
            JOIN DIGITAL MARKETPLACE
          </p>
          <h1 className="text-4xl font-bold md:text-6xl">
            Your next game
            <br />
            starts here.
          </h1>
          <p className="mt-6 max-w-md text-lg text-[#B8AEDB]">
            Create your account and discover great digital game offers.
          </p>
        </section>

        <section className="rounded-2xl border border-[#2E1E52] bg-[#1A0E33] p-8 shadow-2xl">
          <h2 className="mb-2 text-3xl font-bold">Create account</h2>
          <p className="mb-8 text-[#B8AEDB]">
            Sign up with your email address.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="register-email" className="mb-2 block text-sm">
                Email address
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-[#49336D] bg-[#0E0620] px-4 py-3 outline-none focus:border-[#C6F135]"
              />
            </div>

            <div>
              <label htmlFor="register-password" className="mb-2 block text-sm">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-[#49336D] bg-[#0E0620] px-4 py-3 outline-none focus:border-[#C6F135]"
              />
            </div>

            <div>
              <label htmlFor="register-confirm" className="mb-2 block text-sm">
                Confirm password
              </label>
              <input
                id="register-confirm"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-[#49336D] bg-[#0E0620] px-4 py-3 outline-none focus:border-[#C6F135]"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">{error}</p>
            )}

            {success && (
              <p role="status" className="text-sm text-[#C6F135]">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#C6F135] py-3 font-bold text-[#0E0620] transition hover:bg-[#D4FF3F] disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#B8AEDB]">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#C6F135] hover:underline">
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
