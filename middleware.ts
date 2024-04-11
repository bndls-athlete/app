import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs/server";
import { EntityType } from "./types/entityTypes";

export default authMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
  publicRoutes: [
    "/sign-in",
    "/sign-up",
    "/",
    "/reset-password",
    "/privacy-policy",
    "/terms-of-service",
  ],
  ignoredRoutes: ["/api/stripe/webhook"],
  debug: true,
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      // Redirect unauthenticated users to the sign-in page
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const currentPath = new URL(req.url).pathname;

    // Define an array of paths that are exceptions to the usual redirect logic
    const pathExceptions = ["/help-center", "/checkout", "/api"];

    // Check if the current path starts with any of the exceptions
    const isException = pathExceptions.some((path) =>
      currentPath.startsWith(path)
    );

    // Skip redirects for exceptions
    if (isException) {
      return NextResponse.next();
    }

    if (auth.userId) {
      const userType = auth.sessionClaims?.userType;

      // Redirect based on userType
      switch (userType) {
        case EntityType.Athlete:
        case EntityType.Team:
          if (!currentPath.startsWith("/athlete")) {
            return NextResponse.redirect(new URL("/athlete/jobs", req.url));
          }
          break;
        case EntityType.Company:
          if (!currentPath.startsWith("/company")) {
            return NextResponse.redirect(new URL("/company", req.url));
          }
          break;
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
