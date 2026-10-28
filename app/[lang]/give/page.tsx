import type { Metadata } from "next";
import { Heart, Receipt, ShieldCheck } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/ui/section";
import { DonateForm } from "@/components/forms/donate-form";
import { getCollection } from "@/lib/content";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";
import { stripeConfigured } from "@/lib/stripe";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "give", d.give.title, d.give.subtitle);
}

export default async function GivePage({ params, searchParams }: LangParams & { searchParams: Promise<{ fund?: string; cancelled?: string }> }) {
  const { locale, d, settings } = await pageContext(params);
  const sp = await searchParams;
  const projects = await getCollection("projects");
  const funds = settings.funds.map((f) => ({ id: f.id, name: t(f.name, locale), description: t(f.description, locale) }));
  const defaultFund = funds.some((f) => f.id === sp.fund) ? sp.fund! : "general";
  return (
    <>
      <PageHero kicker={d.nav.give} title={d.give.title} text={d.give.subtitle} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-raised sm:p-8">
            {sp.cancelled && (
              <p className="mb-5 rounded-lg border border-gold-300 bg-gold-50 p-3 text-sm text-navy-900" role="status">
                {d.give.cancelled}
              </p>
            )}
            <DonateForm locale={locale} g={d.give} f={d.form} funds={funds} enabled={stripeConfigured()} defaultFund={defaultFund} />
          </div>
          <div className="space-y-8">
            <div>
              <SectionHeading kicker={d.give.howTitle} title={d.give.howTitle} className="mb-4" />
              <p className="leading-relaxed text-ink/85">{t(settings.givingExplanation, locale)}</p>
              <ul className="mt-5 space-y-3">
                {settings.funds.map((f) => (
                  <li key={f.id} className="flex gap-3">
                    <Heart className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-navy-800">{t(f.name, locale)}</p>
                      <p className="text-sm text-muted">{t(f.description, locale)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-3 rounded-xl bg-navy-50 p-4 text-sm">
                <ShieldCheck className="h-5 w-5 shrink-0 text-navy-800" aria-hidden="true" /> {d.give.secure}
              </li>
              <li className="flex items-start gap-3 rounded-xl bg-navy-50 p-4 text-sm">
                <Receipt className="h-5 w-5 shrink-0 text-navy-800" aria-hidden="true" /> {d.give.receiptNote}
              </li>
            </ul>
            <div>
              <h2 className="text-xl font-semibold text-navy-800">{d.give.otherWays}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{t(settings.otherWaysToGive, locale)}</p>
            </div>
            {projects.filter((p) => p.active).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-navy-800">{d.outreach.projects}</h2>
                <ul className="mt-2 space-y-1 text-sm">
                  {projects
                    .filter((p) => p.active)
                    .map((p) => (
                      <li key={p.id} className="flex items-center gap-2 text-ink/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> {t(p.title, locale)}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
