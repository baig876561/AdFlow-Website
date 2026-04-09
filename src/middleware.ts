import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/client", "/moderator", "/admin"];

// Role-based route access
const ROLE_ROUTES: Record<string, string[]> = {
  "/client": ["client", "admin", "super_admin"],
  "/moderator": ["moderator", "admin", "super_admin"],
  "/admin": ["admin", "super_admin"],
};

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Check if this is a protected route
  const isProtected = PROTECTED_ROUTES.some((route) =>
    path.startsWith(route)
  );

  if (isProtected) {
    if (!user) {
      // Redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(loginUrl);
    }

    // Fetch user role from our users table
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData) {
      // Check role-based access
      for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
        if (
          path.startsWith(routePrefix) &&
          !allowedRoles.includes(userData.role)
        ) {
          // Redirect to their appropriate dashboard
          const redirectMap: Record<string, string> = {
            client: "/client",
            moderator: "/moderator",
            admin: "/admin",
            super_admin: "/admin",
          };
          const redirectTo = redirectMap[userData.role] || "/";
          return NextResponse.redirect(new URL(redirectTo, request.url));
        }
      }
    }
  }

  // Redirect logged-in users away from auth pages
  if (user && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
