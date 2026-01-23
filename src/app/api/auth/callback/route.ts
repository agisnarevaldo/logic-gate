import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  console.log('Callback: Auth callback route called')
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  console.log('Callback: URL params:', {
    hasCode: !!code,
    origin,
    next,
    error,
    error_description,
    fullUrl: request.url
  })

  // Handle OAuth error
  if (error) {
    console.error('Callback: OAuth error received:', error, error_description)
    const errorMessage = error_description || error
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`)
  }

  if (code) {
    console.log('Callback: Processing authorization code...')

    try {
      // Create the redirect response FIRST
      const redirectUrl = new URL(next, origin)
      const response = NextResponse.redirect(redirectUrl)

      // Track cookies that will be set
      const cookiesToSetOnResponse: { name: string; value: string; options: CookieOptions }[] = []

      // Create Supabase client that collects cookies
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
              // Collect cookies for later
              cookiesToSetOnResponse.push(...cookiesToSet)
              console.log(`Callback: setAll called with ${cookiesToSet.length} cookies`)
            },
          },
        }
      )

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const { data, error: exchangeError } = await (supabase.auth as any).exchangeCodeForSession(code)

      console.log('Callback: Code exchange result:', {
        success: !exchangeError,
        error: exchangeError?.message,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        userEmail: data?.user?.email,
        cookiesCollected: cookiesToSetOnResponse.length
      })

      if (exchangeError) {
        console.error('Callback: Error exchanging code for session:', exchangeError)
        let errorMessage = exchangeError.message || 'Could not authenticate user'
        if (errorMessage.includes('user_profiles') && errorMessage.includes('does not exist')) {
          errorMessage = 'Database not properly configured. Please contact administrator.'
        }
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`)
      }

      if (data?.user) {
        console.log('Callback: Session created successfully for user:', data.user.id)

        // Force a session read which should trigger cookie setting
        console.log('Callback: Force reading session to trigger cookie writes...')
        await (supabase.auth as any).getSession()

        console.log('Callback: After getSession, cookies collected:', cookiesToSetOnResponse.length)

        // NOW set all collected cookies on the response
        cookiesToSetOnResponse.forEach(({ name, value, options }) => {
          // For development (localhost), modify cookie options
          const cookieOptions: CookieOptions = { ...options }
          if (process.env.NODE_ENV === 'development') {
            delete cookieOptions.secure
            cookieOptions.sameSite = 'lax'
          }

          console.log(`Callback: Setting cookie: ${name}`)
          response.cookies.set(name, value, cookieOptions)
        })

        // Log all cookies being sent
        const allCookies = response.cookies.getAll()
        console.log('Callback: Final cookies on response:', allCookies.map(c => c.name))

        // Set cache headers
        response.headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')

        return response
      } else {
        console.error('Callback: No user data received after successful code exchange')
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication successful but no user data received')}`)
      }
    } catch (error) {
      console.error('Callback: Exception during code exchange:', error)
      const errorMessage = error instanceof Error ? error.message : 'Server error during authentication'
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`)
    }
  }

  console.log('Callback: No code found, redirecting to login')
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('No authorization code found')}`)
}
