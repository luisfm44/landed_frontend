"use client";

import { cn } from "@/lib/utils";
import { Opportunity } from "@/types/opportunity";
import { formatCop, formatUsd } from "@/lib/format";
import { ExternalLink } from "lucide-react";

interface TopDealsProps {
  opportunities: Opportunity[];
  className?: string;
}

function toSavingsPct(savings: number | undefined, reference: number | undefined): number | null {
  if (savings == null || reference == null || reference <= 0) return null;
  return (savings / reference) * 100;
}

function filterAndRank(opportunities: Opportunity[]): Opportunity[] {
  return opportunities
    .filter((opp) => {
      const level = opp.decision.opportunityLevel;
      const confidence = opp.decision.marketSnapshot?.confidence;
      return (level === "rare" || level === "good") && confidence === "high";
    })
    .sort((a, b) => {
      const scoreA = a.decision.dealScore ?? Infinity;
      const scoreB = b.decision.dealScore ?? Infinity;
      return scoreA - scoreB;
    })
    .slice(0, 10);
}

export function TopDeals({ opportunities, className }: TopDealsProps) {
  const deals = filterAndRank(opportunities);

  if (deals.length === 0) return null;

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#0F172A] dark:text-[#F5F5F7] tracking-tight">
          Mejores oportunidades ahora
        </h2>
        <span className="text-[11px] text-[#94A3B8]">{deals.length} deal{deals.length !== 1 && "s"}</span>
      </div>

      <ul className="flex flex-col gap-2">
        {deals.map((opp) => {
          const { recommended, opportunityLevel, opportunityLabel, marketSnapshot, importScenarios } = opp.decision;
          const isRare = opportunityLevel === "rare";

          const relevantScenario = importScenarios.find(
            (s) =>
              s.available &&
              ((recommended === "import_direct" && s.method === "direct") ||
                (recommended === "import_locker" && s.method === "locker")),
          );

          const medianPrice = marketSnapshot?.medianPrice;
          const computedSavings =
            relevantScenario && medianPrice != null
              ? medianPrice - relevantScenario.totalCop
              : opp.decision.savingsVsLocal;
          const savingsPct = toSavingsPct(computedSavings, medianPrice);

          return (
            <li key={opp.externalUrl}>
              <a
                href={opp.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-start gap-3 rounded-xl px-3.5 py-3 transition-all duration-150",
                  "border bg-white dark:bg-[#111113]",
                  "hover:shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.4)]",
                  isRare
                    ? "border-red-200/70 dark:border-red-500/20 ring-1 ring-red-200/40 dark:ring-red-500/10"
                    : "border-[#E2E8F0] dark:border-[#26262B]",
                )}
              >
                {/* Badge */}
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap",
                    isRare
                      ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
                  )}
                >
                  {isRare ? "🔥 Top oportunidad" : "🟢 Buena compra"}
                </span>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F5F5F7] leading-snug line-clamp-1">
                    {opp.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    {opportunityLabel ?? "Importar"} · {formatUsd(opp.priceUsd)} USD en origen
                  </p>
                </div>

                {/* Prices */}
                <div className="shrink-0 flex flex-col items-end gap-0.5">
                  {medianPrice != null && (
                    <p className="text-[10px] text-[#94A3B8] tabular-nums line-through">
                      {formatCop(medianPrice)}
                    </p>
                  )}
                  {relevantScenario && (
                    <p className="text-xs font-bold tabular-nums text-[#0F172A] dark:text-[#F5F5F7]">
                      {formatCop(relevantScenario.totalCop)}
                    </p>
                  )}
                  {savingsPct != null && savingsPct > 0 && (
                    <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      −{Math.round(savingsPct)}%
                    </p>
                  )}
                </div>

                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#CBD5E1] group-hover:text-[#94A3B8] transition-colors" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
