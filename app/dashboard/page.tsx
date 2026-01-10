'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'

type Profile = {
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
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(profileData as Profile)

    if ((profileData as any)?.is_pro) {
      const { data: calculationsData } = await supabase
        .from('calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setCalculations(calculationsData || [])
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: 32 }}>
        <Navbar />
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: 32 }}>
      <Navbar />

      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          background: '#020617',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 10px 30px rgba(0,0,0,.4)',
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Panel de Usuario</h1>

        <p><strong>Email:</strong> {profile?.email}</p>
        <p>
          <strong>Plan:</strong>{' '}
          <span style={{ color: profile?.is_pro ? '#22c55e' : '#facc15' }}>
            {profile?.is_pro ? 'PRO 🚀' : 'FREE'}
          </span>
        </p>
        <p>
          <strong>Uso:</strong> {profile?.calculations_count} / {profile?.is_pro ? '∞' : '3'}
        </p>

        {!profile?.is_pro && (
          <div style={{ marginTop: 20 }}>
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/upgrade-to-pro', { method: 'POST' })
                  if (!res.ok) throw new Error('Error al actualizar')
                  alert('🎉 Ya eres Pro')
                  location.reload()
                } catch (e: any) {
                  alert(e.message)
                }
              }}
              style={{
                background: '#22c55e',
                color: 'white',
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Actualizar a Pro
            </button>
          </div>
        )}

        {profile?.is_pro && (
          <>
            <h2 style={{ marginTop: 24 }}>Historial</h2>

            {calculations.length === 0 ? (
              <p>No hay cálculos aún</p>
            ) : (
              <ul>
                {calculations.map(c => (
                  <li key={c.id}>
                    ${c.precio_final} — {new Date(c.created_at).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
