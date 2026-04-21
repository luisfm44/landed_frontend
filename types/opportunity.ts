export type DecisionType =
  | "buy_local"
  | "import_direct"
  | "import_locker"
  | "not_recommended";

export interface ImportScenario {
  method: "direct" | "locker";
  totalCop: number;
  shippingTimeDays?: number;
  available: boolean;
}

export interface LocalOffer {
  store: string;
  priceCop: number;
  url?: string;
}

export interface LocalMarketOffer {
  source: string;
  priceCop: number;
  url?: string;
}

export interface MarketSnapshot {
  minPrice: number;
  maxPrice: number;
  medianPrice: number;
  sources: number;
  confidence: "low" | "medium" | "high";
  snapshotAgeMs?: number;
  offers?: LocalMarketOffer[];
}

export interface ProductMeta {
  /** Whether the seller explicitly ships to Colombia. undefined = unknown. */
  shipsToColombia?: boolean;
  /** Seller rating 0–100 (e.g. eBay feedback percentage). */
  sellerRating?: number;
  /** Product condition as reported by the marketplace. */
  condition?: string;
}

export interface DecisionResult {
  recommended: DecisionType;
  reason: string;
  importScenarios: ImportScenario[];
  bestLocal?: LocalOffer;
  savingsVsLocal?: number;
  warnings?: string[];
  meta?: ProductMeta;
  marketSnapshot?: MarketSnapshot;
  opportunityLevel?: "rare" | "good" | "neutral" | "bad";
  opportunityLabel?: string;
  dealScore?: number;
}

export interface Opportunity {
  title: string;
  priceUsd: number;
  externalUrl: string;
  marketplace?: string;
  decision: DecisionResult;
  isTopDeal?: boolean;
}
