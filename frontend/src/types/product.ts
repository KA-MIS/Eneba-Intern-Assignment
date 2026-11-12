
export type Platform = "PC" | "PS5" | "Xbox" | "Switch";

export type Region = "GLOBAL" | "EUROPE" | "US";

export interface Product {
  id: string;
  slug: string;
  title: string;
  platform: Platform;
  region: Region;
  imageUrl: string;
  lowestPrice: number;
  originalPrice: number | null;
  currency: "EUR";
  badge?: "HOT" | "NEW";
}

export interface SellerOffer {
  id: string;
  productId: string;
  sellerName: string;
  positiveRating: number;
  price: number;
  currency: "EUR";
  available: boolean;
}

export interface ProductDetails extends Product {
  description: string;
  publisher: string;
  releaseDate: string;
  offers: SellerOffer[];
}
