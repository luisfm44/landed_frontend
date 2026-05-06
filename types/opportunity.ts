export type DecisionType =
  | "buy_local"
  | "import_direct"
  | "import_locker"
  | "either"
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

/** Rich local Colombian offer as returned by the backend decision engine. */
export interface RichLocalOffer {
  source: string;
  store?: string;
  priceCop: number;
  title?: string;
  url?: string;
  trustLevel?: "high" | "medium";
  sellerRating?: number;
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
  /** Full rich best local offer as returned by the backend. */
  bestLocalOffer?: RichLocalOffer;
  /** Full list of local offers as returned by the backend. */
  localOffers?: RichLocalOffer[];
  savingsVsLocal?: number;
  warnings?: string[];
  meta?: ProductMeta;
  marketSnapshot?: MarketSnapshot;
  opportunityLevel?: "rare" | "good" | "neutral" | "bad";
  opportunityLabel?: string;
  dealScore?: number;
  /** Overall market confidence level for the recommendation. */
  marketConfidence?: "low" | "medium" | "high";
  /** Whether the local price snapshot was a cache hit or is stale. */
  snapshotStatus?: "hit" | "stale" | "miss";
  /** Age of the price snapshot in milliseconds. */
  snapshotAgeMs?: number;
  /** Human-readable trust explanation for the recommendation. */
  trustMessage?: string;
  /** Primary local price source identifier (e.g. "Mercado Libre"). */
  localPriceSource?: string;
}

export interface Opportunity {
  title: string;
  priceUsd: number;
  externalUrl: string;
  marketplace?: string;
  decision: DecisionResult;
  isTopDeal?: boolean;
}
