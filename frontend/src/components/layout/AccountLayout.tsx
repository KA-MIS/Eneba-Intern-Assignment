
import { useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Outlet,
} from "react-router-dom";
import {
  UserRound,
  Wallet,
  ShoppingCart,
  Gamepad2,
  Headphones,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const navigation = [
  {
    label: "Overview",
    path: "/account",
    icon: UserRound,
    end: true,
  },
  {
    label: "Balance",
    path: "/account/balance",
    icon: Wallet,
  },
  {
    label: "Orders",
    path: "/account/orders",
    icon: ShoppingCart,
  },
  {
    label: "Keys library",
    path: "/account/keys",
    icon: Gamepad2,
  },
  {
    label: "Tickets",
    path: "/account/tickets",
    icon: Headphones,
  },
  {
    label: "Settings",
    path: "/account/settings",
    icon: Settings,
  },
];

export function AccountLayout() {
  const { user, loading, signOut } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F4FA]">
        <p className="text-[#32147D]">Loading account...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function handleLogout() {
    setLogoutError("");

    const result = await signOut();

    if (result.error) {
      setLogoutError(result.error);
      return;
    }

    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F5F4FA] text-[#211047]">
      {/* ACCOUNT HEADER */}
      <header className="sticky top-0 z-50 flex h-[68px] items-center justify-between bg-[#4219A8] px-5 text-white md:px-7">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle account navigation"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((open) => !open)}
            className="rounded p-2 hover:bg-white/10 md:hidden"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" aria-label="Back to store">
            <img
              src="/images/Logo.png"
              alt="Store logo"
              className="h-11 w-auto max-w-[160px] object-contain"
            />
          </Link>
        </div>

        <div className="flex min-w-0 items-center gap-4">
          <span className="hidden max-w-[250px] truncate text-sm font-semibold sm:block">
            {user.email}
          </span>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-[#251547] text-sm font-bold text-[#C6F135]">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-68px)]">
        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed bottom-0 left-0 top-[68px] z-40
            w-[225px] overflow-y-auto bg-[#4219A8]
            text-white transition-transform duration-200
            md:sticky md:top-[68px] md:h-[calc(100vh-68px)]
            md:shrink-0 md:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <nav className="py-3" aria-label="Account navigation">
            <p className="px-7 pb-3 pt-2 text-xs font-bold uppercase tracking-wide text-[#D3C4FF]">
              My account
            </p>

            {navigation.map(({ label, path, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-7 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#32147D] text-white"
                      : "text-white/90 hover:bg-[#32147D]"
                  }`
                }
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}

            <div className="mt-6 border-t border-white/20 pt-3">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-7 py-3 text-sm font-semibold hover:bg-[#32147D]"
              >
                <Store size={20} />
                Back to store
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-7 py-3 text-left text-sm font-semibold text-red-200 hover:bg-[#32147D]"
              >
                <LogOut size={20} />
                Log out
              </button>

              {logoutError && (
                <p role="alert" className="px-7 py-2 text-xs text-red-200">
                  {logoutError}
                </p>
              )}
            </div>
          </nav>
        </aside>

        {/* CONTENT CHANGES, LAYOUT STAYS */}
        <div className="min-w-0 flex-1 px-5 py-6 md:px-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
