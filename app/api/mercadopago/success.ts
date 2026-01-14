'use server'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const preferenceId = req.nextUrl.searchParams.get('preference_id')

  if (!preferenceId) {
    return NextResponse.redirect('/login')
  }

  // Buscar la preferencia
  const { data: prefData, error } = await supabase
    .from<Database['public']['Tables']['mp_preferences']['Row']>('mp_preferences')
    .select('user_id, status')
    .eq('id', preferenceId)
    .single()

  if (error || !prefData) {
    console.error('Preferencia no encontrada:', error)
    return NextResponse.redirect('/login')
  }

  if (prefData.status !== 'approved') {
    // Actualizar estado de la preferencia
    const { error: updatePrefError } = await supabase
      .from<Database['public']['Tables']['mp_preferences']['Update']>('mp_preferences')
      .update({ status: 'approved' })
      .eq('id', preferenceId)

    if (updatePrefError) console.error('Error actualizando preferencia:', updatePrefError)

    // Marcar al usuario como Pro
    const { error: updateUserError } = await supabase
      .from<Database['public']['Tables']['user_profiles']['Update']>('user_profiles')
      .update({ is_pro: true })
      .eq('id', prefData.user_id)

    if (updateUserError) console.error('Error actualizando usuario:', updateUserError)
  }

  return NextResponse.redirect('/dashboard')
}

