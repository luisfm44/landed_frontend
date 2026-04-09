"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Opportunity } from "@/types/opportunity";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, Gavel, Timer, TriangleAlert } from "lucide-react";
import { formatUsd } from "@/lib/format";
import { AuctionTimer } from "@/components/auction-timer";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

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
  } = opportunity;

  const worthImporting = opportunity.worthImporting ?? score >= 65;
  const isTopDeal = opportunity.isTopDeal ?? false;
  const isAuction = type === "auction";

  const savingsPct = Math.round(savingsPercentage * 100);

  const localEstimate =
    savingsPercentage > 0 && savingsPercentage < 1
      ? landedPrice / (1 - savingsPercentage)
      : landedPrice;
  const savingsAmount = Math.round(localEstimate - landedPrice);

  const scoreLabel = t("scoreExcellent", { score });

  const primaryExplanation =
    explanation?.[0] ??
    (worthImporting || isAuction
      ? t("cheaperThanLocal", { amount: formatUsd(savingsAmount) })
      : t("noLocalAdvantage"));

  return (
    <Card
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border border-ld-border bg-surface shadow-card",
        "dark:bg-surface/80 dark:backdrop-blur-xl",
        "transition-all duration-300 ease-out cursor-pointer",
        "hover:shadow-elevated hover:scale-[1.02]",
        "dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]" ,
        // Top deals only get a thin top accent — one edge, not the full left border
        isTopDeal && "border-t-2 border-t-primary"
      )}
    >
      <CardContent className="flex flex-col gap-4 flex-1 px-5 pt-5 pb-4">

        {/* ── 1. PRICE + SAVINGS ─────────────────────────────────── */}
        <div>
          <span className="text-4xl font-extrabold text-[#0f172a] dark:text-foreground tracking-tight leading-none">
            {formatUsd(landedPrice)}
          </span>
          {savingsPct > 0 && (
            <p className="mt-1.5 text-sm font-medium text-success">
              {t("savingsLabel", { pct: savingsPct })} · <span className="text-gray-400 dark:text-muted-foreground/60 font-normal line-through">{formatUsd(price)}</span>
            </p>
          )}
        </div>

        {/* ── 2. ONE PILL — recommendation only ─────────────────── */}
        {isAuction ? (
          <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-brand bg-brand-light rounded-md px-2 py-0.5">
            <Gavel className="h-3 w-3" />
            {t("auction")}
          </span>
        ) : worthImporting ? (
          <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-success bg-success-light rounded-md px-2 py-0.5">
            {t("worthImporting")}
          </span>
        ) : (
          <span className="inline-flex w-fit text-xs font-semibold text-gray-400 dark:text-muted-foreground/70 rounded-md px-0 py-0.5">
            {t("buyLocally")}
          </span>
        )}

        {/* ── 3. EXPLANATION ────────────────────────────────────── */}
        <p className="text-sm text-[#374151] dark:text-foreground/80 leading-snug -mt-1">
          {primaryExplanation}
        </p>

        {explanation && explanation.length > 1 && (
          <p className="text-xs text-gray-400 dark:text-muted-foreground leading-relaxed -mt-2">
            {explanation[1]}
          </p>
        )}

        {/* ── 4. TITLE ──────────────────────────────────────────── */}
        <div className="pt-2 border-t border-ld-border">
          <h3 className="text-sm font-medium text-gray-600 dark:text-muted-foreground leading-snug line-clamp-2">
            {title}
          </h3>
        </div>

        {/* ── 5. META ───────────────────────────────────────────── */}
        <p className="text-xs text-gray-400 dark:text-muted-foreground/60 -mt-2">
          {scoreLabel}
          {listingsCount !== undefined && listingsCount > 0 && (
            <> · {t("offersLabel", { count: listingsCount })}</>
          )}
          {marketplace && <> · {marketplace}</>}
        </p>

        {/* ── AUCTION DETAILS ───────────────────────────────────── */}
        {isAuction && (
          <div className="space-y-1.5 pt-1">
            {currentBid !== undefined && (
              <p className="text-xs text-gray-500 dark:text-muted-foreground">
                {t("currentBid")}: <span className="font-semibold text-gray-700 dark:text-foreground">{formatUsd(currentBid)}</span>
              </p>
            )}
            {estimatedFinalPrice !== undefined && (
              <p className="text-xs text-gray-500 dark:text-muted-foreground">
                {t("couldWinFor")}: <span className="font-semibold text-brand">{formatUsd(estimatedFinalPrice)}</span>
              </p>
            )}
            {auctionEndsAt && (
              <span className="text-xs text-gray-400 dark:text-muted-foreground/60 flex items-center gap-1">
                <Timer className="h-3 w-3 shrink-0" />
                <AuctionTimer
                  endsAt={auctionEndsAt}
                  timeLeftLabel={t("timeLeft")}
                  endedLabel={t("auctionEnded")}
                />
              </span>
            )}
          </div>
        )}

        {/* PRICING WARNING — no box, just a text notice */}
        {pricingWarning && (
          <p className="text-xs text-warning flex items-center gap-1.5 -mt-1">
            <TriangleAlert className="h-3 w-3 shrink-0" />
            {pricingWarning}
          </p>
        )}
      </CardContent>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <CardFooter className="mt-auto pt-0 pb-5 px-5">
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold",
            "transition-all duration-200 active:scale-[0.99]",
            // Primary action — full blue, glow on hover signals clickability
            isAuction || worthImporting
              ? "bg-primary text-white hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(37,99,235,0.35)]"
              // Secondary — muted, no glow; importar en Colombia is the better path
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/8 dark:text-gray-300 dark:hover:bg-white/12"
          )}
        >
          <span>
            {isAuction
              ? t("joinAuction")
              : worthImporting
              ? t("buyFor", { price: formatUsd(landedPrice) })
              : t("viewOffer")}
          </span>
          <ExternalLink className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </a>
      </CardFooter>
    </Card>
  );
}


