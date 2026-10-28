import type { Metadata } from "next";
import { PageHero, Section } from "@/components/ui/section";
import { t } from "@/lib/i18n/config";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";
import { formatDate, paragraphs } from "@/lib/utils";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "privacy", d.privacy.title, d.privacy.title);
}

export default async function PrivacyPage({ params }: LangParams) {
  const { locale, d, settings } = await pageContext(params);
  return (
    <>
      <PageHero title={d.privacy.title} text={`${d.privacy.updated}: ${formatDate(settings.privacyUpdated, locale, { dateStyle: "long" })}`} />
      <Section>
        <div className="prose-church mx-auto max-w-3xl">
          {paragraphs(t(settings.privacyPolicy, locale)).map((p, i) =>
            p.type === "h" ? <h2 key={i}>{p.text}</h2> : <p key={i}>{p.text}</p>,
          )}
        </div>
      </Section>
    </>
  );
}
