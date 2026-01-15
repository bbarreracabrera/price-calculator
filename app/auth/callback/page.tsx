'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const finishAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.replace('/dashboard')
      } else {
        router.replace('/')
      }
    }

    finishAuth()
  }, [router, supabase])

  return (
    <div style={{ padding: 32 }}>
      <p>Iniciando sesión…</p>
    </div>
  )
}
