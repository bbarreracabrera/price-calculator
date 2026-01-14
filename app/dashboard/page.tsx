'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

interface User {
  id: string
  email: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user

      if (!sessionUser) {
        router.replace('/') // vuelve al login si no hay sesión
      } else {
        setUser({ id: sessionUser.id, email: sessionUser.email! })
      }
    }

    // Supabase v2+ devuelve { data: { subscription } }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace('/')
      } else {
        setUser({ id: session.user.id, email: session.user.email! })
      }
    })

    checkSession()
    return () => subscription.unsubscribe()
  }, [router])

  if (!user) return <p className="text-center mt-20">Cargando...</p>

  return (
    <div className="p-12">
      <h1 className="text-3xl font-bold">Bienvenido, {user.email}</h1>
      <p className="mt-4">Aquí están tus notas y funcionalidades de Notepad.</p>
    </div>
  )
}
