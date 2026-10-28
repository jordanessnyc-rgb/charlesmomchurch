import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/ui/section";
import { Photo } from "@/components/ui/placeholder-image";
import { getCollection } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "ministries", d.ministries.title, d.ministries.subtitle);
}

export default async function MinistriesPage({ params }: LangParams) {
  const { locale, d } = await pageContext(params);
  const ministries = await getCollection("ministries");
  return (
    <>
      <PageHero kicker={d.nav.ministries} title={d.ministries.title} text={d.ministries.subtitle} />
      <Section>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <li key={m.id}>
              <Link href={`/${locale}/ministries/${m.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-raised">
                <Photo src={m.image} alt={t(m.name, locale)} label={d.misc.photoComingSoon} className="aspect-[16/10]" sizes="(max-width: 640px) 100vw, 33vw" />
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-2xl font-semibold text-navy-800">{t(m.name, locale)}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{t(m.summary, locale)}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gold-700">{t(m.schedule, locale)}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-800 group-hover:underline">
                    {d.cta.learnMore} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
