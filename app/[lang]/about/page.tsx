import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Photo } from "@/components/ui/placeholder-image";
import { getCollection } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";
import { paragraphs } from "@/lib/utils";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "about", d.about.title, d.about.subtitle);
}

export default async function AboutPage({ params }: LangParams) {
  const { locale, d, settings } = await pageContext(params);
  const [leaders, ministries] = await Promise.all([getCollection("leadership"), getCollection("ministries")]);
  return (
    <>
      <PageHero kicker={d.nav.about} title={d.about.title} text={d.about.subtitle} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeading kicker={d.about.history} title={d.about.history} className="mb-6" />
            <Photo src={settings.gallery[0]?.url} alt="" label={d.misc.photoComingSoon} className="aspect-[4/3] rounded-2xl" />
          </div>
          <div className="prose-church text-lg">
            {paragraphs(t(settings.history, locale)).map((p, i) => (p.type === "h" ? <h2 key={i}>{p.text}</h2> : <p key={i}>{p.text}</p>))}
          </div>
        </div>
      </Section>
      <Section tone="navy">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8">
            <p className="kicker text-gold-300">{d.about.mission}</p>
            <p className="mt-3 font-display text-2xl leading-snug">{t(settings.mission, locale)}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8">
            <p className="kicker text-gold-300">{d.about.vision}</p>
            <p className="mt-3 font-display text-2xl leading-snug">{t(settings.vision, locale)}</p>
          </div>
        </div>
      </Section>
      <Section tone="cream">
        <SectionHeading kicker={d.about.beliefs} title={d.about.beliefs} align="center" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {settings.beliefs.map((b, i) => (
            <Card as="li" key={i}>
              <h3 className="text-xl font-semibold text-navy-800">{t(b.title, locale)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{t(b.text, locale)}</p>
            </Card>
          ))}
        </ul>
      </Section>
      <Section>
        <SectionHeading kicker={d.about.leadership} title={d.about.leadership} />
        <ul className="grid gap-8 md:grid-cols-2">
          {leaders.map((l) => (
            <li key={l.id} className="flex flex-col gap-5 sm:flex-row">
              <Photo src={l.image} alt={l.name} className="h-40 w-40 shrink-0 rounded-2xl" sizes="160px" />
              <div>
                <h3 className="text-2xl font-semibold text-navy-800">{l.name}</h3>
                <p className="text-sm font-semibold uppercase tracking-wider text-gold-700">{t(l.role, locale)}</p>
                <p className="mt-3 leading-relaxed text-ink/80">{t(l.bio, locale)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="navy-light">
        <SectionHeading kicker={d.nav.ministries} title={d.about.ministries} text={d.ministries.subtitle} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <li key={m.id}>
              <Link href={`/${locale}/ministries/${m.slug}`} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition hover:border-gold-400">
                <h3 className="text-lg font-semibold text-navy-800">{t(m.name, locale)}</h3>
                <p className="mt-1 flex-1 text-sm text-muted">{t(m.summary, locale)}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 group-hover:underline">
                  {d.cta.learnMore} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
