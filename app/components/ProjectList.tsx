'use client'
import { generatePDF } from '@/app/utils/generatePDF'

const STATUS_CONFIG: any = {
  pending: { label: 'Pendiente', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  approved: { label: 'Aprobado', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  paid: { label: 'Pagado', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  rejected: { label: 'Rechazado', color: 'bg-red-500/10 text-red-500 border-red-500/20' }
}

interface ProjectListProps {
  projects: any[]
  profile: any
  onStatusChange: (id: string, newStatus: string) => void
  onDelete: (id: string) => void
}

export default function ProjectList({ projects, profile, onStatusChange, onDelete }: ProjectListProps) {

  if (projects.length === 0) {
    return (
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-12 text-center border-dashed">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📂</div>
        <p className="text-zinc-400 font-medium">Aún no tienes cotizaciones.</p>
        <p className="text-zinc-600 text-sm mt-1">Tus proyectos guardados aparecerán aquí.</p>
      </div>
    )
  }

  // ✅ CAMBIO: Aumentamos space-y-4 a space-y-6 para separar las tarjetas entre sí
  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="group relative bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 p-6 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col lg:flex-row justify-between lg:items-center gap-6 md:gap-8"
        >
          {/* Info Principal */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h4 className="font-bold text-white text-xl group-hover:text-green-400 transition-colors">
                {project.name}
              </h4>
              
              {/* SELECTOR DE ESTADO (Más grande y fácil de tocar) */}
              <select 
                value={project.status || 'pending'}
                onChange={(e) => onStatusChange(project.id, e.target.value)}
                className={`w-full sm:w-auto text-xs font-bold px-3 py-1.5 rounded-lg border appearance-none cursor-pointer outline-none transition-colors ${STATUS_CONFIG[project.status || 'pending']?.color || STATUS_CONFIG.pending.color}`}
              >
                <option value="pending">🟡 Pendiente</option>
                <option value="approved">🔵 Aprobado</option>
                <option value="paid">🟢 Pagado</option>
                <option value="rejected">🔴 Rechazado</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-500">
              <span className="flex items-center gap-1 bg-zinc-950/50 px-2 py-1 rounded">
                📅 {new Date(project.created_at).toLocaleDateString('es-CL')}
              </span>
              {project.details?.hours && (
                <span className="flex items-center gap-1 bg-zinc-950/50 px-2 py-1 rounded">
                  ⏱ {project.details.hours} Horas
                </span>
              )}
            </div>
          </div>

          {/* Precio y Botones */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between lg:justify-end gap-6 w-full lg:w-auto border-t lg:border-t-0 border-zinc-800 pt-5 lg:pt-0 mt-2 lg:mt-0">
            <div className="text-left sm:text-right">
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Total</p>
              <p className="text-2xl font-black text-white tracking-tight">
                ${Number(project.total_price).toLocaleString('es-CL')}
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => generatePDF(project, profile)}
                className="flex-1 sm:flex-none py-3 px-4 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                title="Descargar PDF"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </button>
              
              <button 
                onClick={() => onDelete(project.id)}
                className="flex-1 sm:flex-none py-3 px-4 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-colors flex items-center justify-center"
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