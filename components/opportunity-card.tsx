"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Opportunity } from "@/types/opportunity";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, Timer, TriangleAlert } from "lucide-react";
import { formatUsd, formatCop, usdToCop } from "@/lib/format";
import { AuctionTimer } from "@/components/auction-timer";
import { ScoreBar } from "@/components/ui/score-bar";
import { generateInsight } from "@/lib/score";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const MARKETPLACE_LABELS: Record<string, string> = {
  reverb: "Reverb",
  ebay: "eBay",
  audiogon: "Audiogon",
};

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const t = useTranslations("card");

  const {
    title,
    price,
    landedPrice,
    savingsPercentage,
    score,
    type,
    externalUrl,
    pricingWarning,
    listingsCount,
    auctionEndsAt,
    currentBid,
    estimatedFinalPrice,
    explanation,
    marketplace,
    condition,
    location,
  } = opportunity;

  const worthImporting = opportunity.worthImporting ?? score >= 65;
  const isTopDeal = opportunity.isTopDeal ?? false;
  const isAuction = type === "auction";

  const savingsPct = Math.round(savingsPercentage * 100);
  const localEstimateUsd =
    savingsPercentage > 0 && savingsPercentage < 1
      ? landedPrice / (1 - savingsPercentage)
      : landedPrice;
  const savingsUsd = Math.round(localEstimateUsd - landedPrice);

  // COP equivalents — display only, not for financial precision
  const copLanded = usdToCop(landedPrice);
  const copLocal = usdToCop(localEstimateUsd);
  const copSavings = usdToCop(savingsUsd);
  const copCurrentBid = currentBid !== undefined ? usdToCop(currentBid) : undefined;
  const copEstFinal = estimatedFinalPrice !== undefined ? usdToCop(estimatedFinalPrice) : undefined;

  const marketplaceLabel = marketplace
    ? (MARKETPLACE_LABELS[marketplace.toLowerCase()] ?? marketplace)
    : undefined;

  const primaryExplanation =
    explanation?.[0] ??
    (worthImporting || isAuction
      ? t("cheaperThanLocal", { amount: formatCop(copSavings) })
      : t("noLocalAdvantage"));

  const ctaLabel = isAuction
    ? marketplaceLabel
      ? t("joinAuctionOn", { marketplace: marketplaceLabel })
      : t("joinAuction")
    : worthImporting
    ? marketplaceLabel
      ? t("buyOn", { marketplace: marketplaceLabel })
      : t("viewOffer")
    : t("viewOffer");

  const smartBadge = generateInsight(opportunity, copSavings, marketplaceLabel);

  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        isTopDeal
          ? "border-2 border-[#2563EB]/40 dark:border-[#2563EB]/30"
          : "border border-[#E2E8F0] dark:border-[#26262B]",
        "bg-white dark:bg-[#111113]",
        isTopDeal
          ? "shadow-[0_4px_24px_rgba(37,99,235,0.15)] dark:shadow-[0_4px_24px_rgba(37,99,235,0.08)]"
          : "shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_0_0_1px_#26262B]",
        "transition-all duration-300 ease-out cursor-pointer will-change-transform",
        "hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.995] active:duration-100",
        worthImporting && !isAuction
          ? "hover:shadow-[0_10px_40px_rgba(37,99,235,0.15)]"
          : "hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        "dark:hover:shadow-[0_0_0_1px_#3F3F46,0_12px_40px_rgba(0,0,0,0.6)]",
      )}
    >
      {/* ── "Mejor opción" badge ─────────────────────────────────── */}
      {isTopDeal && (
        <div className="absolute top-4 right-4 z-10 bg-[#2563EB] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm tracking-wide">
          Mejor opción
        </div>
      )}

      <CardContent className="flex flex-col flex-1 px-5 pt-5 pb-4">

        {/* ── 1. HEADER: title + meta ───────────────────────────────── */}
        <div className={cn("flex flex-col gap-1", isTopDeal && "pr-[104px]")}>
          {(marketplaceLabel || condition || location) && (
            <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider leading-none">
              {[marketplaceLabel, condition, location].filter(Boolean).join(" · ")}
            </p>
          )}
          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F5F5F7] leading-snug line-clamp-2">
            {title}
          </h3>
          {listingsCount !== undefined && listingsCount > 1 && (
            <p className="text-[10px] text-[#94A3B8]">
              {t("offersLabel", { count: listingsCount })}
            </p>
          )}
        </div>

        <div className="mt-4 h-px bg-[#E2E8F0] dark:bg-[#26262B]" />

        {/* ── 2. SCORE + BADGE ──────────────────────────────────────── */}
        <div className="mt-4 flex flex-col gap-3">
          <ScoreBar score={score} />

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className={cn(
              "inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-1 ring-1 transition-shadow",
              smartBadge.className,
              smartBadge.glow
            )}>
              {smartBadge.label}
            </span>

            {isAuction && auctionEndsAt && (
              <span className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                <Timer className="h-3 w-3 shrink-0" />
                <AuctionTimer
                  endsAt={auctionEndsAt}
                  timeLeftLabel={t("timeLeft")}
                  endedLabel={t("auctionEnded")}
                />
              </span>
            )}
          </div>

          {smartBadge.insight && (
            <p className="text-[10px] text-[#94A3B8] leading-snug pl-0.5 -mt-1">
              {smartBadge.insight}
            </p>
          )}
        </div>

        <div className="mt-4 h-px bg-[#E2E8F0] dark:bg-[#26262B]" />

        {/* ── 3. PRICE BREAKDOWN ────────────────────────────────────── */}
        {isAuction ? (
          <div className="mt-4 flex flex-col gap-1">
            <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Puja actual</p>
            <p className="text-3xl font-semibold text-[#0F172A] dark:text-white tabular-nums tracking-[-0.01em]">
              {copCurrentBid !== undefined ? formatCop(copCurrentBid) : formatCop(copLanded)}
            </p>
            <p className="text-xs text-[#94A3B8]">
              ~{currentBid !== undefined ? formatUsd(currentBid) : formatUsd(landedPrice)} USD
            </p>
            {estimatedFinalPrice !== undefined && (
              <p className="mt-1 text-xs text-[#94A3B8]">
                Final est.{" "}
                <span className="font-medium text-[#64748B] dark:text-[#A1A1AA]">
                  ~{formatUsd(estimatedFinalPrice)} USD
                </span>
              </p>
            )}
            {savingsPct > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="font-medium text-violet-600 dark:text-violet-400">
                  Ahorras {formatCop(copSavings)}
                </span>
                <span className="text-[#94A3B8]">({savingsPct}%)</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Precio origen</span>
              <span className="tabular-nums font-medium text-[#0F172A] dark:text-[#F5F5F7]">
                {formatUsd(price)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Envío + impuestos</span>
              <span className="tabular-nums font-medium text-[#0F172A] dark:text-[#F5F5F7]">
                +{formatUsd(Math.round(landedPrice - price))}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm pt-1.5 border-t border-[#E2E8F0] dark:border-[#26262B]">
              <span className="font-semibold text-[#0F172A] dark:text-white">Total en Colombia</span>
              <span className="tabular-nums font-semibold text-[#0F172A] dark:text-white">
                {formatCop(copLanded)}
              </span>
            </div>
            {worthImporting && savingsPct > 0 && (
              <div className="mt-1 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.08] border border-emerald-200 dark:border-emerald-500/20">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Ahorras {formatCop(copSavings)} ({savingsPct}%) vs Colombia
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── PRICING WARNING ───────────────────────────────────────── */}
        {pricingWarning && (
          <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <TriangleAlert className="h-3 w-3 shrink-0" />
            {pricingWarning}
          </p>
        )}
      </CardContent>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <CardFooter className="mt-auto pt-0 pb-5 px-5">
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group/cta inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold",
            "transition-all duration-200 active:scale-[0.97] group-hover:scale-[1.02]",
            isAuction || worthImporting
              ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_2px_8px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
              : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] dark:bg-white/[0.06] dark:text-[#94A3B8] dark:hover:bg-white/[0.10]"
          )}
        >
          <span>{ctaLabel}</span>
          <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
        </a>
      </CardFooter>
    </Card>
  );
}


