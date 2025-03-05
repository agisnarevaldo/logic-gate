import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request:NextRequest) {
    const token = await getToken({ req: request })
    const isAuthenticated = !!token

    // Paths's that don't require authentication
    const publicPaths = ["/", "login", "/signup"]
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

    // Allow access to static files and API routes
    if (
        request.nextUrl.pathname.startsWith("/_next") ||
        request.nextUrl.pathname.startsWith("/api") ||
        request.nextUrl.pathname.startsWith("/images")
    ) {
        return NextResponse.next()
    }

    // if the user is not authenticated and trying to access a protected route
    if (!isAuthenticated && !isPublicPath) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // if the user is authenticated and tring to access a public route
    if (isAuthenticated && isPublicPath) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}