'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import ProjectList from '../components/ProjectList'
import DashboardStats from '../components/DashboardStats'
import IncomeChart from '../components/IncomeChart'

export default function Dashboard() {
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))
  
  const [projects, setProjects] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserEmail(session.user.email || '')
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
        
        if (projectsData) setProjects(projectsData)

        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profileData) setProfile(profileData)
      }
      setLoading(false)
    }
    getData()
  }, [supabase])

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, status: newStatus } : p
    )
    setProjects(updatedProjects)
    await supabase.from('projects').update({ status: newStatus }).eq('id', projectId)
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('¿Seguro que quieres borrar este presupuesto?')) return
    setProjects(projects.filter(p => p.id !== projectId))
    await supabase.from('projects').delete().eq('id', projectId)
  }

  return (
    // ✅ CAMBIO 1: Agregamos 'pb-20' al final para que el scroll no corte el ultimo elemento
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden pt-28 pb-20">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* ✅ CAMBIO 2: Aumentamos space-y-8 a space-y-12 */}
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Panel de Control</h1>
            <p className="text-zinc-500 font-medium">Gestiona tu negocio, {userEmail.split('@')[0]}</p>
          </div>
          <Link href="/calculator" className="w-full md:w-auto">
            <button className="w-full md:w-auto px-6 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 active:scale-95">
              <span>＋</span> Nuevo Cálculo
            </button>
          </Link>
        </div>

        {!loading && <DashboardStats projects={projects} />}

        {!loading && projects.length > 0 && (
           <IncomeChart projects={projects} />
        )}

        {/* Banner PRO (Más espacioso) */}
        <div className="relative group overflow-hidden rounded-[2rem] border border-zinc-800/50">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 blur-xl group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative bg-zinc-900/50 p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">🚀</span> Desbloquea Ilimitado
                </h3>
                <p className="text-zinc-400 max-w-lg text-sm leading-relaxed">
                  Actualiza a PRO para guardar historial ilimitado y apoyar el desarrollo.
                </p>
              </div>
              <Link href="/pricing" className="w-full md:w-auto">
                <button className="w-full md:w-auto px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] active:scale-95">
                  Hacerme PRO
                </button>
              </Link>
            </div>
        </div>

        <div className="pt-4">
          <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-green-500 rounded-full"></span>
            Historial Reciente
          </h2>
          {loading ? (
             <div className="text-zinc-500 animate-pulse">Cargando tus proyectos...</div>
          ) : (
             <ProjectList 
               projects={projects} 
               profile={profile}
               onStatusChange={handleStatusChange} 
               onDelete={handleDelete} 
             />
          )}
        </div>

      </div>
    </div>
  )
}