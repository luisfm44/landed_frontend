/**
 * Landed Score Engine
 *
 * Turns raw Opportunity fields into a 0–100 quality signal and a human
 * insight string.  The backend should supply `score` when available; this
 * module acts as the client-side fallback and as the winner-selector when
 * comparing multiple results.
 *
 * Formula weights (must sum to 1.0):
 *   savings      40 % — biggest driver, directly saves the buyer money
 *   risk         30 % — auctions and warnings erode confidence
 *   viability    20 % — is importing actually worth it?
 *   convenience  10 % — direct shipping beats locker friction
 */

import { Opportunity } from "@/types/opportunity";
import { formatCop, usdToCop } from "@/lib/format";

// ─── Core score calculation ───────────────────────────────────────────────────

/**
 * Compute a 0–100 score for an opportunity.
 * Use the backend-supplied `score` when available; fall back to this.
 */
export function computeScore(opp: Opportunity): number {
  // If backend already computed a score, trust it.
  if (opp.score !== undefined && opp.score > 0) return opp.score;

  // 40 % — savings: map 0–50 % savings onto 0–100
  const savingsScore = Math.min(100, opp.savingsPercentage * 200);

  // 30 % — risk: penalise warnings and price-uncertain auctions
  let riskScore = 100;
  if (opp.pricingWarning) riskScore -= 25;
  if (opp.type === "auction") riskScore -= 15;

  // 20 % — viability: is importing worth it at all?
  const viabilityScore = (opp.worthImporting ?? opp.savingsPercentage > 0.1) ? 100 : 15;

  // 10 % — convenience: direct shipping is less friction than a locker
  const convenienceScore = opp.shippingMethod === "direct" ? 85 : 70;

  const raw =
    savingsScore * 0.4 +
    riskScore * 0.3 +
    viabilityScore * 0.2 +
    convenienceScore * 0.1;

  return Math.round(Math.min(100, Math.max(0, raw)));
}

// ─── Winner selection ─────────────────────────────────────────────────────────

/** Return a new array sorted best → worst, each item augmented with its score. */
export function rankOpportunities(
  opps: Opportunity[]
): (Opportunity & { computedScore: number })[] {
  return opps
    .map((o) => ({ ...o, computedScore: computeScore(o) }))
    .sort((a, b) => b.computedScore - a.computedScore);
}

/** Mark the single best opportunity from a list. */
export function markWinner(opps: Opportunity[]): Opportunity[] {
  if (opps.length === 0) return opps;
  const ranked = rankOpportunities(opps);
  const winnerId = ranked[0].externalUrl + ranked[0].title; // stable key
  return opps.map((o) => ({
    ...o,
    isTopDeal: o.externalUrl + o.title === winnerId,
  }));
}

// ─── Insight generation ───────────────────────────────────────────────────────

export interface ScoreInsight {
  /** Short badge label shown on the card */
  label: string;
  /** Tailwind classes for the badge */
  className: string;
  /** Optional glow shadow class for high-confidence winners */
  glow: string | null;
  /** One-line human explanation */
  insight: string | undefined;
}

/**
 * Generate a human-readable insight and badge config for a given opportunity.
 * Accepts pre-computed copSavings so callers don't recalculate.
 */
export function generateInsight(
  opp: Opportunity,
  copSavings: number,
  marketplaceLabel?: string
): ScoreInsight {
  const savingsPct = Math.round(opp.savingsPercentage * 100);
  const isAuction = opp.type === "auction";
  const worthImporting = opp.worthImporting ?? opp.savingsPercentage > 0.1;

  // ── Auction path ────────────────────────────────────────────────────────────
  if (isAuction) {
    const msLeft = opp.auctionEndsAt
      ? new Date(opp.auctionEndsAt).getTime() - Date.now()
      : Infinity;

    if (msLeft < 2 * 60 * 60 * 1000) {
      const h = Math.max(0, Math.floor(msLeft / (1000 * 60 * 60)));
      const m = Math.max(0, Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60)));
      return {
        label: "⚡ Termina pronto",
        className: "text-violet-600 dark:text-violet-400 bg-violet-500/10 ring-violet-500/20",
        glow: "shadow-[0_0_16px_rgba(139,92,246,0.25)]",
        insight: `Quedan ${h}h ${m}m — actúa antes de que suba`,
      };
    }

    return {
      label: "🔨 Subasta activa",
      className: "text-violet-600 dark:text-violet-400 bg-violet-500/10 ring-violet-500/20",
      glow: null,
      insight: opp.pricingWarning
        ? "⚠️ Precio incierto — monitorea antes de pujar"
        : marketplaceLabel
        ? `En ${marketplaceLabel}`
        : undefined,
    };
  }

  // ── Not worth importing ─────────────────────────────────────────────────────
  if (!worthImporting) {
    return {
      label: "🚦 Mejor local",
      className: "text-gray-500 bg-gray-100 dark:bg-white/[0.05] ring-gray-200 dark:ring-white/10",
      glow: null,
      insight: "El precio local es más competitivo en este caso",
    };
  }

  // ── High savings tiers ──────────────────────────────────────────────────────
  if (opp.savingsPercentage >= 0.40) {
    return {
      label: "🔥 Oferta brutal",
      className: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]",
      insight: `Ahorro del ${savingsPct}% frente al mercado local`,
    };
  }

  if (opp.savingsPercentage >= 0.30) {
    return {
      label: "💎 Precio fuera de lo normal",
      className: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
      glow: "shadow-[0_0_14px_rgba(34,197,94,0.15)]",
      insight: `${savingsPct}% por debajo del precio colombiano estimado`,
    };
  }

  if (opp.savingsPercentage >= 0.15) {
    return {
      label: "💰 Buen ahorro",
      className: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
      glow: null,
      insight: `Ahorras ${formatCop(copSavings)} importando`,
    };
  }

  // ── Baseline positive recommendation ───────────────────────────────────────
  const score = computeScore(opp);
  return {
    label: "🧠 Recomendado",
    className: "text-blue-600 dark:text-blue-400 bg-blue-500/10 ring-blue-500/20",
    glow: null,
    insight: score >= 70 ? "Score positivo · vale la pena evaluar" : undefined,
  };
}
