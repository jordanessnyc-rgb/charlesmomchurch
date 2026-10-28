import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return { ...pageMetadata(locale, "give/thank-you", d.give.thanksTitle, d.give.thanksText), robots: { index: false } };
}

export default async function ThankYouPage({ params }: LangParams) {
  const { locale, d } = await pageContext(params);
  return (
    <Section tone="cream" className="min-h-[60vh]">
      <div className="mx-auto max-w-2xl rounded-3xl border border-gold-200 bg-white p-10 text-center shadow-raised">
        <CheckCircle2 className="mx-auto h-14 w-14 text-gold-600" aria-hidden="true" />
        <h1 className="mt-4 text-4xl font-semibold text-navy-800">{d.give.thanksTitle}</h1>
        <p className="mt-4 text-lg text-ink/80">{d.give.thanksText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={`/${locale}`} variant="navy">{d.cta.backHome}</ButtonLink>
          <ButtonLink href={`/${locale}/love-in-action`} variant="outline">{d.nav.loveInAction}</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
