"use client";

import Image from "next/image";
import { LocalStoreOffer } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TopLocalProps {
  offers: LocalStoreOffer[];
  bestImportedTotalCop?: number;
  productImageUrl?: string;
}

function formatCop(amount: number): string {
  return `$${amount.toLocaleString("es-CO")} COP`;
}

// Color palette for store logo initials
const STORE_COLORS: [string, string][] = [
  ["bg-blue-600", "text-white"],
  ["bg-purple-600", "text-white"],
  ["bg-emerald-600", "text-white"],
  ["bg-orange-500", "text-white"],
  ["bg-rose-600", "text-white"],
];

function StoreAvatar({ name, index }: { name: string; index: number }) {
  const [bg, fg] = STORE_COLORS[index % STORE_COLORS.length];
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0", bg, fg)}>
      {initials}
    </div>
  );
}

export function TopLocal({ offers, bestImportedTotalCop, productImageUrl }: TopLocalProps) {
  const isEmpty = offers.length === 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
        <div>
          <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
            2. Mejores opciones locales
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Mejor precio disponible por tienda (1 resultado por tienda)
          </p>
        </div>
        {!isEmpty && bestImportedTotalCop != null && bestImportedTotalCop > 0 && (
          <span className="self-start sm:self-auto text-xs font-medium px-3 py-1.5 rounded-lg bg-[#F1F5F9] dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#26262B] whitespace-nowrap">
            Mejor opción local actual:{" "}
            <strong className="text-[#0F172A] dark:text-white">{formatCop(offers[0]?.priceCop ?? 0)}</strong>
          </span>
        )}
      </div>

      <div className="mt-4">
        {/* Empty state */}
        {isEmpty ? (
          <div className="rounded-2xl border border-dashed border-[#E2E8F0] dark:border-[#26262B] bg-[#FAFAFA] dark:bg-white/[0.02] px-6 py-10 text-center flex flex-col items-center gap-3">
            <span className="text-3xl">🏪</span>
            <p className="text-sm font-semibold text-[#0F172A] dark:text-white">
              No encontramos precios en tiendas locales
            </p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] max-w-sm">
              Es posible que este producto no esté disponible en tiendas colombianas ahora mismo, o que no tengamos cobertura para esta categoría todavía.
            </p>
          </div>
        ) : (
          /* Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer, index) => {
              const isBest = index === 0;
              const imageUrl = offer.imageUrl ?? productImageUrl;

              return (
                <div
                  key={offer.url || `${offer.store}-${index}`}
                  className={cn(
                    "relative flex flex-col rounded-2xl bg-white dark:bg-[#111113] border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden",
                    isBest
                      ? "border-2 border-blue-500 shadow-[0_8px_24px_rgba(37,99,235,0.18)]"
                      : "border-[#E2E8F0] dark:border-[#26262B]",
                  )}
                >
                  {isBest && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500 text-white shadow-sm">
                        MEJOR LOCAL
                      </span>
                    </div>
                  )}

                  {/* Store header */}
                  <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[#F1F5F9] dark:border-[#26262B]">
                    <div className="w-7 h-7 rounded-full bg-[#F1F5F9] dark:bg-white/[0.08] flex items-center justify-center text-xs font-bold text-[#64748B] shrink-0">
                      {index + 1}
                    </div>
                    <StoreAvatar name={offer.store} index={index} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] dark:text-white leading-tight truncate">
                        {offer.store}
                      </p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">🇨🇴 Colombia</p>
                    </div>
                  </div>

                  {/* Product image */}
                  {imageUrl ? (
                    <div className="bg-[#F8FAFC] dark:bg-white/[0.02] flex items-center justify-center h-36 border-b border-[#F1F5F9] dark:border-[#26262B]">
                      <div className="relative w-28 h-28">
                        <Image
                          src={imageUrl}
                          alt={offer.store}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#F8FAFC] dark:bg-white/[0.02] h-36 flex items-center justify-center border-b border-[#F1F5F9] dark:border-[#26262B]">
                      <span className="text-4xl opacity-30">🏪</span>
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-1 gap-3">
                    {/* Price */}
                    <p className="text-2xl font-bold tabular-nums text-[#0F172A] dark:text-white tracking-tight">
                      {formatCop(offer.priceCop)}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                        <span className="text-sm">✓</span>
                        <span className="font-medium">Producto nuevo</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                        <span className="text-sm">✓</span>
                        <span className="font-medium">Garantía oficial</span>
                      </div>
                    </div>

                    {/* Delivery info */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-[#64748B] dark:text-[#94A3B8] border-t border-[#F1F5F9] dark:border-[#26262B] pt-2.5">
                      <span className="flex items-center gap-1">
                        <span>📦</span>
                        <span>Entrega 1–3 días</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🚚</span>
                        <span>Envío Gratis</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🛡️</span>
                        <span>Garantía 12 meses</span>
                      </span>
                    </div>

                    {/* CTA */}
                    {offer.url ? (
                      <a
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto block w-full text-center py-2.5 rounded-xl text-xs font-bold bg-[#F1F5F9] dark:bg-white/[0.06] text-[#0F172A] dark:text-white hover:bg-[#E2E8F0] dark:hover:bg-white/[0.10] transition-colors border border-[#E2E8F0] dark:border-[#26262B]"
                      >
                        Ver en tienda →
                      </a>
                    ) : (
                      <button
                        disabled
                        className="mt-auto w-full py-2.5 rounded-xl text-xs font-bold bg-[#F1F5F9] dark:bg-white/[0.04] text-[#94A3B8] cursor-not-allowed border border-[#E2E8F0] dark:border-[#26262B]"
                      >
                        Ver en tienda →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
