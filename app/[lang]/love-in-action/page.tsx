import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Photo } from "@/components/ui/placeholder-image";
import { Gallery, Testimonials } from "@/components/site/blocks";
import { getCollection } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";
import { formatDate, formatMoney } from "@/lib/utils";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "love-in-action", d.outreach.title, d.outreach.subtitle);
}

export default async function OutreachPage({ params }: LangParams) {
  const { locale, d, settings } = await pageContext(params);
  const [projects, stories, testimonials] = await Promise.all([getCollection("projects"), getCollection("stories"), getCollection("testimonials")]);
  return (
    <>
      <PageHero kicker={d.nav.loveInAction} title={d.outreach.title} text={d.outreach.subtitle}>
        <ButtonLink href={`/${locale}/volunteer`}>{d.cta.volunteer}</ButtonLink>
        <ButtonLink href={`/${locale}/give?fund=outreach`} variant="outlineLight">{d.cta.donate}</ButtonLink>
      </PageHero>
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading kicker={d.outreach.whoWeServe} title={d.outreach.whoWeServe} className="mb-5" />
            <p className="text-lg leading-relaxed text-ink/85">{t(settings.whoWeServe, locale)}</p>
          </div>
          <Gallery images={settings.outreachGallery} placeholderLabel={d.misc.photoComingSoon} count={5} />
        </div>
      </Section>
      <Section tone="cream">
        <SectionHeading kicker={d.outreach.projects} title={d.outreach.projects} />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects
            .filter((p) => p.active)
            .map((p) => {
              const pct = p.goalCents > 0 ? Math.min(100, Math.round((p.raisedCents / p.goalCents) * 100)) : null;
              return (
                <Card as="li" key={p.id} className="flex flex-col p-0 overflow-hidden">
                  <Photo src={p.image} alt={t(p.title, locale)} label={d.misc.photoComingSoon} className="aspect-[16/10]" />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold text-navy-800">{t(p.title, locale)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/80">{t(p.description, locale)}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-gold-700">{d.outreach.needs}</p>
                    <p className="text-sm text-muted">{t(p.needs, locale)}</p>
                    {pct !== null && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-muted">
                          <span>
                            {d.outreach.raised}: {formatMoney(p.raisedCents, locale)}
                          </span>
                          <span>
                            {d.outreach.goal}: {formatMoney(p.goalCents, locale)}
                          </span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-navy-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                          <div className="h-full bg-gold-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="mt-5">
                      <ButtonLink href={`/${locale}/give?fund=${p.fundId}`} variant="navy" size="sm">{d.cta.giveNow}</ButtonLink>
                    </div>
                  </div>
                </Card>
              );
            })}
        </ul>
      </Section>
      {stories.length > 0 && (
        <Section>
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
      {testimonials.length > 0 && (
        <Section tone="cream">
          <SectionHeading kicker={d.impact.testimonials} title={d.impact.testimonials} />
          <Testimonials items={testimonials} locale={locale} />
        </Section>
      )}
      <Section tone="navy">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8">
            <h2 className="text-3xl font-semibold">{d.outreach.volunteer}</h2>
            <p className="mt-3 text-white/80">{d.outreach.volunteerText}</p>
            <div className="mt-6">
              <ButtonLink href={`/${locale}/volunteer`}>{d.cta.volunteer}</ButtonLink>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8">
            <h2 className="text-3xl font-semibold">{d.outreach.contribute}</h2>
            <p className="mt-3 text-white/80">{t(settings.waysToContribute, locale)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/give?fund=outreach`}>{d.cta.donate}</ButtonLink>
              <ButtonLink href={`/${locale}/sponsorship`} variant="outlineLight">{d.cta.sponsor}</ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
