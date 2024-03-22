import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/sign-in", "/sign-up", "/"],
  apiRoutes: [],
  afterAuth(auth, req) {
    // Handle users who aren't authenticated and trying to access a protected route
    if (!auth.userId && !auth.isPublicRoute) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Get the current path
    const currentPath = new URL(req.url).pathname;

    // Skip redirects for API routes
    if (currentPath.startsWith("/api")) {
      return NextResponse.next();
    }

    // Redirect based on userType
    if (auth.userId) {
      const userType = auth.sessionClaims?.userType;

      // Redirect athlete to athlete dashboard
      if (userType === "athlete" && !currentPath.startsWith("/athlete")) {
        return NextResponse.redirect(new URL("/athlete", req.url));
      }

      // Redirect athlete team to team dashboard
      if (userType === "team" && !currentPath.startsWith("/team")) {
        return NextResponse.redirect(new URL("/team", req.url));
      }

      // Redirect company to company dashboard
      if (userType === "company" && !currentPath.startsWith("/company")) {
        return NextResponse.redirect(new URL("/company", req.url));
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
