'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { generatePDF } from '@/app/utils/generatePDF'

// Definimos los estados posibles y sus colores
const STATUS_CONFIG: any = {
  pending: { label: 'Pendiente', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  approved: { label: 'Aprobado', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  paid: { label: 'Pagado', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  rejected: { label: 'Rechazado', color: 'bg-red-500/10 text-red-500 border-red-500/20' }
}

export default function ProjectList() {
  const [projects, setProjects] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // 1. Proyectos
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      
      if (projectsData) setProjects(projectsData)

      // 2. Perfil (para el PDF)
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (profileData) setProfile(profileData)
      setLoading(false)
    }
    fetchData()
  }, [supabase])

  // Función para cambiar estado en BD
  const updateStatus = async (projectId: string, newStatus: string) => {
    // 1. Actualización optimista (UI primero)
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status: newStatus } : p
    ))

    // 2. Guardar en Supabase
    await supabase
      .from('projects')
      .update({ status: newStatus })
      .eq('id', projectId)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Borrar este presupuesto?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(projects.filter(p => p.id !== id))
  }

  if (loading) return <div className="text-zinc-500 text-sm animate-pulse">Cargando historial...</div>

  if (projects.length === 0) {
    return (
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-12 text-center border-dashed">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📂</div>
        <p className="text-zinc-400 font-medium">Aún no tienes cotizaciones.</p>
        <p className="text-zinc-600 text-sm mt-1">Tus proyectos guardados aparecerán aquí.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="group relative bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300 flex flex-col lg:flex-row justify-between lg:items-center gap-6"
        >
          {/* Info Principal */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-bold text-white text-lg group-hover:text-green-400 transition-colors">
                {project.name}
              </h4>
              
              {/* SELECTOR DE ESTADO (Mini Dropdown) */}
              <select 
                value={project.status || 'pending'}
                onChange={(e) => updateStatus(project.id, e.target.value)}
                className={`text-xs font-bold px-2 py-1 rounded border appearance-none cursor-pointer outline-none transition-colors ${STATUS_CONFIG[project.status || 'pending'].color}`}
              >
                <option value="pending">🟡 Pendiente</option>
                <option value="approved">🔵 Aprobado</option>
                <option value="paid">🟢 Pagado</option>
                <option value="rejected">🔴 Rechazado</option>
              </select>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
              <span className="flex items-center gap-1">
                📅 {new Date(project.created_at).toLocaleDateString('es-CL')}
              </span>
              {project.details?.hours && (
                <span className="flex items-center gap-1">
                  ⏱ {project.details.hours} Horas
                </span>
              )}
            </div>
          </div>

          {/* Precio y Botones */}
          <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto border-t lg:border-t-0 border-zinc-800 pt-4 lg:pt-0">
            <div className="text-right">
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total</p>
              <p className="text-xl font-black text-white tracking-tight">
                ${Number(project.total_price).toLocaleString('es-CL')}
              </p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => generatePDF(project, profile)}
                className="p-2.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                title="Descargar PDF Profesional"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </button>
              
              <button 
                onClick={() => handleDelete(project.id)}
                className="p-2.5 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-colors"
                title="Eliminar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}