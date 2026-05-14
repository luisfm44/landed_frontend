"use client";

import { WinnerInfo } from "@/lib/api";
import { cn } from "@/lib/utils";

interface WinnerBannerProps {
  winner: WinnerInfo;
}

function formatCop(amount: number): string {
  return `$${amount.toLocaleString("es-CO")} COP`;
}

export function WinnerBanner({ winner }: WinnerBannerProps) {
  const isImport = winner.type === "import";

  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-6 sm:p-8 shadow-lg",
        isImport
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/[0.06] shadow-[0_10px_30px_rgba(34,197,94,0.15)]"
          : "border-blue-500 bg-blue-50 dark:bg-blue-500/[0.06] shadow-[0_10px_30px_rgba(37,99,235,0.15)]",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400 mb-1">
            🏆 MEJOR OPCIÓN ACTUAL
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-[-0.02em]">
            {winner.title}
          </h2>
          <p className="text-3xl sm:text-4xl font-bold tabular-nums mt-2 text-[#0F172A] dark:text-white">
            {formatCop(winner.totalPriceCop)}
          </p>
        </div>
        {winner.savingsCop > 0 && (
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Ahorras
            </p>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {formatCop(winner.savingsCop)}
            </p>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {winner.savingsPct.toFixed(1)}% menos
            </p>
          </div>
        )}
      </div>

      {/* Comparison box */}
      {winner.bestImportedTotalCop > 0 && winner.bestLocalPriceCop > 0 && (
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-white/60 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 p-4">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#64748B] dark:text-[#71717A] mb-1">
              Mejor importado
            </p>
            <p
              className={cn(
                "text-lg font-bold tabular-nums",
                isImport
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-[#0F172A] dark:text-white",
              )}
            >
              {formatCop(winner.bestImportedTotalCop)}
            </p>
          </div>
          <div className="text-center border-l border-[#E2E8F0] dark:border-[#26262B]">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#64748B] dark:text-[#71717A] mb-1">
              Mejor local
            </p>
            <p
              className={cn(
                "text-lg font-bold tabular-nums",
                !isImport
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-[#0F172A] dark:text-white",
              )}
            >
              {formatCop(winner.bestLocalPriceCop)}
            </p>
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {isImport ? (
          <>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B]">
              📦 Entrega 10–20 días
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B]">
              🛡️ Garantía del fabricante
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B]">
              ↩️ Devoluciones según vendedor
            </span>
          </>
        ) : (
          <>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B]">
              🚀 Entrega inmediata
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B]">
              🛡️ Garantía oficial Colombia
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B]">
              ↩️ Devoluciones fáciles
            </span>
          </>
        )}
      </div>
    </div>
  );
}
