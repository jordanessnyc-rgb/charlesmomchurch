import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Mail, User } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { Photo } from "@/components/ui/placeholder-image";
import { MinistryInterestForm } from "@/components/forms/public-forms";
import { getCollection, getItemBySlug } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, d } = await pageContext(params as LangParams["params"]);
  const { slug } = await params;
  const m = await getItemBySlug("ministries", slug);
  if (!m) return { title: d.notFound.title };
  return pageMetadata(locale, `ministries/${slug}`, t(m.name, locale), t(m.summary, locale), m.image || undefined);
}

export default async function MinistryPage({ params }: Props) {
  const { locale, d } = await pageContext(params as LangParams["params"]);
  const { slug } = await params;
  const m = await getItemBySlug("ministries", slug);
  if (!m) notFound();
  const others = (await getCollection("ministries")).filter((x) => x.id !== m.id);
  const gallery = m.gallery
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    <>
      <PageHero kicker={d.nav.ministries} title={t(m.name, locale)} text={t(m.summary, locale)} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Photo src={m.image} alt={t(m.name, locale)} label={d.misc.photoComingSoon} className="aspect-[16/9] rounded-2xl" sizes="(max-width: 1024px) 100vw, 60vw" />
            <div className="prose-church mt-8 text-lg">
              {t(m.description, locale)
                .split(/\n\s*\n/)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
            <h2 className="mt-8 text-2xl font-semibold text-navy-800">{d.ministries.activities}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {t(m.activities, locale)
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean)
                .map((a) => (
                  <li key={a} className="rounded-full bg-navy-50 px-3 py-1 text-sm text-navy-800">
                    {a}
                  </li>
                ))}
            </ul>
            {gallery.length > 0 && (
              <>
                <h2 className="mt-8 text-2xl font-semibold text-navy-800">{d.ministries.photos}</h2>
                <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {gallery.map((g) => (
                    <li key={g}>
                      <Photo src={g} alt="" className="aspect-square rounded-xl" sizes="33vw" />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl border border-line bg-cream p-6">
              <dl className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-navy-800">{d.ministries.schedule}</dt>
                    <dd className="text-ink/80">{t(m.schedule, locale)}</dd>
                  </div>
                </div>
                {m.leader && (
                  <div className="flex gap-3">
                    <User className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                    <div>
                      <dt className="font-semibold text-navy-800">{d.ministries.leader}</dt>
                      <dd className="text-ink/80">{m.leader}</dd>
                    </div>
                  </div>
                )}
                {m.contactEmail && (
                  <div className="flex gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                    <div>
                      <dt className="font-semibold text-navy-800">{d.ministries.contact}</dt>
                      <dd>
                        <a href={`mailto:${m.contactEmail}`} className="text-navy-800 underline">{m.contactEmail}</a>
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>
            {m.registration && (
              <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <SectionHeading title={d.ministries.joinTitle} text={d.ministries.joinIntro} className="mb-5" />
                <MinistryInterestForm locale={locale} d={d} m={d.ministries} ministryId={m.id} ministryName={t(m.name, "en")} />
              </div>
            )}
          </aside>
        </div>
      </Section>
      <Section tone="cream">
        <h2 className="mb-5 text-2xl font-semibold text-navy-800">{d.nav.ministries}</h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.id}>
              <Link href={`/${locale}/ministries/${o.slug}`} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-navy-800 hover:border-gold-400">
                {t(o.name, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
