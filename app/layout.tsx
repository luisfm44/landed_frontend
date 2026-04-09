import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("footer");

  return (
    <html
      lang={locale}
      /* No hardcoded dark class — the FOUC script below sets it before first paint.
         suppressHydrationWarning prevents React mismatch when class differs from SSR. */
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/*
        FOUC prevention: runs synchronously before any CSS paint.
        Reads localStorage → OS preference → applies 'dark' class immediately.
        Mirrors the same logic as getPreferredTheme() in lib/theme.ts.
        Must be in <head> as a blocking script — not deferred or async.
      */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <TooltipProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-gray-200 dark:border-ld-border py-6 text-center text-xs text-gray-400 dark:text-muted-foreground/60">
              {t("copyright", { year: new Date().getFullYear() })}
            </footer>
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
