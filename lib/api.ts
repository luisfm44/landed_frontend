import { Opportunity } from "@/types/opportunity";

interface CompareResultItem {
  marketplace: string;
  title: string;
  priceUsd: number;
  productUrl: string;
  totalCop: number;
  /** totalCop expressed in USD — use this for landedPrice (already in USD). */
  totalUsd?: number;
  /** Savings as a 0–1 decimal (e.g. 0.25 = 25%). */
  savingsPercentage?: number;
  method: string;
  score: number;
  recommended: boolean;
  insight: string;
}

interface CompareResponse {
  query: string;
  total: number;
  results: CompareResultItem[];
  bestOption: CompareResultItem | null;
}

function mapToOpportunity(item: CompareResultItem): Opportunity {
  // landedPrice must be in USD — totalUsd was added to the backend response
  // specifically for this. Fall back to rough COP→USD if old backend response.
  const USD_TO_COP_APPROX = 4100;
  const landedPrice = item.totalUsd ?? item.totalCop / USD_TO_COP_APPROX;

  return {
    title: item.title,
    marketplace: item.marketplace,
    price: item.priceUsd,
    landedPrice,
    savingsPercentage: item.savingsPercentage ?? 0,
    score: item.score,
    type: "fixed",
    externalUrl: item.productUrl,
    shippingMethod: item.method,
    worthImporting: item.recommended,
    explanation: item.insight ? [item.insight] : undefined,
  };
}

export async function compareFetcher(q: string): Promise<Opportunity[]> {
  const res = await fetch(`/api/compare?q=${encodeURIComponent(q)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status} al buscar`);
  }

  const data: CompareResponse = await res.json();
  return data.results.map(mapToOpportunity);
}
