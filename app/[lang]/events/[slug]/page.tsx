import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarPlus, Clock, MapPin, Video } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { Photo } from "@/components/ui/placeholder-image";
import { EventRegistrationForm } from "@/components/forms/public-forms";
import { getItemBySlug } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";
import { formatDate, formatTime, siteUrl } from "@/lib/utils";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, d } = await pageContext(params as LangParams["params"]);
  const { slug } = await params;
  const e = await getItemBySlug("events", slug);
  if (!e) return { title: d.notFound.title };
  return pageMetadata(locale, `events/${slug}`, t(e.title, locale), t(e.description, locale).slice(0, 160), e.image || undefined);
}

function gcalUrl(title: string, details: string, location: string, start: string, end: string) {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const p = new URLSearchParams({ action: "TEMPLATE", text: title, details, location, dates: `${fmt(start)}/${fmt(end || start)}` });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export default async function EventPage({ params }: Props) {
  const { locale, d, settings } = await pageContext(params as LangParams["params"]);
  const { slug } = await params;
  const e = await getItemBySlug("events", slug);
  if (!e) notFound();
  const link = e.link || (e.online ? settings.livestreamUrl || settings.zoomUrl : "");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: t(e.title, locale),
    description: t(e.description, locale),
    startDate: e.startsAt,
    endDate: e.endsAt || undefined,
    eventAttendanceMode: e.online ? "https://schema.org/MixedEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: t(e.location, locale), address: settings.address.line1 || settings.address.city },
    organizer: { "@type": "Organization", name: settings.legalName, url: siteUrl() },
    image: e.image || undefined,
  };
  return (
    <>
      <PageHero kicker={formatDate(e.startsAt, locale)} title={t(e.title, locale)}>
        {link && (
          <ButtonLink href={link}>
            <Video className="h-5 w-5" aria-hidden="true" /> {e.online ? d.cta.joinZoom : d.cta.watchLive}
          </ButtonLink>
        )}
        <ButtonLink href={gcalUrl(t(e.title, locale), t(e.description, locale), t(e.location, locale), e.startsAt, e.endsAt)} variant="outlineLight">
          <CalendarPlus className="h-5 w-5" aria-hidden="true" /> {d.events.addToCalendar}
        </ButtonLink>
      </PageHero>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Photo src={e.image} alt="" label={d.misc.photoComingSoon} className="aspect-[16/9] rounded-2xl" sizes="(max-width: 1024px) 100vw, 60vw" />
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3 rounded-xl bg-cream p-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{d.events.when}</dt>
                  <dd className="font-medium text-navy-800">
                    {formatDate(e.startsAt, locale)}
                    <br />
                    {formatTime(e.startsAt, locale)}
                    {e.endsAt && ` – ${formatTime(e.endsAt, locale)}`}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl bg-cream p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{d.events.where}</dt>
                  <dd className="font-medium text-navy-800">
                    {t(e.location, locale)}
                    <span className="block text-sm font-normal text-muted">{e.online ? d.events.online : d.events.inPerson}</span>
                  </dd>
                </div>
              </div>
            </dl>
            <div className="prose-church mt-8 text-lg">
              {t(e.description, locale)
                .split(/\n\s*\n/)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
          </div>
          <aside>
            {e.registration ? (
              <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <SectionHeading title={d.events.registerTitle} className="mb-5" />
                <EventRegistrationForm locale={locale} d={d} e={d.events} eventId={e.id} eventTitle={t(e.title, "en")} />
              </div>
            ) : (
              <div className="rounded-2xl border border-gold-200 bg-gold-50 p-6">
                <p className="font-semibold text-navy-900">{d.visit.formTitle}</p>
                <p className="mt-1 text-sm text-ink/80">{d.visit.formIntro}</p>
                <ButtonLink href={`/${locale}/visit`} variant="navy" size="sm" className="mt-4">
                  {d.cta.planVisit}
                </ButtonLink>
              </div>
            )}
          </aside>
        </div>
      </Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
