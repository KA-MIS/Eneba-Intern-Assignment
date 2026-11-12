
import type { Product } from "../types/product";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

interface ApiProduct {
  id: string;
  slug: string;
  title: string;
  platform: Product["platform"];
  region: Product["region"];
  imageUrl: string;
  lowestPrice: number;
  currency: "EUR";
}

interface ProductsResponse {
  data: ApiProduct[];
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/api/products`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const result: ProductsResponse = await response.json();

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid API response");
  }

  return result.data.map((product) => ({
    ...product,
    originalPrice: null,
  }));
}
