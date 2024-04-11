import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
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
  afterAuth(auth, req) {
    const currentPath = new URL(req.url).pathname;
    const pathExceptions = ["/help-center", "/checkout", "/api"];
    const isException = pathExceptions.some((path) =>
      currentPath.startsWith(path)
    );

    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // Skip redirects for exceptions
    if (isException) {
      return NextResponse.next();
    }

    // Handle authenticated users
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

    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
