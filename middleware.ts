import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-please-change-32-characters-long",
);
const COOKIE_NAME = "bm_session";

async function hasSession(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

/** /a/[subdomain]/dashboard, /practice, ... /admin/* — 로그인 필요 */
function isSubsiteProtected(pathname: string): boolean {
  const m = pathname.match(/^\/a\/[^/]+(\/.+)?$/);
  if (!m) return false;
  const rest = m[1] ?? "";
  if (!rest || rest === "/") return false;
  const protectedPrefixes = [
    "/dashboard",
    "/practice",
    "/wrong",
    "/mock",
    "/analysis",
    "/board",
    "/mypage",
    "/admin",
  ];
  return protectedPrefixes.some((p) => rest === p || rest.startsWith(`${p}/`));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth =
    (pathname.startsWith("/academy") && !pathname.startsWith("/academy/setup")) ||
    pathname.startsWith("/admin") ||
    isSubsiteProtected(pathname);

  if (needsAuth && !(await hasSession(req))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/academy/:path*", "/admin/:path*", "/a/:subdomain/:path*"],
};
