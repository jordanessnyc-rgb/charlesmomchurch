import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Globe, HandHeart, Heart, MapPin, Package, Users, Video } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { t, type Locale } from "@/lib/i18n/config";
import type { EventItem, ImpactStat, ServiceTime, TestimonialItem } from "@/lib/content/types";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { Photo } from "@/components/ui/placeholder-image";
import { Card } from "@/components/ui/card";

export function ServiceTimes({ times, locale, d, zoomUrl, livestreamUrl, compact = false, light = false }: { times: ServiceTime[]; locale: Locale; d: Dictionary; zoomUrl?: string; livestreamUrl?: string; compact?: boolean; light?: boolean }) {
  return (
    <ul className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
      {times.map((s) => {
        const link = s.link || (s.online ? zoomUrl || livestreamUrl : "");
        return (
          <li key={s.id} className={cn("rounded-2xl border p-5", light ? "border-white/15 bg-white/5" : "border-line bg-white shadow-card")}>
            <p className={cn("text-xs font-semibold uppercase tracking-[0.18em]", light ? "text-gold-300" : "text-gold-600")}>{t(s.day, locale)}</p>
            <p className={cn("mt-1 font-display text-2xl font-semibold", light ? "text-white" : "text-navy-800")}>{s.time}</p>
            <p className={cn("mt-1 font-medium", light ? "text-white/90" : "text-ink")}>{t(s.label, locale)}</p>
            <p className={cn("mt-2 flex items-center gap-1.5 text-sm", light ? "text-white/65" : "text-muted")}>
              {s.online ? <Globe className="h-4 w-4" aria-hidden="true" /> : <MapPin className="h-4 w-4" aria-hidden="true" />}
              {t(s.location, locale)}
            </p>
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className={cn("mt-3 inline-flex items-center gap-1 text-sm font-semibold", light ? "text-gold-300" : "text-navy-800")}>
                {s.online ? d.cta.joinZoom : d.cta.watchLive} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

const categoryColors: Record<EventItem["category"], string> = {
  service: "bg-navy-100 text-navy-800",
  conference: "bg-gold-100 text-gold-700",
  outreach: "bg-emerald-100 text-emerald-800",
  youth: "bg-sky-100 text-sky-800",
  other: "bg-slate-100 text-slate-700",
};

export function EventCard({ event, locale, d }: { event: EventItem; locale: Locale; d: Dictionary }) {
  const start = new Date(event.startsAt);
  const day = new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", { day: "numeric", timeZone: "America/New_York" }).format(start);
  const month = new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", { month: "short", timeZone: "America/New_York" }).format(start);
  return (
    <Card as="article" className="flex gap-5 p-5">
      <div className="flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-navy-800 text-white">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gold-300">{month}</span>
        <span className="font-display text-3xl font-semibold leading-none">{day}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider", categoryColors[event.category])}>{event.category}</span>
          {event.registration && <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[11px] font-semibold text-gold-700">{d.events.registrationOpen}</span>}
        </div>
        <h3 className="mt-1.5 text-xl font-semibold text-navy-800">
          <Link href={`/${locale}/events/${event.slug}`} className="hover:underline">
            {t(event.title, locale)}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{t(event.description, locale)}</p>
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/80">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gold-600" aria-hidden="true" />
            <dd>
              {formatDate(event.startsAt, locale, { weekday: "short" })} · {formatTime(event.startsAt, locale)}
            </dd>
          </div>
          <div className="flex items-center gap-1.5">
            {event.online ? <Video className="h-4 w-4 text-gold-600" aria-hidden="true" /> : <MapPin className="h-4 w-4 text-gold-600" aria-hidden="true" />}
            <dd>{t(event.location, locale)}</dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}

const statIcons = { families: Users, events: CalendarDays, volunteers: HandHeart, supplies: Package, meals: Package, prayer: Heart };

export function StatsGrid({ stats, locale, light = false }: { stats: ImpactStat[]; locale: Locale; light?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = statIcons[s.icon] ?? Users;
        return (
          <li key={s.id} className={cn("rounded-2xl border p-5 text-center", light ? "border-white/15 bg-white/5" : "border-line bg-white shadow-card")}>
            <Icon className={cn("mx-auto h-7 w-7", light ? "text-gold-300" : "text-gold-600")} aria-hidden="true" />
            <p className={cn("mt-2 font-display text-4xl font-semibold", light ? "text-white" : "text-navy-800")}>{s.value}</p>
            <p className={cn("mt-1 text-sm", light ? "text-white/75" : "text-muted")}>{t(s.label, locale)}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function Testimonials({ items, locale }: { items: TestimonialItem[]; locale: Locale }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {items.map((it) => (
        <li key={it.id} className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <p className="font-display text-2xl leading-snug text-navy-800">“{t(it.quote, locale)}”</p>
          <div className="mt-4 flex items-center gap-3">
            <Photo src={it.image} alt="" className="h-11 w-11 rounded-full" />
            <div>
              <p className="font-semibold">{it.name}</p>
              <p className="text-sm text-muted">{t(it.context, locale)}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Gallery({ images, placeholderLabel, count = 6 }: { images: { url: string; caption: { en: string; es: string } }[]; placeholderLabel: string; count?: number; locale?: Locale }) {
  const list = images.length ? images : Array.from({ length: count }, () => ({ url: "", caption: { en: "", es: "" } }));
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {list.slice(0, 9).map((img, i) => (
        <li key={i} className={cn(i === 0 && "col-span-2 row-span-2")}>
          <Photo src={img.url} alt={img.caption.en || ""} label={img.url ? undefined : placeholderLabel} className={cn("w-full rounded-2xl", i === 0 ? "aspect-square md:aspect-[4/3] h-full" : "aspect-square")} />
        </li>
      ))}
    </ul>
  );
}

export function YouTubeEmbed({ id, title, className }: { id: string; title: string; className?: string }) {
  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-2xl bg-navy-900 shadow-card", className)}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export function MapEmbed({ query, title }: { query: string; title: string }) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const src = key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encodeURIComponent(query)}`
    : `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-navy-50 shadow-card sm:aspect-video">
      <iframe className="absolute inset-0 h-full w-full" src={src} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
    </div>
  );
}
