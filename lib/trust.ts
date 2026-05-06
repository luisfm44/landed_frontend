const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

export function getTrustBadgeConfig(confidence: "low" | "medium" | "high"): {
  label: string;
  className: string;
} {
  switch (confidence) {
    case "high":
      return {
        label: "Alta confianza",
        className:
          "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      };
    case "medium":
      return {
        label: "Confianza media",
        className:
          "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      };
    case "low":
      return {
        label: "Datos limitados",
        className:
          "bg-gray-100 text-gray-500 border border-gray-200 dark:bg-white/[0.05] dark:text-[#94A3B8] dark:border-white/[0.10]",
      };
  }
}

export function getSnapshotFreshnessHint(
  snapshotStatus: string | undefined,
  snapshotAgeMs: number | undefined,
): { text: string; isWarning: boolean } | null {
  const isStale =
    snapshotStatus === "stale" ||
    (snapshotAgeMs != null && snapshotAgeMs > TWELVE_HOURS_MS);

  const isRecent =
    snapshotStatus === "hit" &&
    (snapshotAgeMs == null || snapshotAgeMs < SIX_HOURS_MS);

  if (isStale) {
    return { text: "Datos pueden estar desactualizados", isWarning: true };
  }
  if (isRecent) {
    return { text: "Actualizado recientemente", isWarning: false };
  }
  return null;
}
