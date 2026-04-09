/**
 * Landed Design Tokens — single source of truth.
 *
 * These values are mirrored in app/globals.css (@theme block) so that
 * Tailwind generates semantic utility classes (bg-success, text-brand, etc.).
 *
 * Philosophy: Landed is a decision engine, not an ecommerce UI.
 * Every token answers a question the buyer has:
 *   success  → "this is worth it"
 *   warning  → "price could rise"
 *   danger   → "not worth importing"
 *   brand    → "auction / special state"
 *   primary  → "take action"
 */

// ─── Colors ─────────────────────────────────────────────────────────────────
export const colors = {
  // Surface system — all cards white, page bg near-white
  background: "#FAFAFA",
  surface: "#FFFFFF",
  border: "#E5E7EB",

  // Text
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",

  // Brand actions — primary CTA, links
  primary: "#2563EB",
  primaryLight: "#DBEAFE",

  // Auction / special states
  brand: "#7C3AED",
  brandLight: "#EDE9FE",

  // Semantic states
  success: "#16A34A", // savings confirmed, worth importing
  successLight: "#DCFCE7",

  warning: "#D97706", // amber-600 — price may rise (darker for a11y on white)
  warningLight: "#FEF3C7",

  danger: "#DC2626", // not worth importing
  dangerLight: "#FEE2E2",
} as const;

// ─── Radius ──────────────────────────────────────────────────────────────────
// Matches the Tailwind v4 --radius-* tokens in globals.css.
// The base --radius is 10px; md/lg/xl are derived.
export const radius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "18px",
} as const;

// ─── Shadow ──────────────────────────────────────────────────────────────────
// card     → default resting state
// elevated → hover / focus elevation
export const shadow = {
  card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.06)",
  elevated: "0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
} as const;

// ─── Typography reference ────────────────────────────────────────────────────
// Actual sizing is controlled by Tailwind utilities in components.
// This table documents the intended scale for designers.
export const typography = {
  price: { size: "30px", weight: "700", notes: "Primary decision element" },
  h1: { size: "48px", weight: "700" },
  h2: { size: "28px", weight: "600" },
  body: { size: "16px", weight: "400" },
  small: { size: "14px", weight: "400" },
  micro: { size: "12px", weight: "400" },
} as const;
