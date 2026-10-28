import { NextResponse, type NextRequest } from "next/server";
import { getSettings } from "@/lib/content";
import { isLocale } from "@/lib/i18n/config";
import { renderLetterOfNeed } from "@/lib/pdf";

export const runtime = "nodejs";

/** GET /api/letter-of-need?lang=en|es → the official Letter of Need as a PDF. */
export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get("lang");
  const locale = isLocale(lang) ? lang : "en";
  const settings = await getSettings();
  if (settings.letterOfNeedPdfUrl) return NextResponse.redirect(settings.letterOfNeedPdfUrl, 302);
  const bytes = await renderLetterOfNeed(settings, locale);
  const filename = locale === "es" ? "Carta-de-Necesidad-Casa-de-Milagros.pdf" : "Letter-of-Need-Casa-de-Milagros.pdf";
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "public, max-age=300",
    },
  });
}
