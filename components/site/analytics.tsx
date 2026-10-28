import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return (
    <>
      <VercelAnalytics />
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
    </>
  );
}
