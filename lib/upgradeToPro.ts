import { createClient } from './supabase/client'

export async function upgradeToPro(user: { id: string }) {
  const supabase = createClient()

  // 👇 rompemos el tipado SOLO aquí (forma correcta)
  const supabaseAny = supabase as any

  const { error } = await supabaseAny
    .from('user_profiles')
    .update({ is_pro: true })
    .eq('id', user.id)

  if (error) throw error
}
