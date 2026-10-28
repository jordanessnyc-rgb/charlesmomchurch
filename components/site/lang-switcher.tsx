"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

export function LangSwitcher({ locale, light = true, className }: { locale: Locale; light?: boolean; className?: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "");
  const items: { code: Locale; label: string; aria: string }[] = [
    { code: "en", label: "EN", aria: "English" },
    { code: "es", label: "ES", aria: "Español" },
  ];
  return (
    <div className={cn("inline-flex items-center rounded-full border p-0.5 text-xs font-semibold", light ? "border-white/30" : "border-navy-800/30", className)} role="group" aria-label="Language">
      {items.map((it) => (
        <Link
          key={it.code}
          href={`/${it.code}${rest}`}
          hrefLang={it.code}
          lang={it.code}
          aria-label={it.aria}
          aria-current={it.code === locale ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1 transition",
            it.code === locale
              ? "bg-gold-500 text-navy-900"
              : light
                ? "text-white/80 hover:text-white"
                : "text-navy-800/70 hover:text-navy-800",
          )}
        >
          {it.label}
        </Link>
      ))}
    </div>
  );
}
