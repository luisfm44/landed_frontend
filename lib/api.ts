import { Opportunity, DecisionResult } from "@/types/opportunity";

interface CompareResultItem {
  marketplace: string;
  title: string;
  priceUsd: number;
  productUrl: string;
  decision: DecisionResult;
}

interface CompareResponse {
  query: string;
  total: number;
  results: CompareResultItem[];
  bestOption: CompareResultItem | null;
}

function mapToOpportunity(item: CompareResultItem): Opportunity {
  return {
    title: item.title,
    marketplace: item.marketplace,
    priceUsd: item.priceUsd,
    externalUrl: item.productUrl,
    decision: item.decision,
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
