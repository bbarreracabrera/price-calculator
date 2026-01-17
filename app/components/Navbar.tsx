'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  
  // Estado para abrir/cerrar menú móvil
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Escuchar auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_OUT') router.refresh()
    })
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    return () => subscription.unsubscribe()
  }, [supabase, router])

  // Cerrar menú automáticamente al cambiar de página
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Helper para links activos
  const navLinkClass = (path: string) => 
    pathname === path 
      ? "text-green-400 font-bold" 
      : "text-zinc-400 hover:text-white transition-colors"

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="text-white font-black text-xl tracking-tight z-50 relative">
            Price<span className="text-green-500">Calc</span>
          </Link>

          {/* --- MENÚ DE ESCRITORIO (Hidden en móvil) --- */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className={navLinkClass('/')}>Inicio</Link>
            <Link href="/calculator" className={navLinkClass('/calculator')}>Calculadora</Link>
            <Link href="/pricing" className={navLinkClass('/pricing')}>Planes</Link>
            
            {user && (
              <>
                <Link href="/clients" className={navLinkClass('/clients')}>Clientes</Link>
                <Link href="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>
                <Link href="/profile" className={navLinkClass('/profile')}>Mi Perfil</Link>
              </>
            )}
          </div>

          {/* BOTÓN LOGIN / LOGOUT (Escritorio) */}
          <div className="hidden md:block">
            {user ? (
              <button onClick={handleLogout} className="text-xs font-bold px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition">
                Cerrar sesión
              </button>
            ) : (
              <Link href="/login" className="text-sm px-5 py-2.5 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition">
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* --- BOTÓN HAMBURGUESA (Solo Móvil) --- */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden z-50 p-2 text-zinc-300 hover:text-white focus:outline-none"
          >
            {isOpen ? (
              // Icono X (Cerrar)
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              // Icono Hamburguesa (Abrir)
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* --- MENÚ MÓVIL (FULL SCREEN OVERLAY) --- */}
      {/* Se renderiza fuera del nav para cubrir toda la pantalla */}
      <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-300 md:hidden flex flex-col items-center justify-center space-y-8 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        
        {/* Enlaces Móviles (Grandes y centrados) */}
        <Link href="/" className="text-2xl font-bold text-zinc-300 hover:text-white">Inicio</Link>
        <Link href="/calculator" className="text-2xl font-bold text-zinc-300 hover:text-green-400">Calculadora</Link>
        <Link href="/pricing" className="text-2xl font-bold text-zinc-300 hover:text-white">Planes</Link>

        {user && (
          <>
            <div className="w-16 h-px bg-zinc-800 my-4"></div> {/* Separador */}
            <Link href="/clients" className="text-2xl font-bold text-white hover:text-green-400">Clientes</Link>
            <Link href="/dashboard" className="text-2xl font-bold text-white hover:text-green-400">Dashboard</Link>
            <Link href="/profile" className="text-2xl font-bold text-white hover:text-green-400">Mi Perfil</Link>
          </>
        )}

        <div className="pt-8">
          {user ? (
            <button 
              onClick={handleLogout}
              className="px-8 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500 hover:text-white transition"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link href="/login" className="px-8 py-3 rounded-xl bg-white text-black font-bold text-lg">
              Iniciar sesión
            </Link>
          )}
        </div>

      </div>
    </>
  )
}