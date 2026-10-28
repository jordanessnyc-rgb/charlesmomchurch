import type { Metadata } from "next";
import { YoutubeIcon } from "@/components/site/brand-icons";
import { ButtonLink } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { YouTubeEmbed } from "@/components/site/blocks";
import { SocialLinks } from "@/components/site/social-links";
import { getCollection } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";
import { formatDate } from "@/lib/utils";
import type { MediaItem } from "@/lib/content/types";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "media", d.media.title, d.media.subtitle);
}

export default async function MediaPage({ params }: LangParams) {
  const { locale, d, settings } = await pageContext(params);
  const media = await getCollection("media");
  const byCat = (c: MediaItem["category"]) => media.filter((m) => m.category === c).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const sections: { key: MediaItem["category"]; title: string }[] = [
    { key: "sermon", title: d.media.sermons },
    { key: "teaching", title: d.media.teachings },
    { key: "inspirational", title: d.media.inspirational },
  ];
  const live = byCat("live");
  return (
    <>
      <PageHero kicker={d.nav.media} title={d.media.title} text={d.media.subtitle}>
        {settings.youtubeChannelUrl && (
          <ButtonLink href={settings.youtubeChannelUrl}>
            <YoutubeIcon className="h-5 w-5" /> {d.media.youtube}
          </ButtonLink>
        )}
      </PageHero>
      <Section tone="navy">
        <SectionHeading kicker={d.media.live} title={d.media.live} light />
        {settings.youtubeLiveEmbedId || live[0] ? (
          <div className="mx-auto max-w-4xl">
            <YouTubeEmbed id={settings.youtubeLiveEmbedId || live[0].youtubeId} title={d.media.live} />
          </div>
        ) : (
          <p className="text-white/70">{d.media.noVideos}</p>
        )}
        {settings.livestreamUrl && (
          <div className="mt-6">
            <ButtonLink href={settings.livestreamUrl}>{d.cta.watchLive}</ButtonLink>
          </div>
        )}
      </Section>
      {sections.map((s, idx) => {
        const items = byCat(s.key);
        return (
          <Section key={s.key} tone={idx % 2 === 0 ? "white" : "cream"}>
            <SectionHeading title={s.title} />
            {items.length ? (
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((m) => (
                  <li key={m.id}>
                    <YouTubeEmbed id={m.youtubeId} title={t(m.title, locale)} />
                    <h3 className="mt-3 text-lg font-semibold text-navy-800">{t(m.title, locale)}</h3>
                    {m.date && <p className="text-xs text-muted">{formatDate(m.date, locale, { dateStyle: "medium" })}</p>}
                    {t(m.description, locale) && <p className="mt-1 text-sm text-ink/80">{t(m.description, locale)}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">{d.media.noVideos}</p>
            )}
          </Section>
        );
      })}
      <Section tone="navy-light">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-navy-800">{d.media.followUs}</h2>
            <p className="mt-2 text-muted">{d.media.subscribe}</p>
          </div>
          <SocialLinks social={settings.social} label={d.media.followUs} dark />
        </div>
      </Section>
    </>
  );
}
