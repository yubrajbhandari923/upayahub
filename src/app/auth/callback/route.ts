import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/en'

  if (code) {
    // Create a supabase client with cookie support for server-side auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Successfully authenticated, redirect to the next page
      return NextResponse.redirect(new URL(next, request.url))
    }

    console.error('Auth callback error:', error)
  }

  // If no code or error occurred, redirect to home
  // Remove the error query param to avoid confusion
  return NextResponse.redirect(new URL('/en', request.url))
}