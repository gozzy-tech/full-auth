import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const authRoutes = ["/login", "/register", "/verify-email"];
const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("access_token")?.value;
  const currentPath = req.nextUrl.pathname;

  // If token exists
  if (authToken) {
    try {
      const decoded: any = jwtDecode(authToken);

      // If token is expired
      if (decoded.exp * 1000 < Date.now()) {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.delete("access_token");
        return res;
      }

      // If authenticated user tries to access auth routes
      if (authRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Authenticated and accessing other routes
      return NextResponse.next();
    } catch (err) {
      console.error("Invalid token:", err);
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("access_token");
      return res;
    }
  }

  // Allow unauthenticated access to public or auth routes
  if (publicRoutes.includes(currentPath) || authRoutes.includes(currentPath)) {
    return NextResponse.next();
  }

  // If not authenticated and accessing protected routes
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", currentPath);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
