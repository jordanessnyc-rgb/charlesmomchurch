import { en, type Dictionary } from "./en";
import { es } from "./es";
import type { Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { en, es: es as Dictionary };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export * from "./config";
export type { Dictionary };
