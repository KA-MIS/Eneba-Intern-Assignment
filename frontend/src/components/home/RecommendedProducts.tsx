
import { Link } from "react-router-dom";
import { ProductGrid } from "../products/ProductGrid";
import { demoProducts } from "../../data/demoProducts";

export function RecommendedProducts() {
  const recommendedProducts = demoProducts.slice(0, 5);

  return (
    <section
      aria-labelledby="recommended-heading"
      className="w-full bg-[#4519AC] py-8"
    >
      <div className="mx-auto max-w-7xl px-4">

        {/* HEADER */}
        <div className="mb-6 flex items-center gap-2">
          <h2
            id="recommended-heading"
            className="font-display text-2xl font-bold text-white md:text-3xl"
          >
            Recommended for you
          </h2>

          <span
            className="text-white/60"
            title="Recommended games"
          >
            ⓘ
          </span>
        </div>

        {/* GAME CARDS */}
        <ProductGrid products={recommendedProducts} />

        {/* SHOW ALL BUTTON */}
        <div className="mt-7 flex justify-center">
          <Link
            to="/store"
            className="
              flex min-w-[200px]
              items-center justify-center
              border border-white
              px-8 py-2.5
              text-sm font-bold text-white
              transition-colors
              hover:bg-white
              hover:text-[#211342]
            "
          >
            See all
          </Link>
        </div>

      </div>
    </section>
  );
}
