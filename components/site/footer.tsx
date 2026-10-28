import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { SiteSettings } from "@/lib/content/types";
import { SocialLinks } from "./social-links";

export function Footer({ locale, d, settings }: { locale: Locale; d: Dictionary; settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const address = [settings.address.line1, settings.address.line2, [settings.address.city, settings.address.state].filter(Boolean).join(", "), settings.address.zip]
    .filter(Boolean)
    .join(", ");
  const cols = [
    {
      title: d.footer.quickLinks,
      links: [
        ["/about", d.nav.about],
        ["/ministries", d.nav.ministries],
        ["/events", d.nav.events],
        ["/media", d.nav.media],
        ["/visit", d.nav.visit],
        ["/contact", d.nav.contact],
      ],
    },
    {
      title: d.footer.getHelp,
      links: [
        ["/prayer", d.nav.prayer],
        ["/assistance", d.nav.assistance],
        ["/love-in-action", d.nav.loveInAction],
        ["/impact", d.nav.impact],
      ],
    },
    {
      title: d.footer.support,
      links: [
        ["/give", d.nav.give],
        ["/sponsorship", d.nav.sponsorship],
        ["/volunteer", d.nav.volunteer],
        ["/privacy", d.nav.privacy],
      ],
    },
  ];
  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.jpg" alt="" width={56} height={56} className="h-14 w-14 rounded-full ring-2 ring-gold-500/60" />
            <div>
              <p className="font-display text-2xl font-semibold">{settings.churchName}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold-300">Centro de Adoración e Intercesión</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">{d.footer.nonprofit}</p>
          <ul className="mt-5 space-y-2 text-sm text-white/80">
            {address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>{address}</span>
              </li>
            )}
            {settings.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">{settings.phone}</a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a>
              </li>
            )}
          </ul>
          <div className="mt-5">
            <SocialLinks social={settings.social} label={d.footer.followUs} />
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gold-300">{c.title}</h3>
            <ul className="space-y-2">
              {c.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={`/${locale}${href}`} className="text-sm text-white/80 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-2 py-5 text-xs text-white/55 sm:flex-row sm:items-center">
          <p>
            © {year} {settings.legalName}. {d.footer.rights}
          </p>
          <p>{d.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
