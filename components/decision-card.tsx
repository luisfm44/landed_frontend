"use client";

import { cn } from "@/lib/utils";
import { Opportunity, DecisionType, ImportScenario } from "@/types/opportunity";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ExternalLink,
  Star,
  Truck,
  PackageCheck,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { formatCop, formatUsd } from "@/lib/format";

interface DecisionCardProps {
  opportunity: Opportunity;
}

const SITUATION_CONFIG: Record<
  DecisionType,
  {
    title: string;
    icon: React.ElementType;
    iconClass: string;
    ctaLabel: string;
  }
> = {
  import_direct: {
    title: "Envío directo disponible",
    icon: Truck,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    ctaLabel: "Ver oferta",
  },
  import_locker: {
    title: "Requiere casillero en USA",
    icon: PackageCheck,
    iconClass: "text-blue-600 dark:text-blue-400",
    ctaLabel: "Ver oferta",
  },
  buy_local: {
    title: "Más económico en Colombia",
    icon: ShoppingBag,
    iconClass: "text-gray-500 dark:text-gray-400",
    ctaLabel: "Explorar de todos modos",
  },
  not_recommended: {
    title: "No recomendado importar",
    icon: XCircle,
    iconClass: "text-red-500 dark:text-red-400",
    ctaLabel: "Ver de todos modos",
  },
};

const MARKETPLACE_LABEL: Record<string, string> = {
  reverb: "Reverb",
  ebay: "eBay",
  audiogon: "Audiogon",
  usaudiomart: "US Audio Mart",
};

const CONFIDENCE_LABEL: Record<"low" | "medium" | "high", string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const TRUST_TONE_CLASSES: Record<"success" | "warning" | "muted", string> = {
  success: "text-emerald-700 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  muted: "text-[#94A3B8]",
};

const CONDITION_LABEL: Record<string, string> = {
  new: "Nuevo",
  open_box: "Caja abierta",
  used: "Usado",
  refurbished: "Reacondicionado",
  like_new: "Como nuevo",
  excellent: "Excelente",
  very_good: "Muy bueno",
  good: "Bueno",
  fair: "Regular",
  poor: "Deteriorado",
  for_parts: "Solo piezas",
};

function getRelevantScenario(
  recommended: DecisionType,
  importScenarios: ImportScenario[],
): ImportScenario | undefined {
  const method =
    recommended === "import_direct"
      ? "direct"
      : recommended === "import_locker"
        ? "locker"
        : null;
  if (!method) return undefined;
  return importScenarios.find((s) => s.method === method && s.available);
}

function buildFinalLine(
  recommended: DecisionType,
  savingsVsLocal: number | undefined,
): string | null {
  if (recommended === "import_direct") {
    return savingsVsLocal && savingsVsLocal > 0
      ? "Vale la pena importar directamente."
      : "Importar directo es viable.";
  }
  if (recommended === "import_locker") {
    return savingsVsLocal && savingsVsLocal > 0
      ? "El ahorro cubre el costo del casillero."
      : "Considera el costo del casillero antes de importar.";
  }
  if (recommended === "buy_local") {
    return savingsVsLocal != null && savingsVsLocal < 0
      ? `Importar costaría ${formatCop(Math.abs(savingsVsLocal))} más que comprarlo aquí.`
      : "Mejor comprarlo en Colombia.";
  }
  if (recommended === "not_recommended") {
    return "No se recomienda esta importación.";
  }
  return null;
}

function toSavingsPct(savings: number | undefined, referencePrice: number | undefined): number | null {
  if (savings == null || referencePrice == null || referencePrice <= 0) {
    return null;
  }
  return (savings / referencePrice) * 100;
}

function formatCopCompactMillions(amount: number): string {
  const millions = amount / 1_000_000;
  const decimals = millions >= 10 ? 1 : 2;
  return `$${millions.toFixed(decimals)}M`;
}

function getRecommendationCopy(
  recommended: DecisionType,
  savingsPct: number | null,
  opportunityLabel?: string,
): string {
  if (recommended === "import_direct" || recommended === "import_locker") {
    const label = opportunityLabel ?? "Mejor importar";
    // When opportunityLabel is provided, savings go in secondary text to avoid duplication
    if (opportunityLabel != null) {
      return `🟢 ${label}`;
    }
    return savingsPct != null && savingsPct > 0
      ? `🟢 ${label} — ahorras ${Math.round(savingsPct)}%`
      : `🟢 ${label}`;
  }
  if (recommended === "buy_local") {
    return "🔵 Mejor comprar local";
  }
  return "⚪ Compra indiferente";
}

function getOpportunityBadgeClasses(level: "rare" | "good" | "neutral" | "bad"): string {
  switch (level) {
    case "rare":
      return "bg-red-50 border border-red-200 text-red-700 font-bold dark:bg-red-500/[0.10] dark:border-red-500/20 dark:text-red-400";
    case "good":
      return "bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/[0.10] dark:border-emerald-500/20 dark:text-emerald-400";
    case "neutral":
      return "bg-slate-100 border border-slate-200 text-[#64748B] dark:bg-white/[0.06] dark:border-white/[0.10] dark:text-[#94A3B8]";
    case "bad":
      return "bg-rose-50 border border-rose-200 text-rose-600 dark:bg-rose-500/[0.08] dark:border-rose-500/15 dark:text-rose-400";
  }
}

function getMarketTrustLine(
  confidence: "low" | "medium" | "high",
  sources: number,
  snapshotAgeMs?: number,
): { text: string; tone: "success" | "warning" | "muted" } {
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
  const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

  const ageHours = snapshotAgeMs != null ? Math.round(snapshotAgeMs / (60 * 60 * 1000)) : null;
  const isRecent = snapshotAgeMs == null || snapshotAgeMs < SIX_HOURS_MS;
  const isStale = snapshotAgeMs != null && snapshotAgeMs > TWELVE_HOURS_MS;

  let text: string;
  let tone: "success" | "warning" | "muted";

  if (confidence === "high" && isRecent) {
    text = ageHours != null
      ? `✅ Basado en ${sources} tiendas reales · actualizado hace ${ageHours}h`
      : `✅ Basado en ${sources} tiendas reales`;
    tone = "success";
  } else if (confidence === "medium") {
    text = `🟡 Referencia de mercado (${sources} tiendas)`;
    tone = "warning";
  } else {
    text = "⚠️ Datos limitados";
    tone = "warning";
  }

  if (isStale && confidence !== "low") {
    text += " · puede estar desactualizado";
    tone = "warning";
  }

  return { text, tone };
}

function getSourceBadge(source: string): { label: string; className: string } {
  const normalized = source.toLowerCase();

  if (normalized.includes("mercado libre")) {
    return { label: "ML", className: "bg-[#FFF3C4] text-[#2563EB]" };
  }
  if (normalized.includes("falabella")) {
    return { label: "FA", className: "bg-emerald-100 text-emerald-700" };
  }
  if (normalized.includes("alkosto")) {
    return { label: "AK", className: "bg-rose-100 text-rose-700" };
  }
  if (normalized.includes("ktronix")) {
    return { label: "KT", className: "bg-orange-100 text-orange-700" };
  }

  return {
    label: source
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    className: "bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-[#E2E8F0]",
  };
}

function getBestMarketOffer(
  offers: NonNullable<Opportunity["decision"]["marketSnapshot"]>["offers"] | undefined,
) {
  if (!offers || offers.length === 0) return undefined;
  return offers.reduce((lowest, current) => {
    if (current.priceCop < lowest.priceCop) {
      return current;
    }
    return lowest;
  });
}

export function DecisionCard({ opportunity }: DecisionCardProps) {
  const { title, priceUsd, externalUrl, marketplace, decision, isTopDeal } = opportunity;
  const {
    recommended,
    reason,
    importScenarios,
    bestLocal,
    savingsVsLocal,
    warnings,
    meta,
    marketSnapshot,
    opportunityLevel,
    opportunityLabel,
  } = decision;

  const situation = SITUATION_CONFIG[recommended];
  const SituationIcon = situation.icon;
  const isWorthImporting =
    recommended === "import_direct" || recommended === "import_locker";

  const relevantScenario = getRelevantScenario(recommended, importScenarios);

  const bestMarketOffer = getBestMarketOffer(marketSnapshot?.offers);
  const typicalComparisonPrice = marketSnapshot?.medianPrice ?? bestLocal?.priceCop;

  const computedSavingsVsLocal =
    relevantScenario && typicalComparisonPrice != null
      ? typicalComparisonPrice - relevantScenario.totalCop
      : savingsVsLocal;

  const savingsPct = toSavingsPct(computedSavingsVsLocal, typicalComparisonPrice);
  const finalLine = buildFinalLine(recommended, computedSavingsVsLocal);
  const compactOffers =
    marketSnapshot?.offers
      ?.slice()
      .sort((left, right) => left.priceCop - right.priceCop)
      .slice(0, 3) ?? [];
  const recommendationCopy = getRecommendationCopy(recommended, savingsPct, opportunityLabel);
  const trustLine = marketSnapshot
    ? getMarketTrustLine(marketSnapshot.confidence, marketSnapshot.sources, marketSnapshot.snapshotAgeMs)
    : null;
  const marketPremiumPct =
    relevantScenario && typicalComparisonPrice != null && relevantScenario.totalCop > 0
      ? ((typicalComparisonPrice - relevantScenario.totalCop) / relevantScenario.totalCop) * 100
      : null;

  const marketplaceLabel = marketplace
    ? (MARKETPLACE_LABEL[marketplace.toLowerCase()] ?? marketplace)
    : null;

  const conditionLabel =
    meta?.condition && meta.condition !== "unknown"
      ? (CONDITION_LABEL[meta.condition] ?? meta.condition)
      : null;

  const hasMetaContext = conditionLabel != null || meta?.sellerRating != null;

  return (
    <Card
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl",
        isTopDeal
          ? "border-2 border-[#2563EB]/40 dark:border-[#2563EB]/30"
          : "border border-[#E2E8F0] dark:border-[#26262B]",
        opportunityLevel === "rare" && "ring-1 ring-red-300/40 dark:ring-red-500/20",
        "bg-white dark:bg-[#111113]",
        "shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_1px_#26262B]",
      )}
    >
      {isTopDeal && (
        <div className="absolute top-4 right-4 z-10 bg-[#2563EB] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide">
          Mejor opción
        </div>
      )}

      <CardContent className="flex flex-col flex-1 px-5 pt-5 pb-4 gap-4">

        {/* ── Listing header ── */}
        <div className={cn("flex flex-col gap-0.5", isTopDeal && "pr-[104px]")}>
          {marketplaceLabel && (
            <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {marketplaceLabel}
            </p>
          )}
          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F5F5F7] leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-[#94A3B8]">{formatUsd(priceUsd)} USD en origen</p>
          <div className="mt-1.5 flex flex-col gap-1">
            {opportunityLevel ? (
              <span
                className={cn(
                  "inline-flex items-center self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                  getOpportunityBadgeClasses(opportunityLevel),
                )}
              >
                {recommendationCopy}
              </span>
            ) : (
              <span
                className={cn(
                  "inline-flex items-center text-[11px] font-semibold",
                  isWorthImporting
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-[#0F172A] dark:text-[#F5F5F7]",
                )}
              >
                {recommendationCopy}
              </span>
            )}

          </div>

        </div>

        <div className="h-px bg-[#E2E8F0] dark:bg-[#26262B]" />

        {/* ── Situation ── */}
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center gap-2", situation.iconClass)}>
            <SituationIcon className="h-4 w-4 shrink-0" />
            <span className="text-sm font-bold">{situation.title}</span>
          </div>
        </div>

        {/* ── Context: condition + seller rating ── */}
        {hasMetaContext && (
          <div className="flex flex-col gap-1.5">
            {(conditionLabel != null || meta?.sellerRating != null) && (
              <div className="flex items-center gap-3 flex-wrap pl-0.5">
                {conditionLabel && (
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    {conditionLabel}
                  </span>
                )}
                {meta?.sellerRating != null && (
                  <span className="flex items-center gap-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    <Star className="h-3 w-3 text-amber-400" />
                    {meta.sellerRating}% positivo
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Relevant import cost ── */}
        {relevantScenario && (() => {
          const importIsLower = typicalComparisonPrice == null || relevantScenario.totalCop <= typicalComparisonPrice;
          return (
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 rounded-xl bg-[#F1F5F9] dark:bg-white/[0.05] border border-[#CBD5E1] dark:border-white/[0.12] px-4 py-3">
              <span className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-snug">
                {relevantScenario.method === "direct"
                  ? "Total importado (producto + envío + impuestos)"
                  : "Total importado (producto + casillero + impuestos)"}
              </span>
              <span className={cn(
                "justify-self-end text-right text-sm font-bold tabular-nums whitespace-nowrap",
                importIsLower
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400",
              )}>
                {formatCop(relevantScenario.totalCop)}
              </span>
            </div>
          );
        })()}



        {marketSnapshot && (
          <div className="flex flex-col gap-1.5 rounded-xl border border-[#CBD5E1] dark:border-white/[0.12] bg-[#F1F5F9] dark:bg-white/[0.05] px-4 py-3">
            <p className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
              📊 Mercado en Colombia
            </p>
            {/* Median price — primary emphasis */}
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4">
              <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Precio típico en Colombia</span>
              <span className={cn(
                "justify-self-end text-right text-base font-bold tabular-nums whitespace-nowrap",
                relevantScenario == null
                  ? "text-emerald-700 dark:text-emerald-400"
                  : relevantScenario.totalCop <= marketSnapshot.medianPrice
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-700 dark:text-emerald-400",
              )}>
                {formatCop(marketSnapshot.medianPrice)}
              </span>
            </div>
            {trustLine && (
              <p className={cn("mt-1 text-[11px] font-medium", TRUST_TONE_CLASSES[trustLine.tone])}>
                {trustLine.text}
              </p>
            )}
          </div>
        )}

        {compactOffers.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              3 mejores ofertas locales
            </p>
            {compactOffers.map((offer, index) => (
              <div
                key={`${offer.source}-${index}`}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 rounded-lg px-2 py-1 text-sm",
                  index === 0 && "bg-emerald-50 dark:bg-emerald-500/[0.08]",
                )}
              >
                <div className="min-w-0 flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[10px] font-bold",
                      getSourceBadge(offer.source).className,
                    )}
                  >
                    {getSourceBadge(offer.source).label}
                  </span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] line-clamp-1">
                    {offer.source}
                  </span>
                  {index === 0 && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/[0.12] dark:text-emerald-400">
                      Mejor precio local
                    </span>
                  )}
                </div>
                <span className="justify-self-end text-right tabular-nums text-[#0F172A] dark:text-[#F5F5F7] whitespace-nowrap">
                  {formatCop(offer.priceCop)}
                </span>
              </div>
            ))}
          </div>
        )}

        {(warnings?.length ?? 0) > 0 && (
          <div className="flex flex-col gap-1">
            {warnings?.map((w) => (
              <p
                key={w}
                className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5"
              >
                <span aria-hidden="true">⚠️</span>
                <span>{w}</span>
              </p>
            ))}
          </div>
        )}

        {/* ── Savings ── */}
        {isWorthImporting && computedSavingsVsLocal != null && (
          computedSavingsVsLocal > 0 ? (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.08] border border-emerald-200 dark:border-emerald-500/20">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Ahorras
                </p>
                {savingsPct != null && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-500">
                    {Math.round(savingsPct)}% vs mercado local
                  </p>
                )}
              </div>
              <p className="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                {formatCop(computedSavingsVsLocal)}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-500/[0.08] border border-amber-200 dark:border-amber-500/20">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                ⚠️ Más caro que el mercado
              </p>
              <p className="text-sm font-bold tabular-nums text-amber-700 dark:text-amber-400">
                +{formatCop(Math.abs(computedSavingsVsLocal))}
              </p>
            </div>
          )
        )}

      </CardContent>

      {/* ── CTA ── */}
      <CardFooter className="mt-auto pt-0 pb-5 px-5">
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold",
            "transition-all duration-200 active:scale-[0.97]",
            isWorthImporting
              ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_2px_8px_rgba(37,99,235,0.2)]"
              : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] dark:bg-white/[0.06] dark:text-[#94A3B8] dark:hover:bg-white/[0.10]",
          )}
        >
          <span>{situation.ctaLabel}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </CardFooter>
    </Card>
  );
}
