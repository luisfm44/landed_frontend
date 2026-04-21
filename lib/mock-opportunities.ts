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
      reason: "Ahorro de $1.520.000 COP vs precio típico en Colombia",
      opportunityLevel: "rare",
      opportunityLabel: "Precio excepcional",
      dealScore: 12,
      importScenarios: [
        { method: "locker", totalCop: 6300000, available: true },
      ],
      bestLocal: { store: "Colombia", priceCop: 7612000 },
      savingsVsLocal: 1312000,
      marketSnapshot: {
        minPrice: 7390000,
        maxPrice: 8290000,
        medianPrice: 7820000,
        sources: 6,
        confidence: "high",
        offers: [
          { source: "Mercado Libre", priceCop: 7899000 },
          { source: "KTronix", priceCop: 8199000 },
          { source: "Audio Boutique", priceCop: 7590000 },
          { source: "Falabella", priceCop: 7999000 },
        ],
      },
    },
  },
  {
    title: "KEF R3 Meta Walnut Pair Bookshelf Speakers — Excellent",
    priceUsd: 1499,
    externalUrl: "https://www.ebay.com/itm/kef-r3-meta-walnut",
    marketplace: "ebay",
    decision: {
      recommended: "import_locker",
      reason: "Ahorro de $312.000 COP vs precio típico en Colombia",
      opportunityLevel: "good",
      opportunityLabel: "Buen precio",
      dealScore: 48,
      importScenarios: [
        { method: "locker", totalCop: 7508000, available: true },
      ],
      bestLocal: { store: "Colombia", priceCop: 7612000 },
      savingsVsLocal: 82000,
      marketSnapshot: {
        minPrice: 7390000,
        maxPrice: 8290000,
        medianPrice: 7820000,
        sources: 6,
        confidence: "high",
        offers: [
          { source: "Mercado Libre", priceCop: 7899000 },
          { source: "KTronix", priceCop: 8199000 },
          { source: "Audio Boutique", priceCop: 7590000 },
          { source: "Falabella", priceCop: 7999000 },
        ],
      },
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
      opportunityLevel: "good",
      opportunityLabel: "Buena oportunidad",
      dealScore: 31,
      importScenarios: [
        { method: "direct", totalCop: 5100000, available: true },
        { method: "locker", totalCop: 5600000, available: true },
      ],
      bestLocal: { store: "Colombia", priceCop: 7150000 },
      savingsVsLocal: 2050000,
      warnings: ["Precio de referencia con baja dispersión histórica"],
      marketSnapshot: {
        minPrice: 6990000,
        maxPrice: 7550000,
        medianPrice: 7240000,
        sources: 3,
        confidence: "medium",
        offers: [
          { source: "Mercado Libre", priceCop: 7299000 },
          { source: "Sonovista", priceCop: 7190000 },
        ],
      },
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
      warnings: ["Verifica estado y garantía antes de importar"],
    },
  },
  {
    title: "Cambridge Audio CXA81 Integrated Amplifier",
    priceUsd: 920,
    externalUrl: "https://www.usaudiomart.com",
    marketplace: "usaudiomart",
    decision: {
      recommended: "not_recommended",
      reason: "Diferencia mínima frente al mercado local",
      importScenarios: [
        { method: "direct", totalCop: 4630000, available: true },
      ],
      bestLocal: { store: "Colombia", priceCop: 4700000 },
      savingsVsLocal: 70000,
      warnings: ["Posibles costos postventa no incluidos"],
      marketSnapshot: {
        minPrice: 4490000,
        maxPrice: 4890000,
        medianPrice: 4680000,
        sources: 2,
        confidence: "low",
        offers: [
          { source: "Mercado Libre", priceCop: 4690000 },
          { source: "Hi-Fi Colombia", priceCop: 4750000 },
        ],
      },
    },
  },
];
