import { describe, expect, it } from "vitest";
import { en } from "@/lib/i18n/en";
import { es } from "@/lib/i18n/es";

function keys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => (v && typeof v === "object" ? keys(v as Record<string, unknown>, `${prefix}${k}.`) : [`${prefix}${k}`]));
}

describe("dictionaries", () => {
  it("Spanish has exactly the same keys as English", () => {
    expect(keys(es as unknown as Record<string, unknown>).sort()).toEqual(keys(en as unknown as Record<string, unknown>).sort());
  });
  it("no empty strings in either language", () => {
    const empties = (obj: Record<string, unknown>, prefix = ""): string[] =>
      Object.entries(obj).flatMap(([k, v]) => (v && typeof v === "object" ? empties(v as Record<string, unknown>, `${prefix}${k}.`) : typeof v === "string" && v.trim() === "" ? [`${prefix}${k}`] : []));
    expect(empties(en as unknown as Record<string, unknown>)).toEqual([]);
    expect(empties(es as unknown as Record<string, unknown>)).toEqual([]);
  });
});
