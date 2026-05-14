"use client";

import { AnyOffer, ImportedOffer, LocalStoreOffer } from "@/lib/api";
import { cn } from "@/lib/utils";

interface OtherOffersTableProps {
  offers: AnyOffer[];
  title: string;
  subtitle?: string;
  emptyMessage?: string;
  bestLocalPriceCop?: number;
  exchangeRateCopUsd?: number;
  startIndex?: number;
}

function formatCop(amount: number): string {
  return `$${amount.toLocaleString("es-CO")} COP`;
}

// Country flag by marketplace
function originFlag(marketplace: string): string {
  const k = marketplace.toLowerCase();
  if (k.includes(".de") || k === "thomann") return "🇩🇪";
  if (k.includes(".uk")) return "🇬🇧";
  if (k === "mercadolibre" || k === "falabella" || k === "alkosto" || k === "audiofilo") return "🇨🇴";
  return "🇺🇸";
}

function originCountry(marketplace: string, type: string): string {
  if (type === "local") return "Colombia";
  const k = marketplace.toLowerCase();
  if (k.includes(".de") || k === "thomann") return "Alemania";
  if (k.includes(".uk")) return "Reino Unido";
  return "Estados Unidos";
}

// Styled store badge
function StoreBadge({ name, type }: { name: string; type: string }) {
  const k = name.toLowerCase();
  let colorClass = "bg-[#F1F5F9] dark:bg-white/[0.06] text-[#64748B] dark:text-[#94A3B8]";
  if (k === "ebay") colorClass = "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400";
  else if (k.startsWith("amazon")) colorClass = "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400";
  else if (k === "reverb") colorClass = "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400";
  else if (k === "adorama") colorClass = "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400";
  else if (k === "b&h" || k === "b&h photo") colorClass = "bg-gray-800 text-white";
  else if (k === "thomann") colorClass = "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400";
  else if (k === "mercadolibre") colorClass = "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500";
  else if (k === "falabella") colorClass = "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400";
  else if (k === "alkosto") colorClass = "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400";
  else if (type === "local") colorClass = "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";

  return (
    <span className={cn("px-2 py-0.5 rounded-md text-xs font-semibold capitalize", colorClass)}>
      {name}
    </span>
  );
}

export function OtherOffersTable({
  offers,
  title,
  subtitle,
  emptyMessage,
  bestLocalPriceCop,
  exchangeRateCopUsd = 4100,
  startIndex = 4,
}: OtherOffersTableProps) {
  if (offers.length === 0) {
    if (!emptyMessage) return null;
    return (
      <div>
        <div className="mb-1">
          <h3 className="text-base font-bold text-[#0F172A] dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{subtitle}</p>}
        </div>
        <div className="mt-4 rounded-2xl border border-dashed border-[#E2E8F0] dark:border-[#26262B] bg-white dark:bg-[#111113] px-6 py-8 text-center">
          <span className="text-2xl">🏪</span>
          <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-1">
        <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Table */}
      <div className="mt-4 rounded-2xl border border-[#E2E8F0] dark:border-[#26262B] overflow-hidden bg-white dark:bg-[#111113]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] dark:border-[#26262B] bg-[#F8FAFC] dark:bg-white/[0.02]">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] w-10">
                #
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">
                Tienda
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] hidden sm:table-cell">
                Origen
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">
                Precio total puesto en casa
              </th>
              {bestLocalPriceCop != null && bestLocalPriceCop > 0 && (
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] hidden md:table-cell">
                  VS Mejor local
                  <span className="block font-normal text-[#CBD5E1] dark:text-[#3F3F46]">
                    ({formatCop(bestLocalPriceCop)})
                  </span>
                </th>
              )}
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] hidden lg:table-cell">
                Entrega estimada
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">
                Ver detalle
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#1C1C1E]">
            {offers.map((offer, index) => {
              const isImported = offer.type === "imported";
              const imp = isImported ? (offer as ImportedOffer) : null;
              const loc = !isImported ? (offer as LocalStoreOffer) : null;
              const label = isImported ? imp!.marketplace : loc!.store;
              const url = isImported ? imp!.productUrl : loc!.url;
              const diff =
                bestLocalPriceCop != null && bestLocalPriceCop > 0
                  ? offer.totalPriceCop - bestLocalPriceCop
                  : null;
              const diffPct =
                diff != null && bestLocalPriceCop != null && bestLocalPriceCop > 0
                  ? (diff / bestLocalPriceCop) * 100
                  : null;
              const rowNum = startIndex + index;

              return (
                <tr
                  key={url || `offer-${index}`}
                  className="hover:bg-[#F8FAFC] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3.5 text-xs font-bold text-[#94A3B8] tabular-nums">
                    {rowNum}
                  </td>
                  <td className="px-4 py-3.5">
                    <StoreBadge name={label} type={offer.type} />
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                      <span>{originFlag(label)}</span>
                      <span>{originCountry(label, offer.type)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums font-bold text-[#0F172A] dark:text-white text-sm">
                    {formatCop(offer.totalPriceCop)}
                  </td>
                  {bestLocalPriceCop != null && bestLocalPriceCop > 0 && (
                    <td className="px-4 py-3.5 text-right tabular-nums hidden md:table-cell">
                      {diff != null && diffPct != null && (
                        diff <= 0 ? (
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Ahorra {formatCop(Math.abs(diff))} ({Math.abs(diffPct).toFixed(0)}%)
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                            {formatCop(diff)} más caro<br />
                            <span className="text-[10px] font-medium">({diffPct.toFixed(0)}% más)</span>
                          </span>
                        )
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3.5 text-xs text-[#94A3B8] hidden lg:table-cell">
                    {isImported ? "10–18 días hábiles" : "2–4 días hábiles"}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
                      >
                        Ver detalle &rsaquo;
                      </a>
                    ) : (
                      <span className="text-xs text-[#94A3B8]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer disclaimer */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <p className="text-[11px] text-[#94A3B8]">
          ⓘ Los precios pueden variar según la disponibilidad, tipo de cambio y políticas de cada tienda.
        </p>
        <p className="text-[11px] text-[#94A3B8] tabular-nums">
          COP/USD: {exchangeRateCopUsd.toLocaleString("es-CO")}
        </p>
      </div>
    </div>
  );
}
