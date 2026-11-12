
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

import {
  HeroBanner,
  type HeroBannerData,
} from "./components/home/HeroBanner";

import { CategorySlider } from "./components/home/CategorySlider";
import { RecommendedProducts } from "./components/home/RecommendedProducts";
import { TopGames } from "./components/home/TopGames";
import { BestSellingGiftCards } from "./components/home/BestSellingGiftCards";
import { BestSellingGiftCardProducts } from "./components/home/BestSellingGiftCardProducts";
import { UpcomingGames } from "./components/home/UpcomingGames";
import { GameCategories } from "./components/home/GameCategories";

import { PlaceholderPage } from "./pages/PlaceholderPage";
import { StorePage } from "./pages/StorePage";
import { ProductPage } from "./pages/ProductPage";
import { CartPage } from "./pages/CartPage";
import { CheapGamesPage } from "./pages/CheapGamesPage";

import { giftCardProducts } from "./data/giftCardProducts";
import { upcomingGames } from "./data/upcomingGames";

import { RecentlyViewed } from "./components/home/RecentlyViewed";

// ======================================
// HERO BANNER DATA
// ======================================

const previewBanner: HeroBannerData = {
  badge: "Up to 90% off",
  title: "Play more.",
  highlightedTitle: "Pay less.",
  description:
    "Instant game key delivery. Verified sellers. Great prices on digital games.",
};

// ======================================
// HOMEPAGE
// ======================================

function HomePage() {
  return (
    <main className="w-full">
      <HeroBanner data={previewBanner} />

      <CategorySlider />

      <RecommendedProducts />

      <TopGames />

      <BestSellingGiftCards />

      <BestSellingGiftCardProducts
        products={giftCardProducts}
      />

      <UpcomingGames products={upcomingGames} />

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
  return (
    <div className="flex min-h-screen flex-col bg-base">

      {/* NAVIGATION */}
      <Navbar />

      {/* PAGE CONTENT */}
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

          {/* SEARCH */}
          <Route
            path="/search"
            element={
              <Page
                title="Search Results"
                description="Find your next game."
              />
            }
          />

          {/* PRODUCT DETAILS */}
          <Route
            path="/product/:slug"
            element={<ProductPage />}
          />

          {/* CHEAP GAMES PROMOTION */}
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
                description="Discover new games."
              />
            }
          />

          {/* GIFT CARDS */}
          <Route
            path="/gift-cards"
            element={
              <Page
                title="Gift Cards"
                description="Browse digital gift cards."
              />
            }
          />

          {/* SOFTWARE */}
          <Route
            path="/software"
            element={
              <Page
                title="Software"
                description="Explore software offers."
              />
            }
          />

          {/* CHECKOUT */}
          <Route
            path="/checkout"
            element={
              <Page
                title="Checkout"
                description="Sign in to complete your purchase."
              />
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <Page
                title="Sign In"
                description="Access your account."
              />
            }
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={
              <Page
                title="Create Account"
                description="Register a new account."
              />
            }
          />

          {/* ORDER HISTORY */}
          <Route
            path="/account/orders"
            element={
              <Page
                title="Order History"
                description="View your previous purchases."
              />
            }
          />

          {/* 404 PAGE */}
          <Route
            path="/404"
            element={
              <Page
                title="404 – Page Not Found"
                description="This page does not exist."
              />
            }
          />

          {/* UNKNOWN ROUTES */}
          <Route
            path="*"
            element={<Navigate to="/404" replace />}
          />

        </Routes>
      </div>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
