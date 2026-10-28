import "server-only";
import { createHash } from "node:crypto";

/** Honeypot + timing check + optional Cloudflare Turnstile verification. */
export type SpamInput = { honeypot?: string; startedAt?: number; turnstileToken?: string; ip?: string };

const buckets = new Map<string, { count: number; reset: number }>();

export function hashIp(ip: string | undefined): string | null {
  if (!ip) return null;
  return createHash("sha256").update(`${ip}:${process.env.AUTH_SECRET ?? "cdm"}`).digest("hex").slice(0, 32);
}

/** Best-effort in-memory rate limit (per serverless instance): 10 submissions per 10 minutes per IP. */
export function rateLimited(ip: string | undefined, limit = 10, windowMs = 10 * 60_000): boolean {
  if (!ip) return false;
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.reset < now) {
    buckets.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }
  b.count += 1;
  return b.count > limit;
}

export function turnstileEnabled(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY && !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
}

export async function verifySpam(input: SpamInput): Promise<{ ok: boolean; reason?: string }> {
  if (input.honeypot && input.honeypot.trim() !== "") return { ok: false, reason: "honeypot" };
  if (typeof input.startedAt === "number" && Date.now() - input.startedAt < 2500) return { ok: false, reason: "too_fast" };
  if (rateLimited(input.ip)) return { ok: false, reason: "rate_limited" };
  if (turnstileEnabled()) {
    if (!input.turnstileToken) return { ok: false, reason: "turnstile_missing" };
    try {
      const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: input.turnstileToken, remoteip: input.ip }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (!json.success) return { ok: false, reason: "turnstile_failed" };
    } catch (err) {
      console.error("turnstile verify failed", err);
      return { ok: false, reason: "turnstile_error" };
    }
  }
  return { ok: true };
}
