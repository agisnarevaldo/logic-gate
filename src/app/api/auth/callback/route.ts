import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  console.log('Callback: Auth callback route called')
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('Callback: URL params:', { 
    hasCode: !!code, 
    origin,
    fullUrl: request.url 
  })

  if (code) {
    console.log('Callback: Processing authorization code...')
    const response = NextResponse.redirect(`${origin}/dashboard`)
    const supabase = createClient(request, response)
    
    try {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const { error } = await (supabase.auth as any).exchangeCodeForSession(code)
      console.log('Callback: Code exchange result:', { 
        success: !error,
        error: error?.message 
      })
      
      if (!error) {
        console.log('Callback: Session created successfully, redirecting to dashboard')
        return response
      } else {
        console.error('Callback: Error exchanging code for session:', error)
        return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
      }
    } catch (error) {
      console.error('Callback: Exception during code exchange:', error)
      return NextResponse.redirect(`${origin}/login?error=Server error during authentication`)
    }
  }

  console.log('Callback: No code found, redirecting to login')
  return NextResponse.redirect(`${origin}/login?error=No authorization code found`)
}
