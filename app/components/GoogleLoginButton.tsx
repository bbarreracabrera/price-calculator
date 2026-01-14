'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface User {
  id: string
  email: string
}

export default function GoogleLoginButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user

      if (sessionUser) {
        setUser({ id: sessionUser.id, email: sessionUser.email! })
        router.replace('/dashboard')
        return
      }

      setLoading(false)
    }

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email! })
        router.replace('/dashboard')
      }
    })

    checkSession()
    return () => subscription.unsubscribe()
  }, [router])

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) console.error('Error iniciando sesión:', error.message)
  }

  if (loading) return null
  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Iniciar sesión con Google
      </button>
    )
  }

  return <p>Redirigiendo...</p>
}

