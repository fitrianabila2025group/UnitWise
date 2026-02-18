import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute =
      req.nextUrl.pathname.startsWith("/admin") &&
      !req.nextUrl.pathname.startsWith("/admin/login");
    const isAdminApi = req.nextUrl.pathname.startsWith("/api/admin");

    if ((isAdminRoute || isAdminApi) && token?.role !== "ADMIN" && token?.role !== "EDITOR") {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute =
          req.nextUrl.pathname.startsWith("/admin") &&
          !req.nextUrl.pathname.startsWith("/admin/login");
        const isAdminApi = req.nextUrl.pathname.startsWith("/api/admin");

        if (isAdminRoute || isAdminApi) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
