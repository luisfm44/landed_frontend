/**
 * Mock opportunity data — used by the default search fetcher and dev/testing.
 * Shape matches the new DecisionResult-based Opportunity type.
 */

import { Opportunity } from "@/types/opportunity";

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    title: "KEF R3 Meta Bookshelf Speakers — Near Mint",
    priceUsd: 1199,
    externalUrl: "https://www.ebay.com",
    marketplace: "ebay",
    isTopDeal: true,
    decision: {
      recommended: "import_locker",
      reason: "Ahorro de $1.312.000 COP vs precio local",
      importScenarios: [
        { method: "locker", totalCop: 6300000, available: true },
      ],
      bestLocal: { store: "Colombia", priceCop: 7612000 },
      savingsVsLocal: 1312000,
    },
  },
  {
    title: "McIntosh MA352 Hybrid Integrated Amplifier",
    priceUsd: 950,
    externalUrl: "https://www.ebay.com",
    marketplace: "ebay",
    decision: {
      recommended: "import_direct",
      reason: "Ahorro de $2.050.000 COP con envío directo",
      importScenarios: [
        { method: "direct", totalCop: 5100000, available: true },
        { method: "locker", totalCop: 5600000, available: true },
      ],
      bestLocal: { store: "Colombia", priceCop: 7150000 },
      savingsVsLocal: 2050000,
    },
  },
  {
    title: "Focal Utopia Over-Ear Headphones — Open Box",
    priceUsd: 2800,
    externalUrl: "https://www.reverb.com",
    marketplace: "reverb",
    decision: {
      recommended: "buy_local",
      reason: "Más barato en Colombia después de impuestos",
      importScenarios: [
        { method: "locker", totalCop: 18200000, available: true },
      ],
      bestLocal: { store: "Colombia", priceCop: 15900000 },
      savingsVsLocal: -2300000,
    },
  },
];
