import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

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
      const response = NextResponse.redirect(`${origin}${next}`)
      const supabase = createClient(request, response)

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const { data, error: exchangeError } = await (supabase.auth as any).exchangeCodeForSession(code)

      console.log('Callback: Code exchange result:', {
        success: !exchangeError,
        error: exchangeError?.message,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        userEmail: data?.user?.email,
        isNewUser: data?.user?.app_metadata?.provider === 'google' && !data?.user?.last_sign_in_at
      })

      if (exchangeError) {
        console.error('Callback: Error exchanging code for session:', exchangeError)

        // Check if it's a database-related error
        let errorMessage = exchangeError.message || 'Could not authenticate user'
        if (errorMessage.includes('user_profiles') && errorMessage.includes('does not exist')) {
          errorMessage = 'Database not properly configured. Please contact administrator.'
          console.error('Callback: Database schema error - user_profiles table missing')
        }

        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`)
      }

      if (data?.user) {
        console.log('Callback: Session created successfully for user:', data.user.id)

        // Set additional headers for better session handling
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
