import { NextResponse } from "next/server";
import { auth } from "@/auth";

// `middleware.ts` was renamed to `proxy.ts` in this Next.js version — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
// `auth()` wraps the Proxy request handler the same way it used to wrap
// `middleware`.
const PUBLIC_ROUTES = ["/login", "/register"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isLoggedIn && !isPublicRoute) {
    const redirectUrl = new URL("/login", req.nextUrl);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
