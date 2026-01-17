'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { generatePDF } from '@/app/utils/generatePDF'

export default function ProjectList() {
  const [projects, setProjects] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Cargar Proyectos
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      
      if (projectsData) setProjects(projectsData)

      // Cargar Perfil (para el logo en PDF)
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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de borrar este presupuesto?')) return
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
    <div className="space-y-3">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="group relative bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-600 hover:bg-zinc-800/80 transition-all duration-300 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm hover:shadow-xl hover:shadow-black/20"
        >
          {/* Info Izquierda */}
          <div>
            <h4 className="font-bold text-white text-lg group-hover:text-green-400 transition-colors mb-1">
              {project.name}
            </h4>
            <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
              <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                {new Date(project.created_at).toLocaleDateString('es-CL')}
              </span>
              {project.details?.hours && <span>{project.details.hours} Horas</span>}
            </div>
          </div>

          {/* Precio y Acciones Derecha */}
          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
            <div className="text-right">
              <p className="text-xs text-zinc-500 uppercase font-bold">Total Cobrado</p>
              <p className="text-xl font-black text-white tracking-tight">
                ${Number(project.total_price).toLocaleString('es-CL')}
              </p>
            </div>

            <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Botón PDF */}
              <button 
                onClick={() => generatePDF(project, profile)}
                className="p-3 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-blue-600 hover:text-white transition-colors shadow-lg"
                title="Descargar PDF"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </button>
              
              {/* Botón Eliminar */}
              <button 
                onClick={() => handleDelete(project.id)}
                className="p-3 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 border border-transparent transition-colors shadow-lg"
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