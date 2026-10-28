import type { Metadata } from "next";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { VolunteerForm } from "@/components/forms/public-forms";
import { getCollection } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";
import Link from "next/link";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "volunteer", d.volunteer.title, d.volunteer.subtitle);
}

export default async function VolunteerPage({ params }: LangParams) {
  const { locale, d } = await pageContext(params);
  const ministries = await getCollection("ministries");
  return (
    <>
      <PageHero kicker={d.nav.volunteer} title={d.volunteer.title} text={d.volunteer.subtitle} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <VolunteerForm locale={locale} d={d} v={d.volunteer} />
          </div>
          <aside>
            <SectionHeading title={d.nav.ministries} className="mb-4" />
            <ul className="space-y-2">
              {ministries.map((m) => (
                <li key={m.id}>
                  <Link href={`/${locale}/ministries/${m.slug}`} className="block rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-navy-800 shadow-card hover:border-gold-400">
                    {t(m.name, locale)}
                    <span className="block text-xs font-normal text-muted">{t(m.summary, locale)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
