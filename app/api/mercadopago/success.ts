// app/api/mercadopago/success.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()

    const { searchParams } = new URL(req.url)
    const preferenceId = searchParams.get('external_reference')

    if (!preferenceId) {
      return NextResponse.json(
        { error: 'Missing external_reference' },
        { status: 400 }
      )
    }

    // 1️⃣ Buscar la preferencia guardada
    const { data: prefData, error } = await supabase
      .from('mp_preferences')
      .select('user_id, status')
      .eq('id', preferenceId)
      .single()

    if (error || !prefData) {
      return NextResponse.json(
        { error: 'Preference not found' },
        { status: 404 }
      )
    }

    // 2️⃣ Marcar preferencia como aprobada
    await supabase
      .from('mp_preferences')
      .update({ status: 'approved' })
      .eq('id', preferenceId)

    // 3️⃣ Actualizar usuario a PRO
    await supabase
      .from('user_profiles')
      .update({ is_pro: true })
      .eq('id', prefData.user_id)

    // 4️⃣ Redirigir al dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
    )
  } catch (err: any) {
    console.error('MercadoPago success error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}