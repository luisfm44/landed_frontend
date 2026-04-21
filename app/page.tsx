"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/components/search-bar";
import { DecisionCard } from "@/components/decision-card";
import { OpportunityGridSkeleton } from "@/components/opportunity-card-skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useSearch } from "@/hooks/use-search";
import { compareFetcher } from "@/lib/api";
import { TopDeals } from "@/components/top-deals";
import { MOCK_OPPORTUNITIES } from "@/lib/mock-opportunities";

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

  const { query, setQuery, results, isLoading: isSearching, error, search } = useSearch({
    fetcher: compareFetcher,
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

      {/* 3. TOP DEALS FEED */}
      <section className="bg-[#FAFAFA] dark:bg-[#0B0B0C] py-20 border-t border-[#E2E8F0] dark:border-[#1F1F23]">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <p className="text-[11px] font-bold text-[#2563EB] uppercase tracking-[0.18em] mb-3">
              En este momento
            </p>
            <TopDeals opportunities={MOCK_OPPORTUNITIES} />
          </motion.div>
        </div>
      </section>

      {/* 4. COMPARACIÓN EN VIVO */}
      <section className="bg-white dark:bg-[#0B0B0C] py-24 border-t border-[#E2E8F0] dark:border-[#1F1F23]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-12"
          >
            <p className="text-[11px] font-bold text-[#2563EB] uppercase tracking-[0.18em] mb-3">
              Ejemplo real
            </p>
            <h2 className="text-[28px] font-semibold tracking-[-0.01em] text-[#0F172A] dark:text-white">
              Así se ve una comparación
            </h2>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-2">
              KEF R3 Meta — encontrado en eBay · Near Mint
            </p>
          </motion.div>

          <motion.div
            variants={cardContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-[1fr_48px_1fr] items-stretch gap-0"
          >
            {/* ── IMPORTAR (winner) ─────────────────────────────── */}
            <motion.div
              variants={fadeUp}
              className="relative p-6 rounded-2xl md:rounded-r-none bg-white dark:bg-[#111113] border-2 border-[#2563EB]/40 dark:border-[#2563EB]/30 shadow-[0_4px_32px_rgba(37,99,235,0.14)] flex flex-col gap-4"
            >
              {/* Winner badge */}
              <div className="absolute top-4 right-4 bg-[#2563EB] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide shadow-sm">
                Mejor opción
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">✓ Importar</p>
                <p className="text-2xl font-semibold text-[#0F172A] dark:text-white tabular-nums tracking-[-0.01em] mt-1">
                  $6.314.000 COP
                </p>
                <p className="text-xs text-[#94A3B8] mt-0.5">~$1.540 USD total</p>
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Precio origen (eBay)</span>
                  <span className="tabular-nums font-medium text-[#0F172A] dark:text-[#F5F5F7]">$4.919.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Envío al casillero</span>
                  <span className="tabular-nums font-medium text-[#0F172A] dark:text-[#F5F5F7]">+$246.000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Arancel + IVA</span>
                  <span className="tabular-nums font-medium text-[#0F172A] dark:text-[#F5F5F7]">+$1.149.000</span>
                </div>
              </div>

              {/* Savings callout */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.08] border border-emerald-200 dark:border-emerald-500/20">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  Ahorras $2.969.000 (32%) vs comprar local
                </p>
              </div>

              <p className="text-sm font-medium text-[#2563EB] dark:text-blue-400 -mb-1">
                💡 Landed recomienda importar
              </p>

              <a
                href="https://www.ebay.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-150"
              >
                Ver en eBay
              </a>
            </motion.div>

            {/* ── VS divider ───────────────────────────────────── */}
            <div className="hidden md:flex items-center justify-center">
              <span className="text-[11px] font-black text-[#94A3B8] dark:text-[#3F3F46] uppercase tracking-[0.25em] select-none writing-mode-vertical rotate-0">
                VS
              </span>
            </div>
            <div className="flex md:hidden items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-[#26262B]" />
              <span className="text-[11px] font-black text-[#94A3B8] dark:text-[#3F3F46] uppercase tracking-[0.25em] select-none">VS</span>
              <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-[#26262B]" />
            </div>

            {/* ── COMPRAR LOCAL (loser) ─────────────────────────── */}
            <motion.div
              variants={fadeUp}
              className="p-6 rounded-2xl md:rounded-l-none bg-[#FAFAFA] dark:bg-[#0D0D0F] border border-[#E2E8F0] dark:border-[#26262B] opacity-90 flex flex-col gap-4"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Comprar en Colombia</p>
                <p className="text-2xl font-semibold text-[#64748B] dark:text-[#71717A] tabular-nums tracking-[-0.01em] mt-1 line-through decoration-[#CBD5E1] dark:decoration-[#3F3F46]">
                  $9.283.000 COP
                </p>
                <p className="text-xs text-[#94A3B8] mt-0.5">precio en tiendas locales</p>
              </div>

              <div className="space-y-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                <p className="flex items-start gap-2"><span className="text-[#CBD5E1] dark:text-[#3F3F46] mt-0.5">—</span>Precio inflado por distribución e importación local</p>
                <p className="flex items-start gap-2"><span className="text-[#CBD5E1] dark:text-[#3F3F46] mt-0.5">—</span>Menor disponibilidad de unidades</p>
                <p className="flex items-start gap-2"><span className="text-[#CBD5E1] dark:text-[#3F3F46] mt-0.5">—</span>Menos opciones de condición y color</p>
              </div>

              <p className="text-sm font-medium text-[#94A3B8] dark:text-[#52525B] -mb-1">
                ❌ No recomendado en este caso
              </p>

              <button
                disabled
                className="mt-auto w-full py-3 rounded-xl text-sm font-semibold bg-[#F1F5F9] dark:bg-white/[0.04] text-[#94A3B8] dark:text-[#52525B] cursor-not-allowed select-none"
              >
                Ver tiendas locales
              </button>
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


