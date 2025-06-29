import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    let token = null;
    
    try {
        token = await getToken({ 
            req: request,
            secret: process.env.NEXTAUTH_SECRET 
        });
    } catch {
        // If JWT token is corrupted, treat as unauthenticated
        console.log("JWT error in middleware, treating as unauthenticated");
        token = null;
    }
    
    const isAuthenticated = !!token

    // Paths that don't require authentication
    const publicPaths = ["/", "/login", "/signup"]
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

    // if the user is authenticated and trying to access a public route
    if (isAuthenticated && isPublicPath) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}