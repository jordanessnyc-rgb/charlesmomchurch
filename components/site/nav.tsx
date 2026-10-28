"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LangSwitcher } from "./lang-switcher";
import { buttonClass } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";

export type NavGroup = { label: string; href?: string; items?: { label: string; href: string; description?: string }[] };

export function DesktopNav({ groups, locale }: { groups: NavGroup[]; locale: Locale }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
      {groups.map((g) =>
        g.items ? (
          <div key={g.label} className="group relative">
            <button className="nav-link inline-flex items-center gap-1" aria-haspopup="true" aria-expanded="false">
              {g.label}
              <ChevronDown className="h-4 w-4 opacity-70 transition group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />
            </button>
            <div className="invisible absolute left-0 top-full z-40 w-72 translate-y-1 pt-2 opacity-0 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <ul className="rounded-2xl border border-white/10 bg-navy-900/95 p-2 shadow-raised backdrop-blur">
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Link
                      href={`/${locale}${it.href}`}
                      className={cn("block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/10 hover:text-white", pathname === `/${locale}${it.href}` && "bg-white/10 text-gold-300")}
                    >
                      <span className="font-medium">{it.label}</span>
                      {it.description && <span className="mt-0.5 block text-xs text-white/55">{it.description}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <Link key={g.label} href={`/${locale}${g.href}`} className={cn("nav-link", pathname === `/${locale}${g.href}` && "text-gold-300")}>
            {g.label}
          </Link>
        ),
      )}
    </nav>
  );
}

export function MobileNav({ groups, locale, labels, giveHref }: { groups: NavGroup[]; locale: Locale; labels: { menu: string; close: string; give: string }; giveHref: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    // Route changed (a menu link was followed): close the drawer during render, per React's "adjusting state" pattern.
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-2 text-sm font-medium text-white"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" /> {labels.menu}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col bg-navy-900 text-white shadow-raised transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label={labels.menu}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <LangSwitcher locale={locale} />
          <button type="button" onClick={() => setOpen(false)} className="inline-flex items-center gap-1 rounded-full p-2 text-white/80 hover:bg-white/10" aria-label={labels.close}>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((g) => (
            <div key={g.label} className="mb-2">
              {g.items ? (
                <>
                  <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">{g.label}</p>
                  <ul>
                    {g.items.map((it) => (
                      <li key={it.href}>
                        <Link href={`/${locale}${it.href}`} className="block rounded-lg px-3 py-2.5 text-base text-white/90 hover:bg-white/10">
                          {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={`/${locale}${g.href}`} className="block rounded-lg px-3 py-2.5 text-base font-medium text-white hover:bg-white/10">
                  {g.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <Link href={`/${locale}${giveHref}`} className={buttonClass("gold", "lg", "w-full")}>
            {labels.give}
          </Link>
        </div>
      </div>
    </div>
  );
}
