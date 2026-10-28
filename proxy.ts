import { NextResponse, type NextRequest } from "next/server";

const locales = ["en", "es"];
const defaultLocale = "en";

/** Picks a locale from the saved cookie, then the browser's Accept-Language, then the default. */
function pickLocale(req: NextRequest): string {
  const cookie = req.cookies.get("lang")?.value;
  if (cookie && locales.includes(cookie)) return cookie;
  const accept = req.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().toLowerCase().slice(0, 2);
    if (locales.includes(code)) return code;
  }
  return defaultLocale;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin area: require the session cookie to exist (it is verified server-side in the layout).
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!req.cookies.get("cdm_admin")?.value) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  if (pathname.startsWith("/admin")) return NextResponse.next();

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) {
    const current = pathname.split("/")[1];
    const res = NextResponse.next();
    if (req.cookies.get("lang")?.value !== current) {
      res.cookies.set("lang", current, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return res;
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${pickLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Everything except API routes, Next internals, and static files.
    "/((?!api|_next|_vercel|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|images|documents|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml|pdf)$).*)",
  ],
};
