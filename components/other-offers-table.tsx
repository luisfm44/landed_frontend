"use client";

import { useState } from "react";
import { AnyOffer, ImportedOffer, LocalStoreOffer } from "@/lib/api";
import { cn } from "@/lib/utils";

interface OtherOffersTableProps {
  offers: AnyOffer[];
  bestLocalPriceCop?: number;
  exchangeRateCopUsd?: number;
}

type TabFilter = "all" | "imported" | "local";

function formatCop(amount: number): string {
  return `$${amount.toLocaleString("es-CO")} COP`;
}

function formatDiff(diff: number): string {
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${formatCop(Math.abs(diff))}`;
}

export function OtherOffersTable({
  offers,
  bestLocalPriceCop,
  exchangeRateCopUsd = 4100,
}: OtherOffersTableProps) {
  const [tab, setTab] = useState<TabFilter>("all");

  if (offers.length === 0) return null;

  const filtered =
    tab === "all" ? offers : offers.filter((o) => o.type === tab);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#0F172A] dark:text-white">
          3. Más ofertas disponibles
        </h3>
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-[#F1F5F9] dark:bg-white/[0.06] text-xs font-medium">
          {(["all", "imported", "local"] as TabFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1 rounded-md transition-colors",
                tab === t
                  ? "bg-white dark:bg-[#1E1E20] text-[#0F172A] dark:text-white shadow-sm"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white",
              )}
            >
              {t === "all" ? "Todos" : t === "imported" ? "Importados" : "Locales"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#E2E8F0] dark:border-[#26262B] overflow-hidden bg-white dark:bg-[#111113]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] dark:border-[#26262B] bg-[#F8FAFC] dark:bg-white/[0.02]">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] w-8">
                #
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">
                Tienda
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] hidden sm:table-cell">
                Origen
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">
                Precio total
              </th>
              {bestLocalPriceCop != null && bestLocalPriceCop > 0 && (
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] hidden md:table-cell">
                  vs Mejor local
                </th>
              )}
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] hidden lg:table-cell">
                Entrega
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">
                Detalle
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#1C1C1E]">
            {filtered.map((offer, index) => {
              const isImported = offer.type === "imported";
              const imp = isImported ? (offer as ImportedOffer) : null;
              const loc = !isImported ? (offer as LocalStoreOffer) : null;
              const label = isImported ? imp!.marketplace : loc!.store;
              const url = isImported ? imp!.productUrl : loc!.url;
              const diff =
                bestLocalPriceCop != null && bestLocalPriceCop > 0
                  ? offer.totalPriceCop - bestLocalPriceCop
                  : null;

              return (
                <tr
                  key={url || `offer-${index}`}
                  className="hover:bg-[#F8FAFC] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-medium text-[#94A3B8] tabular-nums">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[#0F172A] dark:text-white capitalize">
                      {label}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-medium",
                        isImported
                          ? "bg-blue-50 dark:bg-blue-500/[0.08] text-blue-700 dark:text-blue-400"
                          : "bg-emerald-50 dark:bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-400",
                      )}
                    >
                      {isImported ? "🌎 Importado" : "🇨🇴 Local"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-[#0F172A] dark:text-white text-sm">
                    {formatCop(offer.totalPriceCop)}
                  </td>
                  {bestLocalPriceCop != null && bestLocalPriceCop > 0 && (
                    <td className="px-4 py-3 text-right tabular-nums text-xs font-medium hidden md:table-cell">
                      {diff != null && (
                        <span
                          className={diff <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
                        >
                          {diff <= 0 ? formatDiff(diff) : `+${formatCop(Math.abs(diff))}`}
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 text-xs text-[#94A3B8] hidden lg:table-cell">
                    {isImported ? "10–20 días" : "Inmediata"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#2563EB] hover:underline"
                      >
                        Ver detalle &gt;
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
      <p className="mt-3 text-[11px] text-[#94A3B8] leading-relaxed">
        * Precios en COP incluyen arancel + IVA para importados. Tasa de referencia:{" "}
        <span className="tabular-nums">$1 USD ≈ {exchangeRateCopUsd.toLocaleString("es-CO")} COP</span>.
        Verifica precios antes de comprar.
      </p>
    </div>
  );
}
