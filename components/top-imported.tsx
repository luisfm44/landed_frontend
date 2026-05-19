"use client";

import Image from "next/image";
import { ImportedOffer } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TopImportedProps {
  offers: ImportedOffer[];
  bestLocalPriceCop?: number;
}

function formatCop(amount: number): string {
  return `$${amount.toLocaleString("es-CO")} COP`;
}

// ── Marketplace logos (styled text) ──────────────────────────────────────────

function MarketplaceLogo({ name }: { name: string }) {
  const key = name.toLowerCase();
  if (key === "ebay") {
    return (
      <span className="font-extrabold text-lg tracking-tight leading-none">
        <span style={{ color: "#e53238" }}>e</span>
        <span style={{ color: "#0064d2" }}>b</span>
        <span style={{ color: "#f5af02" }}>a</span>
        <span style={{ color: "#86b817" }}>y</span>
      </span>
    );
  }
  if (key.startsWith("amazon")) {
    return (
      <span className="font-bold text-sm" style={{ color: "#232F3E" }}>
        amazon<span style={{ color: "#FF9900" }}>.com</span>
      </span>
    );
  }
  if (key === "reverb") {
    return (
      <span className="font-bold text-sm" style={{ color: "#0d7377" }}>
        Reverb
      </span>
    );
  }
  if (key === "audiogon") {
    return (
      <span className="font-bold text-sm" style={{ color: "#6d28d9" }}>
        Audiogon
      </span>
    );
  }
  if (key === "usaudiomart") {
    return (
      <span className="font-bold text-sm text-blue-700">
        US AudioMart
      </span>
    );
  }
  return (
    <span className="font-bold text-sm text-[#0F172A] dark:text-white capitalize">
      {name}
    </span>
  );
}

const MARKETPLACE_FLAGS: Record<string, string> = {
  ebay: "🇺🇸",
  amazon: "🇺🇸",
  reverb: "🇺🇸",
  audiogon: "🇺🇸",
  usaudiomart: "🇺🇸",
  "amazon.de": "🇩🇪",
  "amazon.co.uk": "🇬🇧",
  default: "🌎",
};

function getFlag(marketplace: string): string {
  const key = marketplace.toLowerCase();
  return MARKETPLACE_FLAGS[key] ?? MARKETPLACE_FLAGS.default;
}

function getOrigin(marketplace: string): string {
  const key = marketplace.toLowerCase();
  if (key.includes("de") || key === "amazon.de") return "Alemania";
  if (key.includes("uk") || key === "amazon.co.uk") return "Reino Unido";
  return "Estados Unidos";
}

export function TopImported({ offers, bestLocalPriceCop }: TopImportedProps) {
  if (offers.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
        <div>
          <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
            1. Mejores opciones importadas
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Precios totales puesto en tu casa en Colombia (producto + envío + impuestos)
          </p>
        </div>
        {bestLocalPriceCop != null && bestLocalPriceCop > 0 && (
          <span className="self-start sm:self-auto text-xs font-medium px-3 py-1.5 rounded-lg bg-[#F1F5F9] dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B] whitespace-nowrap">
            Comparadas contra la mejor opción local:{" "}
            <strong className="text-[#0F172A] dark:text-white">{formatCop(bestLocalPriceCop)}</strong>
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer, index) => {
          const isBest = index === 0;
          const savingsCop = offer.savingsCop ?? 0;
          const isCheaper = savingsCop > 0;

          return (
            <div
              key={offer.productUrl || `${offer.marketplace}-${index}`}
              className={cn(
                "relative flex flex-col rounded-2xl bg-white dark:bg-[#111113] border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden",
                isBest
                  ? "border-2 border-emerald-500 shadow-[0_8px_24px_rgba(34,197,94,0.2)]"
                  : "border-[#E2E8F0] dark:border-[#26262B]",
              )}
            >
              {/* Marketplace header */}
              <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[#F1F5F9] dark:border-[#26262B]">
                <div className="w-7 h-7 rounded-full bg-[#F1F5F9] dark:bg-white/[0.08] flex items-center justify-center text-xs font-bold text-[#64748B] shrink-0">
                  {index + 1}
                </div>
                <MarketplaceLogo name={offer.marketplace} />
                <div className="ml-auto flex items-center gap-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <span>{getFlag(offer.marketplace)}</span>
                  <span>{getOrigin(offer.marketplace)}</span>
                </div>
              </div>

              {/* Product image */}
              {offer.imageUrl ? (
                <div className="bg-[#F8FAFC] dark:bg-white/[0.02] flex items-center justify-center h-52 sm:h-56 border-b border-[#F1F5F9] dark:border-[#26262B]">
                  <div className="relative w-40 h-40 sm:w-44 sm:h-44">
                    <Image
                      src={offer.imageUrl}
                      alt={offer.title}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-[#F8FAFC] dark:bg-white/[0.02] h-52 sm:h-56 flex items-center justify-center border-b border-[#F1F5F9] dark:border-[#26262B]">
                  <span className="text-6xl opacity-30">🎵</span>
                </div>
              )}

              <div className="p-4 flex flex-col flex-1 gap-3">
                {/* Best badge — below image, inside card body */}
                {isBest && (
                  <span className="self-start px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                    MEJOR IMPORTADO
                  </span>
                )}
                {/* Title */}
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {offer.title}
                </p>

                {/* Breakdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Precio del producto</span>
                    <span className="tabular-nums font-medium text-[#0F172A] dark:text-[#F5F5F7]">
                      {formatCop(offer.breakdown.productCop)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">
                      {offer.method === "direct" ? "Envío internacional" : "Casillero + envío"}
                    </span>
                    <span className="tabular-nums font-medium text-[#0F172A] dark:text-[#F5F5F7]">
                      {formatCop(offer.breakdown.shippingCop)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Impuestos y aranceles</span>
                    <span className="tabular-nums font-medium text-[#0F172A] dark:text-[#F5F5F7]">
                      {formatCop(offer.breakdown.taxesCop)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="rounded-xl bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-[#26262B] px-3 py-2.5 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#94A3B8] mb-0.5">
                    Total puesto en tu casa
                  </p>
                  <p className={cn(
                    "text-xl font-bold tabular-nums",
                    isBest ? "text-emerald-600 dark:text-emerald-400" : "text-[#0F172A] dark:text-white"
                  )}>
                    {formatCop(offer.totalPriceCop)}
                  </p>
                </div>

                {/* Savings callout */}
                {offer.savingsCop != null && (
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-xs font-semibold text-center",
                      isCheaper
                        ? "bg-emerald-50 dark:bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : "bg-red-50 dark:bg-red-500/[0.08] text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20",
                    )}
                  >
                    {isCheaper
                      ? `Ahorra ${formatCop(Math.abs(offer.savingsCop))} (${Math.abs(offer.savingsPct ?? 0).toFixed(0)}%)`
                      : `${formatCop(Math.abs(offer.savingsCop))} más caro que el mejor local`}
                  </div>
                )}

                {/* Footer */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <span>📦</span>
                    <span>Entrega estimada {offer.method === "direct" ? "9–13 días" : "14–20 días"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>🛡️</span>
                    <span>Protección al comprador</span>
                  </span>
                </div>

                {/* CTA */}
                {offer.productUrl && (
                  <a
                    href={offer.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto block w-full text-center py-2.5 rounded-xl text-xs font-bold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
                  >
                    Ver oferta →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
