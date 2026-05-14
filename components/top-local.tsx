"use client";

import { LocalStoreOffer } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TopLocalProps {
  offers: LocalStoreOffer[];
  bestImportedTotalCop?: number;
}

function formatCop(amount: number): string {
  return `$${amount.toLocaleString("es-CO")} COP`;
}

const STORE_LOGOS: Record<string, string> = {
  falabella: "🏬",
  mercadolibre: "🛒",
  audiofilo: "🎵",
  "audioelite": "🎵",
  "lfl audio": "🎵",
  jpmaudio: "🎵",
  axxelsound: "🎵",
  "sonido profesional": "🎵",
  default: "🏪",
};

function getStoreLogo(store: string): string {
  const key = store.toLowerCase();
  for (const [k, v] of Object.entries(STORE_LOGOS)) {
    if (key.includes(k)) return v;
  }
  return STORE_LOGOS.default;
}

export function TopLocal({ offers, bestImportedTotalCop }: TopLocalProps) {
  if (offers.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#0F172A] dark:text-white">
          2. Mejores opciones locales
        </h3>
        {bestImportedTotalCop != null && bestImportedTotalCop > 0 && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F1F5F9] dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B]">
            Ref. importado: {formatCop(bestImportedTotalCop)}
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer, index) => {
          const isBest = index === 0;

          return (
            <div
              key={offer.url || `${offer.store}-${index}`}
              className={cn(
                "relative flex flex-col rounded-xl p-4 bg-white dark:bg-[#111113] border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200",
                isBest
                  ? "border-2 border-blue-500 shadow-[0_10px_30px_rgba(37,99,235,0.2)]"
                  : "border-[#E2E8F0] dark:border-[#26262B]",
              )}
            >
              {isBest && (
                <div className="absolute -top-3 left-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500 text-white shadow-sm">
                    MEJOR LOCAL
                  </span>
                </div>
              )}

              {/* Store identity */}
              <div className="flex items-center gap-2 mt-1 mb-3">
                <span className="text-2xl">{getStoreLogo(offer.store)}</span>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-white leading-tight">
                    {offer.store}
                  </p>
                  <p className="text-[10px] text-[#94A3B8]">Colombia</p>
                </div>
              </div>

              {/* Price */}
              <p className="text-2xl font-bold tabular-nums text-[#0F172A] dark:text-white tracking-[-0.01em] mb-3">
                {formatCop(offer.priceCop)}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1F5F9] dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B]">
                  Producto nuevo
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1F5F9] dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B]">
                  Garantía oficial
                </span>
              </div>

              {/* Footer info */}
              <div className="mt-auto flex flex-wrap gap-1.5 text-[10px] text-[#94A3B8] mb-3">
                <span>🚀 Entrega inmediata</span>
                <span>·</span>
                <span>📦 Envío gratis*</span>
                <span>·</span>
                <span>🛡️ Garantía 1 año</span>
              </div>

              {/* CTA */}
              {offer.url ? (
                <a
                  href={offer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 rounded-lg text-xs font-semibold bg-[#F1F5F9] dark:bg-white/[0.06] text-[#0F172A] dark:text-white hover:bg-[#E2E8F0] dark:hover:bg-white/[0.10] transition-colors border border-[#E2E8F0] dark:border-[#26262B]"
                >
                  Ver en tienda →
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-[#F1F5F9] dark:bg-white/[0.04] text-[#94A3B8] cursor-not-allowed border border-[#E2E8F0] dark:border-[#26262B]"
                >
                  Ver en tienda →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
