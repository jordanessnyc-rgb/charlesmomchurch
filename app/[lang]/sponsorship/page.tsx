import type { Metadata } from "next";
import { Building2, FileDown, HandCoins, Megaphone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { SponsorshipForm } from "@/components/forms/public-forms";
import { getCollection } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "sponsorship", d.sponsorship.title, d.sponsorship.subtitle);
}

export default async function SponsorshipPage({ params }: LangParams) {
  const { locale, d, settings } = await pageContext(params);
  const projects = await getCollection("projects");
  return (
    <>
      <PageHero kicker={d.nav.sponsorship} title={d.sponsorship.title} text={d.sponsorship.subtitle}>
        <ButtonLink href={`/api/letter-of-need?lang=${locale}`}>
          <FileDown className="h-5 w-5" aria-hidden="true" /> {d.sponsorship.downloadLetter}
        </ButtonLink>
        <ButtonLink href="#contact" variant="outlineLight">{d.cta.contactUs}</ButtonLink>
      </PageHero>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Card className="border-gold-300 bg-gold-50">
            <FileDown className="h-8 w-8 text-gold-700" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-semibold text-navy-800">{d.sponsorship.letter}</h2>
            <p className="mt-2 text-ink/80">{d.sponsorship.letterText}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ButtonLink href="/api/letter-of-need?lang=en" variant="navy" size="sm">English (PDF)</ButtonLink>
              <ButtonLink href="/api/letter-of-need?lang=es" variant="outline" size="sm">Español (PDF)</ButtonLink>
            </div>
          </Card>
          <div>
            <SectionHeading kicker={d.sponsorship.currentNeeds} title={d.sponsorship.currentNeeds} className="mb-5" />
            <ul className="space-y-4">
              {settings.currentNeeds.map((n, i) => (
                <li key={i} className="flex gap-3">
                  <HandCoins className="mt-1 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-navy-800">{t(n.title, locale)}</p>
                    <p className="text-sm text-muted">{t(n.text, locale)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section tone="navy">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Building2 className="h-8 w-8 text-gold-300" aria-hidden="true" />
            <h2 className="mt-3 text-3xl font-semibold">{d.sponsorship.futureFacility}</h2>
            <p className="mt-3 leading-relaxed text-white/85">{t(settings.futureFacility, locale)}</p>
          </div>
          <div>
            <Megaphone className="h-8 w-8 text-gold-300" aria-hidden="true" />
            <h2 className="mt-3 text-3xl font-semibold">{d.sponsorship.corporate}</h2>
            <p className="mt-3 leading-relaxed text-white/85">{t(settings.corporateSponsorship, locale)}</p>
          </div>
        </div>
      </Section>
      <Section tone="cream">
        <SectionHeading kicker={d.sponsorship.initiatives} title={d.sponsorship.initiatives} />
        <ul className="grid gap-5 md:grid-cols-3">
          {projects.map((p) => (
            <Card as="li" key={p.id}>
              <h3 className="text-lg font-semibold text-navy-800">{t(p.title, locale)}</h3>
              <p className="mt-2 text-sm text-ink/80">{t(p.description, locale)}</p>
            </Card>
          ))}
        </ul>
      </Section>
      <Section id="contact">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title={d.sponsorship.contactTitle} text={d.sponsorship.contactIntro} />
          <SponsorshipForm locale={locale} d={d} s={d.sponsorship} />
        </div>
      </Section>
    </>
  );
}
