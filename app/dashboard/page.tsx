'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { upgradeToPro } from '@/lib/upgradeToPro'
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
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(profileData as Profile | null)

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
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: 'white',
        padding: 32
      }}>
        <Navbar />
        <div style={{
          maxWidth: 720,
          margin: '0 auto',
          background: '#020617',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 10px 30px rgba(0,0,0,.4)'
        }}>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: 'white',
      padding: 32
    }}>
      <Navbar />
      <div style={{
        maxWidth: 720,
        margin: '0 auto',
        background: '#020617',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 10px 30px rgba(0,0,0,.4)'
      }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>
          Panel de Usuario
        </h1>

        <div style={{ marginBottom: 16 }}>
          <p><strong>Email:</strong> {profile?.email}</p>
          <p>
            <strong>Plan:</strong>{' '}
            <span style={{
              color: profile?.is_pro ? '#22c55e' : '#facc15'
            }}>
              {profile?.is_pro ? 'PRO 🚀' : 'FREE'}
            </span>
          </p>
          <p>
            <strong>Uso:</strong>{' '}
            {profile?.calculations_count} /{' '}
            {profile?.is_pro ? '∞' : '3'}
          </p>
        </div>

        {!profile?.is_pro && (
          <div style={{
            background: '#1e293b',
            padding: 16,
            borderRadius: 8,
            marginBottom: 24
          }}>
            <p style={{ color: '#facc15' }}>
              Estás en el plan Free. Máximo 3 cálculos.
            </p>
            <button
              onClick={async () => {
                try {
                  await upgradeToPro()
                  alert('🎉 Ya eres Pro')
                  location.reload()
                } catch (e: any) {
                  alert(e.message)
                }
              }}
              style={{
                marginTop: 12,
                background: '#22c55e',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
              Actualizar a Pro
            </button>
          </div>
        )}

        {profile?.is_pro && (
          <>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>
              Historial
            </h2>
            {calculations.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No hay cálculos aún</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {calculations.map(c => (
                  <li key={c.id} style={{
                    padding: 12,
                    background: '#1e293b',
                    borderRadius: 8,
                    marginBottom: 8
                  }}>
                    <strong>${c.precio_final}</strong>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </div>
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

