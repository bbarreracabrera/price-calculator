// app/api/mercadopago/success.ts
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      return new Response('Faltan parámetros', { status: 400 })
    }

    // Actualizar usuario a Pro en Supabase
    const { error } = await supabase
      .from('user_profiles')
      .update({ is_pro: true })
      .eq('id', userId)

    if (error) {
      console.error('Error actualizando usuario a Pro:', error.message)
      return new Response('Error al actualizar el plan', { status: 500 })
    }

    // Redirigir al dashboard
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, 302)
  } catch (error: any) {
    console.error('Error en success:', error)
    return new Response('Error interno', { status: 500 })
  }
}
