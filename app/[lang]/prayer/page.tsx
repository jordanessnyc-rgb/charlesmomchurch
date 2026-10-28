import type { Metadata } from "next";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { PrayerForm, TestimonyForm } from "@/components/forms/public-forms";
import { ServiceTimes } from "@/components/site/blocks";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "prayer", d.prayer.title, d.prayer.subtitle);
}

export default async function PrayerPage({ params }: LangParams) {
  const { locale, d, settings } = await pageContext(params);
  const prayerTimes = settings.serviceTimes.filter((s) => s.type === "prayer");
  return (
    <>
      <PageHero kicker={d.nav.prayer} title={d.prayer.title} text={d.prayer.subtitle} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionHeading title={d.prayer.formTitle} className="mb-6" />
            <PrayerForm locale={locale} d={d} p={d.prayer} />
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl bg-navy-800 p-8 text-white">
              <p className="font-display text-2xl leading-snug text-gold-300">{d.prayer.scripture}</p>
            </div>
            {prayerTimes.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-navy-800">{d.events.onlinePrayer}</h2>
                <ServiceTimes times={prayerTimes} locale={locale} d={d} zoomUrl={settings.zoomUrl} compact />
              </div>
            )}
          </aside>
        </div>
      </Section>
      <Section tone="cream" id="testimony">
        <div className="mx-auto max-w-3xl">
          <SectionHeading kicker={d.impact.testimonials} title={d.prayer.testimonyTitle} text={d.prayer.testimonyIntro} />
          <TestimonyForm locale={locale} d={d} p={d.prayer} />
        </div>
      </Section>
    </>
  );
}
