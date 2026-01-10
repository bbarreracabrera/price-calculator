import { createClient } from '@/lib/supabase/client'

export async function upgradeToPro(user: { id: string }) {
  const supabase = createClient()

  const updateData = { is_pro: true }
  const { error } = await (supabase.from('user_profiles').update as any)(updateData).eq('id', user.id)

  if (error) throw error
}
