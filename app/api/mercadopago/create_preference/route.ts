import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers' // 👈 Importante para leer la sesión
import { createServerClient } from '@supabase/ssr' // 👈 Usamos la librería de servidor
import { v4 as uuidv4 } from 'uuid'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configuración de MercadoPago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export async function POST(req: NextRequest) {
  console.log("🔥 --- INICIANDO PROCESO DE PAGO (SERVIDOR) ---")

  try {
    // 1. Crear el cliente de Supabase sabiendo leer cookies
    const cookieStore = cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Leer el body
    const body = await req.json().catch(() => ({}))
    const { description, price } = body

    // 2. Obtener usuario (Ahora sí debería funcionar)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      console.error("❌ ERROR: El servidor sigue sin ver al usuario. ¿Estás logueado?")
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    console.log("✅ Usuario autenticado:", user.email)

    const preferenceId = uuidv4()
    const preference = new Preference(client);

    // 3. Crear preferencia en MercadoPago
    console.log("📤 Enviando datos a MercadoPago...")
    
    const result = await preference.create({
      body: {
        items: [
          {
            id: 'pro-plan-monthly',
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
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercadopago/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
        },
        auto_return: 'approved',
        external_reference: preferenceId,
      }
    })

    console.log("📥 RESPUESTA MP:", result.init_point ? "Link recibido OK" : "Sin link")

    // 4. Guardar en Supabase
    await supabase
      .from('mp_preferences')
      .insert({
        id: preferenceId,
        user_id: user.id,
        mp_preference_id: result.id,
        amount: Number(price) || 9990,
        description: description || 'Plan PRO',
        status: 'pending',
      })

    return NextResponse.json({
      init_point: result.init_point,
    })

  } catch (error: any) {
    console.error('❌ ERROR FATAL:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}