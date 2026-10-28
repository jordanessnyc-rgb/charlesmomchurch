import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { Gallery, StatsGrid, Testimonials, YouTubeEmbed } from "@/components/site/blocks";
import { getCollection } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";
import { formatDate } from "@/lib/utils";
import { Photo } from "@/components/ui/placeholder-image";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "impact", d.impact.title, d.impact.subtitle);
}

export default async function ImpactPage({ params }: LangParams) {
  const { locale, d, settings } = await pageContext(params);
  const [stats, testimonials, stories, media] = await Promise.all([getCollection("impactStats"), getCollection("testimonials"), getCollection("stories"), getCollection("media")]);
  const video = media.find((m) => m.category === "inspirational") ?? media[0];
  return (
    <>
      <PageHero kicker={d.nav.impact} title={d.impact.title} text={d.impact.subtitle} />
      <Section>
        <StatsGrid stats={stats} locale={locale} />
        {settings.impactUpdated && (
          <p className="mt-3 text-right text-xs text-muted">
            {d.impact.updated}: {formatDate(settings.impactUpdated, locale, { month: "long", year: "numeric" })}
          </p>
        )}
      </Section>
      {stories.length > 0 && (
        <Section tone="cream">
          <SectionHeading kicker={d.outreach.stories} title={d.outreach.stories} />
          <ul className="grid gap-8 md:grid-cols-2">
            {stories.map((s) => (
              <li key={s.id} className="grid gap-5 sm:grid-cols-[180px_1fr]">
                <Photo src={s.image} alt="" label={d.misc.photoComingSoon} className="aspect-square rounded-2xl" sizes="180px" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">{formatDate(s.date, locale, { month: "long", year: "numeric" })}</p>
                  <h3 className="mt-1 text-xl font-semibold text-navy-800">{t(s.title, locale)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/80">{t(s.text, locale)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section>
        <SectionHeading kicker={d.impact.testimonials} title={d.impact.testimonials} />
        <Testimonials items={testimonials} locale={locale} />
      </Section>
      <Section tone="navy-light">
        <SectionHeading kicker={d.impact.gallery} title={d.impact.gallery} />
        {video && (
          <div className="mx-auto mb-8 max-w-4xl">
            <YouTubeEmbed id={video.youtubeId} title={t(video.title, locale)} />
          </div>
        )}
        <Gallery images={settings.outreachGallery} placeholderLabel={d.misc.photoComingSoon} />
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/${locale}/give?fund=outreach`}>{d.cta.donate}</ButtonLink>
          <ButtonLink href={`/${locale}/volunteer`} variant="outline">{d.cta.volunteer}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
