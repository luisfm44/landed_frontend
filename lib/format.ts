/**
 * Format a USD dollar amount as a compact string, e.g. "$1,200" or "$4,599.00".
 */
export function formatUsd(amount: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Approximate display-only exchange rate (COP per USD).
 * Used for converting USD prices to COP for Colombian users.
 * NOT used for financial calculations — backend provides accurate rates.
 */
export const USD_TO_COP = 4100;

/** Convert a USD amount to COP using the display exchange rate. */
export function usdToCop(usd: number): number {
  return Math.round(usd * USD_TO_COP);
}

/**
 * Format a Colombian Peso amount using the official COP currency format.
 * Primary display currency for Colombian users.
 */
export function formatCop(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
