"use client";

import Image from "next/image";
import { WinnerInfo } from "@/lib/api";
import { cn } from "@/lib/utils";

interface WinnerBannerProps {
  winner: WinnerInfo;
  productImageUrl?: string;
  productName?: string;
}

function formatCop(amount: number): string {
  return `$${amount.toLocaleString("es-CO")} COP`;
}

export function WinnerBanner({ winner, productImageUrl, productName }: WinnerBannerProps) {
  const isImport = winner.type === "import";
  const hasLocal = winner.bestLocalPriceCop > 0;
  const hasImported = winner.bestImportedTotalCop > 0;

  return (
    <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#26262B] bg-white dark:bg-[#111113] shadow-lg overflow-hidden">
      {/* ── Main row ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-0">

        {/* Product image — always visible, placeholder when no URL */}
        <div className="shrink-0 sm:w-52 bg-[#F8FAFC] dark:bg-white/[0.03] flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-[#E2E8F0] dark:border-[#26262B]">
          {productImageUrl ? (
            <div className="relative w-40 h-40 sm:w-44 sm:h-44">
              <Image
                src={productImageUrl}
                alt={productName ?? "Producto"}
                fill
                className="object-contain rounded-xl"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-40 h-40 sm:w-44 sm:h-44 flex flex-col items-center justify-center gap-2 rounded-xl bg-[#F1F5F9] dark:bg-white/[0.04]">
              <span className="text-4xl opacity-30">🎵</span>
              <span className="text-[10px] text-[#94A3B8] text-center px-2">Imagen no disponible</span>
            </div>
          )}
        </div>

        {/* Center: product info + delivery badges */}
        <div className="flex-1 p-6 flex flex-col justify-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              {productName ?? "Producto"}
            </h2>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              {isImport ? "Importar desde el exterior" : "Comprar en Colombia"}
            </p>
          </div>

          {/* Delivery / Warranty / Returns — horizontal pill row */}
          <div className="flex flex-wrap gap-2">
            {isImport ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-white/[0.06] text-xs text-[#475569] dark:text-[#94A3B8]">
                  🚚 <span>Entrega <strong className="text-[#0F172A] dark:text-white">8–15 días hábiles</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-white/[0.06] text-xs text-[#475569] dark:text-[#94A3B8]">
                  🛡️ <span>Garantía <strong className="text-[#0F172A] dark:text-white">Según la tienda</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-white/[0.06] text-xs text-[#475569] dark:text-[#94A3B8]">
                  🔄 <span>Devoluciones <strong className="text-[#0F172A] dark:text-white">Según la tienda</strong></span>
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-white/[0.06] text-xs text-[#475569] dark:text-[#94A3B8]">
                  🚀 <span>Entrega <strong className="text-[#0F172A] dark:text-white">1–3 días hábiles</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-white/[0.06] text-xs text-[#475569] dark:text-[#94A3B8]">
                  🛡️ <span>Garantía <strong className="text-[#0F172A] dark:text-white">Oficial Colombia</strong></span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-white/[0.06] text-xs text-[#475569] dark:text-[#94A3B8]">
                  🔄 <span>Devoluciones <strong className="text-[#0F172A] dark:text-white">Fáciles</strong></span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: decision highlight */}
        <div
          className={cn(
            "shrink-0 sm:w-64 flex flex-col justify-center gap-2 p-6 border-t sm:border-t-0 sm:border-l",
            isImport
              ? "bg-emerald-50 dark:bg-emerald-500/[0.06] border-emerald-200 dark:border-emerald-500/20"
              : "bg-blue-50 dark:bg-blue-500/[0.06] border-blue-200 dark:border-blue-500/20",
          )}
        >
          <div
            className={cn(
              "self-start px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em]",
              isImport ? "bg-emerald-500 text-white" : "bg-blue-500 text-white",
            )}
          >
            🏆 MEJOR OPCIÓN ACTUAL
          </div>

          <p
            className={cn(
              "text-2xl font-bold tracking-tight mt-1",
              isImport
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-blue-700 dark:text-blue-400",
            )}
          >
            {winner.title}
          </p>

          {winner.savingsCop > 0 && (
            <>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isImport
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-blue-700 dark:text-blue-400",
                )}
              >
                Ahorra {formatCop(winner.savingsCop)}{" "}
                <span className="font-bold">({winner.savingsPct.toFixed(0)}%)</span>
              </p>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Comparado con la mejor opción local
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Comparison bar — always shown ──────────────────────────── */}
      <div className="border-t border-[#E2E8F0] dark:border-[#26262B] grid grid-cols-[1fr_auto_1fr] bg-[#F8FAFC] dark:bg-white/[0.02]">
        <div className="py-4 px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#64748B] dark:text-[#94A3B8] mb-1">
            Mejor importado
          </p>
          {hasImported ? (
            <p className={cn("text-lg font-bold tabular-nums", isImport ? "text-emerald-700 dark:text-emerald-400" : "text-[#0F172A] dark:text-white")}>
              {formatCop(winner.bestImportedTotalCop)}
            </p>
          ) : (
            <p className="text-sm text-[#94A3B8]">Sin opciones</p>
          )}
        </div>
        <div className="relative flex items-center justify-center px-4">
          <span className="relative z-10 w-9 h-9 rounded-full bg-white dark:bg-[#111113] border-2 border-[#E2E8F0] dark:border-[#26262B] flex items-center justify-center text-[11px] font-bold text-[#94A3B8]">VS</span>
        </div>
        <div className="py-4 px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#64748B] dark:text-[#94A3B8] mb-1">
            Mejor local
          </p>
          {hasLocal ? (
            <p className={cn("text-lg font-bold tabular-nums", !isImport ? "text-blue-700 dark:text-blue-400" : "text-[#0F172A] dark:text-white")}>
              {formatCop(winner.bestLocalPriceCop)}
            </p>
          ) : (
            <p className="text-sm text-[#94A3B8]">No hay en tiendas locales</p>
          )}
        </div>
      </div>
    </div>
  );
}
