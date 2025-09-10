import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  console.log('Callback: Auth callback route called')
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const origin = requestUrl.origin

  console.log('Callback: URL params:', { 
    hasCode: !!code, 
    origin,
    next,
    error,
    fullUrl: request.url 
  })

  // Handle OAuth error
  if (error) {
    console.error('Callback: OAuth error received:', error)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`)
  }

  if (code) {
    console.log('Callback: Processing authorization code...')
    const response = NextResponse.redirect(`${origin}${next}`)
    const supabase = createClient(request, response)
    
    try {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const { data, error: exchangeError } = await (supabase.auth as any).exchangeCodeForSession(code)
      console.log('Callback: Code exchange result:', { 
        success: !exchangeError,
        error: exchangeError?.message,
        hasUser: !!data?.user
      })
      
      if (!exchangeError && data?.user) {
        console.log('Callback: Session created successfully, redirecting to:', next)
        return response
      } else {
        console.error('Callback: Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Could not authenticate user')}`)
      }
    } catch (error) {
      console.error('Callback: Exception during code exchange:', error)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Server error during authentication')}`)
    }
  }

  console.log('Callback: No code found, redirecting to login')
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('No authorization code found')}`)
}
