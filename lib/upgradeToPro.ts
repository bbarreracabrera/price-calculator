import { createClient } from './supabase/client'

/**
 * Actualiza el usuario a plan Pro
 * @throws Error si el usuario no está autenticado o hay error en la BD
 */
export async function upgradeToPro() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('No autenticado')

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_pro: true } as any)
    .eq('id', user.id)

  if (error) throw error
}

