import type { Field } from "./schemas";
import { slugify, youtubeId } from "@/lib/utils";

type Obj = Record<string, unknown>;

function str(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

/** Coerces one field value from the client payload into the stored shape. Throws on missing required values. */
export function coerceField(field: Field, value: unknown): unknown {
  switch (field.type) {
    case "bilingual":
    case "bilingual-textarea": {
      const v = (value ?? {}) as Obj;
      const out = { en: str(v.en).trim(), es: str(v.es).trim() };
      if (field.required && !out.en && !out.es) throw new Error(`${field.label} is required`);
      if (!out.es) out.es = out.en;
      if (!out.en) out.en = out.es;
      return out;
    }
    case "bool":
      return value === true || value === "true" || value === "on";
    case "number": {
      const n = Number(value ?? 0);
      if (!Number.isFinite(n)) throw new Error(`${field.label} must be a number`);
      return field.money ? Math.round(n * 100) : n;
    }
    case "slug": {
      const s = slugify(str(value));
      return s;
    }
    case "list": {
      const rows = Array.isArray(value) ? value : [];
      return rows.map((row) => coerceObject(field.fields ?? [], (row ?? {}) as Obj));
    }
    case "select": {
      const s = str(value);
      if (field.options && !field.options.some((o) => o.value === s)) return field.options[0]?.value ?? "";
      return s;
    }
    case "url":
    case "image": {
      const s = str(value).trim();
      if (s && !/^(https?:\/\/|\/)/.test(s)) throw new Error(`${field.label} must be a full URL starting with https://`);
      return s;
    }
    case "email": {
      const s = str(value).trim();
      if (s && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) throw new Error(`${field.label} must be a valid email`);
      return s;
    }
    default: {
      let s = str(value).trim();
      if (field.key === "youtubeId") s = youtubeId(s);
      if (field.required && !s) throw new Error(`${field.label} is required`);
      return s;
    }
  }
}

/** Coerces a flat object by a field list (keys may be dotted paths into nested objects). */
export function coerceObject(fields: Field[], input: Obj, base: Obj = {}): Obj {
  const out: Obj = structuredClone(base);
  for (const f of fields) {
    const value = getPath(input, f.key);
    // A field missing from the payload keeps its stored value; a required field with no value anywhere fails.
    if (value === undefined && getPath(base, f.key) !== undefined) continue;
    setPath(out, f.key, coerceField(f, value));
  }
  return out;
}

export function getPath(obj: Obj, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, k) => (acc && typeof acc === "object" ? (acc as Obj)[k] : undefined), obj);
}
export function setPath(obj: Obj, path: string, value: unknown): void {
  const keys = path.split(".");
  let cur: Obj = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!cur[k] || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k] as Obj;
  }
  cur[keys[keys.length - 1]] = value;
}
