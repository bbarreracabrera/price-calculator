// app/api/mercadopago/create_preference.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { description, price } = await req.json()

    // Validar usuario
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 })
    }

    const preferenceId = uuidv4()

    // Crear preferencia en MercadoPago
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ title: description || 'Pro Plan', quantity: 1, unit_price: Number(price) || 10000, currency_id: 'CLP' }],
        payer: { email: user.email },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
        },
        auto_return: 'approved',
        external_reference: preferenceId,
      }),
    })

    if (!mpResponse.ok) {
      const errorData = await mpResponse.json()
      return NextResponse.json({ error: 'Error creando preferencia', details: errorData }, { status: mpResponse.status })
    }

    const preferenceData = await mpResponse.json()

    // Guardar la preferencia en Supabase
    const { error: dbError } = await supabase
      .from<Database['public']['Tables']['mp_preferences']['Insert']>('mp_preferences')
      .insert([{
        id: preferenceId,
        user_id: user.id,
        mp_preference_id: preferenceData.id,
        amount: Number(price) || 10000,
        description: description || 'Pro Plan',
        status: 'pending',
      }])

    if (dbError) console.error('Error guardando preferencia en Supabase:', dbError)

    return NextResponse.json({ checkout_url: preferenceData.init_point })
  } catch (err: any) {
    console.error('Error creando preferencia:', err)
    return NextResponse.json({ error: err.message || 'Error desconocido' }, { status: 500 })
  }
}
