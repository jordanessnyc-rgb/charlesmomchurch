import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined, set: () => {}, delete: () => {} }) }));

describe("admin session tokens", () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = "test-secret";
    process.env.ADMIN_PASSWORD = "correct horse";
  });
  it("round-trips a valid token and rejects tampering/expiry", async () => {
    const { createSessionToken, verifySessionToken } = await import("@/lib/auth");
    const token = createSessionToken();
    expect(verifySessionToken(token)).toBe(true);
    expect(verifySessionToken(token.slice(0, -2) + "zz")).toBe(false);
    expect(verifySessionToken(token, Date.now() + 8 * 24 * 3600_000)).toBe(false);
    expect(verifySessionToken("admin.123.abc")).toBe(false);
  });
  it("checks the password in constant time without leaking length mismatches as errors", async () => {
    const { checkPassword } = await import("@/lib/auth");
    expect(checkPassword("correct horse")).toBe(true);
    expect(checkPassword("wrong")).toBe(false);
    expect(checkPassword("")).toBe(false);
  });
});
