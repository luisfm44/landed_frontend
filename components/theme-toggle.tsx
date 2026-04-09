"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleTheme, type Theme } from "@/lib/theme";

/**
 * Apple-style pill toggle for light/dark mode.
 *
 * - Lazy useState initializer reads the class the FOUC script already wrote to
 *   <html> before React hydrated — no useEffect or extra render needed.
 * - suppressHydrationWarning on <button> prevents SSR/client mismatch
 *   (SSR returns 'dark' since document is unavailable; client reads actual DOM).
 * - Thumb slides with CSS transition — no JS animation loop needed.
 */
export function ThemeToggle() {
  /**
   * DOM is already correct by the time useState runs on the client:
   * the FOUC script in <head> ran synchronously before React hydrated.
   * On SSR (document undefined) defaults to 'dark' — matches FOUC fallback.
   */
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  function handleToggle() {
    setTheme(toggleTheme());
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={handleToggle}
      suppressHydrationWarning
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(
        // Pill track — gray in light, glass in dark
        "relative h-7 w-14 rounded-full border transition-colors duration-300",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "bg-gray-200 border-gray-300 dark:bg-white/10 dark:border-white/[0.08]"
      )}
    >
      {/* Sliding thumb */}
      <span
        suppressHydrationWarning
        className={cn(
          // Thumb — white in light (neutral), primary blue in dark (brand-matched)
          "absolute top-[3px] left-[3px] h-[22px] w-[22px] rounded-full shadow-sm",
          "flex items-center justify-center",
          "bg-white dark:bg-primary",
          // translate-x-7 = 28px — from left=3 to right position=3+28=31, tracking stops at 56-22-3=31 ✓
          "transition-transform duration-300 ease-out",
          isDark ? "translate-x-7" : "translate-x-0"
        )}
      >
        {/* Icon shows the CURRENT mode — user understands what they're switching from */}
        {isDark ? (
          <Moon className="h-3 w-3 text-white" />
        ) : (
          <Sun className="h-3 w-3 text-amber-500" />
        )}
      </span>
    </button>
  );
}
