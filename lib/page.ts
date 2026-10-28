import "server-only";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSettings } from "@/lib/content";
import { getDictionary, isLocale, type Dictionary, type Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/utils";

export type LangParams = { params: Promise<{ lang: string }> };

/** Resolves the locale from the route, 404s on unknown locales, and loads shared data. */
export async function pageContext(params: LangParams["params"]): Promise<{ locale: Locale; d: Dictionary; settings: Awaited<ReturnType<typeof getSettings>> }> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const [settings] = await Promise.all([getSettings()]);
  return { locale: lang, d: getDictionary(lang), settings };
}

export function pageMetadata(locale: Locale, path: string, title: string, description: string, image?: string): Metadata {
  const base = siteUrl();
  const clean = path.replace(/^\//, "");
  const url = `${base}/${locale}${clean ? `/${clean}` : ""}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${base}/en${clean ? `/${clean}` : ""}`,
        es: `${base}/es${clean ? `/${clean}` : ""}`,
        "x-default": `${base}/en${clean ? `/${clean}` : ""}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: locale === "es" ? "es_US" : "en_US",
      siteName: "Casa de Milagros",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export const localeParams = () => [{ lang: "en" }, { lang: "es" }];
