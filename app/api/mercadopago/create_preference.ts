import type { NextRequest } from 'next/server'
import mercadopago from 'mercadopago'
import { createClient } from '@/lib/supabase/client'

mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN!)

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { plan, price, userId } = await req.json()

  const preference = {
    items: [
      { title: plan, quantity: 1, currency_id: 'CLP', unit_price: price }
    ],
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/success?userId=${userId}`,
      failure: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    },
    auto_return: 'approved',
  }

  const response = await mercadopago.preferences.create(preference)
  return new Response(JSON.stringify({ init_point: response.body.init_point }), { status: 200 })
}
