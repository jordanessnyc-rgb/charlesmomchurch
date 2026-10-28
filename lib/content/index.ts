import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { defaultCollections, defaultSettings } from "./defaults";
import type { CollectionName, Collections, EventItem, SiteSettings } from "./types";

export * from "./types";
export { defaultSettings, defaultCollections };

function deepMerge<T>(base: T, patch: unknown): T {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return (patch ?? base) as T;
  if (!base || typeof base !== "object" || Array.isArray(base)) return patch as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
    const b = (base as Record<string, unknown>)[k];
    out[k] = b && typeof b === "object" && !Array.isArray(b) && v && typeof v === "object" && !Array.isArray(v) ? deepMerge(b, v) : v;
  }
  return out as T;
}

/** Site settings: database row merged over the defaults so new fields always have a value. */
export async function getSettings(): Promise<SiteSettings> {
  const db = getDb();
  if (!db) return defaultSettings;
  try {
    const row = await db.query.siteSettings.findFirst({ where: eq(schema.siteSettings.id, "site") });
    return row ? deepMerge(defaultSettings, row.data) : defaultSettings;
  } catch (err) {
    console.error("getSettings failed, using defaults", err);
    return defaultSettings;
  }
}

export async function saveSettings(data: SiteSettings): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not configured");
  await db
    .insert(schema.siteSettings)
    .values({ id: "site", data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.siteSettings.id, set: { data, updatedAt: new Date() } });
}

type Options = { includeUnpublished?: boolean };

/**
 * Items of a collection. When the database has no rows for the collection the defaults are
 * returned, so the site looks complete before anything is entered in the admin.
 */
export async function getCollection<K extends CollectionName>(name: K, opts: Options = {}): Promise<Collections[K][]> {
  const db = getDb();
  const defaults = defaultCollections[name] as Collections[K][];
  if (!db) return opts.includeUnpublished ? defaults : defaults.filter((i) => i.published);
  try {
    const rows = await db
      .select()
      .from(schema.contentItems)
      .where(
        opts.includeUnpublished
          ? eq(schema.contentItems.collection, name)
          : and(eq(schema.contentItems.collection, name), eq(schema.contentItems.published, true)),
      )
      .orderBy(asc(schema.contentItems.sort), asc(schema.contentItems.createdAt));
    const seeded = await isSeeded(name);
    if (!seeded) return opts.includeUnpublished ? defaults : defaults.filter((i) => i.published);
    return rows
      .filter((r) => !r.id.endsWith("-tombstone"))
      .map((r) => ({ ...(r.data as object), id: r.id, sort: r.sort, published: r.published }) as Collections[K]);
  } catch (err) {
    console.error(`getCollection(${name}) failed, using defaults`, err);
    return defaults.filter((i) => i.published);
  }
}

/** A collection counts as "seeded" once it has at least one row (published or not). */
async function isSeeded(name: CollectionName): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const row = await db.select({ id: schema.contentItems.id }).from(schema.contentItems).where(eq(schema.contentItems.collection, name)).limit(1);
  return row.length > 0;
}

export async function getItem<K extends CollectionName>(name: K, id: string): Promise<Collections[K] | null> {
  const items = await getCollection(name, { includeUnpublished: true });
  return items.find((i) => i.id === id) ?? null;
}

export async function getItemBySlug<K extends "events" | "ministries" | "projects">(name: K, slug: string): Promise<Collections[K] | null> {
  const items = await getCollection(name);
  return items.find((i) => i.slug === slug) ?? null;
}

export async function upsertItem<K extends CollectionName>(name: K, item: Collections[K]): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not configured");
  const seeded = await isSeeded(name);
  if (!seeded) {
    // First edit of a collection: copy the defaults in so nothing silently disappears.
    for (const d of defaultCollections[name] as Collections[K][]) {
      if (d.id === item.id) continue;
      await db.insert(schema.contentItems).values(rowFor(name, d)).onConflictDoNothing();
    }
  }
  const { id, sort, published, ...data } = item;
  await db
    .insert(schema.contentItems)
    .values({ id, collection: name, data, sort, published, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.contentItems.id, set: { data, sort, published, updatedAt: new Date() } });
}

function rowFor<K extends CollectionName>(name: K, item: Collections[K]) {
  const { id, sort, published, ...data } = item;
  return { id, collection: name, data, sort, published };
}

export async function deleteItem(name: CollectionName, id: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not configured");
  const seeded = await isSeeded(name);
  if (!seeded) {
    // Deleting a default item before the collection was ever edited: materialise the other
    // defaults so the deleted one does not reappear.
    for (const d of defaultCollections[name]) {
      if (d.id === id) continue;
      await db.insert(schema.contentItems).values(rowFor(name, d)).onConflictDoNothing();
    }
    if (defaultCollections[name].length <= 1) {
      await db.insert(schema.contentItems).values({ id: `${name}-tombstone`, collection: name, data: {}, sort: 0, published: false }).onConflictDoNothing();
    }
    return;
  }
  await db.delete(schema.contentItems).where(and(eq(schema.contentItems.collection, name), eq(schema.contentItems.id, id)));
}

export async function getUpcomingEvents(limit?: number): Promise<EventItem[]> {
  const events = await getCollection("events");
  const now = Date.now() - 6 * 3600_000; // keep today's events visible until late evening
  const upcoming = events
    .filter((e) => new Date(e.endsAt || e.startsAt).getTime() >= now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  return limit ? upcoming.slice(0, limit) : upcoming;
}

export async function getPastEvents(limit = 12): Promise<EventItem[]> {
  const events = await getCollection("events");
  const now = Date.now() - 6 * 3600_000;
  return events
    .filter((e) => new Date(e.endsAt || e.startsAt).getTime() < now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
    .slice(0, limit);
}
