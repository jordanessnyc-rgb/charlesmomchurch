import type { Metadata } from "next";
import { Car, MapPin, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { MapEmbed, ServiceTimes } from "@/components/site/blocks";
import { VisitorForm } from "@/components/forms/public-forms";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "visit", d.visit.title, d.visit.subtitle);
}

export default async function VisitPage({ params }: LangParams) {
  const { locale, d, settings } = await pageContext(params);
  const address = [settings.address.line1, settings.address.line2, [settings.address.city, settings.address.state].filter(Boolean).join(", "), settings.address.zip].filter(Boolean).join(", ");
  const query = settings.address.line1 ? address : settings.mapsQuery;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  return (
    <>
      <PageHero kicker={d.nav.visit} title={d.visit.title} text={d.visit.subtitle}>
        <ButtonLink href={directions}>
          <MapPin className="h-5 w-5" aria-hidden="true" /> {d.cta.getDirections}
        </ButtonLink>
        <ButtonLink href="#visitor-form" variant="outlineLight">{d.visit.formTitle}</ButtonLink>
      </PageHero>
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading kicker={d.visit.location} title={d.visit.location} className="mb-4" />
            <p className="text-lg text-ink/85">{address || settings.mapsQuery}</p>
            {settings.phone && <p className="mt-1 text-muted">{settings.phone}</p>}
            <div className="mt-6">
              <h3 className="mb-3 text-xl font-semibold text-navy-800">{d.visit.times}</h3>
              <ServiceTimes times={settings.serviceTimes.filter((s) => s.type === "worship")} locale={locale} d={d} livestreamUrl={settings.livestreamUrl} compact />
            </div>
          </div>
          <MapEmbed query={query} title={d.visit.location} />
        </div>
      </Section>
      <Section tone="cream">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-7 shadow-card">
            <Car className="h-7 w-7 text-gold-600" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-semibold text-navy-800">{d.visit.parking}</h2>
            <p className="mt-2 leading-relaxed text-ink/80">{t(settings.parking, locale)}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-7 shadow-card">
            <Sparkles className="h-7 w-7 text-gold-600" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-semibold text-navy-800">{d.visit.expect}</h2>
            <p className="mt-2 leading-relaxed text-ink/80">{t(settings.whatToExpect, locale)}</p>
          </div>
        </div>
      </Section>
      <Section id="visitor-form">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title={d.visit.formTitle} text={d.visit.formIntro} />
          <VisitorForm locale={locale} d={d} v={d.visit} />
        </div>
      </Section>
    </>
  );
}
