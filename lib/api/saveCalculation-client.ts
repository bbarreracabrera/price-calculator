import { createClient } from '../supabase/client'

interface CalculationData {
  costos_fijos?: number | null
  costos_variables?: number | null
  horas_trabajo?: number | null
  valor_hora?: number | null
  margen?: number | null
  precio_final?: number | null
  ganancia_estimada?: number | null
  iva_desglosado?: number | null
}

/**
 * Guarda un cálculo en la base de datos (versión cliente)
 * Para usar en componentes 'use client'
 * Verifica límites de usuarios Free (máx. 3 cálculos)
 * @param calculation Datos del cálculo a guardar
 * @throws Error si el usuario no está autenticado, alcanzó el límite o hay error en la BD
 */
export async function saveCalculationClient(calculation: CalculationData) {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('No autenticado')

  // Obtener perfil
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('is_pro, calculations_count')
    .eq('id', user.id)
    .single()

  if (profileError) throw profileError

  // Límite Free
  if (!profile?.is_pro && (profile?.calculations_count || 0) >= 3) {
    throw new Error('Límite alcanzado. Actualiza a Pro.')
  }

  // Guardar cálculo
  const { error: insertError } = await supabase
    .from('calculations')
    .insert({
      ...calculation,
      user_id: user.id,
    } as any)

  if (insertError) throw insertError

  // Incrementar contador
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({
      calculations_count: (profile?.calculations_count || 0) + 1,
    } as any)
    .eq('id', user.id)

  if (updateError) throw updateError
}

