"use client";

import { SearchResultPayload } from "@/lib/api";
import { WinnerBanner } from "@/components/winner-banner";
import { TopImported } from "@/components/top-imported";
import { TopLocal } from "@/components/top-local";
import { OtherOffersTable } from "@/components/other-offers-table";

interface SearchResultsLayoutProps {
  data: SearchResultPayload;
}

export function SearchResultsLayout({ data }: SearchResultsLayoutProps) {
  const { winner, topImported, topLocal, otherOffers } = data;

  const bestLocalPriceCop = winner?.bestLocalPriceCop ?? topLocal[0]?.priceCop;
  const bestImportedTotalCop = winner?.bestImportedTotalCop ?? topImported[0]?.totalPriceCop;

  return (
    <div className="space-y-10">
      {winner && <WinnerBanner winner={winner} />}
      {topImported.length > 0 && (
        <TopImported offers={topImported} bestLocalPriceCop={bestLocalPriceCop} />
      )}
      {topLocal.length > 0 && (
        <TopLocal offers={topLocal} bestImportedTotalCop={bestImportedTotalCop} />
      )}
      {otherOffers.length > 0 && (
        <OtherOffersTable
          offers={otherOffers}
          bestLocalPriceCop={bestLocalPriceCop}
        />
      )}
    </div>
  );
}
