import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "cdm_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // one week

function secret(): string | null {
  return process.env.AUTH_SECRET || null;
}

export function adminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD && !!secret();
}

function sign(payload: string): string {
  return createHmac("sha256", secret() ?? "").update(payload).digest("base64url");
}

export function createSessionToken(now = Date.now()): string {
  const exp = Math.floor(now / 1000) + MAX_AGE_SECONDS;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null, now = Date.now()): boolean {
  if (!token || !secret()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expStr, sig] = parts;
  const payload = `${role}.${expStr}`;
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const exp = Number(expStr);
  return role === "admin" && Number.isFinite(exp) && exp * 1000 > now;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export async function setAdminCookie(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
