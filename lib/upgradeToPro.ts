import { createClient } from '@/lib/supabase/client'

export async function upgradeToPro(userId: string) {
  const supabase = createClient()

  const updateData = { is_pro: true }
  const { error } = await (supabase.from('user_profiles').update as any)(updateData).eq('id', userId)

  if (error) {
    throw error
  }

  return true
}
