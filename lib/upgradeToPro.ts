export async function upgradeToPro(user: { id: string }) {
  const supabase = createClient()

  const { error } = await supabase
    .from('user_profiles')
    .update({ is_pro: true })
    .eq('id', user.id)

  if (error) throw error
}
