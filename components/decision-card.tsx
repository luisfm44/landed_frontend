"use client";

import { cn } from "@/lib/utils";
import { Opportunity, DecisionType, ImportScenario } from "@/types/opportunity";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertTriangle,
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
  } = decision;

  const situation = SITUATION_CONFIG[recommended];
  const SituationIcon = situation.icon;
  const isWorthImporting =
    recommended === "import_direct" || recommended === "import_locker";

  const relevantScenario = getRelevantScenario(recommended, importScenarios);
  const finalLine = buildFinalLine(recommended, savingsVsLocal);

  const marketplaceLabel = marketplace
    ? (MARKETPLACE_LABEL[marketplace.toLowerCase()] ?? marketplace)
    : null;

  const conditionLabel =
    meta?.condition && meta.condition !== "unknown"
      ? (CONDITION_LABEL[meta.condition] ?? meta.condition)
      : null;

  const hasContext =
    (warnings?.length ?? 0) > 0 ||
    conditionLabel != null ||
    meta?.sellerRating != null;

  return (
    <Card
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl",
        isTopDeal
          ? "border-2 border-[#2563EB]/40 dark:border-[#2563EB]/30"
          : "border border-[#E2E8F0] dark:border-[#26262B]",
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
          <p className="text-xs text-[#94A3B8]">{formatUsd(priceUsd)} en origen</p>
        </div>

        <div className="h-px bg-[#E2E8F0] dark:bg-[#26262B]" />

        {/* ── Situation ── */}
        <div className="flex flex-col gap-1">
          <div className={cn("flex items-center gap-2", situation.iconClass)}>
            <SituationIcon className="h-4 w-4 shrink-0" />
            <span className="text-sm font-bold">{situation.title}</span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] pl-6 leading-relaxed">
            {reason}
          </p>
        </div>

        {/* ── Context: warnings + condition + seller rating ── */}
        {hasContext && (
          <div className="flex flex-col gap-1.5">
            {warnings?.map((w) => (
              <div key={w} className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">{w}</p>
              </div>
            ))}
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
        {relevantScenario && (
          <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/[0.08] px-4 py-3">
            <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
              {relevantScenario.method === "direct" ? "Envío directo" : "Casillero en USA"}
            </span>
            <span className="text-sm font-bold tabular-nums text-[#0F172A] dark:text-white">
              {formatCop(relevantScenario.totalCop)}
            </span>
          </div>
        )}

        {/* ── Local price comparison ── */}
        {bestLocal && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#94A3B8]">vs. {bestLocal.store}</span>
            <span className="tabular-nums text-[#94A3B8]">
              {formatCop(bestLocal.priceCop)}
            </span>
          </div>
        )}

        {/* ── Savings ── */}
        {isWorthImporting && savingsVsLocal != null && savingsVsLocal > 0 && (
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.08] border border-emerald-200 dark:border-emerald-500/20">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Ahorras
            </p>
            <p className="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
              {formatCop(savingsVsLocal)}
            </p>
          </div>
        )}

        {/* ── Final recommendation ── */}
        {finalLine && (
          <p className="text-xs text-[#94A3B8] italic">{finalLine}</p>
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
