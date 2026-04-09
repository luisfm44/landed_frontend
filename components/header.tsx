import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Header() {
  const t = await getTranslations("header");

  return (
    // Glass header in dark: backdrop-blur creates depth between nav and content
    // border-border/60 on light; border-ld-border in dark for the premium token
    <header className="sticky top-0 z-50 w-full border-b border-border/60 dark:border-ld-border bg-background/95 dark:bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 select-none">
          {/* Logo text: white in dark — foreground token handles this */}
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Landed
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {t("tagline")}
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-4">
          <Link
            href="/opportunities"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("opportunities")}
          </Link>
          {/* ThemeToggle is a client component — renders fine inside async server Header */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
