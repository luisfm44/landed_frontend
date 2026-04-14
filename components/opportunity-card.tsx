"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Opportunity } from "@/types/opportunity";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, Gavel, Timer, TriangleAlert, TrendingDown } from "lucide-react";
import { formatUsd, formatCop, usdToCop } from "@/lib/format";
import { AuctionTimer } from "@/components/auction-timer";

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

  return (
    <Card
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl",
        "border border-gray-200 dark:border-[#26262B]",
        "bg-white dark:bg-[#111113]",
        "transition-all duration-300 ease-out cursor-pointer",
        "hover:shadow-lg hover:-translate-y-0.5",
        "dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        isTopDeal && "border-t-2 border-t-[#2563EB]"
      )}
    >
      <CardContent className="flex flex-col gap-4 flex-1 px-5 pt-5 pb-4">

        {/* ── 1. BADGE ROW ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 min-h-[26px]">
          {isAuction ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-violet-500 dark:text-violet-400 bg-violet-500/10 dark:bg-violet-500/15 rounded-full px-2.5 py-1 ring-1 ring-violet-500/20">
              <Gavel className="h-3 w-3" />
              {t("auction")}
            </span>
          ) : worthImporting ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full px-2.5 py-1 ring-1 ring-emerald-500/20">
              <TrendingDown className="h-3 w-3" />
              {t("worthImporting")}
            </span>
          ) : (
            <span className="inline-flex items-center text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/[0.05] rounded-full px-2.5 py-1 ring-1 ring-gray-200 dark:ring-white/10">
              {t("buyLocally")}
            </span>
          )}

          {/* Timer slot for auctions, marketplace tag for fixed */}
          {isAuction && auctionEndsAt ? (
            <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
              <Timer className="h-3 w-3 shrink-0" />
              <AuctionTimer
                endsAt={auctionEndsAt}
                timeLeftLabel={t("timeLeft")}
                endedLabel={t("auctionEnded")}
              />
            </span>
          ) : marketplaceLabel ? (
            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {marketplaceLabel}
            </span>
          ) : null}
        </div>

        {/* ── 2. PRICE BLOCK (COP PRIMARY) ──────────────────────────── */}
        {isAuction && copCurrentBid !== undefined ? (
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {t("currentBid")}
            </p>
            <p className="text-[2.25rem] font-extrabold text-gray-900 dark:text-white tracking-tight leading-none tabular-nums">
              {formatCop(copCurrentBid)}
            </p>
            {currentBid !== undefined && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                ~{formatUsd(currentBid)} USD
              </p>
            )}
            {copEstFinal !== undefined && estimatedFinalPrice !== undefined && (
              <p className="pt-1.5 text-sm text-gray-600 dark:text-gray-400">
                {t("couldWinFor")}{" "}
                <span className="font-semibold text-violet-600 dark:text-violet-400">
                  {formatCop(copEstFinal)}
                </span>
                <span className="text-[11px] text-gray-400 dark:text-gray-500 ml-1">
                  (~{formatUsd(estimatedFinalPrice)} USD)
                </span>
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-[2.25rem] font-extrabold text-gray-900 dark:text-white tracking-tight leading-none tabular-nums">
              {formatCop(copLanded)}
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              ~{formatUsd(landedPrice)} USD
            </p>
          </div>
        )}

        {/* ── 3. SAVINGS ────────────────────────────────────────────── */}
        {savingsPct > 0 && (
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 -mt-1">
            <span
              className={cn(
                "text-sm font-semibold",
                isAuction
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-emerald-700 dark:text-emerald-400"
              )}
            >
              {formatCop(copSavings)} menos
            </span>
            <span className="shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/[0.06] rounded px-1.5 py-0.5 tabular-nums">
              {savingsPct}%
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 w-full">
              vs. {formatCop(copLocal)} local
            </span>
          </div>
        )}

        {/* ── 4. EXPLANATION ────────────────────────────────────────── */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug -mt-1">
          {primaryExplanation}
        </p>

        {/* ── 5. PRODUCT TITLE + META ───────────────────────────────── */}
        <div className="pt-3 border-t border-gray-100 dark:border-[#26262B]">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
            Score {score}/100
            {listingsCount !== undefined && listingsCount > 0 && (
              <> · {t("offersLabel", { count: listingsCount })}</>
            )}
            {marketplaceLabel && <> · {marketplaceLabel}</>}
          </p>
        </div>

        {/* ── PRICING WARNING ───────────────────────────────────────── */}
        {pricingWarning && (
          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 -mt-1">
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
            "group inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold",
            "transition-all duration-200 active:scale-[0.99]",
            isAuction || worthImporting
              ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.06] dark:text-gray-300 dark:hover:bg-white/[0.10]"
          )}
        >
          <span>{ctaLabel}</span>
          <ExternalLink className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </a>
      </CardFooter>
    </Card>
  );
}


