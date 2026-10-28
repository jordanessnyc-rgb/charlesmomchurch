import type { MetadataRoute } from "next";
import { getCollection } from "@/lib/content";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const staticPaths = ["", "/about", "/prayer", "/love-in-action", "/assistance", "/give", "/sponsorship", "/impact", "/ministries", "/events", "/media", "/visit", "/volunteer", "/contact", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [events, ministries] = await Promise.all([getCollection("events"), getCollection("ministries")]);
  const paths = [...staticPaths, ...events.map((e) => `/events/${e.slug}`), ...ministries.map((m) => `/ministries/${m.slug}`)];
  const now = new Date();
  return paths.flatMap((p) =>
    (["en", "es"] as const).map((lang) => ({
      url: `${base}/${lang}${p}`,
      lastModified: now,
      changeFrequency: p === "" || p === "/events" ? "weekly" : "monthly",
      priority: p === "" ? 1 : 0.7,
      alternates: { languages: { en: `${base}/en${p}`, es: `${base}/es${p}` } },
    })),
  );
}
