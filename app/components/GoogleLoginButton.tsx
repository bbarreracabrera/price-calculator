'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function GoogleLoginButton() {
  const router = useRouter()

  // Detecta si hay sesión existente al cargar el componente
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard') // Redirige directo si ya hay sesión
      }
    }
    checkSession()
  }, [router])

  const handleSignIn = async () => {
    // Redirige directamente a la ruta /dashboard después de login
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard` // URL final
      }
    })
    if (error) console.error('Error iniciando sesión:', error.message)
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Iniciar sesión con Google
    </button>
  )
}
