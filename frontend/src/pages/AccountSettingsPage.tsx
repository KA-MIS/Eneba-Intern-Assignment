
import { useEffect, useState, type FormEvent } from "react";
import {
  UserRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

export function AccountSettingsPage() {
  const { user } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [profileError, setProfileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Load authenticated user data
  useEffect(() => {
    if (!user) return;

    setUsername(
      user.user_metadata?.username ||
      user.email?.split("@")[0] ||
      ""
    );

    setEmail(user.email || "");
  }, [user]);

  // ======================================
  // UPDATE PROFILE
  // ======================================

  async function handleProfileSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    const cleanUsername = username.trim();

    if (
      cleanUsername.length < 3 ||
      cleanUsername.length > 30
    ) {
      setProfileError(
        "Username must contain 3–30 characters."
      );
      return;
    }

    setSavingProfile(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username: cleanUsername,
        },
      });

      if (error) throw error;

      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Could not update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  // ======================================
  // UPDATE EMAIL
  // ======================================

  async function handleEmailSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setEmailMessage("");
    setEmailError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setEmailError("Enter a valid email address.");
      return;
    }

    if (cleanEmail === user?.email?.toLowerCase()) {
      setEmailMessage("Your email has not changed.");
      return;
    }

    setSavingEmail(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: cleanEmail,
      });

      if (error) throw error;

      setEmailMessage(
        "Email change requested. Check your inbox for confirmation."
      );
    } catch (error) {
      setEmailError(
        error instanceof Error
          ? error.message
          : "Could not update email."
      );
    } finally {
      setSavingEmail(false);
    }
  }

  // ======================================
  // UPDATE PASSWORD
  // ======================================

  async function handlePasswordSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setSavingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage(
        "Password updated successfully."
      );
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Could not update password."
      );
    } finally {
      setSavingPassword(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-md border border-[#DDD5EA] bg-white px-4 py-3 text-sm text-[#211047] outline-none focus:border-[#6236DC] focus:ring-2 focus:ring-[#6236DC]/15";

  const labelClass =
    "block text-xs font-semibold text-[#51436C]";

  return (
    <main className="mx-auto max-w-[1050px] text-[#211047]">
      <p className="text-xs text-[#82779B]">
        My account · Settings
      </p>

      <h1 className="mb-6 mt-6 text-sm font-bold uppercase tracking-wider">
        Account settings
      </h1>

      <div className="space-y-5">
        {/* PROFILE */}
        <section className="bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#F0EDF5] px-7 py-6">
            <UserRound
              size={20}
              className="text-[#4219A8]"
            />
            <h2 className="text-sm font-bold uppercase">
              Profile information
            </h2>
          </div>

          <form
            onSubmit={handleProfileSave}
            className="space-y-5 p-7"
          >
            <div>
              <label
                htmlFor="account-username"
                className={labelClass}
              >
                Username
              </label>

              <input
                id="account-username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                minLength={3}
                maxLength={30}
                required
                autoComplete="username"
                className={inputClass}
              />
            </div>

            {profileError && (
              <p role="alert" className="text-sm text-red-600">
                {profileError}
              </p>
            )}

            {profileMessage && (
              <p role="status" className="text-sm text-green-700">
                {profileMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-md bg-[#C6F135] px-6 py-3 text-sm font-bold text-[#211047] hover:bg-[#D4FF3F] disabled:opacity-50"
            >
              {savingProfile
                ? "Saving..."
                : "Save changes"}
            </button>
          </form>
        </section>

        {/* EMAIL */}
        <section className="bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#F0EDF5] px-7 py-6">
            <Mail
              size={20}
              className="text-[#4219A8]"
            />
            <h2 className="text-sm font-bold uppercase">
              Email address
            </h2>
          </div>

          <form
            onSubmit={handleEmailSave}
            className="space-y-5 p-7"
          >
            <div>
              <label
                htmlFor="account-email"
                className={labelClass}
              >
                Email address
              </label>

              <input
                id="account-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#786B96]">
              <ShieldCheck size={16} />
              <span>
                Current email status:{" "}
                {user?.email_confirmed_at
                  ? "Verified"
                  : "Not verified"}
              </span>
            </div>

            {emailError && (
              <p role="alert" className="text-sm text-red-600">
                {emailError}
              </p>
            )}

            {emailMessage && (
              <p role="status" className="text-sm text-green-700">
                {emailMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={savingEmail}
              className="rounded-md bg-[#4219A8] px-6 py-3 text-sm font-bold text-white hover:bg-[#32147D] disabled:opacity-50"
            >
              {savingEmail
                ? "Updating..."
                : "Update email"}
            </button>
          </form>
        </section>

        {/* PASSWORD */}
        <section className="bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#F0EDF5] px-7 py-6">
            <LockKeyhole
              size={20}
              className="text-[#4219A8]"
            />
            <h2 className="text-sm font-bold uppercase">
              Security
            </h2>
          </div>

          <form
            onSubmit={handlePasswordSave}
            className="space-y-5 p-7"
          >
            <div>
              <label
                htmlFor="new-password"
                className={labelClass}
              >
                New password
              </label>

              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                minLength={8}
                required
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className={labelClass}
              >
                Confirm new password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                minLength={8}
                required
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            <p className="text-xs text-[#82779B]">
              Use a strong, unique password.
              Supabase may require recent authentication.
            </p>

            {passwordError && (
              <p role="alert" className="text-sm text-red-600">
                {passwordError}
              </p>
            )}

            {passwordMessage && (
              <p role="status" className="text-sm text-green-700">
                {passwordMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={savingPassword}
              className="rounded-md bg-[#4219A8] px-6 py-3 text-sm font-bold text-white hover:bg-[#32147D] disabled:opacity-50"
            >
              {savingPassword
                ? "Updating..."
                : "Update password"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
