import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/types";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/unauthorized",
  "/session-expired",
  "/api",
  "/_next",
  "/favicon.ico",
  "/public",
];

// Role-based route access
const ROLE_ROUTES: Record<UserRole, string[]> = {
  SUPER_ADMIN: ["/dashboard", "/dashboard/owner", "/organizations", "/settings"],
  RESTAURANT_OWNER: [
    "/dashboard",
    "/dashboard/owner",
    "/dashboard/manager",
    "/pos",
    "/kitchen",
    "/delivery",
    "/orders",
    "/menu",
    "/inventory",
    "/employees",
    "/customers",
    "/analytics",
    "/reports",
    "/reservations",
    "/tables",
    "/settings",
  ],
  MANAGER: [
    "/dashboard",
    "/dashboard/manager",
    "/pos",
    "/kitchen",
    "/orders",
    "/menu",
    "/inventory",
    "/employees",
    "/customers",
    "/analytics",
    "/reservations",
    "/tables",
    "/settings",
  ],
  CASHIER: ["/pos", "/orders"],
  WAITER: ["/orders", "/tables", "/reservations"],
  KITCHEN_STAFF: ["/kitchen"],
  DELIVERY_DRIVER: ["/delivery"],
  CUSTOMER: [],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Note: This application uses JWT tokens stored in localStorage (client-side).
  // The middleware cannot access localStorage, so authentication is handled client-side.
  // Protected routes will be rendered client-side and redirect if not authenticated.
  // This is a standard pattern for JWT-based authentication with localStorage.

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..+).*)",
  ],
};