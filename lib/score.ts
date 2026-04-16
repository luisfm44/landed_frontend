import { Opportunity } from "@/types/opportunity";

/**
 * Mark the first opportunity as the top deal.
 * Results are pre-sorted by the backend (best import options first).
 */
export function markWinner(opps: Opportunity[]): Opportunity[] {
  if (opps.length === 0) return opps;
  return opps.map((o, i) => ({ ...o, isTopDeal: i === 0 }));
}

