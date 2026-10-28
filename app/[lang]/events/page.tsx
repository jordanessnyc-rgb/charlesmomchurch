import type { Metadata } from "next";
import { Video } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { EventCard, ServiceTimes } from "@/components/site/blocks";
import { getPastEvents, getUpcomingEvents } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "events", d.events.title, d.events.subtitle);
}

export default async function EventsPage({ params }: LangParams) {
  const { locale, d, settings } = await pageContext(params);
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents(6)]);
  const groups: { key: "worship" | "prayer" | "bible"; title: string }[] = [
    { key: "worship", title: d.events.worship },
    { key: "prayer", title: d.events.onlinePrayer },
    { key: "bible", title: d.events.bible },
  ];
  const special = upcoming.filter((e) => e.category === "conference" || e.category === "service");
  return (
    <>
      <PageHero kicker={d.nav.events} title={d.events.title} text={d.events.subtitle}>
        {settings.livestreamUrl && (
          <ButtonLink href={settings.livestreamUrl}>
            <Video className="h-5 w-5" aria-hidden="true" /> {d.cta.watchLive}
          </ButtonLink>
        )}
        {settings.zoomUrl && <ButtonLink href={settings.zoomUrl} variant="outlineLight">{d.cta.joinZoom}</ButtonLink>}
      </PageHero>
      <Section>
        <SectionHeading kicker={d.events.weekly} title={d.events.weekly} />
        <div className="space-y-10">
          {groups.map((g) => {
            const times = settings.serviceTimes.filter((s) => s.type === g.key);
            if (!times.length) return null;
            return (
              <div key={g.key}>
                <h3 className="mb-4 text-2xl font-semibold text-navy-800">{g.title}</h3>
                <ServiceTimes times={times} locale={locale} d={d} zoomUrl={settings.zoomUrl} livestreamUrl={settings.livestreamUrl} />
              </div>
            );
          })}
        </div>
        {(settings.zoomUrl || settings.livestreamUrl) && (
          <div className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-5 text-sm text-navy-900">
            <p className="font-semibold">{d.events.livestreamNote}</p>
            <p className="mt-1 text-ink/80">{t(settings.zoomNote, locale)}</p>
          </div>
        )}
      </Section>
      <Section tone="cream" id="upcoming">
        <SectionHeading kicker={d.events.calendar} title={d.events.upcoming} />
        {upcoming.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} locale={locale} d={d} />
            ))}
          </div>
        ) : (
          <p className="text-muted">{d.events.noUpcoming}</p>
        )}
      </Section>
      {special.length > 0 && (
        <Section tone="navy">
          <SectionHeading kicker={d.events.special} title={d.events.special} light />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {special.map((e) => (
              <li key={e.id} className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", { dateStyle: "long", timeZone: "America/New_York" }).format(new Date(e.startsAt))}</p>
                <h3 className="mt-1 text-2xl font-semibold">{t(e.title, locale)}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-white/75">{t(e.description, locale)}</p>
                <ButtonLink href={`/${locale}/events/${e.slug}`} variant="gold" size="sm" className="mt-4">
                  {d.cta.learnMore}
                </ButtonLink>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {past.length > 0 && (
        <Section>
          <SectionHeading title={d.events.past} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => (
              <li key={e.id} className="rounded-xl border border-line p-4 text-sm">
                <p className="text-xs text-muted">{new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", { dateStyle: "medium", timeZone: "America/New_York" }).format(new Date(e.startsAt))}</p>
                <p className="font-semibold text-navy-800">{t(e.title, locale)}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
