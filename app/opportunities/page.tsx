import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DecisionCard } from "@/components/decision-card";
import { Opportunity, DecisionResult, ImportScenario } from "@/types/opportunity";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

interface BackendOpportunity {
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
}

function mapOpportunity(item: BackendOpportunity): Opportunity {
  const method = (item.shippingMethod as "direct" | "locker") ?? "locker";
  const landedCop = Math.round(item.landedCostUsd * 4100);
  const localCop =
    item.savingPct > 0 && item.savingPct < 1
      ? Math.round(landedCop / (1 - item.savingPct))
      : undefined;

  const importScenario: ImportScenario = {
    method,
    totalCop: landedCop,
    available: true,
  };

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
    importScenarios: [importScenario],
    bestLocal: localCop ? { store: "Colombia", priceCop: localCop } : undefined,
    savingsVsLocal: localCop ? localCop - landedCop : undefined,
    warnings: item.pricingWarning ? [item.pricingWarning] : undefined,
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
            <DecisionCard key={o.externalUrl || o.title} opportunity={o} />
          ))}
        </div>
      )}
    </div>
  );
}
