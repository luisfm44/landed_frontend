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

const USE_MOCK_COMPARE = process.env.NEXT_PUBLIC_USE_MOCK_COMPARE === "true";

function mapToOpportunity(item: CompareResultItem): Opportunity {
  return {
    title: item.title,
    marketplace: item.marketplace,
    priceUsd: item.priceUsd,
    externalUrl: item.productUrl,
    decision: item.decision,
  };
}

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

export async function compareFetcher(q: string): Promise<Opportunity[]> {
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
  return data.results.map(mapToOpportunity);
}
