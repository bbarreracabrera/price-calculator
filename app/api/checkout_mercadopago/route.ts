import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { v4 as uuidv4 } from 'uuid'
import MercadoPagoConfig, { Preference } from 'mercadopago'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) { return cookieStore.get(name)?.value },
          set(name, value, options) { cookieStore.set({ name, value, ...options }) },
          remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
        },
      }
    )

    const body = await req.json().catch(() => ({}))
    const { description, price } = body

    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const preferenceId = uuidv4()
    const preference = new Preference(client);
    
    // === CAMBIO FINAL PARA PRODUCCIÓN ===
    // En Vercel configuraremos esta variable. Si no existe, usa localhost.
    const URL_FINAL = process.env.NEXT_PUBLIC_BASE_URL || req.headers.get('origin') || 'http://localhost:3000'

    console.log("🌐 Generando pago para:", URL_FINAL)

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'pro-plan-lifetime',
            title: description || 'Plan PRO - PriceCalc',
            quantity: 1,
            unit_price: Number(price) || 9990,
            currency_id: 'CLP',
          },
        ],
        payer: {
          email: user.email,
        },
        back_urls: {
          success: `${URL_FINAL}/dashboard?payment=success`,
          failure: `${URL_FINAL}/pricing?payment=failure`,
          pending: `${URL_FINAL}/pricing?payment=pending`,
        },
        auto_return: 'approved', // ¡En producción (HTTPS) esto SÍ funciona!
        external_reference: preferenceId,
      }
    })

    // Guardar en Supabase (Silencioso si falla)
    try {
        await supabase.from('mp_preferences').insert({
            id: preferenceId,
            user_id: user.id,
            mp_preference_id: result.id,
            amount: Number(price) || 9990,
            description: description || 'Plan PRO',
            status: 'pending',
        })
    } catch (e) {
        console.log("Log de pago no guardado en DB")
    }

    return NextResponse.json({ init_point: result.init_point })

  } catch (error: any) {
    console.error('❌ ERROR MP:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}