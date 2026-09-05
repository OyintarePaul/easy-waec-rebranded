import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const code = searchParams.get('code')
 
  if (code) {
    const supabase = await createClient()
    
    // This critical step exchanges the code for a session 
    // and automatically sets the auth cookies in the response headers
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${baseUrl}/dashboard`)
    }
  }

  return NextResponse.redirect(`${baseUrl}/auth/login`)
}
