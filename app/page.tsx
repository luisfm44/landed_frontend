"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/components/search-bar";
import { OpportunityCard } from "@/components/opportunity-card";
import { Opportunity } from "@/types/opportunity";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export default function Home() {
  const t = useTranslations("home");
  const tMock = useTranslations("mockData");

  const MOCK_OPPORTUNITIES: Opportunity[] = [
    {
      title: "KEF R3 Meta Bookshelf Speakers (Titanium Grey) — Near Mint",
      price: 1199,
      landedPrice: 1540,
      savingsPercentage: 0.32,
      score: 82,
      type: "fixed",
      externalUrl: "https://reverb.com",
      marketplace: "reverb",
      shippingMethod: "locker",
      listingsCount: 3,
      worthImporting: true,
      isTopDeal: true,
      explanation: [tMock("kef.exp0"), tMock("kef.exp1")],
    },
    {
      title: "Technics SL-1200MK2 Direct Drive Turntable — Excellent",
      price: 680,
      landedPrice: 920,
      savingsPercentage: 0.41,
      score: 91,
      type: "auction",
      externalUrl: "https://ebay.com",
      marketplace: "ebay",
      shippingMethod: "locker",
      listingsCount: 5,
      worthImporting: true,
      isTopDeal: true,
      auctionEndsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      currentBid: 620,
      estimatedFinalPrice: 750,
      explanation: [tMock("technics.exp0"), tMock("technics.exp1")],
    },
    {
      title: "McIntosh MA352 Hybrid Integrated Amplifier",
      price: 3800,
      landedPrice: 4850,
      savingsPercentage: 0.28,
      score: 76,
      type: "fixed",
      externalUrl: "https://reverb.com",
      marketplace: "reverb",
      shippingMethod: "direct",
      listingsCount: 1,
      worthImporting: true,
      isTopDeal: true,
      explanation: [tMock("mcintosh.exp0")],
    },
    {
      title: "Focal Aria 906 Bookshelf Speakers — Very Good",
      price: 850,
      landedPrice: 1220,
      savingsPercentage: 0.08,
      score: 42,
      type: "fixed",
      externalUrl: "https://audiogon.com",
      marketplace: "audiogon",
      shippingMethod: "direct",
      listingsCount: 2,
      worthImporting: false,
      isTopDeal: false,
      explanation: [tMock("focal.exp0"), tMock("focal.exp1")],
    },
    {
      title: "Denon PMA-1700NE Integrated Amplifier — Mint",
      price: 1400,
      landedPrice: 1840,
      savingsPercentage: 0.24,
      score: 68,
      type: "fixed",
      externalUrl: "https://ebay.com",
      marketplace: "ebay",
      shippingMethod: "locker",
      listingsCount: 2,
      worthImporting: true,
      isTopDeal: false,
      explanation: [tMock("denon.exp0"), tMock("denon.exp1")],
    },
  ];

  const topDeals = MOCK_OPPORTUNITIES.filter((o) => o.isTopDeal);
  const otherOpportunities = MOCK_OPPORTUNITIES.filter((o) => !o.isTopDeal);

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Opportunity[] | null>(null);

  // One observer per scrollable section — each fires independently as user scrolls
  const topDealsReveal = useReveal();
  const allOppsReveal = useReveal();

  async function handleSearch(q: string) {
    setIsSearching(true);
    setQuery(q);
    await new Promise((r) => setTimeout(r, 500));
    setResults(MOCK_OPPORTUNITIES);
    setIsSearching(false);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      {/* ── Hero ─────────────────────────────────────────────── */}
      {/*
        min-h-[80vh]: hero fills most of the viewport so deals appear "below the fold",
        creating a clear two-act UX: understand → search → browse.
        Overflow-hidden clips the gradient overlay to the section boundary.
      */}
      <section className="relative py-24 flex flex-col items-center text-center overflow-hidden">
        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
            {t("hero.titlePrefix")}
            <br className="hidden sm:block" />
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {t("hero.titleGradient")}
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Search — the only CTA in the viewport. No competing buttons. */}
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          </div>

          {/*
            Trust text directly under the search bar (not above it).
            Close proximity to the input answers the hesitation moment:
            "what does this actually calculate?" — answered before they click.
          */}
          <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            {t("hero.trust")}
          </p>

          <p className="mt-10 text-xs text-gray-400 dark:text-gray-500">
            <span className="font-medium text-gray-600 dark:text-gray-400">
              {t("hero.affiliateFree")}
            </span>
            {" "}{t("hero.affiliateDisclosure")}
          </p>
        </div>
      </section>

      {/* ── Real Example Section ────────────────────────────── */}
      <section className="py-16 sm:py-20">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold mb-4 ring-1 ring-success/20">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {t("example.pill")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t("example.heading")}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2.5 max-w-md mx-auto leading-relaxed">
            {t("example.subheading")}
          </p>
        </div>

        {/* Comparison card */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-[#26262B] rounded-2xl shadow-md overflow-hidden">

            {/* Product header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-[#26262B] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                {/* Speaker icon */}
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-4-4m4 4l4-4M9 9H6a2 2 0 00-2 2v2a2 2 0 002 2h3" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  {t("example.pill")}
                </p>
                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                  {t("example.product")}
                </h3>
              </div>
            </div>

            {/* Price comparison — two columns */}
            <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-[#26262B]">
              {/* Local (Colombia) */}
              <div className="px-6 py-6">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                  {t("example.localLabel")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                  $12.9M
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                  {t("example.localSource")}
                </p>
              </div>

              {/* Imported — winner */}
              <div className="px-6 py-6 bg-success/5 dark:bg-success/8 relative">
                <span className="absolute top-3 right-3 text-[9px] font-bold text-success bg-success/15 dark:bg-success/20 px-2 py-0.5 rounded-full ring-1 ring-success/20 leading-none">
                  {t("example.bestOption")}
                </span>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                  {t("example.importLabel")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-success tabular-nums">
                  $8.7M
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                  {t("example.importSource")}
                </p>
              </div>
            </div>

            {/* Savings banner */}
            <div className="flex items-center justify-between px-6 py-4 bg-success text-white">
              <div className="flex items-center gap-2">
                {/* TrendingDown */}
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 17l5 5m0 0l-5-5m5 5V6M6 13l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span className="text-sm font-semibold">{t("example.youSave")}</span>
              </div>
              <span className="text-xl font-bold tabular-nums">{t("example.savingsPct")}</span>
            </div>

            {/* Recommendation text */}
            <div className="px-6 py-5 flex items-start gap-3">
              <svg className="w-4 h-4 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t("example.recoBold")}
                </span>
                {" "}
                {t("example.recoDetail")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works — 3 steps ──────────────────────────── */}
      {/* Static section — always visible. Builds trust before deals appear. */}
      <section className="py-16 sm:py-20 border-t border-gray-200 dark:border-[#26262B]">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t("howItWorks.heading")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { num: "01", titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc" },
            { num: "02", titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc" },
            { num: "03", titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc" },
          ].map(({ num, titleKey, descKey }) => (
            <div key={num} className="flex flex-col gap-3">
              {/* Step number — large, muted; acts as visual anchor without competing with text */}
              <span className="text-4xl font-black text-gray-200 dark:text-gray-700 leading-none select-none">
                {num}
              </span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {t(titleKey as Parameters<typeof t>[0])}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t(descKey as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>
      </section>

      {results !== null ? (
        <section className="pb-20">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-widest">
              {t("results.forQuery", { query })}
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {t("results.found", { count: results.length })}
            </span>
          </div>
          {isSearching ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((opp, i) => (
                <OpportunityCard key={i} opportunity={opp} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* ── Top Deals ────────────────────────────────────── */}
          <section className="pb-12">
            {/* ref on inner div — section elements need HTMLDivElement-typed ref */}
            <div ref={topDealsReveal.ref}>
              {/* Heading fades in first (no delay); cards stagger behind */}
              <div
                className={cn(
                  "mb-8 transition-all duration-500 ease-out",
                  topDealsReveal.visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                )}
              >
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {t("topDeals.heading")}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">
                  {t("topDeals.subheading")}
                </p>
              </div>
              {/* gap-8: more breathing room for featured deals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {topDeals.map((opp, i) => (
                  // Each card has a stagger delay based on index — 120ms apart.
                  // blur-sm initial state is below the fold so never visible pre-JS.
                  <div
                    key={i}
                    className={cn(
                      "transition-all duration-700 ease-out",
                      topDealsReveal.visible
                        ? "opacity-100 translate-y-0 blur-none"
                        : "opacity-0 translate-y-8 blur-sm"
                    )}
                    style={{
                      transitionDelay: topDealsReveal.visible ? `${i * 120 + 150}ms` : "0ms",
                    }}
                  >
                    <OpportunityCard opportunity={opp} />
                  </div>
                ))}
              </div>
            </div>
          </section>


          {/* ── All Opportunities ────────────────────────────── */}
          <section className="pb-20">
            <div ref={allOppsReveal.ref}>
              {/* Section header fades in immediately; cards stagger with 100ms spacing */}
              <div
                className={cn(
                  "border-t border-gray-200 dark:border-[#26262B] pt-10 mb-8",
                  "transition-all duration-500 ease-out",
                  allOppsReveal.visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                )}
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
                      {t("results.heading")}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t("results.subheading")}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                    {t("results.found", { count: otherOpportunities.length })}
                  </span>
                </div>
              </div>
              {/* gap-5: tighter grid for secondary listings — clear visual tier below top deals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherOpportunities.map((opp, i) => (
                  // 100ms stagger — tighter than top deals for a denser, secondary feel
                  <div
                    key={i}
                    className={cn(
                      "transition-all duration-700 ease-out",
                      allOppsReveal.visible
                        ? "opacity-100 translate-y-0 blur-none"
                        : "opacity-0 translate-y-8 blur-sm"
                    )}
                    style={{
                      transitionDelay: allOppsReveal.visible ? `${i * 100 + 150}ms` : "0ms",
                    }}
                  >
                    <OpportunityCard opportunity={opp} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Value Proposition ──────────────────────────────── */}
          {/* Final conversion layer before page ends — answers "why trust Landed?" */}
          <section className="py-16 sm:py-20 border-t border-gray-200 dark:border-[#26262B]">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {t("valueProp.heading")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { titleKey: "valueProp.item1Title", descKey: "valueProp.item1Desc" },
                { titleKey: "valueProp.item2Title", descKey: "valueProp.item2Desc" },
                { titleKey: "valueProp.item3Title", descKey: "valueProp.item3Desc" },
              ].map(({ titleKey, descKey }) => (
                <div key={titleKey} className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-[#26262B] rounded-xl p-6 shadow-md">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                    {t(titleKey as Parameters<typeof t>[0])}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t(descKey as Parameters<typeof t>[0])}
                  </p>
                </div>
              ))}
            </div>
            {/* Final CTA — scroll-anchor for users who read all the way down */}
            <div className="text-center mt-10">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-[0_0_16px_rgba(37,99,235,0.35)] transition-all duration-200"
              >
                {t("valueProp.cta")}
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border bg-card h-72 animate-pulse" />
      ))}
    </div>
  );
}
