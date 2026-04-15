"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Opportunity } from "@/types/opportunity";
import { markWinner } from "@/lib/score";

/**
 * useSearch — Landed's search orchestrator.
 *
 * Responsibilities:
 *  - Sync query ↔ URL (?q=...) so results survive refresh and are shareable
 *  - Debounce rapid keystrokes (300 ms default) before firing
 *  - Smooth-scroll to the results section after search
 *  - Keep loading / error / results state
 *  - Accept an optional `fetcher` so callers can swap mock ↔ real API
 *
 * Usage:
 *   const { query, setQuery, results, isLoading, error, search } = useSearch();
 */

export type SearchFetcher = (q: string) => Promise<Opportunity[]>;

/** Default fetcher: mock data with artificial delay. Replace with real API call. */
async function defaultFetcher(q: string): Promise<Opportunity[]> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 600));

  // TODO: replace with `fetch(`/api/search?q=${encodeURIComponent(q)}`)` etc.
  const { MOCK_OPPORTUNITIES } = await import("@/lib/mock-opportunities");
  return MOCK_OPPORTUNITIES.filter(
    (o) =>
      o.title.toLowerCase().includes(q.toLowerCase()) ||
      (o.marketplace ?? "").toLowerCase().includes(q.toLowerCase())
  );
}

interface UseSearchOptions {
  /** Custom fetcher — swap in real API endpoint here. */
  fetcher?: SearchFetcher;
  /** Debounce delay in ms (0 = off, fire on explicit search() call only). */
  debounceMs?: number;
  /** CSS selector or element id to scroll to after search completes. */
  resultsAnchor?: string;
}

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: Opportunity[] | null;
  isLoading: boolean;
  error: string | null;
  /** Imperatively fire a search (used by button click / Enter). */
  search: (q?: string) => void;
  /** Clear results and reset state. */
  reset: () => void;
}

export function useSearch({
  fetcher = defaultFetcher,
  debounceMs = 0,
  resultsAnchor = "#results",
}: UseSearchOptions = {}): UseSearchReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQueryRaw] = useState<string>(
    () => searchParams.get("q") ?? ""
  );
  const [results, setResults] = useState<Opportunity[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track current request so stale responses are discarded
  const requestId = useRef(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setQuery = useCallback((q: string) => {
    setQueryRaw(q);
  }, []);

  const scrollToResults = useCallback(() => {
    const el = document.querySelector(resultsAnchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [resultsAnchor]);

  const executeSearch = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;

      // Update URL without full navigation
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", trimmed);
      router.replace(`?${params.toString()}`, { scroll: false });

      const id = ++requestId.current;
      setIsLoading(true);
      setError(null);

      try {
        const raw = await fetcher(trimmed);
        if (id !== requestId.current) return; // stale — discard
        const ranked = markWinner(raw);
        setResults(ranked);
        // Small delay so the results section renders before we scroll
        setTimeout(scrollToResults, 80);
      } catch (err) {
        if (id !== requestId.current) return;
        setError(
          err instanceof Error ? err.message : "Error al buscar. Intenta de nuevo."
        );
      } finally {
        if (id === requestId.current) setIsLoading(false);
      }
    },
    [fetcher, router, searchParams, scrollToResults]
  );

  /** Public: trigger search explicitly (button / Enter). */
  const search = useCallback(
    (q?: string) => {
      const target = q ?? query;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      executeSearch(target);
    },
    [query, executeSearch]
  );

  /** Auto-search when query changes, if debounce is enabled. */
  useEffect(() => {
    if (debounceMs <= 0) return;
    if (!query.trim()) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => executeSearch(query), debounceMs);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, debounceMs, executeSearch]);

  /** Run initial search if URL already has ?q= (e.g. shared link) */
  useEffect(() => {
    const initial = searchParams.get("q");
    if (initial) {
      setQueryRaw(initial);
      executeSearch(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  const reset = useCallback(() => {
    requestId.current++;
    setResults(null);
    setError(null);
    setIsLoading(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return { query, setQuery, results, isLoading, error, search, reset };
}
