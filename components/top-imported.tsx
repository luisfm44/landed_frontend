"use client";

import { ImportedOffer } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TopImportedProps {
  offers: ImportedOffer[];
  bestLocalPriceCop?: number;
}

function formatCop(amount: number): string {
  return `$${amount.toLocaleString("es-CO")} COP`;
}

const MARKETPLACE_FLAGS: Record<string, string> = {
  ebay: "🇺🇸",
  amazon: "🇺🇸",
  "amazon.com": "🇺🇸",
  "amazon.de": "🇩🇪",
  "amazon.co.uk": "🇬🇧",
  "amazon.es": "🇪🇸",
  "amazon.ca": "🇨🇦",
  "amazon.com.br": "🇧🇷",
  mercadolibre: "🇺🇸",
  default: "🌎",
};

function getFlag(marketplace: string): string {
  const key = marketplace.toLowerCase();
  return MARKETPLACE_FLAGS[key] ?? MARKETPLACE_FLAGS.default;
}

export function TopImported({ offers, bestLocalPriceCop }: TopImportedProps) {
  if (offers.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#0F172A] dark:text-white">
          1. Mejores opciones importadas
        </h3>
        {bestLocalPriceCop != null && bestLocalPriceCop > 0 && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F1F5F9] dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B]">
            Ref. local: {formatCop(bestLocalPriceCop)}
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer, index) => {
          const isBest = index === 0;
          const savingsCop = offer.savingsCop ?? 0;
          const isCheaper = savingsCop > 0;

          return (
            <div
              key={offer.productUrl || `${offer.marketplace}-${index}`}
              className={cn(
                "relative flex flex-col rounded-xl p-4 bg-white dark:bg-[#111113] border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200",
                isBest
                  ? "border-2 border-emerald-500 shadow-[0_10px_30px_rgba(34,197,94,0.25)]"
                  : "border-[#E2E8F0] dark:border-[#26262B]",
              )}
            >
              {isBest && (
                <div className="absolute -top-3 left-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                    MEJOR IMPORTADO
                  </span>
                </div>
              )}

              {/* Rank + marketplace */}
              <div className="flex items-center gap-2 mt-1 mb-3">
                <div className="w-7 h-7 rounded-full bg-[#F1F5F9] dark:bg-white/[0.06] flex items-center justify-center text-xs font-bold text-[#64748B] dark:text-[#94A3B8] shrink-0">
                  {index + 1}
                </div>
                <span className="text-lg">{getFlag(offer.marketplace)}</span>
                <span className="text-sm font-semibold text-[#0F172A] dark:text-white truncate capitalize">
                  {offer.marketplace}
                </span>
              </div>

              {/* Title */}
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-2 mb-3 leading-relaxed">
                {offer.title}
              </p>

              {/* Breakdown */}
              <div className="space-y-1 text-xs mb-3">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Producto</span>
                  <span className="tabular-nums font-medium text-[#0F172A] dark:text-[#F5F5F7]">
                    {formatCop(offer.breakdown.productCop)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">
                    {offer.method === "direct" ? "Envío directo" : "Casillero"}
                  </span>
                  <span className="tabular-nums font-medium text-[#0F172A] dark:text-[#F5F5F7]">
                    +{formatCop(offer.breakdown.shippingCop)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Arancel + IVA</span>
                  <span className="tabular-nums font-medium text-[#0F172A] dark:text-[#F5F5F7]">
                    +{formatCop(offer.breakdown.taxesCop)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#E2E8F0] dark:border-[#26262B]">
                  <span className="font-semibold text-[#0F172A] dark:text-white">Total</span>
                  <span className="tabular-nums font-bold text-[#0F172A] dark:text-white text-sm">
                    {formatCop(offer.totalPriceCop)}
                  </span>
                </div>
              </div>

              {/* Savings callout */}
              {offer.savingsCop != null && (
                <div
                  className={cn(
                    "rounded-lg p-2.5 text-xs font-medium text-center mb-3",
                    isCheaper
                      ? "bg-emerald-50 dark:bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                      : "bg-red-50 dark:bg-red-500/[0.08] text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20",
                  )}
                >
                  {isCheaper
                    ? `Ahorras ${formatCop(Math.abs(offer.savingsCop))} (${Math.abs(offer.savingsPct ?? 0).toFixed(1)}%)`
                    : `${formatCop(Math.abs(offer.savingsCop))} más caro que local`}
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto flex flex-wrap gap-1.5 text-[10px] text-[#94A3B8]">
                <span>📦 10–20 días</span>
                <span>·</span>
                <span>🛡️ Protección comprador</span>
              </div>

              {/* CTA */}
              {offer.productUrl && (
                <a
                  href={offer.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block w-full text-center py-2 rounded-lg text-xs font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
                >
                  Ver oferta →
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
