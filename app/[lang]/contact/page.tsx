import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { MapEmbed } from "@/components/site/blocks";
import { SocialLinks } from "@/components/site/social-links";
import { ContactForm } from "@/components/forms/public-forms";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "contact", d.contact.title, d.contact.subtitle);
}

export default async function ContactPage({ params, searchParams }: LangParams & { searchParams: Promise<{ topic?: string }> }) {
  const { locale, d, settings } = await pageContext(params);
  const { topic } = await searchParams;
  const address = [settings.address.line1, settings.address.line2, [settings.address.city, settings.address.state].filter(Boolean).join(", "), settings.address.zip].filter(Boolean).join(", ");
  const query = settings.address.line1 ? address : settings.mapsQuery;
  const teams = [
    { title: d.contact.prayerTeam, email: settings.emails.prayer || settings.email, href: `/${locale}/prayer`, cta: d.cta.prayer },
    { title: d.contact.assistanceTeam, email: settings.emails.assistance || settings.email, href: `/${locale}/assistance`, cta: d.cta.assistance },
    { title: d.contact.sponsorshipTeam, email: settings.emails.sponsorship || settings.email, href: `/${locale}/sponsorship`, cta: d.cta.sponsor },
  ];
  return (
    <>
      <PageHero kicker={d.nav.contact} title={d.contact.title} text={d.contact.subtitle} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading title={d.contact.formTitle} className="mb-6" />
            <ContactForm locale={locale} d={d} c={d.contact} defaultTopic={topic && topic in d.contact.topics ? topic : "general"} />
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl border border-line bg-cream p-6">
              <h2 className="text-xl font-semibold text-navy-800">{d.contact.general}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {settings.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gold-600" aria-hidden="true" />
                    <a href={`mailto:${settings.email}`} className="text-navy-800 underline">{settings.email}</a>
                  </li>
                )}
                {settings.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gold-600" aria-hidden="true" />
                    <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="text-navy-800 underline">{settings.phone}</a>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                  <span>{address || settings.mapsQuery}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                  <span>
                    <span className="font-medium">{d.contact.hours}:</span> {t(settings.officeHours, locale)}
                  </span>
                </li>
              </ul>
              <div className="mt-5">
                <SocialLinks social={settings.social} label={d.contact.social} dark />
              </div>
            </div>
            <ul className="space-y-3">
              {teams.map((tm) => (
                <li key={tm.title} className="rounded-2xl border border-line bg-white p-5 shadow-card">
                  <h3 className="font-semibold text-navy-800">{tm.title}</h3>
                  {tm.email && (
                    <a href={`mailto:${tm.email}`} className="mt-1 block text-sm text-muted underline">{tm.email}</a>
                  )}
                  <ButtonLink href={tm.href} variant="outline" size="sm" className="mt-3">{tm.cta}</ButtonLink>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
      <Section tone="cream">
        <SectionHeading title={d.contact.directions} />
        <MapEmbed query={query} title={d.contact.directions} />
        <div className="mt-5">
          <ButtonLink href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`} variant="navy">{d.cta.getDirections}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
