import type {
  Product,
  ProductDetails,
  ProductCategory,
} from "../types/product";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

interface ApiProduct {
  id: string;
  slug: string;
  title: string;
  category: ProductCategory;
  platform: Product["platform"];
  region: Product["region"];
  imageUrl: string | null;
  steamAppId: number | null;
  lowestPrice: number | string;
  currency: "EUR";
  productType?: string;
  genres?: string[];
  operatingSystems?: string[];
}

interface ProductsResponse {
  data: ApiProduct[];
}

interface ProductDetailsResponse {
  data: ProductDetails;
}

export interface ProductFilters {
  category?: ProductCategory;
  search?: string;
  platform?: string;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  genre?: string;
  os?: string;
  productType?: string;
  sort?:
    | "title_asc"
    | "title_desc"
    | "price_asc"
    | "price_desc"
    | "random";
  limit?: number;
  page?: number;
}

export async function getProducts(
  filters: ProductFilters = {},
  signal?: AbortSignal
): Promise<Product[]> {
  const params = new URLSearchParams();

  params.set("category", filters.category ?? "game");

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.platform) {
    params.set("platform", filters.platform);
  }

  if (filters.region) {
    params.set("region", filters.region);
  }

  if (filters.genre) params.set("genre", filters.genre);
  if (filters.os) params.set("os", filters.os);
  if (filters.productType) params.set("productType", filters.productType);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));

  if (filters.maxPrice !== undefined) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  if (filters.limit !== undefined) {
    params.set("limit", String(filters.limit));
  }

  if (filters.page !== undefined) {
    params.set("page", String(filters.page));
  }

  const query = params.toString();

  const response = await fetch(
    `${API_URL}/api/products?${query}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const result: ProductsResponse = await response.json();

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid API response");
  }

  return result.data.map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: product.category,
    platform: product.platform,
    region: product.region,
    imageUrl: product.imageUrl ?? "",
    steamAppId:
      product.steamAppId == null
        ? null
        : Number(product.steamAppId),
    lowestPrice: Number(product.lowestPrice),
    originalPrice: null,
    currency: product.currency,
    productType: product.productType ?? "Game",
    genres: product.genres ?? [],
    operatingSystems: product.operatingSystems ?? [],
  }));
}

export async function getProductDetails(
  slug: string,
  signal?: AbortSignal
): Promise<ProductDetails | null> {
  const response = await fetch(
    `${API_URL}/api/products/${encodeURIComponent(slug)}`,
    { signal }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const result: ProductDetailsResponse =
    await response.json();

  if (
    !result.data ||
    !Array.isArray(result.data.offers)
  ) {
    throw new Error("Invalid product details response");
  }

  return {
    ...result.data,
    steamAppId:
      result.data.steamAppId == null
        ? null
        : Number(result.data.steamAppId),
  };
}
