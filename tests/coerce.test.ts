import { describe, expect, it } from "vitest";
import { coerceObject } from "@/lib/admin/coerce";
import { collectionSchemas, settingsGroups } from "@/lib/admin/schemas";
import { defaultCollections, defaultSettings } from "@/lib/content/defaults";
import { collectionNames } from "@/lib/content/types";

describe("admin coercion", () => {
  it("every default item passes its collection schema unchanged in shape", () => {
    for (const name of collectionNames) {
      for (const item of defaultCollections[name]) {
        const { id: _i, sort: _s, published: _p, ...data } = item;
        const out = coerceObject(collectionSchemas[name].fields, data as Record<string, unknown>);
        for (const f of collectionSchemas[name].fields) expect(out).toHaveProperty(f.key);
      }
    }
  });
  it("every settings group round-trips the default settings", () => {
    for (const g of settingsGroups) {
      const out = coerceObject(g.fields, defaultSettings as unknown as Record<string, unknown>, defaultSettings as unknown as Record<string, unknown>);
      expect(out.churchName).toBe(defaultSettings.churchName);
      expect((out.serviceTimes as unknown[]).length).toBe(defaultSettings.serviceTimes.length);
    }
  });
  it("fills the missing language, converts money to cents and extracts YouTube ids", () => {
    const out = coerceObject(collectionSchemas.projects.fields, { title: { en: "Food" }, description: { es: "Comida" }, goalCents: 25.5, slug: "Food Drive!" });
    expect(out.title).toEqual({ en: "Food", es: "Food" });
    expect(out.description).toEqual({ en: "Comida", es: "Comida" });
    expect(out.goalCents).toBe(2550);
    expect(out.slug).toBe("food-drive");
    const m = coerceObject(collectionSchemas.media.fields, { title: { en: "x" }, youtubeId: "https://youtu.be/dQw4w9WgXcQ?t=1" });
    expect(m.youtubeId).toBe("dQw4w9WgXcQ");
  });
  it("rejects a required field with no value and a bad URL", () => {
    expect(() => coerceObject(collectionSchemas.events.fields, {})).toThrow(/required/);
    expect(() => coerceObject(collectionSchemas.events.fields, { title: { en: "x" }, description: { en: "y" }, startsAt: "2026-01-01T00:00:00Z", image: "not a url" })).toThrow(/URL/);
  });
});
