import { RecentActivityPopup } from "./components/ui/RecentActivityPopup";

import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { CheckoutHeader } from "./components/layout/CheckoutHeader";
import { AccountLayout } from "./components/layout/AccountLayout";

import { HeroBanner } from "./components/home/HeroBanner";

import { CategorySlider } from "./components/home/CategorySlider";
import { RecommendedProducts } from "./components/home/RecommendedProducts";
import { TopGames } from "./components/home/TopGames";
import { GiftCards } from "./components/home/GiftCards";
import { GameCategories } from "./components/home/GameCategories";
import { RecentlyViewed } from "./components/home/RecentlyViewed";

// ======================================
// STORE PAGES
// ======================================

import { PlaceholderPage } from "./pages/PlaceholderPage";
import { StorePage } from "./pages/StorePage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { CheapGamesPage } from "./pages/CheapGamesPage";
import { SearchPage } from "./pages/SearchPage";
import { GiftCardsPage } from "./pages/GiftCardsPage";
import { CheckoutPage } from "./pages/CheckoutPage";

// ======================================
// AUTHENTICATION
// ======================================

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";

// ======================================
// ACCOUNT PAGES
// ======================================

import { AccountPage } from "./pages/AccountPage";
import { AccountSettingsPage } from "./pages/AccountSettingsPage";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderDetailsPage } from "./pages/OrderDetailsPage";
import { KeysLibraryPage } from "./pages/KeysLibraryPage";
import { WalletPage } from "./pages/WalletPage";

// ======================================
// HERO BANNER
// ======================================



// ======================================
// HOMEPAGE
// ======================================

function HomePage() {
  return (
    <main className="w-full">
      <HeroBanner />
      <CategorySlider />
      <RecommendedProducts />
      <TopGames />
      <GiftCards />
      <GameCategories />
      <RecentlyViewed />
    </main>
  );
}

// ======================================
// PLACEHOLDER PAGE
// ======================================

function Page({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <PlaceholderPage
      title={title}
      description={description}
    />
  );
}

// ======================================
// MAIN APPLICATION
// ======================================

export default function App() {
  const location = useLocation();

  const isCheckoutFlow =
    location.pathname === "/cart" ||
    location.pathname === "/checkout";

  const isAccountFlow =
    location.pathname === "/account" ||
    location.pathname.startsWith("/account/");

  return (
    <div className="flex min-h-screen flex-col bg-base">
      {/* ======================================
          NAVIGATION
      ====================================== */}

      {isCheckoutFlow ? (
        <CheckoutHeader />
      ) : isAccountFlow ? null : (
        <Navbar />
      )}

      {/* ======================================
          PAGE CONTENT
      ====================================== */}

      <div className="flex-1">
        <Routes>
          {/* HOMEPAGE */}
          <Route
            path="/"
            element={<HomePage />}
          />

          {/* STORE */}
          <Route
            path="/store"
            element={<StorePage />}
          />

          {/* CART */}
          <Route
            path="/cart"
            element={<CartPage />}
          />

          {/* CHECKOUT */}
          <Route
            path="/checkout"
            element={<CheckoutPage />}
          />

          {/* SEARCH */}
          <Route
            path="/search"
            element={<SearchPage />}
          />

          {/* PRODUCT DETAILS */}
          <Route
            path="/product/:slug"
            element={<ProductPage />}
          />

          {/* DEALS */}
          <Route
            path="/deals"
            element={<CheapGamesPage />}
          />

          {/* NEW RELEASES */}
          <Route
            path="/new"
            element={
              <Page
                title="New Releases"
                description="New game listings will appear here when available."
              />
            }
          />

          {/* GIFT CARDS */}
          <Route
            path="/gift-cards"
            element={<GiftCardsPage />}
          />

          {/* SOFTWARE */}
          <Route
            path="/software"
            element={
              <Page
                title="Software"
                description="Software offers are not available yet."
              />
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          {/* REGISTER */}
          <Route
            path="/register"
            element={<RegisterPage />}
          />

          {/* ======================================
              ACCOUNT
          ====================================== */}

          <Route
            path="/account"
            element={<AccountLayout />}
          >
            {/* OVERVIEW */}
            <Route
              index
              element={<AccountPage />}
            />

            {/* DEMO WALLET */}
            <Route
              path="balance"
              element={<WalletPage />}
            />

            {/* ORDERS */}
            <Route
              path="orders"
              element={<OrdersPage />}
            />

            {/* ORDER DETAILS */}
            <Route
              path="orders/:orderId"
              element={<OrderDetailsPage />}
            />

            {/* KEYS LIBRARY */}
            <Route
              path="keys"
              element={<KeysLibraryPage />}
            />

            {/* ACCOUNT SETTINGS */}
            <Route
              path="settings"
              element={<AccountSettingsPage />}
            />

            {/* SUPPORT TICKETS - PLACEHOLDER */}
            <Route
              path="tickets"
              element={
                <Page
                  title="Support Tickets"
                  description="Support ticket functionality is coming soon."
                />
              }
            />

            {/* LOGIN HISTORY - PLACEHOLDER */}
            <Route
              path="login-history"
              element={
                <Page
                  title="Login History"
                  description="Login history will be available when account activity logging is implemented."
                />
              }
            />
          </Route>

          {/* ======================================
              ERROR PAGES
          ====================================== */}

          <Route
            path="/404"
            element={
              <Page
                title="404 - Page Not Found"
                description="This page does not exist."
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/404"
                replace
              />
            }
          />
        </Routes>
      </div>

      {!isCheckoutFlow && !isAccountFlow && <RecentActivityPopup />}

      {/* ======================================
          FOOTER
      ====================================== */}

      {!isCheckoutFlow && !isAccountFlow && (
        <Footer />
      )}
    </div>
  );
}
