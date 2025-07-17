import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    // Create Supabase client
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )
    
    // Skip middleware for static files and API routes
    if (
        request.nextUrl.pathname.startsWith("/_next") ||
        request.nextUrl.pathname.startsWith("/api") ||
        request.nextUrl.pathname.startsWith("/images") ||
        request.nextUrl.pathname.startsWith("/auth")
    ) {
        return supabaseResponse
    }
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    
    const isAuthenticated = !!user

    // Paths that don't require authentication
    const publicPaths = ["/", "/signup"]
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

    // if the user is not authenticated and trying to access a protected route
    if (!isAuthenticated && !isPublicPath) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    // if the user is authenticated and trying to access a public route
    if (isAuthenticated && isPublicPath) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}