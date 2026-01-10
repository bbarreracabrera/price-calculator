import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

export async function upgradeToPro(userId: string) {
  const supabase = createClient<Database>()

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_pro: true })
    .eq('id', userId)

  if (error) {
    throw error
  }

  return true
}
