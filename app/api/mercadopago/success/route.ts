import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const preferenceId = searchParams.get('external_reference')

    if (!preferenceId) return NextResponse.json({ error: 'Missing reference' }, { status: 400 })

    const { data: prefData } = await supabase.from('mp_preferences').select('user_id').eq('id', preferenceId).single()
    
    if (prefData) {
        await supabase.from('mp_preferences').update({ status: 'approved' }).eq('id', preferenceId)
        await supabase.from('user_profiles').update({ is_pro: true }).eq('id', prefData.user_id)
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`)
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}