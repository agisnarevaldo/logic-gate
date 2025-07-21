import { NextRequest, NextResponse } from "next/server"
import { createClient } from './utils/supabase/server'

export async function middleware(request: NextRequest) {
    console.log(`Middleware: Processing ${request.method} ${request.nextUrl.pathname}`)
    
    const response = NextResponse.next()
    const supabase = createClient(request, response)

    // Allow access to static files, API routes, and auth callbacks
    if (
        request.nextUrl.pathname.startsWith("/_next") ||
        request.nextUrl.pathname.startsWith("/api") ||
        request.nextUrl.pathname.startsWith("/images") ||
        request.nextUrl.pathname === "/favicon.ico" ||
        request.nextUrl.pathname.startsWith("/auth")
    ) {
        console.log(`Middleware: Allowing access to ${request.nextUrl.pathname} (excluded path)`)
        return response
    }

    try {
        console.log('Middleware: Getting session...')
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const { data: { session }, error } = await (supabase.auth as any).getSession()
        const isAuthenticated = !!session

        console.log('Middleware: Session check result:', {
            hasSession: isAuthenticated,
            userId: session?.user?.id,
            sessionError: error?.message,
            path: request.nextUrl.pathname
        })

        // Paths that don't require authentication
        const publicPaths = ["/", "/login", "/signup"]
        const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

        // Log for debugging
        console.log(`Middleware: Path analysis - ${request.nextUrl.pathname}, authenticated: ${isAuthenticated}, public: ${isPublicPath}`)

        // if the user is not authenticated and trying to access a protected route
        if (!isAuthenticated && !isPublicPath) {
            console.log(`Middleware: Redirecting to login from ${request.nextUrl.pathname} (not authenticated)`)
            return NextResponse.redirect(new URL("/login", request.url))
        }

        // If user is authenticated and on login page, redirect to dashboard
        if (isAuthenticated && request.nextUrl.pathname === '/login') {
            console.log('Middleware: Authenticated user on login page, redirecting to dashboard')
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        console.log('Middleware: Allowing request to proceed')
        return response
    } catch (error) {
        console.error('Middleware error:', error)
        // If there's an error, redirect to login for protected routes only
        const publicPaths = ["/", "/login", "/signup"]
        if (!publicPaths.includes(request.nextUrl.pathname)) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
        return response
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
