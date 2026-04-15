export type ListingType = "auction" | "fixed";
export type Recommendation = "import" | "local";

export interface Opportunity {
  title: string;
  price: number;
  landedPrice: number;
  savingsPercentage: number;
  score: number;
  type: ListingType;
  externalUrl: string;
  /** optional enrichment fields matching the backend model */
  marketplace?: string;
  imageUrl?: string;
  currency?: string;
  shippingMethod?: string;
  explanation?: string[];
  pricingWarning?: string;
  condition?: string;
  location?: string;
  recommendation?: Recommendation;
  /** UI decision fields */
  listingsCount?: number;
  worthImporting?: boolean;
  isTopDeal?: boolean;
  /** auction-specific fields */
  auctionEndsAt?: string;
  currentBid?: number;
  estimatedFinalPrice?: number;
}
