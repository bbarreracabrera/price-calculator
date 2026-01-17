'use client'

export default function DashboardStats({ projects }: { projects: any[] }) {
  
  // 1. Calcular Totales
  const totalPagado = projects
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.total_price), 0)

  const totalPorCobrar = projects
    .filter(p => p.status === 'pending' || p.status === 'approved')
    .reduce((sum, p) => sum + Number(p.total_price), 0)

  // 2. Calcular Tasa de Éxito
  const totalFinalizados = projects.filter(p => p.status === 'paid' || p.status === 'rejected').length
  const ganados = projects.filter(p => p.status === 'paid').length
  const tasaExito = totalFinalizados > 0 ? Math.round((ganados / totalFinalizados) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* TARJETA 1: LO QUE YA GANASTE (Cash) */}
      <div className="bg-zinc-900/50 border border-green-900/30 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
          <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Ingresos Reales</p>
        <p className="text-3xl font-black text-green-400">
          ${totalPagado.toLocaleString('es-CL')}
        </p>
        <p className="text-xs text-zinc-500 mt-2">Pagados y en el banco 🏦</p>
      </div>

      {/* TARJETA 2: LO QUE PODRÍA ENTRAR (Pipeline) */}
      <div className="bg-zinc-900/50 border border-yellow-900/30 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
          <svg className="w-16 h-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Por Cobrar / Pendiente</p>
        <p className="text-3xl font-black text-yellow-500">
          ${totalPorCobrar.toLocaleString('es-CL')}
        </p>
        <p className="text-xs text-zinc-500 mt-2">Gestiónalos para cerrar la venta 🔥</p>
      </div>

      {/* TARJETA 3: TU RENDIMIENTO (KPI) */}
      <div className="bg-zinc-900/50 border border-blue-900/30 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
          <svg className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Tasa de Cierre</p>
        <p className="text-3xl font-black text-blue-400">
          {tasaExito}%
        </p>
        <p className="text-xs text-zinc-500 mt-2">De tus cotizaciones terminan en pago 🎯</p>
      </div>

    </div>
  )
}