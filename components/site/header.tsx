import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { DesktopNav, MobileNav, type NavGroup } from "./nav";
import { LangSwitcher } from "./lang-switcher";
import { buttonClass } from "@/components/ui/button";

export function navGroups(d: Dictionary): NavGroup[] {
  return [
    { label: d.nav.home, href: "" },
    {
      label: d.nav.about,
      items: [
        { label: d.nav.about, href: "/about" },
        { label: d.nav.ministries, href: "/ministries" },
        { label: d.nav.impact, href: "/impact" },
        { label: d.nav.loveInAction, href: "/love-in-action" },
      ],
    },
    {
      label: d.nav.connect,
      items: [
        { label: d.nav.visit, href: "/visit" },
        { label: d.nav.events, href: "/events" },
        { label: d.nav.media, href: "/media" },
        { label: d.nav.prayer, href: "/prayer" },
        { label: d.nav.contact, href: "/contact" },
      ],
    },
    {
      label: d.nav.serve,
      items: [
        { label: d.nav.assistance, href: "/assistance" },
        { label: d.nav.volunteer, href: "/volunteer" },
        { label: d.nav.give, href: "/give" },
        { label: d.nav.sponsorship, href: "/sponsorship" },
      ],
    },
  ];
}

export function Header({ locale, d, churchName }: { locale: Locale; d: Dictionary; churchName: string }) {
  const groups = navGroups(d);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-900 text-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-navy-900">
        {d.nav.skipToContent}
      </a>
      <div className="container-x flex h-18 items-center justify-between gap-4 py-2.5">
        <Link href={`/${locale}`} className="flex items-center gap-3" aria-label={churchName}>
          <Image src="/images/logo.jpg" alt="" width={48} height={48} className="h-12 w-12 rounded-full ring-2 ring-gold-500/70" priority />
          <span className="leading-tight">
            <span className="block font-display text-xl font-semibold tracking-wide sm:text-2xl">{churchName}</span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-gold-300 sm:block">Centro de Adoración e Intercesión</span>
          </span>
        </Link>
        <DesktopNav groups={groups} locale={locale} />
        <div className="flex items-center gap-2">
          <LangSwitcher locale={locale} className="hidden sm:inline-flex" />
          <Link href={`/${locale}/give`} className={buttonClass("gold", "sm", "hidden sm:inline-flex")}>
            {d.nav.give}
          </Link>
          <MobileNav groups={groups} locale={locale} labels={{ menu: d.nav.menu, close: d.nav.close, give: d.cta.donate }} giveHref="/give" />
        </div>
      </div>
    </header>
  );
}
