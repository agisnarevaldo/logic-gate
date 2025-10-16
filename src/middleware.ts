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
        request.nextUrl.pathname.startsWith("/public") ||
        request.nextUrl.pathname === "/favicon.ico" ||
        request.nextUrl.pathname.startsWith("/auth") ||
        request.nextUrl.pathname.endsWith(".mp3") ||
        request.nextUrl.pathname.endsWith(".wav") ||
        request.nextUrl.pathname.endsWith(".woff2") ||
        request.nextUrl.pathname.endsWith(".woff") ||
        request.nextUrl.pathname.endsWith(".ttf")
    ) {
        console.log(`Middleware: Allowing access to ${request.nextUrl.pathname} (excluded path)`)
        return response
    }

    try {
        console.log('Middleware: Getting session...')
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const { data: { session }, error } = await (supabase.auth as any).getSession()
        const isAuthenticated = !!session
        let userRole = 'student' // default role

        // Get user role if authenticated
        if (isAuthenticated && session?.user?.id) {
            try {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single()

                userRole = profile?.role || 'student'
            } catch (profileError) {
                console.error('Middleware: Error fetching user role:', profileError)
            }
        }

        console.log('Middleware: Session check result:', {
            hasSession: isAuthenticated,
            userId: session?.user?.id,
            userRole,
            sessionError: error?.message,
            path: request.nextUrl.pathname
        })

        // Paths that don't require authentication
        const publicPaths = ["/", "/login", "/signup"]
        const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

        // Teacher-only paths
        const isTeacherPath = request.nextUrl.pathname.startsWith('/guru')

        // Log for debugging
        console.log(`Middleware: Path analysis - ${request.nextUrl.pathname}, authenticated: ${isAuthenticated}, public: ${isPublicPath}, teacherPath: ${isTeacherPath}, userRole: ${userRole}`)

        // if the user is not authenticated and trying to access a protected route
        if (!isAuthenticated && !isPublicPath) {
            console.log(`Middleware: Redirecting to login from ${request.nextUrl.pathname} (not authenticated)`)
            return NextResponse.redirect(new URL("/login", request.url))
        }

        // If user is authenticated and on login page, redirect based on role
        if (isAuthenticated && request.nextUrl.pathname === '/login') {
            console.log('Middleware: Authenticated user on login page, redirecting based on role:', userRole)
            if (userRole === 'teacher') {
                return NextResponse.redirect(new URL("/guru", request.url))
            } else {
                return NextResponse.redirect(new URL("/dashboard", request.url))
            }
        }

        // Protect teacher routes - only teachers can access /guru/* paths
        if (isTeacherPath && isAuthenticated && userRole !== 'teacher') {
            console.log(`Middleware: Non-teacher user trying to access teacher route: ${request.nextUrl.pathname}`)
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        // Redirect teachers away from student dashboard
        if (isAuthenticated && userRole === 'teacher' && request.nextUrl.pathname === '/dashboard') {
            console.log('Middleware: Teacher trying to access student dashboard, redirecting to teacher dashboard')
            return NextResponse.redirect(new URL("/guru", request.url))
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
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav|woff2|woff|ttf)$).*)',
    ],
}
