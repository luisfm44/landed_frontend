"use client";

import { cn } from "@/lib/utils";
import { Opportunity, DecisionType } from "@/types/opportunity";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { formatCop, formatUsd } from "@/lib/format";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const DECISION_CONFIG: Record<
  DecisionType,
  { label: string; actionLabel: string; className: string }
> = {
  import_direct: {
    label: "Importar directo",
    actionLabel: "Ver oferta",
    className:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  import_locker: {
    label: "Importar con casillero",
    actionLabel: "Ver oferta",
    className:
      "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  buy_local: {
    label: "Comprar en Colombia",
    actionLabel: "Explorar de todos modos",
    className:
      "bg-gray-50 text-gray-700 border-gray-200 dark:bg-white/[0.04] dark:text-gray-400 dark:border-white/10",
  },
  not_recommended: {
    label: "No recomendado",
    actionLabel: "Ver de todos modos",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
};

const METHOD_LABEL: Record<string, string> = {
  direct: "Envío directo",
  locker: "Casillero en USA",
};

const MARKETPLACE_LABELS: Record<string, string> = {
  reverb: "Reverb",
  ebay: "eBay",
  audiogon: "Audiogon",
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { title, priceUsd, externalUrl, marketplace, decision, isTopDeal } =
    opportunity;
  const { recommended, reason, importScenarios, bestLocal, savingsVsLocal, warnings } =
    decision;

  const config = DECISION_CONFIG[recommended];
  const isWorthImporting =
    recommended === "import_direct" || recommended === "import_locker";

  const availableScenarios = importScenarios.filter((s) => s.available);

  const bestImportMethod =
    recommended === "import_direct"
      ? "direct"
      : recommended === "import_locker"
        ? "locker"
        : null;

  const marketplaceLabel = marketplace
    ? (MARKETPLACE_LABELS[marketplace.toLowerCase()] ?? marketplace)
    : undefined;

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
        {/* ── Header ── */}
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

        {/* ── Decision banner — answers "¿Qué hacer?" ── */}
        <div className={cn("rounded-xl border px-4 py-3", config.className)}>
          <p className="text-sm font-semibold">{config.label}</p>
          <p className="text-xs mt-0.5 opacity-80">{reason}</p>
        </div>

        {/* ── Import scenarios ── */}
        {availableScenarios.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Costo de importación
            </p>
            {availableScenarios.map((s) => (
              <div
                key={s.method}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-[#64748B] dark:text-[#94A3B8]">
                  {METHOD_LABEL[s.method] ?? s.method}
                </span>
                <span
                  className={cn(
                    "font-medium tabular-nums",
                    s.method === bestImportMethod
                      ? "text-[#0F172A] dark:text-white"
                      : "text-[#64748B] dark:text-[#94A3B8]",
                  )}
                >
                  {formatCop(s.totalCop)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Local comparison ── */}
        {bestLocal && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Precio local
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                {bestLocal.store}
              </span>
              <span className="font-medium tabular-nums text-[#0F172A] dark:text-[#F5F5F7]">
                {formatCop(bestLocal.priceCop)}
              </span>
            </div>
          </div>
        )}

        {/* ── Savings callout ── */}
        {isWorthImporting && savingsVsLocal != null && savingsVsLocal > 0 && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.08] border border-emerald-200 dark:border-emerald-500/20">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Ahorras {formatCop(savingsVsLocal)} vs Colombia
            </p>
          </div>
        )}

        {/* ── Warnings ── */}
        {warnings?.map((w) => (
          <p
            key={w}
            className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5"
          >
            <AlertTriangle className="h-3 w-3 shrink-0" />
            {w}
          </p>
        ))}
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
          <span>{config.actionLabel}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </CardFooter>
    </Card>
  );
}

