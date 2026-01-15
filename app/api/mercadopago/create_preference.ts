import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { description, price } = await req.json()

    // 1️⃣ Obtener usuario autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    // 2️⃣ ID interno para tracking
    const preferenceId = uuidv4()

    // 3️⃣ Crear preferencia en MercadoPago
    const mpResponse = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              title: description || 'Plan Pro',
              quantity: 1,
              unit_price: Number(price) || 9900,
              currency_id: 'CLP',
            },
          ],
          payer: { email: user.email },
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
            pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
          },
          auto_return: 'approved',
          external_reference: preferenceId,
        }),
      }
    )

    if (!mpResponse.ok) {
      const errorData = await mpResponse.json()
      return NextResponse.json(
        { error: 'Error creando preferencia MercadoPago', details: errorData },
        { status: mpResponse.status }
      )
    }

    const preferenceData = await mpResponse.json()

    // 4️⃣ Guardar preferencia en Supabase
   const { error: dbError } = await supabase
  .from('mp_preferences')
  .insert({
    id: preferenceId,
    user_id: user.id,
    mp_preference_id: preferenceData.id,
    amount: Number(price) || 9990,
    description: description || 'Pro Plan',
    status: 'pending',
  })
    // 5️⃣ Devolver URL de checkout
    return NextResponse.json({
      checkout_url: preferenceData.init_point,
    })
  } catch (error: any) {
    console.error('Error creando preferencia:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno' },
      { status: 500 }
    )
  }
}
