'use client'
import { generatePDF } from '@/app/utils/generatePDF'
import toast from 'react-hot-toast'
// 1. IMPORTAR ROUTER PARA LA REDIRECCIÓN
import { useRouter } from 'next/navigation'

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
  // 2. INICIALIZAR EL ROUTER
  const router = useRouter()

  // Función para confirmar borrado con Toast
  const confirmDelete = (projectId: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-medium text-white">¿Borrar este presupuesto?</span>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => {
              toast.dismiss(t.id)
              onDelete(projectId)
              toast.success('Presupuesto eliminado')
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-600"
          >
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-zinc-700 text-white px-3 py-1 rounded text-xs hover:bg-zinc-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        background: '#18181b',
        color: '#fff',
        border: '1px solid #27272a'
      }
    })
  }

  // Función para enviar por WhatsApp
  const sendToWhatsApp = (project: any) => {
    const clientName = project.details?.client?.name || 'Estimado/a'
    const clientPhone = project.details?.client?.phone || ''
    
    const text = `
Hola ${clientName}, 👋

Adjunto el resumen del presupuesto para *${project.name}*:

🔹 *Servicios:* $${Math.round(project.pocket_money).toLocaleString('es-CL')}
🔹 *Total Final:* $${Number(project.total_price).toLocaleString('es-CL')}

Quedo atento a tus comentarios para avanzar. 🚀

_Enviado desde PriceCalc_
    `.trim()

    const url = clientPhone 
      ? `https://wa.me/${clientPhone.replace(/\D/g,'')}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`

    window.open(url, '_blank')
  }

  // 3. NUEVA FUNCIÓN PARA EDITAR
  const handleEdit = (project: any) => {
    // Navegamos a la calculadora pasando el ID en la URL
    router.push(`/calculator?edit=${project.id}`)
  }

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

            <div className="flex gap-2">
              <button 
                onClick={() => sendToWhatsApp(project)}
                className="flex-1 sm:flex-none py-3 px-4 bg-green-600/20 text-green-400 border border-green-600/30 rounded-xl hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center"
                title="Enviar por WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </button>

              {/* 🆕 BOTÓN EDITAR (LÁPIZ) */}
              <button 
                onClick={() => handleEdit(project)}
                className="flex-1 sm:flex-none py-3 px-4 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-yellow-500 hover:text-black transition-colors flex items-center justify-center"
                title="Editar / Corregir"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>

              <button 
                onClick={() => generatePDF(project, profile)}
                className="flex-1 sm:flex-none py-3 px-4 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                title="Descargar PDF"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </button>
              
              <button 
                onClick={() => confirmDelete(project.id)}
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