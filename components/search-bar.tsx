"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const t = useTranslations("search");
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && onSearch) {
      onSearch(trimmed);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl items-center gap-3 shadow-lg rounded-2xl bg-white border border-gray-200 p-2"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          className="w-full pl-10 h-12 text-sm bg-transparent border-0 outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
          disabled={isLoading}
          aria-label={t("ariaLabel")}
        />
      </div>
      <button
        type="submit"
        className="h-12 px-6 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:scale-[1.02] transition-all duration-150 active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none shrink-0"
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? t("searching") : t("button")}
      </button>
    </form>
  );
}
