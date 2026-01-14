'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/') // redirige directo al inicio
  }

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
      <h2>FutureCare</h2>
      <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'transparent', color: 'white', border: '1px solid white', padding: '6px 12px', borderRadius: 6 }}>
        Cerrar sesión
      </button>
    </nav>
  )
}
