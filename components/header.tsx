import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Header() {
  const t = await getTranslations("header");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] dark:border-[#26262B] bg-[#FAFAFA]/90 dark:bg-[#0B0B0C]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center px-6">
        <Link href="/" className="flex items-center gap-2.5 select-none">
          <span className="text-[15px] font-semibold tracking-tight text-[#0F172A] dark:text-white">
            Landed
          </span>
          <span className="hidden text-[11px] font-medium text-[#94A3B8] sm:inline leading-none">
            {t("tagline")}
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-6">
          <Link
            href="/opportunities"
            className="text-sm text-[#64748B] dark:text-[#94A3B8] transition-colors hover:text-[#0F172A] dark:hover:text-white"
          >
            {t("opportunities")}
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
