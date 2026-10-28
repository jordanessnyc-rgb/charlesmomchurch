export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Bilingual text as stored in content. */
export type L = { en: string; es: string };

export function t(value: L | string | undefined | null, locale: Locale): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] || value.en || value.es || "";
}

export const localeNames: Record<Locale, string> = { en: "English", es: "Español" };
