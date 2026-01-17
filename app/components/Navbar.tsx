'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Escuchar cambios de autenticación en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_OUT') router.refresh()
    })

    // Carga inicial
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-white font-black text-xl tracking-tight">
          Price<span className="text-green-500">Calc</span>
        </Link>

        {/* Links Centrales */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-white transition">Inicio</Link>
          <Link href="/calculator" className="hover:text-white transition">Calculadora</Link>
          <Link href="/pricing" className="hover:text-white transition">Planes</Link>
          
          {/* Enlaces solo para usuarios logueados */}
          {user && (
            <>
              {/* 👇 NUEVO LINK A CLIENTES 👇 */}
              <Link href="/clients" className="text-white hover:text-green-400 transition">Clientes</Link>
              
              <Link href="/dashboard" className="text-white hover:text-green-400 transition">Dashboard</Link>
              <Link href="/profile" className="text-white hover:text-green-400 transition">Mi Perfil</Link>
            </>
          )}
        </div>

        {/* Botón de Acción (Login / Logout) */}
        <div>
          {user ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = '/'
              }}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm px-5 py-2.5 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition"
            >
              Iniciar sesión
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}