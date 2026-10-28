import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { SiteSettings } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";

const NAVY = rgb(11 / 255, 31 / 255, 58 / 255);
const GOLD = rgb(201 / 255, 162 / 255, 39 / 255);
const INK = rgb(0.12, 0.14, 0.2);

/** Renders the official Letter of Need as a branded one-or-more-page PDF. */
export async function renderLetterOfNeed(settings: SiteSettings, locale: Locale): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const body = await pdf.embedFont(StandardFonts.Helvetica);
  const bodyBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const pageW = 612;
  const pageH = 792;
  const margin = 64;
  const width = pageW - margin * 2;
  let page = pdf.addPage([pageW, pageH]);
  let y = pageH - margin;

  const header = () => {
    page.drawRectangle({ x: 0, y: pageH - 92, width: pageW, height: 92, color: NAVY });
    page.drawRectangle({ x: 0, y: pageH - 96, width: pageW, height: 4, color: GOLD });
    page.drawText("CENTRO DE ADORACIÓN E INTERCESIÓN", { x: margin, y: pageH - 44, size: 9, font: bodyBold, color: GOLD });
    page.drawText(settings.churchName, { x: margin, y: pageH - 72, size: 22, font: serif, color: rgb(1, 1, 1) });
    y = pageH - 130;
  };
  const footer = () => {
    const contact = [settings.address.line1, [settings.address.city, settings.address.state].filter(Boolean).join(", "), settings.address.zip]
      .filter(Boolean)
      .join(" · ");
    const line2 = [settings.phone, settings.email].filter(Boolean).join(" · ");
    page.drawLine({ start: { x: margin, y: 54 }, end: { x: pageW - margin, y: 54 }, thickness: 0.5, color: GOLD });
    if (contact) page.drawText(contact, { x: margin, y: 40, size: 8.5, font: body, color: INK });
    if (line2) page.drawText(line2, { x: margin, y: 28, size: 8.5, font: body, color: INK });
  };
  const newPage = () => {
    footer();
    page = pdf.addPage([pageW, pageH]);
    header();
  };
  header();

  const wrap = (text: string, font: typeof body, size: number): string[] => {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > width && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  };
  const drawParagraph = (text: string, font = body, size = 11, gapAfter = 10) => {
    for (const line of wrap(text, font, size)) {
      if (y < 90) newPage();
      page.drawText(line, { x: margin, y, size, font, color: INK });
      y -= size * 1.45;
    }
    y -= gapAfter;
  };

  const date = settings.letterOfNeed.date
    ? new Date(settings.letterOfNeed.date + "T12:00:00")
    : new Date();
  const dateStr = new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", { dateStyle: "long" }).format(date);

  page.drawText(settings.letterOfNeed.title[locale], { x: margin, y, size: 20, font: serif, color: NAVY });
  y -= 30;
  page.drawText(dateStr, { x: margin, y, size: 10.5, font: body, color: INK });
  y -= 28;

  for (const para of settings.letterOfNeed.body[locale].split(/\n\s*\n/)) {
    drawParagraph(para.trim());
  }

  y -= 6;
  if (y < 120) newPage();
  drawParagraph(settings.letterOfNeed.signatory, bodyBold, 11, 2);
  drawParagraph(settings.letterOfNeed.signatoryTitle[locale], body, 10.5, 2);
  footer();

  pdf.setTitle(`${settings.letterOfNeed.title[locale]} – ${settings.churchName}`);
  pdf.setAuthor(settings.legalName);
  return pdf.save();
}
