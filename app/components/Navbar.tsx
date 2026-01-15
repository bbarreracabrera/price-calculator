'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-white font-extrabold text-lg">
          Price<span className="text-green-400">Calc</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <Link href="/" className="hover:text-white transition">Inicio</Link>
          <Link href="/calculator" className="hover:text-white transition">Calculadora</Link>
          <Link href="/pricing" className="hover:text-white transition">Planes</Link>
          {user && (
            <Link href="/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>
          )}
        </div>

        {/* CTA */}
        <div>
          {user ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = '/'
              }}
              className="text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition"
            >
              Iniciar sesión
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}