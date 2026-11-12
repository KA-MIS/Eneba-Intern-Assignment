
import type { ProductDetails } from "../types/product";
import { demoProducts } from "./demoProducts";

const descriptions: Record<string, string> = {
  "cyberpunk-2077":
    "Explore Night City in an open-world action RPG. Customize your character, complete missions and discover a futuristic world.",
  "elden-ring":
    "Explore a vast fantasy world filled with challenging battles, powerful enemies and hidden secrets.",
  "red-dead-redemption-2":
    "Experience an epic adventure across the American frontier in a detailed open world.",
  "hogwarts-legacy":
    "Discover a magical open world, learn spells and explore Hogwarts.",
  minecraft:
    "Build, explore and survive in a world of endless possibilities.",
};

export const demoProductDetails: ProductDetails[] =
  demoProducts.map((product) => ({
    ...product,
    description:
      descriptions[product.slug] ?? "Digital game key.",
    publisher: "Demo publisher",
    releaseDate: "2024-01-01",
    offers: [
      {
        id: `${product.id}-offer-1`,
        productId: product.id,
        sellerName: "GameVault",
        positiveRating: 98,
        price: product.lowestPrice,
        currency: "EUR",
        available: true,
      },
      {
        id: `${product.id}-offer-2`,
        productId: product.id,
        sellerName: "KeyMarket",
        positiveRating: 96,
        price: Number((product.lowestPrice + 1.5).toFixed(2)),
        currency: "EUR",
        available: true,
      },
      {
        id: `${product.id}-offer-3`,
        productId: product.id,
        sellerName: "DigitalZone",
        positiveRating: 99,
        price: Number((product.lowestPrice + 4).toFixed(2)),
        currency: "EUR",
        available: true,
      },
    ],
  }));
