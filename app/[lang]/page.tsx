import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, HandHeart, HeartHandshake, MessageCircleHeart, Sparkles, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Photo } from "@/components/ui/placeholder-image";
import { EventCard, Gallery, ServiceTimes, StatsGrid, YouTubeEmbed } from "@/components/site/blocks";
import { getCollection, getUpcomingEvents } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";
import { formatDate, youtubeId } from "@/lib/utils";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "", `${d.siteName} · ${d.siteFullName}`, d.home.heroSubtitle);
}

export default async function HomePage({ params }: LangParams) {
  const { locale, d, settings } = await pageContext(params);
  const [events, announcements, stats, projects] = await Promise.all([getUpcomingEvents(3), getCollection("announcements"), getCollection("impactStats"), getCollection("projects")]);

  const helps = [
    { href: "/prayer", Icon: MessageCircleHeart, title: d.cta.prayer, text: d.home.helpPrayer },
    { href: "/assistance", Icon: HeartHandshake, title: d.cta.assistance, text: d.home.helpAssistance },
    { href: "/give", Icon: Sparkles, title: d.cta.donate, text: d.home.helpGive },
    { href: "/volunteer", Icon: HandHeart, title: d.cta.getInvolved, text: d.home.helpInvolved },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-hero relative overflow-hidden text-white">
        <div className="container-x relative grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:py-28">
          <div>
            <p className="kicker text-gold-300">{d.home.welcomeKicker}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              <span className="gold-text">{settings.churchName}</span>
              <span className="mt-2 block text-3xl text-white sm:text-4xl lg:text-5xl">{d.home.heroTitle}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">{d.home.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/visit`} size="lg">{d.cta.planVisit}</ButtonLink>
              <ButtonLink href={`/${locale}/prayer`} variant="outlineLight" size="lg">{d.cta.prayer}</ButtonLink>
              <ButtonLink href={`/${locale}/assistance`} variant="outlineLight" size="lg">{d.cta.assistance}</ButtonLink>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/give`} variant="white" size="md">{d.cta.donate}</ButtonLink>
              <ButtonLink href={`/${locale}/volunteer`} variant="ghost" size="md" className="text-white hover:bg-white/10">
                {d.cta.getInvolved} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            {settings.heroImage ? (
              <Photo src={settings.heroImage} alt={settings.churchName} className="aspect-[4/5] rounded-3xl shadow-raised ring-1 ring-white/10" priority sizes="(max-width: 1024px) 90vw, 40vw" />
            ) : (
              <div className="relative aspect-square">
                <div className="absolute inset-6 rounded-full bg-gold-400/20 blur-3xl" />
                <Image src="/images/logo.jpg" alt={settings.legalName} fill priority sizes="(max-width: 1024px) 80vw, 30vw" className="relative rounded-full object-cover shadow-raised ring-4 ring-gold-500/40" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Welcome + mission */}
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading kicker={d.home.missionKicker} title={d.about.mission} className="mb-6" />
            <p className="text-lg leading-relaxed text-ink/85">{t(settings.welcomeMessage, locale)}</p>
            <Link href={`/${locale}/about`} className="mt-5 inline-flex items-center gap-1 font-semibold text-navy-800 hover:underline">
              {d.cta.learnMore} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4">
            <Card className="border-l-4 border-l-gold-500">
              <p className="kicker mb-2">{d.about.mission}</p>
              <p className="leading-relaxed">{t(settings.mission, locale)}</p>
            </Card>
            <Card className="border-l-4 border-l-navy-800">
              <p className="kicker mb-2">{d.about.vision}</p>
              <p className="leading-relaxed">{t(settings.vision, locale)}</p>
            </Card>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section tone="navy">
        <SectionHeading kicker={d.home.servicesKicker} title={d.home.servicesTitle} light />
        <ServiceTimes times={settings.serviceTimes} locale={locale} d={d} zoomUrl={settings.zoomUrl} livestreamUrl={settings.livestreamUrl} light />
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/${locale}/visit`}>{d.cta.planVisit}</ButtonLink>
          <ButtonLink href={`/${locale}/events`} variant="outlineLight">{d.nav.events}</ButtonLink>
        </div>
      </Section>

      {/* How can we help */}
      <Section>
        <SectionHeading kicker={d.home.helpKicker} title={d.home.helpTitle} align="center" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {helps.map((h) => (
            <li key={h.href}>
              <Link href={`/${locale}${h.href}`} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-raised">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-gold-300">
                  <h.Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-navy-800">{h.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{h.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 group-hover:underline">
                  {d.cta.learnMore} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Events & announcements */}
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading kicker={d.home.eventsKicker} title={d.events.upcoming} />
            {events.length ? (
              <div className="space-y-4">
                {events.map((e) => (
                  <EventCard key={e.id} event={e} locale={locale} d={d} />
                ))}
              </div>
            ) : (
              <p className="text-muted">{d.home.noEvents}</p>
            )}
            <Link href={`/${locale}/events`} className="mt-6 inline-flex items-center gap-1 font-semibold text-navy-800 hover:underline">
              {d.cta.viewAll} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div>
            <SectionHeading kicker={d.home.stayConnected} title={d.home.announcementsTitle} />
            <ul className="space-y-4">
              {announcements.map((a) => (
                <li key={a.id} className="rounded-2xl border border-gold-200 bg-white p-5 shadow-card">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-700">{formatDate(a.date, locale, { month: "long", day: "numeric" })}</p>
                  <h3 className="mt-1 text-lg font-semibold text-navy-800">{t(a.title, locale)}</h3>
                  <p className="mt-1 text-sm text-ink/80">{t(a.text, locale)}</p>
                  {a.link && (
                    <Link href={a.link.startsWith("http") ? a.link : `/${locale}${a.link}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-navy-800 hover:underline">
                      {d.misc.readMore} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Love in action */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <SectionHeading kicker={d.home.outreachKicker} title={d.home.outreachTitle} text={d.home.outreachText} />
            <ul className="mb-8 space-y-3">
              {projects.slice(0, 3).map((p) => (
                <li key={p.id} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-navy-800">{t(p.title, locale)}</p>
                    <p className="text-sm text-muted">{t(p.description, locale)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/love-in-action`} variant="navy">{d.nav.loveInAction}</ButtonLink>
              <ButtonLink href={`/${locale}/volunteer`} variant="outline">{d.cta.volunteer}</ButtonLink>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Gallery images={settings.outreachGallery} placeholderLabel={d.misc.photoComingSoon} count={5} />
          </div>
        </div>
      </Section>

      {/* Impact */}
      <Section tone="navy">
        <SectionHeading kicker={d.home.impactKicker} title={d.impact.title} text={d.impact.subtitle} light />
        <StatsGrid stats={stats} locale={locale} light />
        <div className="mt-8">
          <ButtonLink href={`/${locale}/impact`}>{d.nav.impact}</ButtonLink>
        </div>
      </Section>

      {/* Video + gallery */}
      <Section tone="cream">
        <SectionHeading kicker={d.home.galleryKicker} title={d.home.galleryTitle} align="center" />
        {settings.heroVideoUrl && (
          <div className="mx-auto mb-8 max-w-4xl">
            <YouTubeEmbed id={youtubeId(settings.heroVideoUrl)} title={settings.churchName} />
          </div>
        )}
        <Gallery images={settings.gallery} placeholderLabel={d.misc.photoComingSoon} />
        <div className="mt-8 text-center">
          <ButtonLink href={`/${locale}/media`} variant="navy">{d.nav.media}</ButtonLink>
        </div>
      </Section>
    </>
  );
}
