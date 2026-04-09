import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("opportunitiesTitle"),
    description: t("opportunitiesDescription"),
  };
}

export default async function OpportunitiesPage() {
  const t = await getTranslations("opportunities");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">
        {t("title")}
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        {t("description")}
      </p>

      {/* Placeholder — replace with real data-fetching component */}
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground text-sm">
        {t("placeholder")}
      </div>
    </div>
  );
}
