import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

type Locale = "en" | "es";

function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "en";
  const primary = acceptLanguage
    .split(",")[0]
    .split(";")[0]
    .split("-")[0]
    .toLowerCase();
  return primary === "es" ? "es" : "en";
}

export default getRequestConfig(async () => {
  const headersList = await headers();
  const locale = detectLocale(headersList.get("accept-language"));

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
