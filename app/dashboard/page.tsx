'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { upgradeToPro } from '@/lib/upgradeToPro'
import Navbar from '@/components/Navbar'

type Profile = {
  id: string
  email: string
  is_pro: boolean
  calculations_count: number
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [calculations, setCalculations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      if (!user) return router.replace('/login')
      loadData(user.id)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) return router.replace('/login')
      loadData(session.user.id)
    })

    checkSession()
    return () => subscription.unsubscribe()
  }, [])

  async function loadData(userId: string) {
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(profileData as Profile | null)

    if ((profileData as any)?.is_pro) {
      const { data: calculationsData } = await supabase
        .from('calculations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      setCalculations(calculationsData || [])
    }

    setLoading(false)
  }

  if (loading) return <div style={{ minHeight: '100vh', padding: 32 }}>Cargando...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: 32 }}>
      <Navbar />
      <div style={{ maxWidth: 720, margin: '0 auto', background: '#020617', borderRadius: 12, padding: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Panel de Usuario</h1>
