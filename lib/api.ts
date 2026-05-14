import { Opportunity, DecisionResult, MarketSnapshot } from "@/types/opportunity";

// ─── Compare endpoint types ──────────────────────────────────────────────────

interface CompareResultItem {
  marketplace: string;
  title: string;
  priceUsd: number;
  productUrl: string;
  decision: DecisionResult;
  /** Flat market snapshot sent by the backend for the UI comparison section. */
  marketSummary?: BackendMarketSnapshot;
}

// ─── Search result payload types (new structured compare response) ────────────

export interface ImportedOffer {
  type: 'imported';
  marketplace: string;
  title: string;
  priceUsd: number;
  productUrl: string;
  imageUrl?: string;
  totalPriceCop: number;
  breakdown: {
    productCop: number;
    shippingCop: number;
    taxesCop: number;
  };
  method: 'direct' | 'locker';
  savingsCop?: number;
  savingsPct?: number;
}

export interface LocalStoreOffer {
  type: 'local';
  store: string;
  priceCop: number;
  totalPriceCop: number;
  url?: string;
  imageUrl?: string;
}

export type AnyOffer = ImportedOffer | LocalStoreOffer;

export interface WinnerInfo {
  type: 'import' | 'local';
  title: string;
  totalPriceCop: number;
  bestImportedTotalCop: number;
  bestLocalPriceCop: number;
  savingsCop: number;
  savingsPct: number;
}

export interface SearchResultPayload {
  winner: WinnerInfo | null;
  topImported: ImportedOffer[];
  topLocal: LocalStoreOffer[];
  otherOffers: AnyOffer[];
  productImageUrl?: string;
}

interface CompareResponse {
  query: string;
  total: number;
  results: CompareResultItem[];
  bestOption: CompareResultItem | null;
  searchResult: SearchResultPayload;
}

// ─── Top-deals / opportunities endpoint types ────────────────────────────────

interface BackendMarketOffer {
  source?: string;
  store?: string;
  priceCop?: number;
  url?: string;
}

interface BackendMarketSnapshot {
  minPrice?: number;
  maxPrice?: number;
  medianPrice?: number;
  sources?: number;
  confidence?: string;
  snapshotAgeMs?: number;
  offers?: BackendMarketOffer[];
}

/** Shape returned by /opportunities/top-deals and /opportunities */
export interface BackendTopDealItem {
  title: string;
  source: string;
  priceUsd: number;
  landedCostUsd: number;
  savingPct: number;
  recommended?: boolean;
  productUrl?: string;
  shippingMethod?: string;
  pricingWarning?: string;
  insight?: string;
  opportunityLevel?: string;
  opportunityLabel?: string;
  marketConfidence?: string;
  snapshotStatus?: string;
  snapshotAgeMs?: number;
  trustMessage?: string;
  localPriceSource?: string;
  marketSnapshot?: BackendMarketSnapshot;
}

interface BackendListResponse {
  results: BackendTopDealItem[];
  total?: number;
  totalFound?: number;
  returned?: number;
}

// ─── Env ─────────────────────────────────────────────────────────────────────

const USE_MOCK_COMPARE = process.env.NEXT_PUBLIC_USE_MOCK_COMPARE === "true";

// ─── Normalizers ─────────────────────────────────────────────────────────────

function normalizeConfidence(
  confidence: string | undefined,
): MarketSnapshot["confidence"] {
  if (confidence === "high" || confidence === "medium" || confidence === "low") {
    return confidence;
  }
  return "medium";
}

function normalizeOpportunityLevel(
  level: string | undefined,
): DecisionResult["opportunityLevel"] {
  if (
    level === "rare" ||
    level === "good" ||
    level === "neutral" ||
    level === "bad"
  ) {
    return level;
  }
  return undefined;
}

function normalizeSnapshotStatus(
  status: string | undefined,
): DecisionResult["snapshotStatus"] {
  if (status === "hit" || status === "stale" || status === "miss") {
    return status;
  }
  return undefined;
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

function mapBackendMarketSnapshot(
  snapshot: BackendMarketSnapshot | undefined,
): MarketSnapshot | undefined {
  if (!snapshot) return undefined;
  const { minPrice, maxPrice, medianPrice, sources, confidence, snapshotAgeMs, offers } =
    snapshot;
  if (
    minPrice == null ||
    maxPrice == null ||
    medianPrice == null ||
    sources == null
  ) {
    return undefined;
  }
  return {
    minPrice,
    maxPrice,
    medianPrice,
    sources,
    confidence: normalizeConfidence(confidence),
    snapshotAgeMs,
    offers: offers
      ?.filter((o) => o.priceCop != null)
      .map((o) => ({
        source: o.source ?? o.store ?? "Fuente local",
        priceCop: o.priceCop as number,
        url: o.url,
      })),
  };
}

/**
 * Same as mapBackendMarketSnapshot but overrides confidence with an
 * externally-provided value (e.g. `Opportunity.marketConfidence`).
 */
function mapBackendMarketSnapshotWithConfidence(
  snapshot: BackendMarketSnapshot | undefined,
  overrideConfidence: string | undefined,
): MarketSnapshot | undefined {
  const base = mapBackendMarketSnapshot(snapshot);
  if (!base) return undefined;
  if (overrideConfidence) {
    return { ...base, confidence: normalizeConfidence(overrideConfidence) };
  }
  return base;
}

/** Map a flat BackendTopDealItem (from /opportunities endpoints) to Opportunity. */
export function mapBackendTopDealItem(item: BackendTopDealItem): Opportunity {
  const method = (item.shippingMethod as "direct" | "locker") ?? "locker";
  const USD_TO_COP = 4100;
  const landedCop = Math.round(item.landedCostUsd * USD_TO_COP);
  const localCop =
    item.savingPct > 0 && item.savingPct < 1
      ? Math.round(landedCop / (1 - item.savingPct))
      : undefined;

  const isWorthImporting = item.recommended ?? item.savingPct > 0.1;
  const decisionType =
    isWorthImporting
      ? method === "direct"
        ? "import_direct"
        : "import_locker"
      : "buy_local";

  const reason =
    item.insight ??
    (isWorthImporting
      ? localCop
        ? `Ahorro de ${(localCop - landedCop).toLocaleString("es-CO")} COP`
        : "Buena oportunidad de importación"
      : "Más barato comprar en Colombia");

  const decision: DecisionResult = {
    recommended: decisionType,
    reason,
    importScenarios: [{ method, totalCop: landedCop, available: true }],
    bestLocal: localCop
      ? { store: item.localPriceSource ?? "Colombia", priceCop: localCop }
      : undefined,
    savingsVsLocal: localCop ? localCop - landedCop : undefined,
    warnings: item.pricingWarning ? [item.pricingWarning] : undefined,
    marketSnapshot: mapBackendMarketSnapshotWithConfidence(
      item.marketSnapshot,
      item.marketConfidence,
    ),
    opportunityLevel: normalizeOpportunityLevel(item.opportunityLevel),
    opportunityLabel: item.opportunityLabel,
    marketConfidence: normalizeConfidence(item.marketConfidence),
    snapshotStatus: normalizeSnapshotStatus(item.snapshotStatus),
    snapshotAgeMs: item.snapshotAgeMs,
    trustMessage: item.trustMessage,
    localPriceSource: item.localPriceSource,
  };

  return {
    title: item.title,
    priceUsd: item.priceUsd,
    externalUrl: item.productUrl ?? "",
    marketplace: item.source,
    decision,
    isTopDeal: item.recommended ?? false,
  };
}

/** Map a CompareResultItem (from /compare) to Opportunity. */
function mapCompareItem(item: CompareResultItem, isTopDeal = false): Opportunity {
  // Build marketSnapshot from marketSummary; propagate decision.marketConfidence so the
  // market panel and the trust badge always show the same confidence level.
  const marketSnapshot = mapBackendMarketSnapshotWithConfidence(
    item.marketSummary,
    item.decision.marketConfidence,
  );

  const decision: DecisionResult = {
    ...item.decision,
    // Override marketSnapshot with the flat summary when available
    marketSnapshot: marketSnapshot ?? item.decision.marketSnapshot,
  };

  return {
    title: item.title,
    marketplace: item.marketplace,
    priceUsd: item.priceUsd,
    externalUrl: item.productUrl,
    decision,
    isTopDeal,
  };
}

// ─── Mock fetchers ────────────────────────────────────────────────────────────

async function mockCompareFetcher(q: string): Promise<Opportunity[]> {
  const { MOCK_OPPORTUNITIES } = await import("@/lib/mock-opportunities");
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return MOCK_OPPORTUNITIES.filter(
    (o) =>
      o.title.toLowerCase().includes(term) ||
      (o.marketplace ?? "").toLowerCase().includes(term),
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Search products by query — used by the main search bar.
 * Calls the /api/compare proxy which forwards to the backend /compare endpoint.
 */
export async function searchProducts(q: string): Promise<Opportunity[]> {
  if (USE_MOCK_COMPARE) {
    return mockCompareFetcher(q);
  }

  const res = await fetch(`/api/compare?q=${encodeURIComponent(q)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status} al buscar`);
  }

  const data: CompareResponse = await res.json();
  const bestUrl = data.bestOption?.productUrl;
  return data.results.map((item) =>
    mapCompareItem(item, item.productUrl === bestUrl),
  );
}

/** Full compare result — returns mapped opportunities AND the structured searchResult payload. */
export async function searchProductsFull(
  q: string,
): Promise<{ opportunities: Opportunity[]; searchResult: SearchResultPayload }> {
  if (USE_MOCK_COMPARE) {
    const opportunities = await mockCompareFetcher(q);
    return {
      opportunities,
      searchResult: { winner: null, topImported: [], topLocal: [], otherOffers: [] },
    };
  }

  const res = await fetch(`/api/compare?q=${encodeURIComponent(q)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status} al buscar`);
  }

  const data: CompareResponse = await res.json();
  const bestUrl = data.bestOption?.productUrl;
  const opportunities = data.results.map((item) =>
    mapCompareItem(item, item.productUrl === bestUrl),
  );
  const searchResult: SearchResultPayload = data.searchResult ?? {
    winner: null,
    topImported: [],
    topLocal: [],
    otherOffers: [],
  };
  return { opportunities, searchResult };
}

/** Backward-compatible alias — keeps existing useSearch wiring intact. */
export const compareFetcher = searchProducts;

/**
 * Fetch top deals for the home page feed.
 * Calls the /api/top-deals proxy which forwards to /opportunities/top-deals.
 */
export async function getTopDeals(): Promise<Opportunity[]> {
  if (USE_MOCK_COMPARE) {
    const { MOCK_OPPORTUNITIES } = await import("@/lib/mock-opportunities");
    return MOCK_OPPORTUNITIES;
  }

  const res = await fetch("/api/top-deals", { cache: "no-store" });
  if (!res.ok) return [];

  const data: BackendListResponse = await res.json();
  return (data.results ?? []).map(mapBackendTopDealItem);
}

/**
 * Fetch all opportunities.
 * Calls the /api/opportunities proxy which forwards to /opportunities/top-deals.
 */
export async function getOpportunities(): Promise<Opportunity[]> {
  if (USE_MOCK_COMPARE) {
    const { MOCK_OPPORTUNITIES } = await import("@/lib/mock-opportunities");
    return MOCK_OPPORTUNITIES;
  }

  const res = await fetch("/api/opportunities", { cache: "no-store" });
  if (!res.ok) return [];

  const data: BackendListResponse = await res.json();
  return (data.results ?? []).map(mapBackendTopDealItem);
}
