import { createClient } from '@/lib/supabase/client'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')

  if (!userId) return new Response('User ID missing', { status: 400 })

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_pro: true })
    .eq('id', userId)

  if (error) return new Response(error.message, { status: 500 })

  return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)
}
