import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth/admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin/* routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get("mahrea_admin_token")?.value;
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
