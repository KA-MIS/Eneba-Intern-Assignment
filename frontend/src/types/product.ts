export type Platform =
  | "PC"
  | "PS5"
  | "Xbox"
  | "Switch"
  | "DIGITAL";

export type Region = "GLOBAL" | "EUROPE" | "US";

export type ProductCategory = "game" | "gift_card";

export interface Product {
  id: string;
  slug: string;
  title: string;
  category?: ProductCategory;
  platform: Platform;
  region: Region;
  imageUrl: string;
  steamAppId: number | null;
  lowestPrice: number;
  originalPrice: number | null;
  currency: "EUR";
  badge?: "HOT" | "NEW";
  productType?: string;
  genres?: string[];
  operatingSystems?: string[];
}

export interface SellerOffer {
  id: string;
  productId: string;
  sellerName: string;
  positiveRating: number | null;
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
