import { describe, expect, it } from "vitest";
import { confirmationCopy, formSchemas, formTypes, teamNotification } from "@/lib/forms";

describe("form schemas", () => {
  it("accepts a valid prayer request and defaults the flags", () => {
    const r = formSchemas.prayer.safeParse({ name: "Ana López", request: "Please pray for my mother's health." });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.confidential).toBe(false);
      expect(r.data.contactMe).toBe(false);
    }
  });
  it("rejects an assistance request without a phone or need type", () => {
    const r = formSchemas.assistance.safeParse({ name: "Ana", description: "Necesito ayuda con comida", needTypes: [] });
    expect(r.success).toBe(false);
  });
  it("requires at least one volunteer area", () => {
    expect(formSchemas.volunteer.safeParse({ name: "Carlos Pérez", email: "c@example.com", areas: [] }).success).toBe(false);
    expect(formSchemas.volunteer.safeParse({ name: "Carlos Pérez", email: "c@example.com", areas: ["outreach"] }).success).toBe(true);
  });
  it("rejects bad emails", () => {
    expect(formSchemas.contact.safeParse({ name: "Ana", email: "nope", message: "Hello there" }).success).toBe(false);
  });
  it("has bilingual confirmation copy for every form type", () => {
    for (const type of formTypes) {
      for (const locale of ["en", "es"] as const) {
        const c = confirmationCopy(type, locale, "Ana");
        expect(c.subject.length).toBeGreaterThan(5);
        expect(c.text).toContain("Ana");
      }
    }
  });
  it("team notification strips spam fields and flags confidential requests", () => {
    const n = teamNotification("prayer", { name: "Ana", request: "x", confidential: true, honeypot: "", startedAt: 1 }, "es", "https://example.com/admin/inbox/1");
    expect(n.subject).toContain("[CONFIDENTIAL]");
    expect(n.text).not.toContain("honeypot");
    expect(n.text).toContain("https://example.com/admin/inbox/1");
  });
});
