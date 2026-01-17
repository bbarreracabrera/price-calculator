'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import ProjectList from '../components/ProjectList'

export default function Dashboard() {
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))
  const [projectCount, setProjectCount] = useState(0)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserEmail(session.user.email || '')
        const { count } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
        setProjectCount(count || 0)
      }
    }
    getData()
  }, [supabase])

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      
      {/* === LUCES DE FONDO (ATMÓSFERA) === */}
      {/* Luz Verde Esmeralda arriba derecha */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      {/* Luz Azul sutil abajo izquierda */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-1">Panel de Control</h1>
            <p className="text-zinc-500 font-medium">Gestiona tu negocio, {userEmail}</p>
          </div>
          <Link href="/calculator">
            <button className="px-6 py-3 bg-zinc-100 hover:bg-white text-black font-bold rounded-xl transition shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2 transform hover:-translate-y-1 active:scale-95">
              <span>＋</span> Nuevo Cálculo
            </button>
          </Link>
        </div>

        {/* Tarjetas de Estadísticas con HOVER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl hover:bg-zinc-900/80 transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-1 group">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4 group-hover:text-zinc-400">Tu Plan</p>
            <p className="text-3xl font-black text-white group-hover:text-yellow-400 transition-colors">Gratuito</p>
          </div>
          
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl hover:bg-zinc-900/80 transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex justify-between items-end mb-4">
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Uso mensual</p>
               <p className="text-zinc-400 font-medium text-sm">{projectCount} / 3</p>
            </div>
            {/* Barra de progreso animada */}
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ease-out ${projectCount >= 3 ? 'bg-red-500' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`} 
                 style={{ width: `${Math.min((projectCount/3)*100, 100)}%` }}
               ></div>
            </div>
          </div>
          
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl hover:bg-zinc-900/80 transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-between">
             <div>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Estado Cuenta</p>
               <p className="font-bold text-white">Verificada</p>
             </div>
             <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
               ✓
             </div>
          </div>
        </div>

        {/* Banner PRO (Estilo Neon Amarillo) */}
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-zinc-900 border border-zinc-800/50 p-8 rounded-[1.8rem] flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">🚀</span> Desbloquea Ilimitado
                </h3>
                <p className="text-zinc-400 max-w-lg text-sm leading-relaxed">
                  Elimina el límite de 3 proyectos, exporta PDFs sin marca de agua y accede a soporte prioritario.
                </p>
              </div>
              <Link href="/pricing">
                <button className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] active:scale-95 whitespace-nowrap">
                  Hacerme PRO ($9.990)
                </button>
              </Link>
            </div>
        </div>

        {/* Historial */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-green-500 rounded-full"></span>
            Historial Reciente
          </h2>
          <ProjectList />
        </div>

      </div>
    </div>
  )
}