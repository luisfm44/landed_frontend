"use client";

import { Suspense, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/components/search-bar";
import { DecisionCard } from "@/components/decision-card";
import { OpportunityGridSkeleton } from "@/components/opportunity-card-skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useSearch } from "@/hooks/use-search";
import { searchProductsFull, type SearchResultPayload } from "@/lib/api";
import { SearchResultsLayout } from "@/components/search-results-layout";

const cardContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function Home() {
  const t = useTranslations("home");

  const [searchResult, setSearchResult] = useState<SearchResultPayload | null>(null);

  const wrappedFetcher = useCallback(
    async (q: string) => {
      const { opportunities, searchResult: sr } = await searchProductsFull(q);
      setSearchResult(sr);
      return opportunities;
    },
    [],
  );

  const { query, setQuery, results, isLoading: isSearching, error, search } = useSearch({
    fetcher: wrappedFetcher,
    resultsAnchor: "#results",
  });

  return (
    <>
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFF] to-[#FAFAFA] dark:from-[#0B0B0C] dark:via-[#0B0B0C] dark:to-[#0B0B0C] py-24 sm:py-36 px-6">
        {/* Glow animado */}
        <motion.div
          initial={{ opacity: 0.4, scale: 0.9 }}
          animate={{ opacity: 0.8, scale: 1.1 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
          className="pointer-events-none absolute top-[-140px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[#2563EB]/[0.14] blur-[160px]"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-[60px] font-semibold tracking-[-0.02em] text-[#0F172A] dark:text-white leading-[1.10]"
          >
            {t("hero.titlePrefix")}
            <br className="hidden sm:block" />
            {" "}<span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">{t("hero.titleGradient")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-5 text-lg text-[#64748B] dark:text-[#94A3B8] max-w-xl mx-auto leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Search — pieza central */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex justify-center"
          >
            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={search}
              isLoading={isSearching}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 text-sm text-[#94A3B8]"
          >
            {t("hero.trust")}
          </motion.p>
        </div>
      </section>

      {/* 2. COMO FUNCIONA */}
      <section className="bg-[#F1F5F9] dark:bg-[#0B0B0C] py-28 border-t border-[#E2E8F0] dark:border-[#1F1F23]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="text-[28px] font-semibold tracking-[-0.01em] text-center text-[#0F172A] dark:text-white"
          >
            {t("howItWorks.heading")}
          </motion.h2>
          <motion.div
            variants={cardContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {[
              { num: "01", titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc",
                badgeBg: "bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] dark:from-blue-500/10 dark:to-blue-500/5",
                badgeText: "text-[#1D4ED8] dark:text-blue-400" },
              { num: "02", titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc",
                badgeBg: "bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] dark:from-purple-500/10 dark:to-purple-500/5",
                badgeText: "text-[#6D28D9] dark:text-purple-400" },
              { num: "03", titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc",
                badgeBg: "bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] dark:from-emerald-500/10 dark:to-emerald-500/5",
                badgeText: "text-[#065F46] dark:text-emerald-400" },
            ].map(({ num, titleKey, descKey, badgeBg, badgeText }) => (
              <motion.div
                key={num}
                variants={fadeUp}
                className="p-7 rounded-2xl bg-white dark:bg-[#111113] border border-[#E2E8F0] dark:border-[#26262B] shadow-sm hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 ease-out"
              >
                <div className={cn("w-14 h-14 flex items-center justify-center rounded-2xl text-xl font-bold tabular-nums select-none shadow-sm", badgeBg, badgeText)}>
                  {num}
                </div>
                <h3 className="mt-5 text-base font-semibold text-[#0F172A] dark:text-white leading-snug">
                  {t(titleKey as Parameters<typeof t>[0])}
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  {t(descKey as Parameters<typeof t>[0])}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. RESULTADO ACTUAL */}
      <section className="bg-white dark:bg-[#0B0B0C] py-24 border-t border-[#E2E8F0] dark:border-[#1F1F23]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-12"
          >
            <h2 className="text-[28px] font-semibold tracking-[-0.01em] text-[#0F172A] dark:text-white">
              Comparamos y decidimos por ti
            </h2>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-2 max-w-xl mx-auto">
              Landed compara el costo final de importar contra comprar local y resalta la opción que más conviene.
            </p>
          </motion.div>

          <motion.div
            variants={cardContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="space-y-10"
          >
            <motion.div
              variants={fadeUp}
              className="overflow-hidden rounded-2xl border border-[#E2E8F0] dark:border-[#26262B] bg-white dark:bg-[#111113] shadow-[0_14px_36px_rgba(15,23,42,0.10)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-[208px_1fr_256px]">
                <div className="bg-[#F8FAFC] dark:bg-white/[0.03] p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E2E8F0] dark:border-[#26262B]">
                  <div className="h-44 w-44 rounded-2xl bg-white dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-[#26262B] flex items-center justify-center">
                    <span className="text-6xl opacity-60">🎧</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                      Producto de audio
                    </h3>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      Comparación de costo final
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["Precio del producto", "Envío internacional", "Impuestos incluidos"].map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-white/[0.06] text-xs font-medium text-[#475569] dark:text-[#94A3B8]"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-500/[0.06] border-t md:border-t-0 md:border-l border-emerald-200 dark:border-emerald-500/20 p-6 flex flex-col justify-center">
                  <span className="self-start px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-[0.12em]">
                    Mejor opción actual
                  </span>
                  <p className="mt-4 text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                    Conviene importar
                  </p>
                  <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Ahorro estimado: $410.000 COP
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] border-t border-[#E2E8F0] dark:border-[#26262B] bg-[#F8FAFC] dark:bg-white/[0.02]">
                <div className="py-4 px-4 sm:px-6 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#64748B] dark:text-[#94A3B8] mb-1">
                    Mejor importado
                  </p>
                  <p className="text-lg font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                    $1.180.000 COP
                  </p>
                </div>
                <div className="flex items-center justify-center px-3">
                  <span className="w-9 h-9 rounded-full bg-white dark:bg-[#111113] border-2 border-[#E2E8F0] dark:border-[#26262B] flex items-center justify-center text-[11px] font-bold text-[#94A3B8]">
                    VS
                  </span>
                </div>
                <div className="py-4 px-4 sm:px-6 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#64748B] dark:text-[#94A3B8] mb-1">
                    Mejor local
                  </p>
                  <p className="text-lg font-bold tabular-nums text-[#0F172A] dark:text-white">
                    $1.590.000 COP
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. RESULTADOS */}
      <section id="results" className="bg-[#FAFAFA] dark:bg-[#0B0B0C] py-24 border-t border-[#E2E8F0] dark:border-[#1F1F23]">
        <div className="max-w-6xl mx-auto px-6">
          {results !== null ? (
            <>
              <div className="flex items-baseline justify-between mb-8">
                <h2 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest">
                  {t("results.forQuery", { query })}
                </h2>
                <span className="text-xs text-[#94A3B8]">
                  {t("results.found", { count: results.length })}
                </span>
              </div>
              {error && (
                <p className="mb-6 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
              <AnimatePresence mode="wait">
                {isSearching ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  >
                    <OpportunityGridSkeleton />
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {searchResult ? (
                      <SearchResultsLayout data={searchResult} query={query} />
                    ) : (
                      <motion.div
                        variants={cardContainer}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {results.map((opp) => (
                          <motion.div key={opp.externalUrl || opp.title} variants={cardItem}>
                            <DecisionCard opportunity={opp} />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4 py-20 text-center"
            >
              <p className="text-4xl select-none">🔍</p>
              <p className="text-base font-medium text-[#0F172A] dark:text-white">
                {t("results.heading")}
              </p>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] max-w-sm">
                {t("results.subheading")}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
