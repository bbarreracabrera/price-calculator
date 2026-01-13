import { createClient } from '@/utils/supabase/client'

export async function upgradeToPro(userId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_pro: true })
    .eq('id', userId)

  if (error) {
    throw error
  }
}