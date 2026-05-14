"use client";

import { SearchResultPayload } from "@/lib/api";
import { WinnerBanner } from "@/components/winner-banner";
import { TopImported } from "@/components/top-imported";
import { TopLocal } from "@/components/top-local";
import { OtherOffersTable } from "@/components/other-offers-table";

interface SearchResultsLayoutProps {
  data: SearchResultPayload;
  query?: string;
}

export function SearchResultsLayout({ data, query }: SearchResultsLayoutProps) {
  const { winner, topImported, topLocal, otherOffers, productImageUrl } = data;

  const bestLocalPriceCop = winner?.bestLocalPriceCop ?? topLocal[0]?.priceCop;
  const bestImportedTotalCop = winner?.bestImportedTotalCop ?? topImported[0]?.totalPriceCop;

  const otherImported = otherOffers.filter((o) => o.type === "imported");
  const otherLocal = otherOffers.filter((o) => o.type === "local");

  return (
    <div className="space-y-10">
      {winner && (
        <WinnerBanner
          winner={winner}
          productImageUrl={productImageUrl}
          productName={query}
        />
      )}
      {topImported.length > 0 && (
        <TopImported
          offers={topImported}
          bestLocalPriceCop={bestLocalPriceCop}
        />
      )}
      {/* Always render TopLocal — shows empty state when no offers */}
      <TopLocal
        offers={topLocal}
        bestImportedTotalCop={bestImportedTotalCop}
        productImageUrl={productImageUrl}
      />
      {otherImported.length > 0 && (
        <OtherOffersTable
          offers={otherImported}
          title="3. Más opciones importadas"
          subtitle="Precios totales puesto en Colombia (producto + envío + impuestos), ordenados de menor a mayor"
          bestLocalPriceCop={bestLocalPriceCop}
          startIndex={topImported.length + 1}
        />
      )}
      <OtherOffersTable
        offers={otherLocal}
        title="4. Más opciones locales"
        subtitle="Precios en tienda en Colombia, ordenados de menor a mayor"
        emptyMessage="No encontramos más tiendas locales con este producto disponible."
        startIndex={topLocal.length + 1}
      />
    </div>
  );
}
