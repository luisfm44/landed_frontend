import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { OpportunityCard } from "@/components/opportunity-card";
import { Opportunity } from "@/types/opportunity";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

interface BackendOpportunity {
  productId: string;
  title: string;
  source: string;
  priceUsd: number;
  landedCostUsd: number;
  savingPct: number;
  buyScore: number;
  score?: number;
  recommended?: boolean;
  listingCount?: number;
  productUrl?: string;
  shippingMethod?: string;
  pricingWarning?: string;
  explanation?: string[];
  estimatedAuctionUsd?: number;
  insight?: string;
}

function mapOpportunity(item: BackendOpportunity): Opportunity {
  return {
    title: item.title,
    price: item.priceUsd,
    landedPrice: item.landedCostUsd,
    savingsPercentage: item.savingPct,
    score: item.score ?? item.buyScore,
    type: item.estimatedAuctionUsd != null ? "auction" : "fixed",
    externalUrl: item.productUrl ?? "",
    marketplace: item.source,
    shippingMethod: item.shippingMethod,
    pricingWarning: item.pricingWarning ?? undefined,
    explanation:
      item.explanation?.length
        ? item.explanation
        : item.insight
        ? [item.insight]
        : undefined,
    listingsCount: item.listingCount,
    worthImporting: item.recommended ?? item.savingPct > 0.1,
    isTopDeal: item.recommended ?? false,
    estimatedFinalPrice: item.estimatedAuctionUsd,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("opportunitiesTitle"),
    description: t("opportunitiesDescription"),
  };
}

export default async function OpportunitiesPage() {
  const t = await getTranslations("opportunities");

  let opportunities: Opportunity[] = [];
  let fetchError: string | null = null;

  try {
    const res = await fetch(
      `${API_URL}/opportunities/top-deals?limit=50&minScore=0`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      opportunities = ((data.results ?? []) as BackendOpportunity[]).map(
        mapOpportunity
      );
    } else {
      fetchError = `Error ${res.status}`;
    }
  } catch {
    fetchError = "Backend no disponible";
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">
        {t("title")}
      </h1>
      <p className="text-muted-foreground text-sm mb-8">{t("description")}</p>

      {fetchError ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
          {fetchError}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
          No hay oportunidades disponibles en este momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((o) => (
            <OpportunityCard key={o.externalUrl || o.title} opportunity={o} />
          ))}
        </div>
      )}
    </div>
  );
}
