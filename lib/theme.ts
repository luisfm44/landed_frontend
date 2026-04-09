/**
 * Theme utilities — light/dark management for Landed.
 *
 * Priority: localStorage > OS prefers-color-scheme
 *
 * The FOUC prevention script in app/layout.tsx mirrors this logic
 * synchronously BEFORE the first paint. These functions run post-hydration.
 *
 * autoThemeByTime() is exported for potential "smart" scheduling:
 *   morning/afternoon → light, evening/night → dark.
 */

export type Theme = "light" | "dark";

/** Read user's preferred theme — localStorage first, then OS preference. */
export function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Apply theme to document root and persist to localStorage. */
export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

/** Toggle current theme and return the new value. */
export function toggleTheme(): Theme {
  const next: Theme = document.documentElement.classList.contains("dark")
    ? "light"
    : "dark";
  applyTheme(next);
  return next;
}

/**
 * Derive theme from time of day.
 * 19:00–06:59 → dark, 07:00–18:59 → light.
 * Optional — not auto-applied, caller decides.
 */
export function autoThemeByTime(): Theme {
  const h = new Date().getHours();
  return h >= 19 || h < 7 ? "dark" : "light";
}
