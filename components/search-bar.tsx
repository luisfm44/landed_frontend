"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

interface SearchBarProps {
  /** Controlled value — if provided, the parent owns the query state */
  value?: string;
  onChange?: (q: string) => void;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  isLoading = false,
}: SearchBarProps) {
  const t = useTranslations("search");

  // Support both controlled (value + onChange) and uncontrolled usage
  const isControlled = value !== undefined;
  const query = isControlled ? value : "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) onChange(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && onSearch) onSearch(trimmed);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="group flex w-full max-w-2xl items-center gap-2 bg-white dark:bg-[#111113] border border-[#E2E8F0] dark:border-[#26262B] rounded-2xl p-2 shadow-[0_4px_24px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-200 focus-within:shadow-[0_4px_32px_rgba(37,99,235,0.12)] dark:focus-within:shadow-[0_4px_32px_rgba(37,99,235,0.2)] focus-within:border-[#2563EB]/30 dark:focus-within:border-[#2563EB]/40"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8] pointer-events-none transition-colors duration-200 group-focus-within:text-[#2563EB]" />
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={t("placeholder")}
          className="w-full pl-11 h-12 text-[15px] bg-transparent border-0 outline-none focus:ring-0 text-[#0F172A] dark:text-white placeholder-[#94A3B8]"
          disabled={isLoading}
          aria-label={t("ariaLabel")}
        />
      </div>
      <button
        type="submit"
        className="h-12 px-6 rounded-xl text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:scale-[1.02] transition-all duration-150 active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none shrink-0"
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? t("searching") : t("button")}
      </button>
    </form>
  );
}
