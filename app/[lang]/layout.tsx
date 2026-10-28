import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Analytics } from "@/components/site/analytics";
import { getSettings } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { siteUrl } from "@/lib/utils";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["500", "600", "700"], variable: "--font-cormorant", display: "swap" });

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const d = getDictionary(locale);
  const base = siteUrl();
  return {
    metadataBase: new URL(base),
    title: { default: `${d.siteName} · ${d.siteFullName}`, template: `%s · ${d.siteName}` },
    description: d.home.heroSubtitle,
    applicationName: d.siteName,
    keywords: ["church", "iglesia", "New York", "Casa de Milagros", "oración", "prayer", "adoración", "worship", "community outreach", "ayuda comunitaria"],
    openGraph: { type: "website", siteName: d.siteName, locale: locale === "es" ? "es_US" : "en_US", images: [{ url: "/images/logo.jpg", width: 1200, height: 1200 }] },
    twitter: { card: "summary", images: ["/images/logo.jpg"] },
    icons: { icon: "/images/logo.jpg", apple: "/images/logo.jpg" },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = { themeColor: "#0b1f3a", width: "device-width", initialScale: 1 };

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const settings = await getSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: settings.legalName,
    alternateName: settings.churchName,
    url: `${siteUrl()}/${lang}`,
    logo: `${siteUrl()}/images/logo.jpg`,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: settings.address.line1
      ? { "@type": "PostalAddress", streetAddress: settings.address.line1, addressLocality: settings.address.city, addressRegion: settings.address.state, postalCode: settings.address.zip, addressCountry: "US" }
      : undefined,
    sameAs: Object.values(settings.social).filter(Boolean),
  };
  return (
    <html lang={lang} className={`${inter.variable} ${cormorant.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header locale={lang} d={d} churchName={settings.churchName} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={lang} d={d} settings={settings} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Analytics />
      </body>
    </html>
  );
}
