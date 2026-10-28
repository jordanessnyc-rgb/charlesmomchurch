import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/lib/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return raw.replace(/\/$/, "");
}

export function formatDate(iso: string, locale: Locale, opts: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" }): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", { timeZone: "America/New_York", ...opts }).format(d);
}

export function formatTime(iso: string, locale: Locale): string {
  return formatDate(iso, locale, { hour: "numeric", minute: "2-digit" });
}

export function formatDateTime(iso: string, locale: Locale): string {
  return formatDate(iso, locale, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function formatMoney(cents: number, locale: Locale = "en"): string {
  return new Intl.NumberFormat(locale === "es" ? "es-US" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function newId(prefix = ""): string {
  const rand = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  return prefix ? `${prefix}-${rand.slice(0, 8)}` : rand;
}

/** Splits text on blank lines into paragraphs; a line starting with "## " becomes a heading. */
export function paragraphs(text: string): { type: "h" | "p"; text: string }[] {
  const out: { type: "h" | "p"; text: string }[] = [];
  for (const block of text.split(/\n\s*\n/)) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    const lines = trimmed.split("\n");
    if (lines[0].startsWith("## ")) {
      out.push({ type: "h", text: lines[0].slice(3).trim() });
      const rest = lines.slice(1).join("\n").trim();
      if (rest) out.push({ type: "p", text: rest });
    } else out.push({ type: "p", text: trimmed });
  }
  return out;
}

export function youtubeId(input: string): string {
  const m = input.match(/(?:youtu\.be\/|v=|\/embed\/|\/live\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : input.trim();
}
