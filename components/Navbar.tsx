'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  // if (pathname === '/login') return null

  return (
    <nav className="bg-black/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-white tracking-tighter">
          Price<span className="text-green-500">Calc</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition">Inicio</Link>
          <Link href="/calculator" className="text-sm font-medium text-slate-300 hover:text-white transition">Calculadora</Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition">Dashboard</Link>
        </div>

        <Link href="/login">
          <button className="px-5 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-500 transition">
            Iniciar sesión
          </button>
        </Link>
      </div>
    </nav>
  )
}