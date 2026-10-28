import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageHero, Section } from "@/components/ui/section";
import { AssistanceForm } from "@/components/forms/public-forms";
import { pageContext, pageMetadata, type LangParams } from "@/lib/page";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { locale, d } = await pageContext(params);
  return pageMetadata(locale, "assistance", d.assistance.title, d.assistance.subtitle);
}

export default async function AssistancePage({ params }: LangParams) {
  const { locale, d } = await pageContext(params);
  return (
    <>
      <PageHero kicker={d.nav.assistance} title={d.assistance.title} text={d.assistance.subtitle} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <AssistanceForm locale={locale} d={d} a={d.assistance} />
          </div>
          <aside>
            <div className="rounded-2xl border border-gold-200 bg-gold-50 p-6">
              <ShieldCheck className="h-8 w-8 text-gold-700" aria-hidden="true" />
              <p className="mt-3 text-sm leading-relaxed text-navy-900">{d.assistance.confidentialNote}</p>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-ink/80">
              {Object.values(d.assistance.types)
                .slice(0, 5)
                .map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> {x}
                  </li>
                ))}
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
