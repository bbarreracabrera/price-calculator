import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type UserProfilesUpdate =
  Database['public']['Tables']['user_profiles']['Update']

export async function upgradeToPro(user: { id: string }) {
  const supabase = createClient()

  const updateData: UserProfilesUpdate = {
    is_pro: true,
  }

  const { error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('id', user.id)

  if (error) throw error
}